const { monospace, quote } = require("@mengkodingan/ckptw");

module.exports = {
  name: "maling",
  aliases: ["rob"],
  category: "rpg",
  permissions: { group: true },

  code: async (ctx) => {
    try {
      // Extract target JID
      const mention = ctx.msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
      const argId = ctx.args[0];
      const quoted = ctx.quoted?.senderJid;
      const targetJid = quoted || mention || (argId ? `${argId}@s.whatsapp.net` : null);

      if (!targetJid) {
        return await ctx.reply(quote(" Silakan mention atau input ID target yang ingin dirob"));
      }

      // IDs
      const senderId = tools.general.getID(ctx.sender.jid);
      const robTargetId = tools.general.getID(targetJid);

      // Fetch databases
      const userDb = (await db.get(`user.${senderId}`)) || {};
      const targetDb = await db.get(`user.${robTargetId}`);
      if (!targetDb) {
        return await ctx.reply(quote("❎ User tidak ditemukan"));
      }

      const userCd = (await db.get(`user.${senderId}.cd.maling`)) || 0;
      if (userCd > Date.now()) {
        return await ctx.reply(
          quote(`❎ Anda masih memiliki cooldown. Silakan tunggu ${tools.general.convertMsToDuration(userCd - Date.now() + 600000)} lagi.`)
        );
      }

      // Owners & Premium bypass
      if(tools.general.isOwner(robTargetId, ctx.msg.key.id) || userDb?.premium){
        return await ctx.reply(quote("Mau maling apa ya? Pergi jauh jauh, ck"))
      }

      // Prevent robbing when target has no credz
      const maxRob = Math.floor(targetDb.credz * 0.35);
      if (maxRob < 1) {
        return await ctx.reply(quote("Target tidak memiliki Credz untuk dimaling"));
      }

      await db.set(`user.${senderId}.cd.maling`, Date.now() + 600000);

      // Determine amount to rob
      const robCredz = Math.floor(Math.random() * maxRob) + 1;
      const fineRob = robCredz/2
      
      // Crime history & fine calculation
      const historyCount = (await db.get(`user.${senderId}.crimehistory`)) || 0;
      const fine = fineRob + historyCount;

      // Success chance
      const SUCCESS_RATE = 0.4;
      const isSuccess = Math.random() < SUCCESS_RATE;

      if (isSuccess) {
        // Transfer credz on success
        await db.subtract(`user.${robTargetId}.credz`, robCredz);
        await db.add(`user.${senderId}.credz`, robCredz);
        return await ctx.reply(
          quote(`💸 Anda berhasil mengambil ${monospace(robCredz.toString())} Credz dari ${monospace(robTargetId)}`)
        );
      } else {
        // On failure, deduct fine and increase crime history
        await db.subtract(`user.${senderId}.credz`, fine);
        await db.add(`user.${robTargetId}.credz`, fine);
        await db.add(`user.${senderId}.crimehistory`, historyCount + 10);
        await ctx.sendMessage(targetJid, {
          text: quote(`🚨 Anda telah dimaling! Anda ${isSuccess ? 'Kehilangan' : 'Mendapatkan'}: ${monospace(fine.toString())} Credz.`),
        })
        return await ctx.reply(
          quote(`🚨 Anda tertangkap basah! Denda: ${monospace(fine.toString())} Credz.`)
        );
      }
    } catch (error) {
      // Handle unexpected errors
      return await tools.cmd.handleError(ctx, error, false);
    }
  }
};
