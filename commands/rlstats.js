const rls = require('rls-api');
const Discord = require('discord.js');
const config = require('../config.json');
const client = new Discord.Client();
const rlClient = new rls.Client({
    token: config.rlsapi
});

module.exports = {
    name: 'rlstats',
    description: 'Display rocket league stats. (WIP)',
    args: true,
    needsArgs: true,
    WIP: true,
    usage: '<pc/psn/xbox> <steam/psn/gamertag>',
    execute(message, args) {
    	let uniqueID = args[1];

    	if (args[0] == 'pc') {
    		let platformID = rls.platforms.STEAM;
    	}
    	else if (args[0] == 'psn') {
    		let platformID = rls.platforms.PS4;
    	}
    	else if (args[0] == 'xbox') {
    		let platformID = rls.platforms.XB1;
    	} else {
    		return message.channel.send(`${message.author.username}, the usage is \`~rlstats <pc/psn/xbox> <steam/psn/gamertag>\`.`);
    	}

    	/*if (!args[1]) {
    		return message.channel.send(`${message.author}, please enter a valid SteamURL ID, PSN name, or Xbox gamertag.`);
    	} else {
    		return console.log('beep');
    	}

    	/*rlClient.getTiersData((status, data) => {
    		if (status === 200) {
    			message.channel.send("```JS\nTier Data: " + data + "```").catch(console.error);
    		} else {
    			console.log(status);
    		}
    	});

    	rlClient.getPlaylistsData((status, data) => {
    		const parsedData = JSON.parse(data);
    		if (status === 200) {
    			return message.channel.send("```JS\nPlaylist Data: " + parsedData + "```").catch(console.error);
    		} else {
    			console.log(status);
    		}
    	});*/

    	rlClient.getPlayer(uniqueID, platformID, (status, data) => {
    		if (status === 200) {
    			const statsEmbed = new Discord.RichEmbed()
    				.setAuthor(data.stats.displayName, data.avatar)
    				.setURL(data.profileURL)
    				.setTitle('Rocket League Stats')
    				.setThumbnail('http://vignette1.wikia.nocookie.net/rocketleague/images/f/f6/Rocketleague-logo.png')
    				.addField('Duels 1v1', 'MMR: ')
    				.addField('Doubles 2v2', 'MMR: ')
    				.addField('Solo Standard 3v3', 'MMR: ')
    				.addField('Standard 3v3', 'MMR: ');

    			return message.channel.send(statsEmbed);

    		} else {
    			message.channel.send('Status: '+status);
    		}
    	});
    },
};