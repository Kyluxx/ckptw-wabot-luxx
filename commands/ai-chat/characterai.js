const {
    quote
} = require("@itsreimau/ckptw-mod");
const axios = require("axios");
const tools = require("../../tools/exports");
module.exports = {
    name: "characterai",
    aliases: ["cai"],
    category: "ai-chat",
    permissions: {
        credz: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.cmd.generateCommandExample(ctx.used, "apa itu bot whatsapp?"))
        );

        try {
            const apiUrl = tools.api.createUrl("nyxs", "/ai/character-ai", {
                prompt: input,
                gaya: `You are a WhatsApp bot named ${config.bot.name}, owned by ${config.owner.name}. Be friendly, informative, and engaging.` // Dapat diubah sesuai keinginan Anda
            });
            const result = (await axios.get(apiUrl)).data.result;

            return await ctx.reply(result);
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};