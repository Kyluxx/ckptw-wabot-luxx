const mime = require("mime-types");

module.exports = {
    name: "maid",
    category: "entertainment",
    permissions: {
        credz: 10
    },
    code: async (ctx) => {
        try {
            const result = tools.api.createUrl("nekorinn", "/waifuim/maid");

            return await ctx.reply({
                image: {
                    url: result
                },
                mimetype: mime.lookup("png")
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};