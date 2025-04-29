const { quote } = require("@mengkodingan/ckptw");

module.exports = {
    name: "coin",
    aliases: ["koin"],
    category: "profile",
    code: async (ctx) => {
        const senderJid = ctx.sender.jid;
        const senderId = tools.general.getID(senderJid);
        const userDb = await db.get(`user.${senderId}`) || {};
        const mentionJids = ctx._msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

        // Owners and premium users have unlimited coins
        if ((tools.general.isOwner(senderId) || userDb.premium) && !mentionJids.length) {
            return await ctx.reply(quote("🤑 Anda memiliki koin tak terbatas."));
        }

        try {
            // Check for mentioned JIDs in the message
            if (mentionJids.length > 0) {
                // Get the first mentioned user
                const targetJid = mentionJids[0];
                const targetId = tools.general.getID(targetJid);

                // If the user mentioned themselves, show their own coins
                if (targetId === senderId) {
                    const userCoin = userDb.coin || 0;
                    return await ctx.reply(quote(`💰 Anda memiliki ${userCoin} koin tersisa.`));
                }

                // Otherwise, fetch the mentioned user's data
                const targetDb = await db.get(`user.${targetId}`) || {};
                const targetCoin = targetDb.coin || 0;
                return await ctx.reply(quote(`💰 Pengguna ini memiliki ${targetCoin} koin.`));
            }

            // No mentions: show the sender's coins
            const userCoin = userDb.coin || 0;
            return await ctx.reply(quote(`💰 Anda memiliki ${userCoin} koin tersisa.`));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};
