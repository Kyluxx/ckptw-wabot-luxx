const {
    quote
} = require("@im-dims/baileys-library");

module.exports = {
    name: "addpremuser",
    aliases: ["addprem", "apu"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const userId = ctx.args[0];
        const userJid = ctx.quoted.senderJid || ctx.msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || (userId ? `${userId}@s.whatsapp.net` : null);
        const senderJid = ctx.sender.jid;
        const senderId = tools.general.getID(senderJid);

        if (!userJid) return await ctx.reply({
            text: `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
                `${quote(tools.cmd.generateCommandExample(ctx.used, `@${senderId}`))}\n` +
                quote(tools.cmd.generateNotes(["Balas atau kutip pesan untuk menjadikan pengirim sebagai akun target."])),
            mentions: [senderJid]
        });

        const [isOnWhatsApp] = await ctx.core.onWhatsApp(userJid);
        if (!isOnWhatsApp.exists) return await ctx.reply(quote("❎ Akun tidak ada di WhatsApp."));

        try {
            await db.set(`user.${tools.general.getID(userJid)}.premium`, true);

            await ctx.sendMessage(userJid, {
                text: quote("🎉 Anda telah ditambahkan sebagai pengguna Premium oleh Owner!")
            });
            return await ctx.reply(quote("✅ Berhasil ditambahkan sebagai pengguna Premium!"));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};