
// use.js
const { monospace, quote } = require("@mengkodingan/ckptw");

module.exports = {
  name: "use",
  aliases: ["pakai"],
  category: "game",
  permissions: {},
  code: async (ctx) => {
    try {
      const senderId = tools.general.getID(ctx.sender.jid);
      const itemId = parseInt(ctx.args[0], 10);
      if (!itemId || isNaN(itemId)) return await ctx.reply(quote(`❎ Format: ${tools.cmd.generateCommandExample(ctx.used, "<itemid>")}`));
      const invKey = `user.${senderId}.inventory`;
      const inventory = (await db.get(invKey)) || {};
      const itemEntry = inventory[itemId];
      if (!itemEntry || itemEntry.quantity < 1) return await ctx.reply(quote("❎ Kamu tidak punya item tersebut."));
      // Apply effect for Bank Limit Increase
      if (itemId === 1) {
        const inc = 100;
        const userDb = (await db.get(`user.${senderId}`)) || {};
        const oldLimit = userDb.bankLimit ?? 100;
        const newLimit = oldLimit + inc;
        await db.set(`user.${senderId}.bankLimit`, newLimit);
        // decrement inventory
        itemEntry.quantity -= 1;
        if (itemEntry.quantity === 0) delete inventory[itemId];
        else inventory[itemId] = itemEntry;
        await db.set(invKey, inventory);
        return await ctx.reply(quote(`✅ Bank limit bertambah dari ${monospace(oldLimit.toString())} menjadi ${monospace(newLimit.toString())} Credz.`));
      }
      return await ctx.reply(quote("❎ Fitur use untuk item ini belum tersedia."));
    } catch (error) {
      return await tools.cmd.handleError(ctx, error, false);
    }
  }
};
