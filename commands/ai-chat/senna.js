const {
    quote
} = require("@mengkodingan/ckptw");

const { default: axios } = require("axios");

module.exports = {
    name: "senna",
    category: "ai-chat",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.quote(
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.cmd.generateCommandExample(ctx.used, "apa itu bot whatsapp?"))
        );

        try {
            const apiUrl = "https://www.archive-ui.biz.id/api/ai/sennayapping?text=%2F*+balas+dengan+bahasa+indonesia+*%2F++"
            const response = await axios.get(apiUrl + input).result

            return await ctx.quote(response);
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
}