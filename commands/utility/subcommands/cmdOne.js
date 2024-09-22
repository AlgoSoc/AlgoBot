module.exports = {
    name: "one",
    async execute(client,interaction) {
        interaction.editReply("This is subcommand one.")
    },
};