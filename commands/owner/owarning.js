const {
    monospace,
    quote
} = require("@im-dims/baileys-library");

module.exports = {
    name: "owarning",
    category: "owner",
    permissions: {
        botAdmin: true,
        group: true,
        owner: true,
        restrict: true
    },
    code: async (ctx) => {
        const accountJid = ctx.quoted.senderJid || ctx.msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || null;
        const accountId = tools.general.getID(accountJid);
        const senderJid = ctx.sender.jid;
        const senderId = tools.general.getID(senderJid);
        const groupId = ctx.isGroup() ? tools.general.getID(ctx.id) : null;

        if (!accountJid) return await ctx.reply({
            text: `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
                `${quote(tools.cmd.generateCommandExample(ctx.used, `@${senderId}`))}\n` +
                quote(tools.cmd.generateNotes(["Balas atau kutip pesan untuk memberikan warning ke pengguna."])),
            mentions: [senderJid]
        });

        if (accountId === config.bot.id) return await ctx.reply(quote(`❎ Tidak bisa memberikan warning ke bot.`));

        if (await ctx.group().isAdmin(accountJid)) return await ctx.reply(quote("❎ Tidak bisa memberikan warning ke admin grup!"));

        try {
            const key = `group.${groupId}.warnings`;
            const warnings = await db.get(key) || {};
            const current = warnings[accountId] || 0;
            const newWarning = current + 1;

            if (newWarning >= 5) {
                await ctx.reply(quote("⛔ Kamu telah menerima 5 warning dan akan dikeluarkan dari grup!"));
                if (!config.system.restrict) await ctx.group().kick([senderJid]);
                delete warnings[senderId];
                return await db.set(key, warnings);
            }

            warnings[accountId] = newWarning;

            await db.set(key, warnings);

            return await ctx.reply(quote(`⚠️ Warning diberikan. Sekarang warning @${accountId} menjadi ${newWarning}/5.`), {
                mentions: [accountJid]
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};