
const fetch = require('node-fetch');

module.exports = {
  command: ['gptgo'],
  operate: async ({ m, reply, text }) => {
    if (!text) return reply("*Please ask a question*");

    try {
      let response = await fetch(`https://api.tioo.eu.org/gptgo?text=${encodeURIComponent(text)}`);
      let data = await response.json();

      if (!data.result) {
        return reply("*Please try again later or try another command!*");
      } else {
        reply(data.result);
      }
    } catch (error) {
      console.error('Error fetching response from GPTGO API:', error);
      reply("An error occurred while fetching the response from GPTGO API.");
    }
  }
};