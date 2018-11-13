const request = require('request');
const Discord = require('discord.js');

module.exports = {
    name: 'anime',
    description: 'Returns info about a given show from MyAnimeList',
    args: true,
    needsArgs: true,
    usage: '<query>',
    execute(message, args) {
        const query = args.join(' ');
        const url = `https://api.jikan.moe/v3/search/anime?q=${encodeURIComponent(query)}` 
        request(url, (error, response, data) => {
            const result = JSON.parse(data).results[0];
            const numFormat = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            const startDate = new Date(result.start_date).toLocaleDateString();
            const endDate = new Date(result.end_date).toLocaleDateString();
            const theDate = result.airing ? 'Currently airing' : endDate;
            const color = result.airing ? 0x00FF04 : 0xFF0000;

            const embed = new Discord.RichEmbed()
                .setTitle(result.title)
                .setURL(result.url)
                .setDescription(result.synopsis)
                .addField('Episodes', result.episodes)
                .addField('Rating', result.rated)
                .addField('Aired From', `${startDate} - ${theDate}`)
                .setFooter(`Members: ${numFormat(result.members)}・Score: ${result.score}`)
                .setThumbnail(result.image_url)
                .setColor(color)

            message.channel.send(embed);
        });
    }
}
