const { monospace, quote } = require("@mengkodingan/ckptw");

// Message templates
const MESSAGES = {
  prompts: {
    noTarget: "Silakan mention atau input ID target yang ingin dirob",
    notFound: "❎ User tidak ditemukan",
    onCooldown: (time) => `❎ Anda masih memiliki cooldown. Silakan tunggu ${time} lagi.`,
    banned: "Mau maling apa ya? Pergi jauh jauh, ck",
    noCredz: "Target tidak memiliki Credz untuk dimaling",
    lockpad: "🔒 Wah! Lockpad aktif, upaya maling dibatalkan dan kamu ketahuan!",
  },
  results: {
    success: [
      (amt, id) => `💸 Sukses! Kamu nyolong ${monospace(amt)} Credz dari ${monospace(id)} 🎉`,
      (amt, id) => `🕵️‍♂️ Diam-diam ambil ${monospace(amt)} dari ${monospace(id)}. Mantap!`,
      (amt, id) => `👏 Berhasil! ${monospace(amt)} Credz sekarang milikmu, curang tapi cuan!`,
    ],
    fail: [
      () => `🚨 Ups! Gagal nyolong, mending latihan lagi 😅`,
      () => `❌ Coba lagi lain waktu, si target terlalu waspada!`,
      () => `😵 Waduh! Rencana ketahuan, gak jadi deh`,
    ],
    die: [
      () => `💀 Aduh! Kamu ketangkep dan kehilangan semua Credz!`,
      () => `⚰️ Gawat, kamu mati dalam misinya dan nyesel deh!`,
    ],
    immortalRevive: "🏰 Kamu mati tapi dibangkitkan kembali oleh Immortality!",
  },
};

// Utility to pick random element
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

module.exports = {
  name: "maling",
  aliases: ["rob"],
  category: "game",
  permissions: { group: true },

  code: async (ctx) => {
    try {
      // Get target JID
      const targetJid = getTargetJid(ctx);
      if (!targetJid) {
        return ctx.reply(quote(MESSAGES.prompts.noTarget));
      }

      const senderId = tools.general.getID(ctx.sender.jid);
      const targetId = tools.general.getID(targetJid);

      const userDb = (await db.get(`user.${senderId}`)) || {};
      const targetDb = await db.get(`user.${targetId}`);
      if (!targetDb) {
        return ctx.reply(quote(MESSAGES.prompts.notFound));
      }

      // Cooldown check
      const now = Date.now();
      const cdKey = `user.${senderId}.cd.maling`;
      const nextAvailable = (await db.get(cdKey)) || 0;
      if (nextAvailable > now) {
        const waitTime = tools.general.convertMsToDuration(nextAvailable - now + 600000);
        return ctx.reply(quote(MESSAGES.prompts.onCooldown(waitTime)));
      }
      await db.set(cdKey, now + 600000);

      // Owner or premium bypass
      if (tools.general.isOwner(targetId, ctx.msg.key.id) || targetDb.premium) {
        return ctx.reply(quote(MESSAGES.prompts.banned));
      }

      // Check target credz
      const maxRob = Math.floor((targetDb.credz || 0) * 0.35);
      if (maxRob < 1) {
        return ctx.reply(quote(MESSAGES.prompts.noCredz));
      }

      // Lockpad check (8 hours)
      if (targetDb.lockpad_time && now - targetDb.lockpad_time < 8 * 60 * 60 * 1000) {
        return ctx.reply(quote(MESSAGES.prompts.lockpad));
      }

      // Determine outcome
      const amount = Math.floor(Math.random() * maxRob) + 1;
      const rawRate = userDb.stealer ? 0.6 : 0.4;
      const successRate = rawRate;
      const success = Math.random() < successRate;
      userDb.stealer = false;

      if (success) {
        await db.subtract(`user.${targetId}.credz`, amount);
        await db.add(`user.${senderId}.credz`, amount);
        const message = pick(MESSAGES.results.success)(amount, targetId);
        return ctx.reply(quote(message));
      }

      // Failure branch
      const willDie = Math.random() < 0.2;
      if (willDie) {
        if (userDb.immortality) {
          userDb.immortality = false;
          return ctx.reply(quote(MESSAGES.results.immortalRevive));
        }
        await db.set(`user.${senderId}.credz`, 0);
	await db.set(`user.${senderId}.chips`, 0);
        const message = pick(MESSAGES.results.die)();
        return ctx.reply(quote(message));
      }

      // Just fail
      const failMsg = pick(MESSAGES.results.fail)();
      return ctx.reply(quote(failMsg));
    } catch (err) {
      return tools.cmd.handleError(ctx, err, false);
    }
  },
};

// Helper to extract target JID
function getTargetJid(ctx) {
  const mention = ctx.msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  const arg = ctx.args[0] ? `${ctx.args[0]}@s.whatsapp.net` : null;
  return ctx.quoted?.senderJid || mention || arg;
}
