const config = require('../config.json');
const Discord = require('discord.js');
const request = require('request');

module.exports = {
    name: 'beatmap',
    description: 'Display osu! beatmap stats.',
    args: true,
    needsArgs: true,
    usage: '<osu beatmapID>',
    execute(message, args) {
        if (args.length == 0) {
            return message.channel.send('Please use a valid osu! beatmap ID.');
        }

        request(`https://osu.ppy.sh/api/get_beatmaps?k=${config.osuapi}&b=${args}`, (error, response, body) => {
            let stats = JSON.parse(body)[0];

            if (response.statusCode != 200) {
                console.log(response.statusCode);
            }

            if (error) {
                console.log(error);
            }

            if (stats == undefined) {
                return message.channel.send('Invalid beatmap ID.');
            }

            var maxcombo = `\n**Max Combo:** ${stats["max_combo"]}`;
            if (stats["max_combo"] == null) {
                maxcombo = '';
            }

            var beatmapStatus = {
                0: "Graveyard",
                1: "Work In Progress",
                2: "Pending",
                3: "Ranked",
                4: "Approved",
                5: "Qualified",
                6: "Loved"
            }

            var mode = {
                0: "Standard",
                1: "Taiko",
                2: "Catch the Beat",
                3: "Mania"
            }

            try {
                const embed = new Discord.RichEmbed()
                    .setAuthor(`Beatmap Information`, 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Osu%21Logo_%282015%29.png', `https://osu.ppy.sh/b/${stats["beatmap_id"]}`)
                    .setURL(`https://osu.ppy.sh/s/${stats["beatmapset_id"]}`)
                    .setColor('#E3609A')
                    .setDescription(`[${stats["artist"]} - ${stats["title"]}](https://osu.ppy.sh/b/${stats["beatmap_id"]})`)
                    .addField('Stats',`**BPM:** ${stats["bpm"]}`
                                +`\n**AR:** ${stats["diff_approach"]}`
                                +`\n**HP:** ${stats["diff_drain"]}`
                                +`\n**CS:** ${stats["diff_size"]}`
                                +`\n**OD:** ${stats["diff_overall"]}`
                                +`${maxcombo}`, true)
                    .addField('Info', `**Creator:** ${stats["creator"]}`
                                +`\n**Status:** ${beatmapStatus[Number(stats["approved"])+2]}`
                                +`\n**Mode:** ${mode[Number(stats["mode"])]}`
                                +`\n**Difficulty:** ${stats["version"]}`
                                +`\n**Stars:** ${Number(stats["difficultyrating"]).toFixed(2)}`, true)
                    
                    .setFooter('osu! beatmap info')
                    .setThumbnail(`https://b.ppy.sh/thumb/${stats["beatmapset_id"]}l.jpg`);

                message.channel.send(embed);
            }
            catch(err) {
                message.channel.send(`***Error.***\n\`\`\`js\n${err}\n\`\`\``);
            }
        });
    },
};