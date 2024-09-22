const { Collection, Events } = require('discord.js');


// event listens for interactions (like slash commands) triggered by users and executes the corresponding command logic based on the interaction received.

module.exports = {
	name: Events.InteractionCreate,
	async execute(client, interaction) {

		const { cooldowns, commands } = interaction.client;


		if (!interaction.isChatInputCommand()) return;

		if (!commands || !(commands instanceof Collection)) {
            console.error('Commands collection is not defined or is not a Collection instance.');
            return;
        }

		const command = commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		if(!cooldowns.has(command.data.name)) { // if commands doesn't contain the command name being checked in interaction
			// add new command entry
			cooldowns.set(command.data.name, new Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command.data.name);
		const defaultCooldownDuration = 3;
		const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1_000;

		if(timestamps.has(interaction.user.id)){
			// get command and userid as key then get last time command was used. 
			const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount; // get the timestamp and add the cooldown amount

			if(now < expirationTime){
				const expiredTimesStamp = Math.round(expirationTime / 1000);
				// <t: :r> formats timestamps dynamically using discord's inbuilt method
				// Ephemeral = true sets msg to private
				return await interaction.reply({ content: `Please wait. You are on a cooldown for the ${command.data.name} command. You can use it again in <t:${expiredTimesStamp}:R>.`, ephemeral:true})
			}
		}

		timestamps.set(interaction.user.id, now);
		setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

		try {
			await command.execute(client, interaction);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
			} else {
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
	},
};
