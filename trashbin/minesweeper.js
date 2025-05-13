// minesweeper_refactored.js
const { monospace, quote } = require("@mengkodingan/ckptw");
/**
 * Game settings
 */
const SETTINGS = {
  xSize: 3,
  ySize: 3,
  bombs: 1,
  startCost: 50,
  rewardPerOpen: 15,
};

// session store per chat
const sessions = {};

// icon map for display
const ICONS = {
  0: '⬜',
  1: '1️⃣',
  2: '2️⃣',
  3: '3️⃣',
  x: '💣',
  hidden: '⏹',
};

/**
 * Generate minesweeper map with bomb markers and neighbor counts
 */
function generateMap(width, height, bombs) {
  const map = Array.from({ length: width }, () => Array(height).fill(0));
  // place bombs
  let placed = 0;
  while (placed < bombs) {
    const rx = Math.floor(Math.random() * width);
    const ry = Math.floor(Math.random() * height);
    if (map[rx][ry] !== 'x') {
      map[rx][ry] = 'x';
      placed++;
    }
  }
  // calculate counts
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (map[x][y] === 'x') continue;
      let count = 0;
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < width && ny >= 0 && ny < height && map[nx][ny] === 'x') {
            count++;
          }
        }
      }
      map[x][y] = count;
    }
  }
  return map;
}

/**
 * Flood fill zeros to reveal adjacent cells
 */
function floodFill(map, startX, startY) {
  const width = map.length;
  const height = map[0].length;
  const visited = new Set();
  const queue = [[startX, startY]];
  const revealed = [];

  while (queue.length) {
    const [x, y] = queue.shift();
    const key = `${x},${y}`;
    if (visited.has(key)) continue;
    visited.add(key);
    revealed.push([x, y]);

    if (map[x][y] === 0) {
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            queue.push([nx, ny]);
          }
        }
      }
    }
  }
  return revealed;
}

/**
 * Convert grid to display string
 */
function gridToString(view) {
  return view.map(row => row.map(val => ICONS[val] || ICONS.hidden).join('')).join('\n');
}

module.exports = {
  name: "minesweeper",
  category: "game",
  aliases: ["msp"],
  code: async (ctx) => {
    const { prefix, command } = ctx.used;
    const [ action, xArg, yArg ] = ctx.args;

    if (!action) {
      const help = [
        `▶ ${monospace(prefix + command)} go - Play for ${SETTINGS.startCost} chips`,
        `🔓 ${monospace(prefix + command)} open <x> <y> - Open a cell`,
        `🔽 ${monospace(prefix + command)} surrender - Give up`,
      ].join("\n");
      return ctx.reply(quote(`🕹 Minesweeper 🕹\n${help}`));
    }

    // identify user and chips
    const userId = tools.general.getID(ctx.sender.jid);
    const userKey = `user.${userId}`;
    const userData = (await db.get(userKey)) || {};
    const balance = userData.chips || 0;

    const chatId = ctx.chat;
    const session = sessions[chatId];

    try {
      switch (action.toLowerCase()) {
        case 'go':
        case 'start':
          if (balance < SETTINGS.startCost) {
            return ctx.reply(quote('🚨 Not enough chips!'));
          }
          await db.subtract(`${userKey}.chips`, SETTINGS.startCost);
          const fullMap = generateMap(SETTINGS.xSize, SETTINGS.ySize, SETTINGS.bombs);
          const viewMap = Array.from({ length: SETTINGS.xSize }, () => Array(SETTINGS.ySize).fill(0));
          const msg = await ctx.reply(quote(`🕹 Minesweeper 🕹\n\n${gridToString(viewMap)}`));
          sessions[chatId] = { map: fullMap, view: viewMap, msgId: msg.key.id };
          break;

        case 'open':
          if (!session) return ctx.reply(quote('🚨 No active game.'));

          const x = Number(xArg) - 1;
          const y = Number(yArg) - 1;
          if (!Number.isInteger(x) || !Number.isInteger(y) || x < 0 || x >= SETTINGS.xSize || y < 0 || y >= SETTINGS.ySize) {
            return ctx.reply(quote(`🚨 Usage: ${monospace(prefix + command + ' open <x> <y>')}`));
          }

          const cell = session.map[x][y];
          if (cell === 'x') {
            delete sessions[chatId];
            return ctx.reply(quote('💥 BOOM! 💣 Game over.'));
          }

          // reveal cells and reward
          const toReveal = cell === 0 ? floodFill(session.map, x, y) : [[x, y]];
          for (const [rx, ry] of toReveal) {
            if (session.view[rx][ry] === 0) {
              session.view[rx][ry] = session.map[rx][ry];
              await db.add(`${userKey}.chips`, SETTINGS.rewardPerOpen);
            }
          }

          const display = gridToString(session.view);
          const opened = session.view.flat().filter(v => v !== 0).length;

          if (opened === SETTINGS.xSize * SETTINGS.ySize - SETTINGS.bombs) {
            delete sessions[chatId];
            const total = SETTINGS.rewardPerOpen * opened;
            return ctx.reply(quote(`🎉 You cleared all! Total reward: ${total} chips.`));
          }

          await ctx.reply(quote(`🕹 Minesweeper 🕹\n\n${display}`), { delete: session.msgId });
          break;

        case 'surrender':
        case 'stop':
        case 'end':
          if (!session) return ctx.reply(quote('🚨 No active game.'));
          delete sessions[chatId];
          return ctx.reply(quote('🏳 You gave up.'));

        default:
          return ctx.reply(quote('🚨 Unknown action.'));
      }
    } catch (err) {
      console.error(err);
      return tools.cmd.handleError(ctx, err, false);
    }
  },
};
