const { monospace, quote } = require("@mengkodingan/ckptw");

// Shop items with optional effect handlers
const items = [
  {
    id: 1,
    name: "[BL] Bank Limit 🏦",
    aliases: ["bl"],
    price: 200,
    description: "Menambahkan limit bank sebanyak +100",
    // Custom effect when purchasing this item
    effect: async ({ senderId, userPath, userData, quantity, db, ctx, item }) => {
      const inc = 100 * quantity;
      const oldLimit = userData.bankLimit ?? 100;
      const newLimit = oldLimit + inc;
      await db.set(`${userPath}.bankLimit`, newLimit);
      return ctx.reply(
        quote(
          `✅ Berhasil membeli ${quantity}x ${item.name}! \n` +
          `Limit bank: ${oldLimit} → ${newLimit}`
        )
      );
    }
  },
  {
    id: 2,
    name: "[LP] Laptop 💻",
    aliases: ["lp", "laptop"],
    price: 500,
    description: "Mendapatkan Laptop untuk streaming",
    // Custom effect when purchasing this item
    effect: async ({ senderId, userPath, quantity, db, ctx, item }) => {
      if(`${userPath}.laptop` === true) {
        return ctx.reply(quote(`❌ Kamu sudah punya Laptop!`));
      }
      if (quantity > 1) {
        return ctx.reply(quote(`❌ Maksimal pembelian ${item.name} adalah 1`));
      }
      await db.set(`${userPath}.laptop`, true);
      return ctx.reply(
        quote(`✅ Berhasil membeli 1x ${item.name}!`)
      );
    }
  },
  // Add more items here
];

module.exports = {
  name: "shop",
  aliases: ["beli", "buy", "upgrade"],
  category: "rpg",
  code: async (ctx) => {
    try {
      const senderId = tools.general.getID(ctx.sender.jid);
      const userPath = `user.${senderId}`;
      const userData = (await db.get(userPath)) || {};
      const wallet = userData.credz || 0;
      const rawId = ctx.args[0];
      const rawQty = ctx.args[1];

      // If no arguments, show shop list
      if (!rawId) {
        const shopList = items
          .map(i =>
            `${i.id}. ${i.name} - ${monospace(i.price.toString())} Credz\n   ${i.description}`
          )
          .join("\n\n");
        return ctx.reply(quote(`🛒 Shop Items:\n\n${shopList}`));
      }

      // Determine item identifier and quantity
      const identifier = rawId.toLowerCase();
      const quantity = Number(rawQty) > 0 ? Number(rawQty) : 1;

      // Find the item by id, name or alias
      const item = items.find(i =>
        i.id === Number(identifier) ||
        i.name.toLowerCase() === identifier ||
        i.aliases.includes(identifier)
      );
      if (!item) {
        return ctx.reply(quote("❎ Item tidak ditemukan."));
      }

      // Check sufficient funds (owner/premium bypass)
      const totalCost = item.price * quantity;
      const isOwner = tools.general.isOwner(senderId, ctx.msg.key.id);
      const isPremium = userData.premium === true;
      if (wallet < totalCost && !isOwner && !isPremium) {
        return ctx.reply(quote("❎ Credz tidak mencukupi untuk membeli item ini."));
      }

      // Deduct cost
      await db.subtract(`${userPath}.credz`, totalCost);

      // Run custom effect if defined
      if (typeof item.effect === 'function') {
        return item.effect({ senderId, userPath, userData, quantity, db, ctx, item });
      }

      // Default behavior: add to inventory
      const invPath = `${userPath}.inventory`;
      const inventory = (await db.get(invPath)) || {};
      const prevQty = inventory[item.id]?.quantity || 0;
      inventory[item.id] = {
        name: item.name,
        quantity: prevQty + quantity,
      };
      await db.set(invPath, inventory);

      return ctx.reply(
        quote(`✅ Berhasil membeli ${quantity}x ${item.name}!`)
      );

    } catch (error) {
      return tools.cmd.handleError(ctx, error, false);
    }
  },
};
