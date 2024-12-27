





























const axios = require("axios");
const { cmd } = require("../command");

// Commande: fname (Find Name)
cmd(
  {
    pattern: "fname",
    alias: ["findname"],
    desc: "Find the nationality based on a name.",
    category: "fun",
    react: "💕",
    filename: __filename,
  },
  async (conn, mek, m, { reply, text }) => {
    try {
      // Vérification si un nom est fourni
      if (!text || text.trim().length === 0) {
        return reply(
          `❌ *Please provide a name to find the nationality.*\n\n*Example:* .fname Rayan`
        );
      }

      const name = text.trim();

      // Appel à l'API pour trouver la nationalité
      const response = await axios.get(`https://api.nationalize.io/?name=${encodeURIComponent(name)}`);
      const data = response.data;

      // Vérification des données
      if (!data || !data.country || data.country.length === 0) {
        return reply(
          `❌ *Sorry, no data found for the name "${name}".* Please try another name.`
        );
      }

      // Construction du message de réponse
      let resultMessage = `🌍 *Nationality Prediction for:* ${name}\n\n`;
      data.country.forEach((country, index) => {
        resultMessage += `🌎 *Country ${index + 1}:* ${country.country_id} (Probability: ${(country.probability * 100).toFixed(2)}%)\n`;
      });

      // Envoi du résultat
      reply(resultMessage.trim());
    } catch (error) {
      // Gestion de l'erreur avec des détails
      console.error("Error fetching nationality:", error.message);
      reply(
        `⚠️ *An error occurred while fetching the nationality.*\n\n_Error details: ${error.message}_`
      );
    }
  }
);