const {
    quote
} = require("@itsreimau/ckptw-mod");

module.exports = {
    name: "add",
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true,
        restrict: true
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx.used, tools.cmd.getID(ctx.sender.jid)))
        );

        const accountJid = `${input.replace(/[^\d]/g, "")}@s.whatsapp.net`;

        const isOnWhatsApp = await ctx.core.onWhatsApp(accountJid);
        if (isOnWhatsApp.length === 0) return await ctx.reply(quote("❎ Akun tidak ada di WhatsApp!"));

        try {
            await ctx.group().add([accountJid]);

            return await ctx.reply(quote("✅ Berhasil ditambahkan!"));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};