const { EmbedBuilder } = require('discord.js'); // Correct import for EmbedBuilder
const { SlashCommandBuilder } = require("@discordjs/builders"); // Make sure this import is correct
const { NodeHtmlMarkdown } = require('node-html-markdown')
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
      .setName("userstats")
      .setDescription("Fetches the stats of the user."), // we would need to initially register the user
    async execute(interaction) {
      try {
          
        query globalData {
            userStatus {
              userId
              isSignedIn
              isMockUser
              isPremium
              isVerified
              username
              avatar
              isAdmin
              isSuperuser
              permissions
              isTranslator
              activeSessionId
              checkedInToday
              notificationStatus {
                lastModified
                numUnread
              }
            }
          }
          
          // makes an embed
          const embed = new EmbedBuilder()
              .setTitle(question.title)
              .addFields(
                { name: 'Difficulty', value: question.difficulty, inline: true },
                { name: 'Question ID', value: question.frontendQuestionId.toString(), inline: true },
                { name: 'Paid Only', value: question.isPaidOnly ? 'Yes' : 'No', inline: true },
                { name: 'Description', value: "The problem is as follows:", inline: false },
              )
              .setColor('#00FF00')
              .setTimestamp()
              .setURL(`${problemUrl}`);
  
              // add description in chunks
              chunks.forEach((chunk) => {
  
                embed.addFields({ name: '\u200B', value: chunk, inline: false });
              });
          
          await interaction.reply({embeds: [embed]});
      } catch (error) {
        console.log("error: ",error);
        // Example response
        await interaction.reply(`Error in fetching daily problem. Please let bot developers know.`);
      }
      
    },
  };
