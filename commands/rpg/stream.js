const { monospace, quote } = require("@mengkodingan/ckptw");

const COOLDOWN = 10 * 60 * 1000;       // 1 hour cooldown for stream
const VIEWER_TIMEOUT = 30 * 60 * 1000; // 30 minutes before viewers drop

const possibleStreams = [
    "Kamu melakukan live streaming permainan sepak bola di YouTube.",
    "Kamu melakukan live streaming permainan Mobile Legends di Facebook Gaming.",
    "Kamu melakukan live streaming permainan PUBG di TikTok.",
    "Kamu melakukan live streaming permainan Dota 2 di Twitch.",
    "Kamu melakukan live streaming permainan League of Legends di YouTube.",
    "Kamu melakukan live streaming permainan Overwatch di Facebook Gaming.",
    "Kamu melakukan live streaming permainan Apex Legends di TikTok.",
    "Kamu melakukan live streaming permainan Minecraft di Twitch.",
    "Kamu melakukan live streaming permainan Roblox di YouTube.",
    "Kamu melakukan live streaming permainan Fortnight di Facebook Gaming.",
    "Kamu melakukan live streaming permainan World of Warcraft di TikTok.",
    "Kamu melakukan live streaming permainan Valorant di Twitch.",
    "Kamu melakukan live streaming permainan The Last of Us di YouTube.",
    "Kamu melakukan live streaming permainan God of War di Facebook Gaming.",
    "Kamu melakukan live streaming permainan Uncharted di TikTok.",
    "Kamu melakukan live streaming permainan The Witcher di Twitch.",
    "Kamu melakukan live streaming permainan Cyberpunk di YouTube.",
    "Kamu melakukan live streaming permainan Final Fantasy di Facebook Gaming.",
    "Kamu melakukan live streaming permainan Resident Evil di TikTok.",
    "Kamu melakukan live streaming permainan Call of Duty di Twitch.",
  ];

// Sentiment tiers: 2 positive, 2 neutral, 2 negative
const SENTIMENTS = [
  { label: "hype",        impact: +5 }, // strongest positive
  { label: "seru",        impact: +2 }, // mild positive
  { label: "normal",      impact: +1 }, // mild neutral
  { label: "biasa aja",   impact:  0 }, // mild neutral
  { label: "membosankan", impact: -2 }, // mild negative
  { label: "sampah",      impact: -4 }  // strongest negative
];

// Gifts hierarchy 1–10 (smallest to biggest), each with rarity weight and cred value
const GIFTS = [
  { name: "mawar",       weight: 100, value: 1 },    // rarest weight=10, low value
  { name: "lumba-lumba", weight: 75,  value: 5 },
  { name: "buket",       weight: 25,  value: 10 },
  { name: "boneka",      weight: 15,  value: 20 },
  { name: "galaksi",     weight: 10,  value: 50 },
  { name: "robot",       weight: 5,  value: 75 },
  { name: "mobil",       weight: 4,  value: 100 },
  { name: "motor",       weight: 3,  value: 150 },
  { name: "yacht",       weight: 2,  value: 250 },
  { name: "paus",        weight: 1,  value: 500 }   // biggest gift, highest value
];

// Helper to pick a random element from an array
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Weighted random pick from GIFTS
function pickWeightedGift() {
  const total = GIFTS.reduce((sum, g) => sum + g.weight, 0);
  let r = Math.random() * total;
  for (const gift of GIFTS) {
    if (r < gift.weight) return gift;
    r -= gift.weight;
  }
  return GIFTS[GIFTS.length - 1];
}

module.exports = {
  name: "stream",
  aliases: ["laptop"],
  category: "rpg",
  code: async (ctx) => {
    const userId = tools.general.getID(ctx.sender.jid);
    const now    = Date.now();

    // require laptop
    const hasLaptop = (await db.get(`user.${userId}.laptop`)) || false;
    if (!hasLaptop) {
      return ctx.reply(
        quote(`❌ Kamu belum punya Laptop untuk streaming! cobalah membeli di .shop`)
      );
    }

    // cooldown check
    const lastStream = (await db.get(`user.${userId}.lastStream`)) || 0;
    if (now - lastStream < COOLDOWN) {
      const rem = COOLDOWN - (now - lastStream);
      const mins = Math.ceil(rem / 60000);
      return ctx.reply(
        quote(`⏳ Tunggu ${monospace(mins + "m")} lagi sebelum streaming.`)
      );
    }

    // 10% chance to break the laptop
    if (Math.random() < 0.1) {
      await db.set(`user.${userId}.laptop`, false);
      return ctx.reply(quote(`😭 Laptop-mu rusak! Beli lagi laptop di .shop`));
    }

    // handle timeout (viewers reset)
    let viewers = (await db.get(`user.${userId}.viewers`)) || 0;
    let timeoutMsg = "";
    if (lastStream && now - lastStream > VIEWER_TIMEOUT) {
      viewers = 0;
      timeoutMsg = quote(`⚠️ Streak-mu terputus! Semua viewer meninggalkan channel.`) + "\n";
    }

    // simulate one new viewer
    viewers++;

    // apply sentiment effect
    const sentiment = pickRandom(SENTIMENTS);
    viewers = Math.max(0, viewers + sentiment.impact);

    // simulate gifts
    const giftCounts = {};
    let totalGiftCred = 0;
    for (let i = 0; i < viewers; i++) {
      if (Math.random() * 100 < 25) { // 25% chance per viewer
        const gift = pickWeightedGift();
        giftCounts[gift.name] = (giftCounts[gift.name] || 0) + 1;
        totalGiftCred += gift.value;
        await db.add(`user.${userId}.gifts.${gift.name}`, 1);
      }
    }

    // calculate cred reward
    const bonusCred = viewers;
    const totalCred = bonusCred + totalGiftCred;

    // update DB
    await db.set(`user.${userId}.lastStream`, now);
    await db.set(`user.${userId}.viewers`, viewers);
    await db.add(`user.${userId}.credz`, totalCred);

    // build gift summary text
    const giftLines = Object.entries(giftCounts)
      .map(([name, count]) => `🎁 ${count} x ${name} (+${GIFTS.find(g=>g.name===name).value*count} Credz)`)
      .join("\n");

    // final reply
    let reply = quote(pickRandom(possibleStreams)) + "\n";
    reply += timeoutMsg;
    reply += quote(`👀 Sentiment: ${sentiment.label} (${sentiment.impact > 0 ? "+" : ""}${sentiment.impact} viewer)`) + "\n";
    reply += quote(`🔥 Viewer sekarang: ${monospace(viewers)}`) + "\n\n";
    if (giftLines) {
      reply += quote(`🎉 Kamu menerima gift:`) + "\n" + giftLines + "\n\n";
    }
    reply += quote(`💰 Credz: +${monospace(bonusCred)} (viewer)`)
         + ` +${monospace(totalGiftCred)} (gift) = ${monospace(totalCred)}`;

    return ctx.reply(reply);
  }
};
