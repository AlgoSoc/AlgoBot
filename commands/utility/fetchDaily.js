const { EmbedBuilder } = require('discord.js'); // Correct import for EmbedBuilder
const { SlashCommandBuilder } = require("@discordjs/builders"); // Make sure this import is correct
const axios = require('axios');

const DIFFICULTY_COLOURS = {
  "Easy": "#00ff00",
  "Medium": "#ffcc00",
  "Hard": "#b30000",
}

// Fetches problem with specific id

module.exports = {
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Fetch the daily problem"),
  async execute(interaction) {
    try {

        const query = `
                query questionOfToday {
                    activeDailyCodingChallengeQuestion {
                    date
                    link
                    question {
                        difficulty
                        frontendQuestionId: questionFrontendId
                        paidOnly: isPaidOnly
                        title
                        content
                    }
                }
            }
        `;



        
        // Encode the query and variables into a URL-friendly format
        const encodedQuery = encodeURIComponent(query);

        const response = await axios.get(`https://leetcode.com/graphql?query=${encodedQuery}`);

        // Extract the problem data
        const problem = response.data?.data?.activeDailyCodingChallengeQuestion;
        const question = problem?.question;

        // Check if the question data is available
        if (!question) {
          throw new Error('No problem data found or data is not in the expected format.');
        }

        // makes an embed
        const embed = new EmbedBuilder()
            .setTitle(question.title)
            .addFields(         
              { name: 'Difficulty', value: question.difficulty, inline: true },
              { name: 'Question ID', value: question.frontendQuestionId.toString(), inline: true },
              { name: 'Paid Only', value: question.paidOnly ? 'Yes' : 'No', inline: true }
            )
            .setColor(DIFFICULTY_COLOURS[question.difficulty])
            .setTimestamp()
            .setURL(`https://leetcode.com${problem.link}`);

        await interaction.reply({embeds: [embed]});
    } catch (error) {
      console.log("error: ",error);
      // Example response
      await interaction.reply(`Error in fetching daily problem. Please let bot developers know.`);
    }
    
  },
};


