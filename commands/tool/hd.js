const {
    quote
<<<<<<< HEAD
} = require("@mengkodingan/ckptw");
const { Consolefy } = require("@mengkodingan/consolefy");
=======
} = require("@itsreimau/ckptw-mod");
>>>>>>> master
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "hd",
    aliases: ["hd", "hdr", "remini"],
    category: "tool",
    permissions: {
        credz: 20
    },
    code: async (ctx) => {
        const messageType = ctx.getMessageType();
        const [checkMedia, checkQuotedMedia] = await Promise.all([
            tools.cmd.checkMedia(messageType, "image"),
            tools.cmd.checkQuotedMedia(ctx.quoted, "image")
        ]);

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(quote(tools.msg.generateInstruction(["send", "reply"], "image")));

        try {
            const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted.media.toBuffer();
<<<<<<< HEAD
            const uploadUrl = await tools.general.upload(buffer, "image");
            const apiUrl = await tools.api.createUrl("zell", "/tools/hd2", {
=======
            const uploadUrl = await tools.cmd.upload(buffer, "image");
            const apiUrl = tools.api.createUrl("zell", "/tools/hd2", {
>>>>>>> master
                url: uploadUrl
            });
            const result = (await axios.get(apiUrl)).data.result.upscaled;
            //await console.log(`Hasil Upscale: ${monospace(result)}`);

            return await ctx.reply({
                image: {
                    url: result
                },
                mimetype: mime.lookup("jpeg")
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};