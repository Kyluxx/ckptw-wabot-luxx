const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "ototalreset",
    aliases: ["totalreset", "otr"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const mentionedJid = ctx.msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        const userId = ctx.args[0];
        const userJid = ctx.quoted.senderJid || mentionedJid || (userId ? `${userId}@s.whatsapp.net` : null);
        const senderId = tools.general.getID(ctx.sender.jid);

        if (!userJid) return await ctx.reply({
            text: `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
                quote(tools.cmd.generateCommandExample(ctx.used, `@${senderId}`)),
            mentions: [senderId]
        });

        const [isOnWhatsApp] = await ctx.core.onWhatsApp(userJid);
        if (!isOnWhatsApp.exists) return await ctx.reply(quote("❎ Akun tidak ada di WhatsApp!"));

        try {
            await db.set(`user.${tools.general.getID(userJid)}.credz`, 0);
            await db.set(`user.${tools.general.getID(userJid)}.chips`, 0);
            await db.set(`user.${tools.general.getID(userJid)}.bank`, 0);
            await db.set(`user.${tools.general.getID(userJid)}.bankLimit`, 100);

            await ctx.sendMessage(userJid, {
                text: quote(`‼️ Semua balance anda telah direset total oleh Owner!`)
            });
            return await ctx.reply(quote(`✅ Berhasil mereset total seluruh balance untuk pengguna!`));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};
