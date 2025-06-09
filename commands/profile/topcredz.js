const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "topcredz",
    aliases: ["tc"],
    category: "game",
    permissions: {},
    code: async (ctx) => {
        try {
            const senderId = tools.general.getID(ctx.sender.jid);
            const users = (await db.toJSON()).user;

            const leaderboardData = Object.entries(users)
                .map(([id, data]) => ({
                    id,
                    username: data.username || null,
                    credz: data.credz || 0,
                }))
                .sort((a, b) => b.credz - a.credz);

            const userRank = leaderboardData.findIndex(user => user.id === senderId) + 1;
            const topUsers = leaderboardData.slice(4, 14);
            let resultText = "";

            topUsers.forEach((user, index) => {
                const isSelf = user.id === senderId;
                const displayName = isSelf ? `@${user.id}` : user.username ? user.username : `${user.id}`;
                resultText += quote(`${index + 1}. ${displayName} - Credz: ${user.credz}\n`);
            });

            if (userRank > 10) {                
                const userStats = leaderboardData[userRank - 1];
                const displayName = `@${senderId}`;
                resultText += quote(`${userRank}. ${displayName} - Credz: ${userStats.credz}\n`);
            }

            return await ctx.reply({
                text: `${resultText.trim()}\n` +
                    "\n" +
                    config.msg.footer,
                mentions: [`${senderId}@s.whatsapp.net`]
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};
