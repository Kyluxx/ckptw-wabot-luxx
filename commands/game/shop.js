
// shop.js
const { monospace, quote } = require("@mengkodingan/ckptw");

const items = [
  { id: 1, name: "[bl] Bank Limit Increase", aliases: ["bl"], price: 300, description: "Increase your bank limit by +100" }
];

module.exports = {
  name: "shop",
  aliases: ["beli", "buy"],
  category: "game",
  permissions: {},
  code: async (ctx) => {
    try {
      const senderId = tools.general.getID(ctx.sender.jid);
      const userDb = (await db.get(`user.${senderId}`)) || {};
      const wallet = userDb.credz || 0;
      const args = ctx.args;
      if (!args.length) {
        const shopList = items.map(i => `${i.id}. ${i.name} - ${monospace(i.price.toString())} Credz\n   ${i.description}`).join("\n\n");
        return await ctx.reply(quote(`🛒 Shop Items:\n\n${shopList}`));
      }
      let identifier = args[0].toLowerCase();
      let quantity = 1;
      if (identifier === "buy") {
        identifier = args[1]?.toLowerCase();
        if (!identifier) return await ctx.reply(quote(`❎ Format: ${tools.cmd.generateCommandExample(ctx.used, "buy <id> [quantity]")}`));
        if (!isNaN(parseInt(args[2], 10))) quantity = parseInt(args[2], 10);
      } else if (!isNaN(parseInt(args[1], 10))) {
        quantity = parseInt(args[1], 10);
      }
      const item = items.find(i => i.id === parseInt(identifier, 10) || i.name.toLowerCase() === identifier || i.aliases.includes(identifier));
      if (!item) return await ctx.reply(quote("❎ Item tidak ditemukan."));
      const totalCost = item.price * quantity;
      if (wallet < totalCost) return await ctx.reply(quote("❎ Credz tidak mencukupi untuk membeli item ini."));
      await db.subtract(`user.${senderId}.credz`, totalCost);
      // Update inventory object
      const invKey = `user.${senderId}.inventory`;
      const inventory = (await db.get(invKey)) || {};
      const existing = inventory[item.id] || { name: item.name, quantity: 0 };
      existing.quantity += quantity;
      inventory[item.id] = existing;
      await db.set(invKey, inventory);
      return await ctx.reply(quote(`✅ Berhasil membeli ${item.name} x${quantity} seharga ${monospace(totalCost.toString())} Credz.`));
    } catch (error) {
      return await tools.cmd.handleError(ctx, error, false);
    }
  }
};
