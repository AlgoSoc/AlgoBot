const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('subcmd')
		.setDescription('Reloads a command.')
        .addSubcommand((subcommand) => 
	        subcommand.setName(`one`).setDescription(`Subcommand 1`)
	    ),
	async execute(client, interaction){
		await interaction.deferReply();
        // replace utility with folder category name, eg utility in this instance
        client.subCommands.get(`utility_${interaction.options.getSubcommand()}`).execute(client, interaction);
	},
};
