const { quote } = require("@mengkodingan/ckptw");
const mime = require("mime-types");

module.exports = {
  name: "profile",
  aliases: ["me", "prof", "profil"],
  category: "profile",
  code: async (ctx) => {
    try {
      const senderJid = ctx.sender.jid;
      const senderId = tools.general.getID(senderJid);

      // Check for mentioned JID
      const mentionJids = ctx._msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const isMention = mentionJids.length > 0;
      const targetJid = isMention ? mentionJids[0] : senderJid;
      const targetId = tools.general.getID(targetJid);

      // Build leaderboard
      const leaderboardData = Object.entries((await db.toJSON()).user)
        .map(([id, data]) => ({ id, winGame: data.winGame || 0, level: data.level || 0 }))
        .sort((a, b) => b.winGame - a.winGame || b.level - a.level);

      // Fetch target data
      const targetDb = (await db.get(`user.${targetId}`)) || {};
      const userRank = leaderboardData.findIndex(u => u.id === targetId) + 1;
      const isOwner = tools.general.isOwner(targetId);
      const statusLabel = isOwner ? "Owner" : targetDb.premium ? "Premium" : "Freemium";

      // Get names
      const displayName = isMention
        ? targetDb.username || targetJid
        : ctx.sender.pushName;

      // Profile picture
      const profilePictureUrl = await ctx.core
        .profilePictureUrl(targetJid, "image")
        .catch(() => "https://i.pinimg.com/736x/70/dd/61/70dd612c65034b88ebf474a52ccc70c4.jpg");

      // Canvas URL
      const canvas = tools.api.createUrl("fast", "/canvas/rank", {
        avatar: profilePictureUrl,
        background: config.bot.thumbnail,
        username: displayName,
        status: isMention ? statusLabel : "online",
        level: targetDb.level || 0,
        rank: userRank,
        currentXp: targetDb.xp || 0,
        requiredXp: "100",
      });

      // Caption text
      const text = `${quote(`WhatsApp: ${displayName}`)}\n` +
        `${quote(`Username: ${targetDb.username || `-`}`)}\n` +
        `${quote(`Status: ${statusLabel}`)}\n` +
        `${quote(`Level: ${targetDb.level || 0}`)}\n` +
        `${quote(`XP: ${targetDb.xp || 0}/100`)}\n` +
        `${quote(`Rod: ${targetDb.rodlevel || `bamboo`}`)}\n` +
        `${quote(`Pickaxe: ${targetDb.pickaxe || `stone`}`)}\n` +
        `${quote(`Work Streak: ${targetDb.workStreak || 0}`)}\n` +
        `${quote(`Koin: ${isOwner || targetDb.premium ? `Tak terbatas` : targetDb.coin || 0}`)}\n` +
        `${quote(`Peringkat: ${userRank}`)}\n` +
        `${quote(`Menang: ${targetDb.winGame || 0}`)}\n` +
        "\n" +
        config.msg.footer;

      try {
        return await ctx.reply({
          image: { url: canvas },
          mimetype: mime.lookup("png"),
          caption: text
        });
      } catch (err) {
        if (err.status !== 200) return await ctx.reply(text);
      }
    } catch (error) {
      return await tools.cmd.handleError(ctx, error, false);
    }
  }
};
