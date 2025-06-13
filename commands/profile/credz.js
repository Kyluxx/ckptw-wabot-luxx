
// bal.js (credz/balance)
const { monospace, quote } = require("@mengkodingan/ckptw");


module.exports = {
  name: "credz",
  aliases: ["Credz", "cred", "bal", "coin"],
  category: "profile",
  permissions: {},
  code: async (ctx) => {
    try {
      const senderId = tools.general.getID(ctx.sender.jid);
      const userDb = (await db.get(`user.${senderId}`)) || {};

      // Check mentioned user
      const mention = ctx.msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
      const argId = ctx.args[0];
      const targetJid = mention || (argId ? `${argId}@s.whatsapp.net` : null);
      const targetId = targetJid ? tools.general.getID(targetJid) : senderId;
      const targetDb = targetJid ? (await db.get(`user.${targetId}`)) || {} : userDb;
      
      const wallet = targetDb.credz || 0;
      const bank = targetDb.bank || 0;
      const bankLimit = targetDb.bankLimit ?? 100;
      const chips = targetDb.chips || 0;
      
      // Build response
      const userLabel = targetId === senderId ? "Anda" : `Pengguna ${targetId}`;
      const resp = `💰 ${userLabel} memiliki:\n` +
      `• Wallet: ${monospace(wallet.toString())} Credz\n` +
      `• Bank : ${monospace(bank.toString())}/${monospace(bankLimit.toString())} Credz\n` +
      `• Chips : ${monospace(chips.toString())} Chips`
      
      // Unlimited for owner/premium
//      if ((tools.general.isOwner(senderId, ctx.msg.key.id) && !targetJid) || (userDb.premium && !targetJid)) {
//        return await ctx.reply(quote("🤑 Anda memiliki Credz tak terbatas."));
//      }

      return await ctx.reply(quote(resp));
    } catch (error) {
      return await tools.cmd.handleError(ctx, error, false);
    }  
  },
};
