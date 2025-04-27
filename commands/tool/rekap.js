const {
    quote
} = require("@mengkodingan/ckptw");
function rekapDetail(input) {
    // 1. Split blok berdasarkan blank line
    const blocks = input.trim().split(/\r?\n\s*\r?\n/);
    const data = { kecil: [], besar: [] };
  
    for (const blk of blocks) {
      const lines = blk.split(/\r?\n/).map(l => l.trim());
      // 2. Deteksi header BESAR/KECIL
      const h = lines[0].match(/^(\w+)(?:\s*\/\/.*)?$/);
      if (!h) continue;
      const key = h[1].toLowerCase();
      if (!data[key]) continue;
  
      // 3. Ambil semua angka di baris selanjutnya
      for (let i = 1; i < lines.length; i++) {
        const m = lines[i].match(/(\d+)/);
        if (m) data[key].push(Number(m[1]));
      }
    }
  
    // 4. Hitung total
    const sum = arr => arr.reduce((a, b) => a + b, 0);
    const totalKecil = sum(data.kecil);
    const totalBesar = sum(data.besar);
    const grandTotal = totalKecil + totalBesar;
  
    // 5. Kondisional seimbang atau belum
    const status = totalKecil === totalBesar
      ? 'KECIL dan BESAR sudah seimbang'
      : 'KECIL dan BESAR belum seimbang';
  
    // 6. Format output
    return [
      `KECIL: [${data.kecil.join(', ')}] = ${totalKecil}`,
      `BESAR: [${data.besar.join(', ')}] = ${totalBesar}`,
      '',
      status,
      '',
      `Total keduanya: ${grandTotal}`
    ].join('\n');
  }

  module.exports = {
    name: "rekap",
    aliases: ["rek"],
    category: "tool",

    code: async (ctx) => {
        const input = ctx.quoted?.conversation
                
        if (!input) return await ctx.reply(
            `${quote("Balas pesan yang ingin direkap")}`
        )

        return await ctx.reply(
        rekapDetail(input)
        )
    }
}