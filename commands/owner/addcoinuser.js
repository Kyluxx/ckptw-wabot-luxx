const {
    quote
} = require("@itsreimau/ckptw-mod");
const tools = require("../../tools/exports");
module.exports = {
    name: "addcredzuser",
    aliases: ["addcredz", "acu"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const mentionedJid = ctx.msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        const userId = ctx.args[0];
        const userJid = ctx.quoted.senderJid || mentionedJid || (userId ? `${userId}@s.whatsapp.net` : null);
        const senderId = tools.general.getID(ctx.sender.jid);
        const credzAmount = parseInt(ctx.args[mentionedJid ? 1 : 0], 10);

        if ((!userJid || !credzAmount) || isNaN(credzAmount)) return await ctx.reply({
            text: `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
                quote(tools.cmd.generateCommandExample(ctx.used, `@${senderId} 8`)),
            mentions: [senderId]
        });

        const isOnWhatsApp = await ctx.core.onWhatsApp(userJid);
        if (isOnWhatsApp.length === 0) return await ctx.reply(quote("❎ Akun tidak ada di WhatsApp!"));

        try {
            await db.add(`user.${tools.general.getID(userJid)}.credz`, credzAmount);

            await ctx.sendMessage(userJid, {
                text: quote(`🎉 Anda telah menerima ${credzAmount} Credz dari Owner!`)
            });
            return await ctx.reply(quote(`✅ Berhasil menambahkan ${credzAmount} Credz kepada pengguna!`));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};