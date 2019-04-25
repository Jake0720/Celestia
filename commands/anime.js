const request = require('request');
const Discord = require('discord.js');
const cheerio = require('cheerio');

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
            if(error) return;
            const result = JSON.parse(data).results[0];
            const numFormat = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            const color = result.airing ? 0x00FF04 : 0xFF0000;
            const rating = result.rated != null ? result.rated : 'Unknown';
            const episodes = result.episodes != 0 ? result.episodes : 'No episodes.';
            const synopsis = result.synopsis != null ? result.synopsis : 'No synopsis.';
            let startDate = new Date(result.start_date).toLocaleDateString();
            let endDate = new Date(result.end_date).toLocaleDateString();
            let theDate = result.airing ? 'Currently airing' : endDate;

            function getGenre(show) {
                request.get(show, (err, res, body) => {
                    if(err) return;
                    if(res.statusCode == 200) {
                        let genreArr = [];
                        let $ = cheerio.load(body);
                        let genres = $(".dark_text:contains('Genres:')").parent().text().substring(11).split(",");
                        for(let genre in genres) {
                            genreArr.push(genres[genre]);
                        }        

                        let genre;

                        if(genreArr.length > 1) {
                            genre = genreArr.join(', ');
                        } else if (genreArr.length == 1) {
                            genre = genreArr[0];
                        } else if(genreArr.length == 0) {
                            genre = 'None';
                        }

                        if(startDate == '12/31/1969') {
                            startDate = 'Unknown';
                        } 
                        
                        if (theDate == '12/31/1969') {
                            theDate = 'Unknown';
                        }
                        
                        const embed = new Discord.RichEmbed()

                        .setTitle(result.title)
                        .setURL(result.url)
                        .setDescription(synopsis)
                        .addField('Episodes', episodes, true)
                        .addField('Rating', rating, true)
                        .addField('Air Dates', `${startDate} - ${theDate}`, true)
                        .addField('Genre(s)', genre, true)
                        .setFooter(`Members: ${numFormat(result.members)}・Score: ${result.score}`)
                        .setThumbnail(result.image_url)
                        .setColor(color)

                        message.channel.send(embed);
                        
                    }
                });
            }
            getGenre(result.url);
        });
    }
}
