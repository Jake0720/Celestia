const config = require('../config.json');
const request = require('request');
const Discord = require('discord.js');

module.exports = {
    name: 'ctb',
    description: 'Display osu! catch the beat stats.',
    args: true,
    needsArgs: true,
    usage: '<osu username>',
    execute(message, args) {
        if (args.length == 0) {
            return message.channel.send('Please use a valid osu! username.');
        }
        args = args.join('%20');

        request(`https://osu.ppy.sh/api/get_user?k=${config.osuapi}&u=${args}&m=2`, (error, response, body) => {
            let stats = JSON.parse(body)[0];

            if (response.statusCode != 200) {
                console.log(response.statusCode);
            }

            if (error) {
                console.log(error);
            }

            if (stats == undefined) {
                return message.channel.send('This user doesn\'t exist or you entered an invalid username.');
            }

            try {
                const embed = new Discord.RichEmbed()
                    .setAuthor(`${stats["username"]}`, 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Osu%21Logo_%282015%29.png', `https://osu.ppy.sh/u/${stats["user_id"]}`)
                    .setURL(`https://osu.ppy.sh/u/${stats["user_id"]}`)
                    .setColor('#E3609A')
                    .addField('Stats', `**Rank:** #${stats["pp_rank"]}`
                                +`\n**Level:** ${Math.floor(stats["level"])}`
                                +`\n**PP:** ${stats["pp_raw"]}`, true)
                    .addField('\u200b',`:flag_${stats["country"].toLowerCase()}:**(${stats["country"]}):** #${stats["pp_country_rank"]}`
                                +`\n**Playcount:** ${stats["playcount"]}`
                                +`\n**Accuracy:** %${Number(stats["accuracy"]).toFixed(2)}`, true)
                    .setFooter('osu! profile stats')
                    .setThumbnail(`https://a.ppy.sh/${stats["user_id"]}`);

                message.channel.send(embed);
            }
            catch(err) {
                message.channel.send(`***Error.***\n\`\`\`js\n${err}\n\`\`\``);
            }
        });
    },
};