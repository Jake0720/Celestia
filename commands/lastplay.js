const config = require('../config.json');
const request = require('request');
const Discord = require('discord.js');
const osu = require('ojsama');

module.exports = {
    name: 'lastplay',
    description: 'Display your latest osu! play. (WIP)',
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

        var Ranks = {
            SSH: "<:rankSSH:404827907094216706>",
            SH: "<:rankSH:404827904997064705>",
            SS: "<:rankSS:404827912592818186>",
            S: "<:rankS:404827912588754954>",
            A: "<:rankA:404827885652934656>",
            B: "<:rankB:404827888840343553> ",
            C: "<:rankC:404827895207559172>",
            D: "<:rankD:404827904069861376>"
        }

        request(`https://osu.ppy.sh/api/get_user?k=${config.osuapi}&u=${args}`, (error, response, body) => {
            let stats = JSON.parse(body)[0];

            if (response.statusCode != 200) {
                console.log(response.statusCode);
            }

            if (error) {
                console.log(error);
            }

        	request(`https://osu.ppy.sh/api/get_user_recent?k=${config.osuapi}&u=${args}&limit=1`, (error, response, body) => {
                let lastPlay = JSON.parse(body)[0];

                if (lastPlay == undefined) {
                    return message.channel.send('This user has not played recently or you have entered an invalid username.');
                }

                if (response.statusCode != 200) {
                    console.log(response.statusCode);
                }

                if (error) {
                    console.log(error);
                }

                request(`https://osu.ppy.sh/api/get_beatmaps?k=${config.osuapi}&b=${lastPlay["beatmap_id"]}`, (error, response, body) => {
                    let beatmapInfo = JSON.parse(body)[0];
                    let minutes = Math.floor(Number(beatmapInfo["total_length"]) / 60);
                    let seconds = Number(beatmapInfo["total_length"]) - minutes * 60;
                    const acc = 100*((50*Number(lastPlay["count50"]))+(100*Number(lastPlay["count100"]))+(300*Number(lastPlay["count300"])))/(300*(Number(lastPlay["countmiss"])+Number(lastPlay["count50"])+Number(lastPlay["count100"])+Number(lastPlay["count300"])));

                    if (response.statusCode != 200) {
                        console.log(response.statusCode);
                    }

                    if (error) {
                        console.log(error);
                    }

                    request('http://osu.ppy.sh/osu/' + beatmapInfo["beatmap_id"], (error, response, body) => {
                        if (!error && response.statusCode == 200) {
                            var csv = body;
                            var parser = new osu.parser(csv);
                            var map = parser.map;

                            parser.feed(csv);
                            var mods = lastPlay["enabled_mods"];

                            var acc_percent = acc.toFixed(2);
                            var combo = lastPlay["maxcombo"];
                            var nmiss = lastPlay["countmiss"];
                        }


                        if (mods) {
                            console.log("+" + osu.modbits.string(mods));
                        }

                        var stars = new osu.diff().calc({map: map, mods: mods});
                        console.log(stars.toString());
                        
                        var pp = osu.ppv2({
                            stars: stars,
                            combo: combo,
                            nmiss: nmiss,
                            acc_percent: acc_percent,
                        });

                        var max_combo = map.max_combo();
                        combo = combo || max_combo;

                        console.log(pp.computed_accuracy.toString());
                        console.log(combo + "/" + max_combo + "x");

                        console.log(pp.toString());
                        
                        
                        console.log(osu.ppv2({map: parser.map}).toString());
                    
                        var enabledMods = lastPlay["enabled_mods"];
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
                                .setURL(`https://osu.ppy.sh/u/${lastPlay["user_id"]}`)
                                .setColor('#E3609A')
                                .setDescription(`Recently played by [${stats["username"]}](https://osu.ppy.sh/u/${lastPlay["user_id"]}) (#${stats["pp_rank"]}).`)
                                .addField('Beatmap', `[${beatmapInfo["artist"]} - ${beatmapInfo["title"]} (${beatmapInfo["version"]})](https://osu.ppy.sh/b/${beatmapInfo["beatmap_id"]})`
                                            +`\nStars: ${Number(beatmapInfo["difficultyrating"]).toFixed(2)}`
                                            +` | BPM: ${beatmapInfo["bpm"]}`
                                            +` | AR: ${beatmapInfo["diff_approach"]}`
                                            +` | HP: ${beatmapInfo["diff_drain"]}`
                                            +` | CS: ${beatmapInfo["diff_size"]}`
                                            +` | OD: ${beatmapInfo["diff_overall"]}`
                                            +`\nLength: ${minutes}m${seconds}s`)
                                .addField('Stats', `**Rank:** ${lastPlay["rank"]}`
                                            +`\n**Score:** ${lastPlay["score"]}`
                                            +`\n**Max Combo:** ${lastPlay["maxcombo"]}/${beatmapInfo['max_combo']}`
                                            +`\n**Mods:** ${modsList}`, true)
                                .addField('WIP', `**PP:** coming eventually`, true)
                                .addField('Accuracy', `${acc.toFixed(2)}% | <:300:404610091804000276>: ${lastPlay["count300"]}  <:100:404610089282961419>: ${lastPlay["count100"]}  <:50:404610083658399745>: ${lastPlay["count50"]}  <:miss:404610089899786240>: ${lastPlay["countmiss"]}`)
                                .setFooter('osu! latest play')
                                .setThumbnail(`https://a.ppy.sh/${stats["user_id"]}`);

                            message.channel.send(embed);
                        }
                        catch(err) {
                            message.channel.send(`***Error.***\n\`\`\`js\n${err}\n\`\`\``);
                        }
                    }); 
                });
            });
        });
    },
};