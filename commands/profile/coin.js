const { quote } = require("@mengkodingan/ckptw");

module.exports = {
    name: "credz",
    aliases: ["Credz"],
    category: "profile",
    code: async (ctx) => {
        const senderJid = ctx.sender.jid;
        const senderId = tools.general.getID(senderJid);
        const userDb = await db.get(`user.${senderId}`) || {};
        const mentionJids = ctx._msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

        if (tools.general.isOwner(senderId, ctx.msg.key.id) || userDb?.premium) return await ctx.reply(quote("🤑 Anda memiliki Credz tak terbatas."));

        try {
            // Check for mentioned JIDs in the message
            if (mentionJids.length > 0) {
                // Get the first mentioned user
                const targetJid = mentionJids[0];
                const targetId = tools.general.getID(targetJid);

                // If the user mentioned themselves, show their own coins
                if (targetId === senderId) {
                    const userCoin = userDb.credz || 0;
                    return await ctx.reply(quote(`💰 Anda memiliki ${userCoin} Credz tersisa.`));
                }

                // Otherwise, fetch the mentioned user's data
                const targetDb = await db.get(`user.${targetId}`) || {};
                const targetCoin = targetDb.credz || 0;
                return await ctx.reply(quote(`💰 Pengguna ini memiliki ${targetCoin} Credz.`));
            }

            // No mentions: show the sender's coins
            const userCoin = userDb.credz || 0;
            return await ctx.reply(quote(`💰 Anda memiliki ${userCoin} Credz tersisa.`));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};
