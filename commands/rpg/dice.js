
// dice.js
const { quote, monospace } = require("@mengkodingan/ckptw");

// Commands for dice and slot games, chips stored in db
module.exports = 
  {
    name: "dadu",
    aliases: ["dice"],
    category: "game",
    permissions: {},
    code: async (ctx) => {
      try {
        const senderId = tools.general.getID(ctx.sender.jid);
        const userPath = `user.${senderId}`;
        const userData = (await db.get(userPath)) || {};
        const rawBet = ctx.args[0];
        const rawChoice = ctx.args[1];
        const bet = parseInt(rawBet, 10);
        const choice = (rawChoice || '').toLowerCase();

        // Validate bet and choice
        if (!bet || bet <= 0) {
          return ctx.reply(
            quote(
              '❎ Taruhan harus angka positif.\nContoh: !dadu 100 ganjil / !dadu 100 1'
            )
          );
        }
        const valid = ['ganjil', 'genap', '1','2','3','4','5','6'];
        if (!valid.includes(choice)) {
          return ctx.reply(
            quote(
              '❎ Pilihan tidak valid. Contoh: !dadu 100 <ganjil/genap/1-6>'
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

        const result = Math.floor(Math.random()*6)+1;
        let win=false, multiplier=0;
        if ((choice==='ganjil'&&result%2)||(choice==='genap'&&result%2===0)) {
          win=true; multiplier=2;
        } else if (choice===result.toString()) {
          win=true; multiplier=6;
        }

        const change = win ? bet*(multiplier-1) : -bet;
        const newChips = chips + change;
        await db.set(`${userPath}.chips`, newChips);

        let msg = `🎲 HASIL DADU: ${result} 🎲\n\n`;
        msg += win
          ? `Selamat! Anda menang ${monospace(change.toString())} chip.\n`
          : `Maaf, Anda kalah ${monospace(Math.abs(change).toString())} chip.\n`;
        msg += `Total chip: ${monospace(newChips.toString())}`;

        return ctx.reply(quote(msg));
      } catch (e) {
        return tools.cmd.handleError(ctx, e, false);
      }
    },
  }