const {
    quote,
} = require("@mengkodingan/ckptw");
const mime = require("mime-types");

module.exports = {
    name: "tqto",
    aliases: ["thanksto"],
    category: "information",
    permissions: {},
    code: async (ctx) => {

	const text = `_Special Thanks To_` +
	    "\n" +
	    `${quote("────────────────────")}\n` + 
	    `${quote("Allah SWT")}\n` +
            `${quote("Orang tua saya")}\n` +
            `${quote("──────Developer──────")}\n` +
            `${quote("ItsReimau (https://github.com/itsreimau)")}\n` +
            `${quote("Rizky Pratama | Kyluxx (https://github.com/Kyluxx)")}\n` +
            `${quote("───────Donatur──────")}\n` +
            `${quote("Arya (https://www.instagram.com/aryaahahahahaha)")}\n` +
	    `${quote("────────────────────")}\n` +
            `${quote("Dan kepada semua orang yang telah membantu dalam pengembangan bot ini ^^")}\n` +
            "\n" +
            config.msg.footer;


	const fakeQuotedText = {
                key: {
                    participant: "13135550002@s.whatsapp.net",
                    remoteJid: "status@broadcast"
                },
                message: {
                    extendedTextMessage: {
                        text: config.msg.note,
                        title: config.bot.name
                    }
                }
            };
//            const url = (await axios.get(tools.api.createUrl("http://vid2aud.hofeda4501.serv00.net", "/api/img2vid", {
//                url: config.bot.thumbnail
//            }))).data.result;

            return await ctx.reply({
                image: {
                    url: config.bot.thumbnail
                },
                mimetype: mime.lookup("png"),
                caption: text,
                contextInfo: {
                    mentionedJid: [ctx.sender.jid],
                    forwardingScore: 9999,
                    isForwarded: true
                },
            }, {
                quoted: fakeQuotedText
            });

/*
        return await ctx.reply(
            `${quote("Allah SWT")}\n` +
            `${quote("Orang tua saya")}\n` +
            `${quote("─────")}\n` +
            `${quote("ItsReimau (https://github.com/itsreimau)")}\n` +
            `${quote("Serv00 (https://serv00.com/)")}\n` +
            `${quote("─────")}\n` +
            `${quote("Fatahillah Al makarim (https://github.com/ZTRdiamond)")}\n` +
            `${quote("Jastin Linggar Tama (https://github.com/JastinXyz)")}\n` +
            `${quote("Techwiz (https://github.com/techwiz37)")}\n` +
            `${quote("─────")}\n` +
            `${quote("Idul (https://github.com/aidulcandra)")}\n` +
            `${quote("Rizky Pratama | Kyluxx (https://github.com/Kyluxx)")}\n` +
            `${quote("Rippanteq7 (https://github.com/Rippanteq7)")}\n` +
            `${quote("UdeanDev (https://github.com/udeannn)")}\n` +
            `${quote("─────")}\n` +
            `${quote("agatzdev (https://github.com/agatdwi)")}\n` +
            `${quote("Aine (https://github.com/Aiinne)")}\n` +
            `${quote("BochilGaming (https://github.com/BochilGaming)")}\n` +
            `${quote("Bhuzel (https://github.com/Bhuzel)")}\n` +
            `${quote("David Cyril (https://github.com/DavidCyrilTech)")}\n` +
            `${quote("FastURL (alias Hikaru) (https://github.com/fasturl)")}\n` +
            `${quote("Lann (https://github.com/ERLANRAHMAT)")}\n` +
            `${quote("Nyx Altair (https://github.com/NyxAltair)")}\n` +
            `${quote("OtinXSandip (https://github.com/OtinXSandip)")}\n` +
            `${quote("Randyy (https://github.com/rynxzyy)")}\n` +
            `${quote("Siraj (https://github.com/BK9dev)")}\n` +
            `${quote("swndyyyyyy (https://github.com/swndyy)")}\n` +
            `${quote("─────")}\n` +
            `${quote("Dan kepada semua pihak yang telah membantu dalam pengembangan bot ini.")}\n` +
            "\n" +
            config.msg.footer
        ); // Jika Anda tidak menghapus ini, terima kasih!
*/
    }
};
