const Discord = require('discord.js');
const request = require('request');
const color = `#${(Math.random() * 0xFFFFFF<<0).toString(16)}`;

module.exports = {
    name: 'profile',
    description: 'Search a user on MyAnimeList.',
    args: true,
    needsArgs: true,
    usage: '<username>',
    execute(message, args) {
        const query = args.join(' ');
        const url = `https://api.jikan.moe/v3/user/${query}`;
        request(url, (error, response, data) => {
            if(response.statusCode == 404) {
                message.channel.send('Profile not found.');
            }
            let result = JSON.parse(data);
            let description = result['anime_stats'].total_entries > 1 ? 'entries' : 'entry'
            const embed = new Discord.RichEmbed()
                .setTitle(`${result.username}'s MyAnimeList profile`)
                .setURL(result.url)
                .setThumbnail(result.image_url)
                .setDescription(`${result['anime_stats'].total_entries} ${description}`)
                .addField('Watching', result['anime_stats'].watching, true)
                .addField('Completed', result['anime_stats'].completed, true)
                .addField('On Hold', result['anime_stats'].on_hold, true)
                .addField('Planned', result['anime_stats'].plan_to_watch, true)
                .setFooter(`${result['anime_stats'].days_watched.toFixed()} days watched・${result['anime_stats'].mean_score} average rating・${result['anime_stats'].episodes_watched} episodes watched`)
                .setColor(color)
            message.channel.send(embed);
        });
    }
}