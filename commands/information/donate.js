const {
    quote
} = require("@im-dims/baileys-library");

module.exports = {
    name: "donate",
    aliases: ["donasi"],
    category: "information",
    permissions: {},
    code: async (ctx) => {
        try {
            const senderJid = ctx.sender.jid;
            const senderId = tools.general.getID(senderJid);

            const customText = await db.get("bot.text.donate") || null;
            const text = customText ?
                customText
                .replace(/%tag%/g, `@${senderId}`)
                .replace(/%name%/g, config.bot.name)
                .replace(/%prefix%/g, ctx.used.prefix)
                .replace(/%command%/g, ctx.used.command)
                .replace(/%footer%/g, config.msg.footer)
                .replace(/%readmore%/g, config.msg.readmore) :
                `${quote("083838039693 (DANA)")}\n` +
                `${quote("─────")}\n` +
                `${quote("https://paypal.me/itsreimau (PayPal)")}\n` +
                `${quote("https://saweria.co/itsreimau (Saweria)")}\n` +
                `${quote("https://trakteer.id/itsreimau (Trakteer)")}\n` +
                "\n" +
                config.msg.footer;

            return await ctx.reply({
                text: text,
                mentions: [senderJid]
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};