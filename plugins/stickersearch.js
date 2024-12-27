



























const axios = require("axios");
const { cmd } = require("../command");

cmd({
    pattern: "stickersearch",
    alias: ["stsearch", "sticksearch"],
    desc: "Search and fetch stickers based on a keyword.",
    category: "fun",
    react: "🔍",
    filename: __filename
}, async (conn, mek, m, { args, reply }) => {
    try {
        // Vérifiez si un mot-clé est fourni
        if (args.length === 0) {
            return reply(`❗ *Please provide a search term.*\n\nExample:\n.stickersearch funny`);
        }

        const query = args.join(" ");
        const tenorApiKey = "AIzaSyCyouca1_KKy4W_MG1xsPzuku5oa8W358c"; // Remplacez par votre clé API
        const apiUrl = `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(query)}&key=${tenorApiKey}&client_key=my_project&limit=8&media_filter=gif`;

        // Appel API
        const response = await axios.get(apiUrl);

        // Vérifiez si l'API a renvoyé des résultats
        if (response.status !== 200 || !response.data.results || response.data.results.length === 0) {
            return reply(`❌ *No stickers found for:* ${query}`);
        }

        // Envoyez les résultats sous forme de stickers
        for (const result of response.data.results) {
            const mediaUrl = result.media_formats.gif.url;

            await conn.sendMessage(m.chat, {
                sticker: { url: mediaUrl },
                caption: `🎨 *Sticker found for:* "${query}"`
            }, { quoted: mek });
        }

    } catch (error) {
        console.error(error);
        reply(`⚠️ *An error occurred while fetching stickers.*\n\n${error.message}`);
    }
});