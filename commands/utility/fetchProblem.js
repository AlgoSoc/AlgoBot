const { EmbedBuilder } = require('discord.js'); // Correct import for EmbedBuilder
const { SlashCommandBuilder } = require("@discordjs/builders"); // Make sure this import is correct
const { NodeHtmlMarkdown } = require('node-html-markdown')
const axios = require('axios');

const DIFFICULTY_COLOURS = {
  "Easy": "#00ff00",
  "Medium": "#ffcc00",
  "Hard": "#b30000",
}

// Fetches problem with specific id
function splitContent(str, maxLength){
  const preprocess = []
  const chunks = [];

  for (const line of str.split('\n')) {
    if(line && line.length!=0){
      preprocess.push(line+' ');
    }
  }
  console.log(preprocess);

  // Split the string into lines to preserve newlines
  const lines = str.split('\n');
  let constraints = false;
  let chunk = '';
  for (const line of preprocess) {
    if(constraints){
      chunk += line;
      continue;
    }
    if(line.includes("**Input**") ||
        line.includes("**Output**") ||
        line.includes("**Explanation**")){
      chunk+=line+`\n\n`;
      continue;
    }
    if(line.indexOf("**Example")!=-1 ||
    line.indexOf("**Constraints")!=-1){
      if(chunk.length!=0) chunks.push(chunk.trim());
      chunks.push(line);
      chunk = '';
      continue;
    }
    if(line.length!=0 && chunk.length + line.length < maxLength){
      chunk += line;
    }
    else {
      if(chunk.length!=0){
        // code up output or input
        if(chunk.indexOf()!=-1) chunk += '\n';
        chunks.push(chunk);
        chunk = '';
      }
    }
  }
  if(chunk.length!=0) chunks.push(chunk.trim());
  ans = [];
  for(let chunk of chunks){
    const cleanedMarkdown = chunk.replace(/!\[\]\(.*?\)/g, '');
    ans.push(cleanedMarkdown);
  }
  return ans;
}

const difficultyList= ['EASY', 'MEDIUM', 'HARD'];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("random")
    .setDescription("Fetches a random leetcode problem")
    .addStringOption( option => 
      option.setName('difficulty')
        .setDescription('Define the difficulty of the problem.')
        .setRequired(false)
        .addChoices(
          { name: 'Easy', value: 'EASY' },
          { name: 'Medium', value: 'MEDIUM' },
          { name: 'Hard', value: 'HARD' }
        )),
  async execute(client, interaction) {
    try {
        let difficulty = interaction.options.getString('Difficulty');

        if(!difficulty){
          difficulty = difficultyList[Math.floor(Math.random()*3)];
        }

        const query = "query randomQuestion($categorySlug: String, $filters: QuestionListFilterInput) {randomQuestion(categorySlug: $categorySlug, filters: $filters) { titleSlug title isPaidOnly frontendQuestionId: questionFrontendId difficulty content }}";

        const variables = {
          "categorySlug": "all-code-essentials",
          "filters": {
            "difficulty": `${difficulty}`
          }
        };
        
        // Encode the query and variables into a URL-friendly format
        const payload = {
          query,
          variables
        };
        let response = null;
        try {
            response = await axios.post(`https://leetcode.com/graphql`, payload, {
            headers: {
              'Content-Type': 'application/json',
            }, timeout: 5000
          });
        } catch (error) {
          if (error.code === 'ECONNABORTED') {
            console.error('Request timed out');
          } else {
            console.error('Request failed:', error.message);
          }
        }
        
        
        const data = response.data;
        // Extract the problem data
        const problem = data.data;
        const question = problem?.randomQuestion;
        // Check if the question data is available
        if (!question) {
          await interaction.reply('No problem data found or data is not in the expected format.');
          throw new Error('No problem data found or data is not in the expected format.');
          return;
        }

        if(!question.content){
          await interaction.reply('No content found in the problem data.');
          throw new Error('No content found in the problem data.');
          return;
        }



        // parse the content to markdown
        let content = NodeHtmlMarkdown.translate(question.content);

        const baseUrl = "https://leetcode.com/problems/";
        const problemUrl = baseUrl + question.titleSlug;
        
        const chunks = splitContent(content, 1024);
        console.log(chunks);
        
        
        // makes an embed
        const embed = new EmbedBuilder()
            .setTitle(question.title)
            .addFields(
              { name: 'Difficulty', value: question.difficulty, inline: true },
              { name: 'Question ID', value: question.frontendQuestionId.toString(), inline: true },
              { name: 'Paid Only', value: question.isPaidOnly ? 'Yes' : 'No', inline: true },
              { name: 'Description', value: "The problem is as follows:", inline: false },
            )
            .setColor(DIFFICULTY_COLOURS[question.difficulty])
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



