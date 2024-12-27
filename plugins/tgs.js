const axios = require("axios");
const { cmd } = require("../command");


cmd({
    pattern: "stickers",
    alias: ["sticker"],
    desc: "Download Telegram stickers by providing a link to the sticker pack.",
    react: "📦",
    category: "utility",
    use: ".stickers <sticker pack link>",
    filename: __filename,
}, async (conn, mek, m, { args, reply }) => {
    try {
        if (args.length < 1) {
            return reply("❌ Please provide a link to the sticker pack.\nExample: `.stickers https://t.me/addstickers/PackName`");
        }

        const packLink = args[0];

        // Notify the user that the stickers are being fetched
        reply("📦 Fetching stickers...");

        // Fetch stickers using an API
        const response = await axios.get(`https://api.telegram.org/bot7255525909:AAHrp1dDCKbOSoiljFcF1fl4PQ9Tm2-E1Xo/getStickerSet?name=${packLink}`);
        const stickers = response.data.result.stickers;

        if (!stickers || stickers.length === 0) {
            return reply("❌ Sorry, no stickers found for the provided link.");
        }

        // Send the stickers back to the chat (example for sending the first sticker)
        const stickerUrl = `https://api.telegram.org/file/bot7255525909:AAHrp1dDCKbOSoiljFcF1fl4PQ9Tm2-E1Xo/${stickers[0].file_id}`;
        reply(`📦 Downloading sticker: ${stickerUrl}`);

        // Optionally, you can download all stickers in the pack
        // stickers.forEach(async (sticker) => {
        //     const stickerUrl = `https://api.telegram.org/file/bot7255525909:AAHrp1dDCKbOSoiljFcF1fl4PQ9Tm2-E1Xo/${sticker.file_id}`;
        //     await conn.sendFile(m.chat, stickerUrl, '', '', mek);
        // });

    } catch (error) {
        console.error("Error fetching stickers:", error.message);

        if (error.response && error.response.status === 404) {
            reply("❌ Sorry, no stickers found for the specified link.");
        } else {
            reply("❌ An error occurred while fetching the stickers. Please try again later.");
        }
    }
});
