const {
    quote
} = require("@itsreimau/ckptw-mod");

module.exports = {
    name: "addcredzuser",
    aliases: ["addcredz", "acu"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const mentionedJid = ctx.msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
<<<<<<< HEAD
        const userId = ctx.args[0];
        const userJid = ctx.quoted.senderJid || mentionedJid || (userId ? `${userId}@s.whatsapp.net` : null);
        const senderId = tools.general.getID(ctx.sender.jid);
        const credzAmount = parseInt(ctx.args[mentionedJid ? 1 : 0], 10);

        if ((!userJid || !credzAmount) || isNaN(credzAmount)) return await ctx.reply({
            text: `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
                quote(tools.cmd.generateCommandExample(ctx.used, `@${senderId} 8`)),
            mentions: [senderId]
=======
        const userJid = ctx.quoted.senderJid || mentionedJid || (ctx.args[0] ? `${ctx.args[0].replace(/[^\d]/g, "")}@s.whatsapp.net` : null);
        const coinAmount = parseInt(ctx.args[mentionedJid ? 1 : 0], 10) || null;

        if (!userJid && !coinAmount) return await ctx.reply({
            text: `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                `${quote(tools.msg.generateCommandExample(ctx.used, `@${tools.cmd.getID(ctx.sender.jid)} 8`))}\n` +
                quote(tools.msg.generateNotes(["Balas atau kutip pesan untuk menjadikan pengirim sebagai akun target."])),
            mentions: [ctx.sender.jid]
>>>>>>> master
        });

        const isOnWhatsApp = await ctx.core.onWhatsApp(userJid);
        if (isOnWhatsApp.length === 0) return await ctx.reply(quote("❎ Akun tidak ada di WhatsApp!"));

        try {
<<<<<<< HEAD
            await db.add(`user.${tools.general.getID(userJid)}.credz`, credzAmount);
=======
            await db.add(`user.${tools.cmd.getID(userJid)}.coin`, coinAmount);
>>>>>>> master

            await ctx.sendMessage(userJid, {
                text: quote(`🎉 Anda telah menerima ${credzAmount} Credz dari Owner!`)
            });
            return await ctx.reply(quote(`✅ Berhasil menambahkan ${credzAmount} Credz kepada pengguna!`));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};