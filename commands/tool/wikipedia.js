const {
    quote
} = require("@itsreimau/ckptw-mod");
const axios = require("axios");

module.exports = {
    name: "wikipedia",
    aliases: ["wiki"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx.used, "evangelion"))
        );

        try {
            const apiUrl = tools.api.createUrl("bk9", "/search/wiki", {
                query: input
            });
            const result = (await axios.get(apiUrl)).data.BK9[0].BK9;

            return await ctx.reply(
                `${quote(`Kueri: ${input}`)}\n` +
                `${quote("─────")}\n` +
                `${result}\n` +
                "\n" +
                config.msg.footer
            );
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};