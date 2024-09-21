const config = require("../../config.json");

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('verify')
		.setDescription('Gives you the "Verified" role which grants access to the rest of the server.'),
	async execute(interaction){
		
		let member = await interaction.guild.members.fetch(interaction.user.id);
		if (member.roles.cache.some(r => r.name == "Verified")) {
			await interaction.reply({
				content: "You're already verified!",
				ephemeral: true
			});
			return;
		};

		await member.roles.add(process.env["VERIFIED_ROLE_ID"]);

		const welcomeChannel = interaction.guild.channels.cache.get(process.env["WELCOME_CHANNEL_ID"]);
		welcomeChannel.send(`<:algosoc:1285571310281293848> ${member} just joined - give them a warm welcome!`);

		await interaction.reply({
			content: "Verification complete!",
			ephemeral: true
		});

	},
};
