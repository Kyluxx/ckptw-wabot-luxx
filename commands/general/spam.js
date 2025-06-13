const { quote } = require("@mengkodingan/ckptw");

module.exports = {
    name: "jenstore",
    aliases: [],
    category: "general",
    permissions: {},
    code: async (ctx) => {
        try {
            const args = ctx.args;
            const count = parseInt(args[0]) || 5; // default 5 times if not specified
            const message = args.slice(1).join(" ") || "GASKEUNNN!";
            for (let i = 0; i < count; i++) {
                await ctx.reply(quote(message));
                await new Promise(res => setTimeout(res, 100));
            }
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};