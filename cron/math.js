// cron/math.js
const { Events } = require("@mengkodingan/ckptw"); // atau path yang benar
module.exports = (bot, db) => {
  let state = { active: false, answer: null, winner: null };

  const genQ = () => {
    const a = Math.ceil(Math.random() * 20);
    const b = Math.ceil(Math.random() * 20);
    return { text: `*${a} + ${b}* = ?`, answer: a + b };
  };

  // Schedule tiap 10 menit
  setInterval(async () => {
    if (state.active) return;
    const { text, answer } = genQ();
    state = { active: true, answer, winner: null };
    await bot.core.sendMessage("120363417850831926@g.us", {
      text: `🧮 *Math Game!* (1 menit)\n${text}\nJawab cepat!`
    });
    // timeout 5 menit
    setTimeout(async () => {
      if (state.active) {
        state.active = false;
        await bot.core.sendMessage("120363417850831926@g.us", {
          text: `⏰ Waktu habis! Jawaban: *${state.answer}*`
        });
      }
    }, 1 * 60 * 1000);
  }, 10 * 60 * 1000);

  // Listener jawaban
  bot.ev.on(Events.MessagesUpsert, async (m, ctx) => {
//     console.log("🔍 Got message event:", m.key.remoteJid, "| content:", ctx._msg.content);
//   console.log("   state:", state);
    if (!state.active || state.winner) return;
    const txt = ctx._msg.content?.trim();
    // console.log("   Checking answer:", txt, "expected:", state.answer);
    if (txt && parseInt(txt) === state.answer) {
        // console.log("   Correct answer by:", ctx.sender);
      state.active = false;
      state.winner = ctx.sender;
      const userId = ctx.sender.jid.split("@")[0];
      await db.add(`user.${userId}.credz`, 100);
      await bot.core.sendMessage("120363417850831926@g.us", {
        text: `🏆 Selamat @${userId}! Jawaban: *${state.answer}* +100 credz`,
        mentions: [ctx.sender]
      });
    }
  });
};
