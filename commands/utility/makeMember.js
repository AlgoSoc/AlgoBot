const { SlashCommandBuilder } = require('discord.js');
const JSSoup = require('jssoup').default;
const newEmbed = require("../../tools/embedFactory");

async function getMemberStudentIds() {
	const res = await fetch(process.env["MEMBER_LIST_URL"], {
		headers: {
			"Cache-Control": "no-cache",
			"Pragma": "no-cache",
			"Expires": "0",
			cookie: `.ASPXAUTH=${process.env["ASPXAUTH_COOKIE"]};`
		},
	}).then(res => res.text());

	let soup = new JSSoup(res);

	let guildMemberIds = new Set();

	const MEMBER_HTML_TABLE_IDS = new Set([
		"ctl00_Main_rptGroups_ctl05_gvMemberships",
		"ctl00_Main_rptGroups_ctl03_gvMemberships", ]);
	
	let table_id;
	for (table_id of MEMBER_HTML_TABLE_IDS) {
		let tables = soup.findAll("table", { id: table_id });

		for (let table of tables) {
			table.findAll("tr", { class: "msl_row" }).forEach(row => 
			{
				guildMemberIds.add(row.contents[1].text);
			});
			table.findAll("tr", { class: "msl_altrow" }).forEach(row => 
			{
				guildMemberIds.add(row.contents[1].text);
			});
		}
	}

	return guildMemberIds;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('makemember')
		.setDescription('Gives you the "Member" role if you have a society membership.')
		.addStringOption(option =>
			option.setName('student_id')
				.setDescription('Your student ID number.')
				.setRequired(true)),
	async execute(client, interaction){
		const studentID = interaction.options.getString('student_id', true);

		try {

			let memberIds = await getMemberStudentIds();
			if (memberIds.has(studentID)) {
				let memberRole = interaction.guild.roles.cache.find(r => r.id == process.env["MEMBER_ROLE_ID"]);
				interaction.guild.members.cache.get(interaction.user.id).roles.add(memberRole);
				const welcomeChannel = interaction.guild.channels.cache.get(process.env["WELCOME_CHANNEL_ID"]);
				let embed = newEmbed().setDescription(`<:algosoc:1285571310281293848> ${interaction.user} just verified their membership using \`/makemember\` and got the ${memberRole} role!`);
				welcomeChannel.send({
					embeds: [embed]
				});
				const adminChannel = interaction.guild.channels.cache.get(process.env["ADMIN_LOG_CHANNEL_ID"]);
				adminChannel.send(`<:algosoc:1285571310281293848> ${interaction.user} just verified with student ID \`${studentID}\``);
				await interaction.reply({
					content: `Role \`Member\` has been added to ${interaction.user}!`,
					ephemeral: true
				});
			} else {
				await interaction.reply({
					content: "You don't have a membership! You can purchase one at [join.algosoc.uk](http://join.algosoc.uk/)",
					ephemeral: true
				});
			}
		
		} catch (err) {
			console.error(err);
			await interaction.reply({
				content: "An error occurred. Try again later.",
				ephemeral: true
			});
		}

	},
};
