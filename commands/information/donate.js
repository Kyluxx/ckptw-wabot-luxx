module.exports = {
    name: "donate",
    aliases: ["donasi"],
    category: "information",
    code: async (ctx) => {
        try {
            const customText = await db.get("bot.text.donate") || null;
            const text = customText ?
                customText
                .replace(/%tag%/g, `@${tools.cmd.getId(ctx.sender.jid)}`)
                .replace(/%name%/g, config.bot.name)
                .replace(/%prefix%/g, ctx.used.prefix)
                .replace(/%command%/g, ctx.used.command)
                .replace(/%footer%/g, config.msg.footer)
                .replace(/%readmore%/g, config.msg.readmore) :
                `${formatter.quote("083838039693 (DANA)")}\n` +
                `${formatter.quote("─────")}\n` +
                `${formatter.quote("https://paypal.me/itsreimau (PayPal)")}\n` +
                `${formatter.quote("https://saweria.co/itsreimau (Saweria)")}\n` +
                formatter.quote("https://trakteer.id/itsreimau (Trakteer)");

            return await ctx.reply({
                text: text,
                mentions: [ctx.sender.jid],
                footer: config.msg.footer,
                interactiveButtons: []
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error);
        }
    }
};