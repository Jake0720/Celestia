const config = require('../config.json');
const request = require('request');
const Discord = require('discord.js');
const osu = require("ojsama");


module.exports = {
name: 'lastplay',
description: 'Display your latest osu! play. (WIP)',
args: true,
needsArgs: true,
usage: '<osu username>',

execute(message, args) {
	if (args.length == 0)
		return message.channel.send('Please use a valid osu! username.');
	
	args = args.join('%20');
	
	var Mods = {Key2: 268435456, Key3: 134217728, Key1: 67108864, Key10: 33554432, Key9: 16777216,
		LastMod: 4194304, Random: 2097152, FadeIn: 1048576, Key8: 524288, Key7: 262144,	Key6: 131072,
		Key5: 65536, Key4: 32768, PF: 16384, Relax2: 8192, SpunOut: 4096, Autoplay: 2048, FL: 1024,
		NC: 512, HT: 256, Relax: 128, DT: 64, SD: 32, HR: 16, HD: 8, NoVideo: 4, EZ: 2, NF: 1,None: 0};

	var ranks = {SSH: "", SS: "", SH: "", S: "", A: "", B: "", C: "", D: "", F: ""};

	request(`https://osu.ppy.sh/api/get_user?k=${config.osuapi}&u=${args}`, (error, response, body) => {
		let stats = JSON.parse(body)[0];
		if (response.statusCode != 200) console.log(response.statusCode);
		if (error) console.log(error);
		
	request(`https://osu.ppy.sh/api/get_user_recent?k=${config.osuapi}&u=${args}&limit=1`, (error, response, body) => {
		let lastPlay = JSON.parse(body)[0];
		if (lastPlay == undefined) 
			return message.channel.send('This user has not played recently or you have entered an invalid username.');
		if (response.statusCode != 200) console.log(response.statusCode);
		if (error) 	console.log(error);
			
	request(`https://osu.ppy.sh/api/get_beatmaps?k=${config.osuapi}&b=${lastPlay["beatmap_id"]}`, (error, response, body) => {
		if (response.statusCode != 200)	console.log(response.statusCode);
		if (error) console.log(error);
		
		let beatmapInfo = JSON.parse(body)[0];
		
		let beatmap_bpm = beatmapInfo["bpm"]
		let beatmap_ar = beatmapInfo["diff_approach"];
		let beatmap_cs = beatmapInfo["diff_size"];
		let beatmap_od = beatmapInfo["diff_overall"];
		let beatmap_hp = beatmapInfo["diff_drain"];
		let beatmap_length = beatmapInfo["total_length"];

		const acc = 100*((50*Number(lastPlay["count50"]))+(100*Number(lastPlay["count100"]))+(300*Number(lastPlay["count300"])))/(300*(Number(lastPlay["countmiss"])+Number(lastPlay["count50"])+Number(lastPlay["count100"])+Number(lastPlay["count300"])));

		var enabledMods = parseInt(lastPlay["enabled_mods"]);
		var mods = parseInt(lastPlay["enabled_mods"]);
		
		var modsList = [];
		for (var modValues in Mods) {
			if (enabledMods >= Mods[modValues]) {
				enabledMods = enabledMods - Mods[modValues];
				modsList.push(modValues);
				if (enabledMods == 0) {
					break;
				}
			}

		}
		modsList = modsList.join();

	request(`http://osu.ppy.sh/osu/${lastPlay["beatmap_id"]}`, (error, response, body) => {
		if (response.statusCode != 200) console.log(response.statusCode);
		if (error) console.log(error);
		
		var csv = body;
		var parser = new osu.parser(csv);
		var map = parser.map;

		parser.feed(csv);
		
		var acc_percent = parseFloat(acc.toFixed(2)); 
		var combo = parseInt(lastPlay["maxcombo"]);
		var nmiss = parseInt(lastPlay["countmiss"]);

		var stars = new osu.diff().calc({map: map, mods: mods});
		var max_combo = map.max_combo();
		var pp = osu.ppv2({
			stars: stars,
			combo: combo,
			nmiss: nmiss,
			acc_percent: acc_percent,
		});
		
		combo = combo || max_combo;
		
		if (lastPlay["rank"] == "F") 
			pp = "Failed.";
	
		if(modsList.indexOf("HR") != -1){
			beatmap_cs = (beatmap_cs * 1.3).toFixed(1);
			beatmap_hp = (beatmap_hp * 1.4).toFixed(1);
			beatmap_ar = beatmap_ar * 1.4;
			if(beatmap_ar > 10)
				beatmap_ar = 10;
			
		}
		
		if(modsList.indexOf("DT") != -1){
			beatmap_bpm = beatmap_bpm * 1.5;
			beatmap_length = beatmap_length / 1.5;
			beatmap_ar += "▴";
			beatmap_od += "▴";
			beatmap_hp += "▴";
		}
		
		let minutes = Math.floor(beatmap_length / 60);
		let seconds = Math.round(beatmap_length - (minutes * 60));

		try {
			const embed = new Discord.RichEmbed()
				.setAuthor(`Recently played by ${stats["username"]} (#${stats["pp_rank"]})`, 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Osu%21Logo_%282015%29.png', `https://osu.ppy.sh/u/${stats["user_id"]}`)
				.setURL(`https://osu.ppy.sh/u/${lastPlay["user_id"]}`)
				.setColor('#E3609A')
				.addField('Beatmap', `[${beatmapInfo["artist"]} - ${beatmapInfo["title"]} (${beatmapInfo["version"]})](https://osu.ppy.sh/b/${beatmapInfo["beatmap_id"]})`
							+`\nStars: ${String(stars).substring(0, 4)}`
							+` | BPM: ${beatmap_bpm}`
							+` | AR: ${beatmap_ar}`
							+` | HP: ${beatmap_hp}`
							+` | CS: ${beatmap_cs}`
							+` | OD: ${beatmap_od}`
							+`\nLength: ${minutes}m${seconds}s`)
				.addField('Stats', `**Rank:** ${lastPlay["rank"]}`
							+`\n**Score:** ${lastPlay["score"]}`
							+`\n**Max Combo:** ${lastPlay["maxcombo"]}/${beatmapInfo['max_combo']}`, true)
				.addField('\u200b', `**Mods:** ${modsList}`
							+`\n**PP:** ${pp.toString().slice(0,6)}`, true)
				.addField('Accuracy', `${acc.toFixed(2)}%  <:300:404610091804000276>: ${lastPlay["count300"]}  <:100:404610089282961419>: ${lastPlay["count100"]}  <:50:404610083658399745>: ${lastPlay["count50"]}  <:miss:404610089899786240>: ${lastPlay["countmiss"]}`)
				.setFooter('osu! latest play')
				.setThumbnail(`https://b.ppy.sh/thumb/${beatmapInfo["beatmapset_id"]}l.jpg`)
				//.setThumbnail(`${ranks[lastPlay["rank"]]}`);

			message.channel.send(embed);
		} catch(err) {
			message.channel.send(`***Error.***\n\`\`\`js\n${err}\n\`\`\``);
		}
	});
	});
	});
	});
},
};
