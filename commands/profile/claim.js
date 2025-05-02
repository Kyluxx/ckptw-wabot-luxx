const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "claim",
    category: "profile",
    permissions: {},
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.cmd.generateCommandExample(ctx.used, "daily"))}\n` +
            quote(tools.cmd.generateNotes([`Ketik ${monospace(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`]))
        );

        if (input === "list") {
            const listText = await tools.list.get("claim");
            return await ctx.reply(listText);
        }

        const senderId = tools.general.getID(ctx.sender.jid);
        const userDb = await db.get(`user.${senderId}`) || {};

        if (tools.general.isOwner(senderId, ctx.msg.key.id) || userDb?.premium) return await ctx.reply(quote("❎ Anda sudah memiliki Credz tak terbatas, tidak perlu mengklaim lagi."));

        if (!claimRewards[input]) return await ctx.reply(quote("❎ Hadiah tidak valid!"));

        if (userDb?.level < claimRewards[input].level) return await ctx.reply(quote(`❎ Anda perlu mencapai level ${claimRewards[input].level} untuk mengklaim hadiah ini. Level Anda saat ini adalah ${userDb?.level || 0}.`));

        const currentTime = Date.now();
        userDb.lastClaim = userDb?.lastClaim || {};
        const lastClaimTime = userDb?.lastClaim[input] || 0;
        const timePassed = currentTime - lastClaimTime;
        const remainingTime = claimRewards[input].cooldown - timePassed;

        if (remainingTime > 0) return await ctx.reply(quote(`⏳ Anda telah mengklaim hadiah ${input}. Tunggu ${tools.general.convertMsToDuration(remainingTime)} untuk mengklaim lagi.`));

        try {
            const rewardCoin = (userDb?.credz || 0) + claimRewards[input].reward;
            await db.set(`user.${senderId}.credz`, rewardCoin);
            await db.set(`user.${senderId}.lastClaim.${input}`, currentTime);

            return await ctx.reply(quote(`✅ Anda berhasil mengklaim hadiah ${input} sebesar ${claimRewards[input].reward} Credz! Credz saat ini: ${rewardCoin}.`));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};

// Daftar hadiah klaim yang tersedia
const claimRewards = {
    daily: {
        reward: 100,
        cooldown: 24 * 60 * 60 * 1000, // 24 jam (100 Credz)
        level: 1
    },
    weekly: {
        reward: 500,
        cooldown: 7 * 24 * 60 * 60 * 1000, // 7 hari (500 Credz)
        level: 15
    },
    monthly: {
        reward: 2000,
        cooldown: 30 * 24 * 60 * 60 * 1000, // 30 hari (2000 Credz)
        level: 50
    },
    yearly: {
        reward: 10000,
        cooldown: 365 * 24 * 60 * 60 * 1000, // 365 hari (10000 Credz)
        level: 75
    }
};