const { monospace, quote } = require("@mengkodingan/ckptw");

module.exports = {
  name: "upgradepickaxe",
  aliases: ["upickaxe", "upick"],
  category: "rpg",
  code: async (ctx) => {
    const userId = tools.general.getID(ctx.sender.jid);
    const input = ctx.args[0]?.toLowerCase() || null;

    // urutan level pickaxe
    const levels = ["stone", "iron", "golden", "iridium"];
    // mapping upgrade: current → { next, price }
    const upgradeMap = {
      stone:  { next: "iron",    price: 500 },
      iron:   { next: "golden",  price: 1750 },
      golden: { next: "iridium", price: 7000 }
    };

    // .upick list: tampilkan shop pickaxe
    if (input === "list") {
      const listItems = levels.map(level => {
        const info = upgradeMap[level];
        if (info) {
          return `${monospace(level)} → ${monospace(info.next)} : ${info.price} credz`;
        }
        return `${monospace(level)} : MAX LEVEL`;
      }).join("\n");

      return ctx.reply(
        quote(`🛒 Shop Pickaxe Upgrade:`) +
        `
${listItems}` +
        `

Gunakan ${monospace(ctx.used.prefix + ctx.used.command + ' <level>')} untuk upgrade pickaxe.`
      );
    }

    // fetch atau inisialisasi current pickaxe (default stone)
    let current = (await db.get(`user.${userId}.pickaxe`))?.toLowerCase();
    if (!current) {
      current = "stone";
      await db.set(`user.${userId}.pickaxe`, current);
    }

    // tanpa arg: show status
    if (!input) {
      return ctx.reply(
        quote(`⛏️ Pickaxe saat ini: ${monospace(current)}`) +
        `
Gunakan ${monospace(ctx.used.prefix + ctx.used.command + ' list')} untuk daftar.`
      );
    }

    // validasi level input
    if (!levels.includes(input)) {
      return ctx.reply(quote(`❎ Level '${input}' tidak valid!`));
    }

    const currentIndex = levels.indexOf(current);
    const targetIndex = levels.indexOf(input);

    // sudah di level ini
    if (targetIndex === currentIndex) {
      return ctx.reply(quote(`⚠️ Pickaxe-mu sudah di level ${monospace(current)}.`));
    }
    // skip level
    if (targetIndex > currentIndex + 1) {
      return ctx.reply(quote(`⚠️ Kamu tidak bisa lompat dari ${monospace(current)} ke ${monospace(input)}.`));
    }
    // downgrade
    if (targetIndex < currentIndex) {
      return ctx.reply(quote(`⚠️ Kamu tidak bisa menurunkan level pickaxe.`));
    }

    // proper upgrade
    const info = upgradeMap[current];
    const userDb = (await db.get(`user.${userId}`)) || {};
    const credz = userDb.credz || 0;
    const isOwner = tools.general.isOwner(userId);
    const isPremium = userDb.premium;
    let costMsg = "";

    if (!isOwner && !isPremium) {
      if (credz < info.price) {
        return ctx.reply(quote(`💔 Credz mu kurang! Butuh ${monospace(info.price)} untuk upgrade ke ${monospace(info.next)}.`));
      }
      await db.subtract(`user.${userId}.credz`, info.price);
      costMsg = `- ${monospace(info.price + ' credz')}`;
    } else {
      costMsg = `🔓 Gratis upgrade untuk ${isOwner ? 'Owner' : 'Premium User'}!`;
    }

    await db.set(`user.${userId}.pickaxe`, info.next);
    return ctx.reply(
      quote(`✅ Upgrade sukses! Pickaxe-mu sekarang: ${monospace(info.next)}.` +
            `\n${costMsg}`)
    );
  }
};
