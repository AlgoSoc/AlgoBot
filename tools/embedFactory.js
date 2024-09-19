const config = require("../config.json");

const { EmbedBuilder } = require("discord.js");

module.exports = () => {
    const newEmbed = new EmbedBuilder()
        .setColor(config.embed.baseColour)
    return newEmbed;
}