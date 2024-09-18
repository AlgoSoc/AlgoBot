const { Collection, Events } = require('discord.js');

module.exports = {
	name: Events.GuildMemberUpdate,
	async execute(oldMember, newMember) {

		if (!oldMember.roles.cache.some(r => r.name === "Verified") && newMember.roles.cache.some(r => r.name === "Verified")) {
			const welcomeChannel = newMember.guild.channels.cache.get(process.env["WELCOME_CHANNEL_ID"]);
			welcomeChannel.send(`<:algosoc:1285571310281293848> ${newMember} just joined - give them a warm welcome!`);
		};

	},
};
