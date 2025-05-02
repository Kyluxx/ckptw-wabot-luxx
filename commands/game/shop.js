const { monospace, quote } = require("@mengkodingan/ckptw");

// Shop items with optional effect handlers
const items = [
  {
    id: 1,
    name: "[BL] Bank Limit Increase",
    aliases: ["bl"],
    price: 300,
    description: "Menambahkan limit bank sebanyak +100",
    // Custom effect when purchasing this item
    effect: async ({ senderId, userPath, userData, quantity, db, ctx }) => {
      const inc = 100 * quantity;
      const oldLimit = userData.bankLimit ?? 100;
      const newLimit = oldLimit + inc;
      await db.set(`${userPath}.bankLimit`, newLimit);
      return ctx.reply(
        quote(
          `✅ Berhasil membeli ${quantity} ${items[0].name}! \n` +
          `Limit bank: ${oldLimit} → ${newLimit}`
        )
      );
    }
  },
  // Add more items here, each can have its own `effect` function
];

module.exports = {
  name: "shop",
  aliases: ["beli", "buy", "upgrade"],
  category: "game",
  permissions: {},
  code: async (ctx) => {
    try {
      const senderId = tools.general.getID(ctx.sender.jid);
      const userPath = `user.${senderId}`;
      const userData = (await db.get(userPath)) || {};
      const wallet = userData.credz || 0;
      const [rawCmd, rawId, rawQty] = ctx.args.map(a => a.toLowerCase());

      // Show shop list if no args
      if (!rawCmd) {
        const shopList = items
          .map(i =>
            `${i.id}. ${i.name} - ${monospace(i.price.toString())} Credz\n   ${i.description}`
          )
          .join("\n\n");
        return ctx.reply(quote(`🛒 Shop Items:\n\n${shopList}`));
      }

      // Determine identifier and quantity
      const identifier = rawId || rawCmd;
      const quantity = Number(rawQty) > 0 ? Number(rawQty) : 1;

      // Find the item
      const item = items.find(i =>
        i.id === Number(identifier) ||
        i.name.toLowerCase() === identifier ||
        i.aliases.includes(identifier)
      );
      if (!item) return ctx.reply(quote("❎ Item tidak ditemukan."));

      const totalCost = item.price * quantity;
      const isOwner = tools.general.isOwner(senderId, ctx.msg.key.id);
      const isPremium = userData.premium === true;
      if (wallet < totalCost && !isOwner && !isPremium) {
        return ctx.reply(quote("❎ Credz tidak mencukupi untuk membeli item ini."));
      }

      // Deduct cost
      await db.subtract(`${userPath}.credz`, totalCost);

      // Handle custom effect or default inventory update
      if (typeof item.effect === 'function') {
        return item.effect({ senderId, userPath, userData, quantity, db, ctx });
      }

      // // Default: add to inventory
      // const invPath = `${userPath}.inventory`;
      // const inventory = (await db.get(invPath)) || {};
      // inventory[item.id] = {
      //   name: item.name,
      //   quantity: (inventory[item.id]?.quantity || 0) + quantity,
      // };
      // await db.set(invPath, inventory);

    } catch (error) {
      return tools.cmd.handleError(ctx, error, false);
    }
  },
};
