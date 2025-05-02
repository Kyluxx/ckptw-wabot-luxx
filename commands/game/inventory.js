
// inventory.js
const { monospace, quote } = require("@mengkodingan/ckptw");

module.exports = {
  name: "inventory",
  aliases: ["inv"],
  category: "game",
  permissions: {},
code: async (ctx) => {

    try {
      const senderId = tools.general.getID(ctx.sender.jid);
      const invKey = `user.${senderId}.inventory`;
      const inventory = (await db.get(invKey)) || {};
      let resp = "📦 Inventory kamu:\n\n";
      const entries = Object.entries(inventory);
      if (entries.length === 0) resp += "(kosong)";
      for (const [id, data] of entries) {
        resp += `[${id}] ${data.name} x${data.quantity}\n`;
      }
      return await ctx.reply(quote(resp));
    } catch (error) {
      return await tools.cmd.handleError(ctx, error, false);
    }
  }
};
