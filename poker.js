/* poker.js
 * WhatsApp Poker Bot module using Baileys
 * Commands:
 *  - .joinpoker <baseBet>  (max 5 players, all must match baseBet)
 *  - .startpoker           (admin only)
 *  - .bet <amount>         (or .call, .raise, .check, .fold)
 * Flow: join -> start -> deal hole cards -> flop -> turn -> river -> showdown -> payout
 * Features: turn timeout (60s), auto-fold, instant win if only one left, split pot on tie, 10% fee
 * Details: no check allowed after raise, join bet uniform, proper poker hand evaluation
 */

const { quote, monospace } = require("@mengkodingan/ckptw");
const { evaluate } = require("poker-hand-evaluator");

const sessions = new Map();
const TURN_TIMEOUT = 60000;

/**
 * Evaluate hands using poker-hand-evaluator
 */
function evaluateHands(players, community) {
  return players.map(p => {
    const cards = community.concat(p.hand).map(c => c.replace('10', 'T'));
    const formatted = cards.map(card => {
      const rank = card[0];
      const suit = card[1] === '♠️' ? 's'
                 : card[1] === '♥️' ? 'h'
                 : card[1] === '♦️' ? 'd'
                 : 'c';
      return rank + suit;
    });
    const result = evaluate(formatted);
    return { player: p, score: result.score };
  });
}

module.exports = {
  name: "poker",
  aliases: [],
  category: "game",
  permissions: { group: true },

  code: async (ctx) => {
    try {
      const sender = tools.general.getID(ctx.sender.jid);
      const groupId = ctx.from;
      const cmd = ctx.args[0] || null;
      const arg = ctx.args[1] || null;

      if (!sessions.has(groupId)) sessions.set(groupId, {});
      const sess = sessions.get(groupId);

      // JOIN
      if (cmd === "join") {
        const baseBet = parseInt(arg, 10);
        if (!baseBet || baseBet <= 0) return ctx.reply(quote("❎ Base bet harus angka positif."));
        if (!sess.players || sess.ended) {
          sessions.set(groupId, { players: [], baseBet, stage: "joining", deck: [], community: [], pot: 0, turnIndex: 0, timer: null });
        }
        const s = sessions.get(groupId);
        if (s.stage !== "joining") return ctx.reply(quote("❎ Game sedang berjalan."));
        if (s.players.length > 0 && baseBet !== s.baseBet) return ctx.reply(quote(`❎ Base bet harus ${monospace(s.baseBet.toString())}.`));
        if (s.players.find(p => p.id === sender)) return ctx.reply(quote("❎ Kamu sudah join."));
        if (s.players.length >= 5) return ctx.reply(quote("❎ Room penuh (5 pemain)."));

        const userPath = `user.${sender}.chips`;
        const chips = (await db.get(userPath)) || 0;
        if (chips < baseBet) return ctx.reply(quote(`❎ Chip tidak cukup. Butuh ${monospace(baseBet.toString())}.`));
        await db.set(userPath, chips - baseBet);

        s.players.push({ id: sender, chips: chips - baseBet, hand: [], bet: baseBet, folded: false });
        s.pot += baseBet;
        return ctx.reply(quote(`✅ Join berhasil! Base bet: ${monospace(baseBet.toString())}`));
      }

      // START
      if (cmd === "start") {
        if (!(await ctx.group().isAdmin(ctx.sender.jid))) return ctx.reply(quote("❎ Hanya admin bisa start."));
        if (!sess.players || sess.stage !== "joining") return ctx.reply(quote("❎ Belum ada sesi join atau game sudah berjalan."));
        if (sess.players.length < 2) return ctx.reply(quote("❎ Butuh minimal 2 pemain."));

        const suits = ["♠️","♥️","♦️","♣️"];
        const ranks = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];
        sess.deck = suits.flatMap(s => ranks.map(r => `${r}${s}`)).sort(() => Math.random() - 0.5);
        sess.stage = "deal_hole";

        for (let p of sess.players) {
          p.hand = [sess.deck.pop(), sess.deck.pop()];
          await ctx.sendMessage(p.id + "@s.whatsapp.net", { text: `🎴 Kartu kamu: ${p.hand.join(' | ')}` });
        }
        sess.community = [sess.deck.pop(), sess.deck.pop(), sess.deck.pop()];
        await ctx.reply(quote(`🔥 FLOP: ${sess.community.join(' | ')}`));
        sess.stage = "betting";
        sess.turnIndex = 0;

        return startTurn(ctx, sess);
      }

      // ACTIONS
      if (sess.stage === "betting") {
        const player = sess.players[sess.turnIndex];
        if (player.id !== sender) return;
        clearTimeout(sess.timer);

        const highBet = Math.max(...sess.players.map(p => p.bet));
        let amount = arg ? parseInt(arg, 10) : 0;
        let msg;
        switch (cmd) {
          case 'fold':
            player.folded = true;
            msg = `Kamu fold.`;
            break;
          case 'check':
            if (player.bet < highBet) return ctx.reply(quote("❎ Tidak bisa check, ada raise. Gunakan call, raise, atau fold."));
            msg = `Kamu check.`;
            break;
          case 'call':
            amount = highBet - player.bet;
            if (player.chips < amount) return ctx.reply(quote("❎ Chip tidak cukup untuk call."));
            player.chips -= amount;
            player.bet += amount;
            sess.pot += amount;
            msg = `Kamu call ${monospace(amount.toString())}.`;
            break;
          case 'raise':
          case 'bet':
            if (!amount || amount <= highBet) return ctx.reply(quote(`❎ Raise harus lebih tinggi dari ${highBet}.`));
            const diff = amount - player.bet;
            if (player.chips < diff) return ctx.reply(quote("❎ Chip tidak cukup untuk raise."));
            player.chips -= diff;
            player.bet = amount;
            sess.pot += diff;
            msg = `Kamu raise ke ${monospace(amount.toString())}.`;
            break;
          default:
            return;
        }
        await ctx.reply(quote(msg));

        const active = sess.players.filter(p => !p.folded);
        if (active.length === 1) return endGameSingle(ctx, sess, active[0]);

        do { sess.turnIndex = (sess.turnIndex + 1) % sess.players.length; }
        while (sess.players[sess.turnIndex].folded);

        if (active.every(p => p.bet === active[0].bet)) {
          if (sess.community.length < 5) {
            const stageName = sess.community.length === 3 ? 'TURN' : 'RIVER';
            sess.community.push(sess.deck.pop());
            sess.players.forEach(p => p.bet = 0);
            await ctx.reply(quote(`🔥 ${stageName}: ${sess.community.join(' | ')}`));
          } else {
            return endGameShowdown(ctx, sess);
          }
        }
        return startTurn(ctx, sess);
      }

    } catch (e) {
      return tools.cmd.handleError(ctx, e, false);
    }
  }
};

async function startTurn(ctx, sess) {
  const curr = sess.players[sess.turnIndex];
  await ctx.reply(quote(`📣 Giliran: @${curr.id}. Pot: ${monospace(sess.pot.toString())}`));
  sess.timer = setTimeout(async () => {
    curr.folded = true;
    await ctx.reply(quote(`⌛ Waktu habis! @${curr.id} auto-fold.`));
    const active = sess.players.filter(p => !p.folded);
    if (active.length === 1) return endGameSingle(ctx, sess, active[0]);
    do { sess.turnIndex = (sess.turnIndex + 1) % sess.players.length; } while (sess.players[sess.turnIndex].folded);
    startTurn(ctx, sess);
  }, TURN_TIMEOUT);
}

async function endGameSingle(ctx, sess, winner) {
  clearTimeout(sess.timer);
  const fee = Math.floor(sess.pot * 0.1);
  const winAmt = sess.pot - fee;
  const cur = (await db.get(`user.${winner.id}.chips`)) || 0;
  await db.set(`user.${winner.id}.chips`, cur + winAmt);
  await ctx.reply(quote(`🎉 @${winner.id} menang otomatis! Dapat ${monospace(winAmt.toString())}. Fee: ${monospace(fee.toString())}.`));
  sess.ended = true;
}

async function endGameShowdown(ctx, sess) {
  clearTimeout(sess.timer);
  const active = sess.players.filter(p => !p.folded);
  await ctx.reply(quote(`🏁 SHOWDOWN! Pot: ${monospace(sess.pot.toString())}`));
  for (let p of active) await ctx.reply(quote(`@${p.id}: ${p.hand.join(' | ')}`));
  const results = evaluateHands(active, sess.community);
  const bestScore = Math.max(...results.map(r => r.score));
  const winners = results.filter(r => r.score === bestScore).map(r => r.player);
  const fee = Math.floor(sess.pot * 0.1);
  const splitAmt = Math.floor((sess.pot - fee) / winners.length);
  for (let w of winners) {
    const c = (await db.get(`user.${w.id}.chips`)) || 0;
    await db.set(`user.${w.id}.chips`, c + splitAmt);
    await ctx.reply(quote(`🎉 @${w.id} menang ${monospace(splitAmt.toString())} chip.`));
  }
  await ctx.reply(quote(`🔖 Fee total: ${monospace(fee.toString())}`));
  sess.ended = true;
}
