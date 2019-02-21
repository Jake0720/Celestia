const config = require('../config.json');
const request = require('request');
const Discord = require('discord.js');

module.exports = {
    name: 'topplay',
    description: 'Display your top osu! play. (WIP)',
    args: true,
    needsArgs: true,
    usage: '<osu username>',
    execute(message, args) {
        if (args.length == 0) {
            return message.channel.send('Please use a valid osu! username.');
        }
        args = args.join('%20');

        var Mods = {
            Key2: 268435456,
            Key3: 134217728,
            Key1: 67108864,
            Key10: 33554432,
            Key9: 16777216,
            LastMod: 4194304,
            Random: 2097152,
            FadeIn: 1048576,
            Key8: 524288,
            Key7: 262144,
            Key6: 131072,
            Key5: 65536,
            Key4: 32768,
            PF: 16384,
            Relax2: 8192,
            SpunOut: 4096,
            Autoplay: 2048,
            FL: 1024,
            NC: 512,
            HT: 256,
            Relax: 128,
            DT: 64,
            SD: 32,
            HR: 16,
            HD: 8,
            NoVideo: 4,
            EZ: 2,
            NF: 1,
            None: 0
        }

        request(`https://osu.ppy.sh/api/get_user?k=${config.osuapi}&u=${args}`, (error, response, body) => {
            var stats = JSON.parse(body)[0];

            if (response.statusCode != 200) {
                console.log(response.statusCode);
            }

            if (error) {
                console.log(error);
            }

            request(`https://osu.ppy.sh/api/get_user_best?k=${config.osuapi}&u=${args}&limit=1`, (error, response, body) => {
                var topPlay = JSON.parse(body)[0];

                if (response.statusCode != 200) {
                    return console.log(response.statusCode);
                }

                if (error) {
                    return console.log(error);
                }

                if (topPlay == undefined) {
                    return message.channel.send('This user has no best play or you have entered an invalid username.');
                }


                const acc = 100*((50*Number(topPlay["count50"]))+(100*Number(topPlay["count100"]))+(300*Number(topPlay["count300"])))/(300*(Number(topPlay["countmiss"])+Number(topPlay["count50"])+Number(topPlay["count100"])+Number(topPlay["count300"])));
                
                request(`https://osu.ppy.sh/api/get_beatmaps?k=${config.osuapi}&b=${topPlay["beatmap_id"]}`, (error, response, body) => {
                    var beatmapInfo = JSON.parse(body)[0];
                    var minutes = Math.floor(Number(beatmapInfo["total_length"]) / 60);
                    var seconds = Number(beatmapInfo["total_length"]) - minutes * 60;


                    if (response.statusCode != 200) {
                        console.log(response.statusCode);
                    }

                    if (error) {
                        console.log(error);
                    }

                    //Show Mods and whatnot
                    var enabledMods = topPlay["enabled_mods"];
                    var modsList = [];
                    for (var modValues in Mods) {
                        if (enabledMods >= Mods[modValues]) {
                            enabledMods = enabledMods - Mods[modValues];
                            modsList.push(modValues)
                            if (enabledMods == 0) {
                                break;
                            }
                        }

                    }
                    modsList = modsList.join();

                    try {
                        const embed = new Discord.RichEmbed()
                            .setAuthor(`${stats["username"]}`, 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Osu%21Logo_%282015%29.png', `https://osu.ppy.sh/u/${stats["user_id"]}`)
                            .setColor('#E3609A')
                            .setURL(`https://osu.ppy.sh/u/${topPlay["user_id"]}`)
                            .setDescription(`Top play by [${stats["username"]}](https://osu.ppy.sh/u/${topPlay["user_id"]}) (#${stats["pp_rank"]}).`)
                            .addField('Beatmap', `[${beatmapInfo["artist"]} - ${beatmapInfo["title"]} (${beatmapInfo["version"]})](https://osu.ppy.sh/b/${beatmapInfo["beatmap_id"]})`
                                        +`\nStars: ${Number(beatmapInfo["difficultyrating"]).toFixed(2)}`
                                        +` | BPM: ${beatmapInfo["bpm"]}`
                                        +` | AR: ${beatmapInfo["diff_approach"]}`
                                        +` | HP: ${beatmapInfo["diff_drain"]}`
                                        +` | CS: ${beatmapInfo["diff_size"]}`
                                        +` | OD: ${beatmapInfo["diff_overall"]}`
                                        +`\nLength: ${minutes}m${seconds}s`)
                            .addField('Stats', `**Rank:** ${topPlay["rank"]}`
                                        +`\n**Score:** ${topPlay["score"]}`
                                        +`\n**Max Combo:** ${topPlay["maxcombo"]}/${beatmapInfo["max_combo"]}`, true)
                            .addField('\u200b', `**Mods:** ${modsList}`
                                        +`\n**PP:** ${topPlay["pp"]}`, true)
                            .addField('Accuracy', `${acc.toFixed(2)}%  <:300:404610091804000276>: ${topPlay["count300"]}  <:100:404610089282961419>: ${topPlay["count100"]}  <:50:404610083658399745>: ${topPlay["count50"]}  <:miss:404610089899786240>: ${topPlay["countmiss"]}`)
                            .setFooter('osu! top play')
                            .setThumbnail(`https://a.ppy.sh/${stats["user_id"]}`);

                        message.channel.send(embed);
                    }
                    catch(err) {
                        message.channel.send(`***Error.***\n\`\`\`js\n${err}\n\`\`\``);
                    }
                });
            });
        });
    },
};