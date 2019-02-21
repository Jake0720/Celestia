const request = require('request');
const Discord = require('discord.js');

module.exports = {
    name: 'manga',
    description: 'Returns info about a given manga from MyAnimeList',
    args: true,
    needsArgs: true,
    usage: '<query>',
    execute(message, args) {
        const query = args.join(' ');
        const url = `https://api.jikan.moe/v3/search/manga?q=${encodeURIComponent(query)}`;
        request(url, (error, response, data) => {
            const result = JSON.parse(data).results[0];
            const numFormat = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            const endDate = new Date(result.end_date).toLocaleDateString();
            const color = result.airing ? 0x00FF04 : 0xFF0000;

            const embed = new Discord.RichEmbed()
                .setTitle(result.title)
                .setURL(result.url)
                .setDescription(result.synopsis)
                .addField('Chapters', result.chapters, true)
                .addField('Volumes', result.volumes, true)
                .setFooter(`Members: ${numFormat(result.members)}・Score: ${result.score}`)
                .setThumbnail(result.image_url)
                .setColor(color)

        message.channel.send(embed);

        });

    }
}