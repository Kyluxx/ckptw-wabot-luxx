
// slot.js
const { quote, monospace } = require("@mengkodingan/ckptw");

// Commands for dice and slot games, chips stored in db
module.exports = {
    name: "slot",
    aliases: [],
    category: "rpg",
    permissions: {},
    code: async (ctx) => {
      try {
        const senderId = tools.general.getID(ctx.sender.jid);
        const userPath = `user.${senderId}`;
        const userData = (await db.get(userPath)) || {};
        const rawBet = ctx.args[0]
        const bet = parseInt(rawBet, 10);

        // Validate bet
        if (!bet || bet <= 0) {
          return ctx.reply(
            quote(
              '❎ Taruhan harus angka positif.\nContoh: !slot 100'
            )
          );
        }

        const chips = userData.chips || 0;
        if (chips < bet) {
          return ctx.reply(
            quote(
              `❎ Chip tidak cukup. Anda butuh ${monospace(
                bet.toString()
              )} chip.`
            )
          );
        }

        const symbols = ['🍒','🍊','🍋','🍇','💎','7️⃣'];
        const reels = Array.from({length:3},() => symbols[Math.floor(Math.random()*symbols.length)]);

        let multiplier=0;
        const [a,b,c]=reels;
        if (a===b&&b===c) {
          multiplier = a==='💎'?10 : a==='7️⃣'?7 : 5;
        } else if (a===b||b===c) {
          multiplier=2;
        }

        const change = multiplier>0 ? bet*(multiplier-1) : -bet;
        const newChips = chips + change;
        await db.set(`${userPath}.chips`, newChips);

        let msg = `🎰 HASIL SLOT 🎰\n\n[ ${reels.join(' | ')} ]\n\n`;
        msg += multiplier>0
          ? `Selamat! Menang ${monospace(change.toString())} chip (${multiplier}x).\n`
          : `Maaf, Kalah ${monospace(Math.abs(change).toString())} chip.\n`;
        msg += `Total chip: ${monospace(newChips.toString())}`;

        return ctx.reply(quote(msg));
      } catch (e) {
        return tools.cmd.handleError(ctx, e, false);
      }
    },
  }