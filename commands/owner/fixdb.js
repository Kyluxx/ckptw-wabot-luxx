const {
    quote
} = require("@itsreimau/ckptw-mod");

module.exports = {
    name: "fixdb",
    aliases: ["fixdatabase"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const input = ctx.args[0] || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx.used, "user"))
        );

        if (["l", "list"].includes(input)) {
            const listText = await tools.list.get("fixdb");
            return await ctx.reply(listText);
        }

        try {
            const waitMsg = await ctx.reply(config.msg.wait);
            const dbJSON = await db.toJSON();
            const data = {
                user: dbJSON.user || {},
                group: dbJSON.group || {},
                menfess: dbJSON.menfess || {}
            };

            const filteredData = (category, item) => {
                const mappings = {
                    user: {
                        afk: {
                            reason: "string",
                            timestamp: "number"
                        },
                        banned: "boolean",
                        coin: "number",
                        lastClaim: {
                            daily: "number",
                            weekly: "number",
                            monthly: "number",
                            yearly: "number"
                        },
                        lastSentMsg: {
                            banned: "number",
                            cooldown: "number",
                            admin: "number",
                            botAdmin: "number",
                            coin: "number",
                            group: "number",
                            owner: "number",
                            premium: "number",
                            private: "number",
                            restrict: "number"
                        },
                        level: "number",
                        premium: "boolean",
                        uid: "string",
                        username: "string",
                        winGame: "number",
                        xp: "number"
                    },
                    group: {
                        maxwarnings: "number",
                        mute: "object",
                        mutebot: "boolean",
                        text: {
                            goodbye: "string",
                            intro: "string",
                            welcome: "string"
                        },
                        option: {
                            antiaudio: "boolean",
                            antidocument: "boolean",
                            antigif: "boolean",
                            antiimage: "boolean",
                            antilink: "boolean",
                            antinfsw: "boolean",
                            antisticker: "boolean",
                            antitagsw: "boolean",
                            antitoxic: "boolean",
                            antivideo: "boolean",
                            autokick: "boolean",
                            gamerestrict: "boolean",
                            welcome: "boolean"
                        },
                        spam: "object",
                        warnings: "object"
                    },
                    menfess: {
                        from: "string",
                        to: "string"
                    }
                };

                const validate = (obj, map) => {
                    if (typeof map === "string") {
                        return typeof obj === map;
                    } else if (typeof map === "object") {
                        if (typeof obj !== "object" || obj === null) return false;
                        const result = {};
                        for (const key in map) {
                            if (validate(obj[key], map[key])) {
                                result[key] = obj[key];
                            }
                        }
                        return result;
                    }
                    return false;
                };

                const schema = mappings[category];
                const result = validate(item, schema);
                return result || {};
            };

            const processData = async (category, data) => {
                await ctx.editMessage(waitMsg.key, quote(`🔄 Memproses data ${category}...`));
                for (const id of Object.keys(data)) {
                    const item = data[id] || {};
                    const filtered = filteredData(category, item);

                    if (!/^\d+$/.test(id) || Object.keys(filtered).length === 0) {
                        await db.delete(`${category}.${id}`);
                    } else {
                        await db.set(`${category}.${id}`, filtered);
                    }
                }
            };

            switch (input) {
                case "user":
                case "group":
                case "menfess":
                    await processData(input, data[input]);
                    break;

                default:
                    return await ctx.reply(quote(`❎ Key "${input}" tidak valid!`));
            }

            return await ctx.editMessage(waitMsg.key, quote(`✅ Basis data berhasil dibersihkan untuk ${input}!`));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};