const {
    quote
} = require("@itsreimau/ckptw-mod");
const axios = require("axios");

module.exports = {
    name: "deepseek",
    category: "ai-chat",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || ctx.quoted?.conversation || Object.values(ctx.quoted).map(q => q?.text || q?.caption).find(Boolean) || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.msg.generateCommandExample(ctx.used, "apa itu bot whatsapp?"))}\n` +
            quote(tools.msg.generateNotes(["Balas atau quote pesan untuk menjadikan teks sebagai input target, jika teks memerlukan baris baru."]))
        );

        try {
<<<<<<< HEAD
            // const senderUid = await db.get(`user.${tools.general.getID(ctx.sender.jid)}.uid`) || "guest";
            const prompt = `START PROMPT You are a WhatsApp bot named ${config.bot.name}, owned by ${config.owner.name}. Be friendly, informative, and engaging. Dan balas dengan bahasa indonesia END PROMPT `
            const url = "https://www.archive-ui.biz.id/api/ai/deepseek-r1?text" + prompt.replace(" ", "+") + input.replace(" ", "+")
            // const apiUrl = tools.api.createUrl("fast", "/aistream/deepseek", {
            //     ask: input,
            //     style: `You are a WhatsApp bot named ${config.bot.name}, owned by ${config.owner.name}. Be friendly, informative, and engaging.`, // Dapat diubah sesuai keinginan Anda
            //     sessionId: senderUid
            // });
            const result = (await axios.get(url)).data;
=======
            const apiUrl = tools.api.createUrl("archive", "/api/ai/deepseek-coder-67b", {
                text: input
            });
            const result = (await axios.get(apiUrl)).data.result;
>>>>>>> master

            return await ctx.reply(result);
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};