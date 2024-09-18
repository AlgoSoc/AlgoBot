const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('embed')
		.setDescription('Makes an embed.')
		.addStringOption(option =>
			option.setName('input')
				.setDescription('Input to embed.')
				.setRequired(true)),
	async execute(interaction){
		const input = interaction.options.getString('input');

        if(!input){
            return interaction.reply({content: `Please type something.`, ephemeral: true});
        }

        try {
            const embed = new EmbedBuilder()
            .setTitle('User Input Embed')
            .setDescription(input)
            .setColor('#00FF00')
            .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
	        await interaction.reply(`There was an error while creating  \`${command.data.name}\`:\n\`${error.message}\``);
        }
	},
};
