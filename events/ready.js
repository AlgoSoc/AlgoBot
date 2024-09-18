const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) { //  holds your event logic, which will be called by the event handler whenever the event emits.
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};
