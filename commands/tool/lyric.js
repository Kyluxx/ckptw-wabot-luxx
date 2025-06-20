const {
    quote
} = require("@itsreimau/ckptw-mod");
const axios = require("axios");

module.exports = {
    name: "lyric",
    aliases: ["lirik"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx.used, "komm susser tod"))
        );

        try {
            const apiUrl = tools.api.createUrl("paxsenix", "/lyrics/genius", {
                q: input
            });
            const result = (await axios.get(apiUrl)).data;

            return await ctx.reply(
                `${quote(`Judul: ${result.title}`)}\n` +
                `${quote(`Artis: ${result.artist}`)}\n` +
                `${quote("─────")}\n` +
                `${result.lyrics}\n` +
                "\n" +
                config.msg.footer
            );
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};