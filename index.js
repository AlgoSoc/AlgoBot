const { Client, Events, GatewayIntentBits, Collection, Partials } = require('discord.js');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] , partials: [Partials.GuildMember, Partials.Channel] });

client.cooldowns = new Collection();
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) { // loop all folders & load commands 
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}


const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) { // loop through events folder and if events .once then we register the event. if not we turn it on
	const filePath = path.join(eventsPath, file); // join path
	const event = require(filePath); // requires the js folder from file path

    // client.on and client.once take in event name from above and a callback fn that executes the fn in the event.
	if (event.once) { // check the event should only be triggered once
		client.once(event.name, (...args) => event.execute(...args)); //register event only once   
	} else {
		client.on(event.name, (...args) => event.execute(client, ...args)); // register event to be triggered more than once
	}
}

client.login(process.env.TOKEN);
