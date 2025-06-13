const { monospace, quote } = require("@mengkodingan/ckptw");
const { Chess } = require("chess.js");

// prevent multiple games per chat
const sessions = new Map();

module.exports = {
  name: "chess",
  category: "game",
  aliases: ["catur"],
  permissions: {
    group: true
  },
  code: async (ctx) => {
    const chatId = ctx.id;
    
    // init or retrieve session
    let chessData = sessions.get(chatId) || {
      gameData: null,
      fen: null,
      currentTurn: null,
      players: [],
      hasJoined: []
    };
    sessions.set(chatId, chessData);

    const { gameData, fen, currentTurn, players, hasJoined } = chessData;
    const feature = ctx.args[0]?.toLowerCase();

    // stop and remove session
    if (feature === 'delete') {
      sessions.delete(chatId);
      return ctx.reply(quote('🏳️ Chess game stopped.'));
    }

    // start new waiting game
    if (feature === 'create') {
      if (gameData) {
        return ctx.reply(quote('⚠️ Game already in progress.'));
      }
      chessData.gameData = { status: 'waiting', black: null, white: null };
      return ctx.reply(quote('🎮 Chess game started. Waiting for players to join.'));
    }

    // join the waiting game
    if (feature === 'join') {
      const playerJid = ctx.sender.jid;
      if (players.includes(playerJid)) {
        return ctx.reply(quote('🙅‍♂️ You have already joined this game.'));
      }
      if (!gameData || gameData.status !== 'waiting') {
        return ctx.reply(quote('⚠️ No game is currently waiting.'));
      }
      if (players.length >= 2) {
        return ctx.reply(quote('👥 Players are full. Game will start soon.'));
      }

      players.push(playerJid);
      hasJoined.push(playerJid);

      if (players.length === 2) {
        gameData.status = 'ready';
        // assign colors randomly
        const [p1, p2] = players;
        const [black, white] = Math.random() < 0.5 ? [p1, p2] : [p2, p1];
        gameData.black = black;
        gameData.white = white;
        chessData.currentTurn = white;

        const list = hasJoined.map(id => `- @${id.split('@')[0]}`).join('\n');
        const msg = `🙌 Players joined:\n${list}\n\n*Black:* @${black.split('@')[0]}\n*White:* @${white.split('@')[0]}\n\nType *chess start* to begin the game.`;
        return ctx.reply(quote(msg), { mentions: hasJoined });
      }

      return ctx.reply(quote('🙋‍♂️ You joined. Waiting for player 2.'));
    }

    // begin the game after two joined
    if (feature === 'start') {
      if (!gameData || gameData.status !== 'ready') {
        return ctx.reply(quote('⚠️ Cannot start. Need two players joined.'));
      }
      gameData.status = 'playing';
      const initialFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
      chessData.fen = initialFen;

      const turnMsg = `🎲 Turn: White @${gameData.white.split('@')[0]}`;
      const url = `https://www.chess.com/dynboard?fen=${encodeURIComponent(initialFen)}&board=graffiti&piece=graffiti&size=3&coordinates=inside`;

      // send board image
      await ctx.sendMessage(chatId, { image: { url }, caption: quote(turnMsg) });
      return;
    }

    // handle moves: chess <from> <to>
    if (ctx.args[0] && ctx.args[1]) {
      if (!gameData || gameData.status !== 'playing') {
        return ctx.reply(quote('⚠️ Game not started yet.'));
      }
      const playerJid = ctx.sender.jid;
      if (currentTurn !== playerJid) {
        const color = currentTurn === gameData.white ? 'White' : 'Black';
        return ctx.reply(quote(`⏳ It's ${color}'s turn.`), { contextInfo: { mentionedJid: [currentTurn] } });
      }

      const chess = new Chess(fen);
      // check for terminal states
      if (chess.isCheckmate()) {
        sessions.delete(chatId);
        return ctx.reply(quote(`🏁 Checkmate! Winner: @${playerJid.split('@')[0]}`));
      }
      if (chess.isDraw()) {
        sessions.delete(chatId);
        const list = hasJoined.map(id => `- @${id.split('@')[0]}`).join('\n');
        return ctx.reply(quote(`🤝 Draw! Players:\n${list}`), { contextInfo: { mentionedJid: hasJoined } });
      }

      const [from, to] = ctx.args;
      const move = chess.move({ from, to, promotion: 'q' });
      if (!move) {
        return ctx.reply(quote('❌ Invalid move.'));
      }

      // update state
      chessData.fen = chess.fen();
      const idx = players.indexOf(playerJid);
      chessData.currentTurn = players[(idx + 1) % 2];

      // prepare next turn
      const next = chessData.currentTurn;
      const color = next === gameData.white ? 'White' : 'Black';
      const turnMsg = `🎲 Turn: ${color} @${next.split('@')[0]}`;
      const url = `https://www.chess.com/dynboard?fen=${encodeURIComponent(chess.fen())}&board=graffiti&piece=graffiti&size=3&coordinates=inside`;

      await ctx.sendMessage(chatId, { image: { url }, caption: quote(turnMsg) });
      return;
    }

    // help menu
    if (feature === 'help') {
      const helpText = `🌟 Chess Commands:\n\n` +
        `*chess create* - Start game\n` +
        `*chess join* - Join waiting game\n` +
        `*chess start* - Begin when ready\n` +
        `*chess delete* - Stop game\n` +
        `*chess [from] [to]* - Make move\n\n` +
        `Example: [1] chess create (anyone)\n[2] chess join (player 1 and 2)\n[3] chess start (anyone)`;
      return ctx.reply(quote(helpText));
    }

    // invalid command fallback
    return ctx.reply(quote('❓ Invalid command. Use *chess help* to see commands.'));
  }
};
