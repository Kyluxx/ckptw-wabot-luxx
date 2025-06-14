const { quote } = require("@mengkodingan/ckptw");

module.exports = {
  name: "resetwhat",
  aliases: ["rw"],
  category: "owner",
  permissions: { owner: true },
  code: async (ctx) => {
    const [field, type] = ctx.args;
    const defaults = {
      number: 0,
      boolean: false,
      string: "",
    };

    // 1. check args
    if (!field || !type || !(type in defaults)) {
      const instruction = quote(
        tools.cmd.generateInstruction(["send"], ["text"])
      );
      const example = quote(
        tools.cmd.generateCommandExample(ctx.used, "credz number")
      );
      const typesList = Object.keys(defaults).join(", ");
      return ctx.reply(
        `${instruction}\n` +
        quote(`Usage: ${ctx.used} <field> <type>\nAvailable types: ${typesList}`) +
        `\n${example}`
      );
    }

    try {
      // 2. send wait message
      const waitMsg = await ctx.reply("🔄 Resetting all users, please wait...");

      // 3. load users and reset
      const dbJSON = await db.toJSON();
      const users = dbJSON.user || {};
      const defaultValue = defaults[type];

      for (const userId of Object.keys(users)) {
        await db.set(`user.${userId}.${field}`, defaultValue);
      }

      // 4. edit to success
      await ctx.editMessage(
        waitMsg.key,
        quote(`✅ Field \`${field}\` has been reset to \`${defaultValue}\` for all users!`)
      );
    } catch (err) {
      return tools.cmd.handleError(ctx, err, false);
    }
  },
};
