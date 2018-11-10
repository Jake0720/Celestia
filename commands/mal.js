const config = require('../config.json');
const Discord = require('discord.js');
const request = require('request');

module.exports = {
    name: 'mal',
    description: 'Mal search or something.',
    args: true,
    needsArgs: true,
    WIP: true,
    usage: '<type: anime/manga/person/character> <page number> <search query>',
    execute(message, args) {
        if (args.length == 0) {
            return message.channel.send('Use a valid type, page number, and search query. Example: ~mal anime 1 Sword Art Online');
        }

        var type = args[1];
        var page = args[2];
        var query = args.slice(3,-1).join('%20');

        request(`https://api.jikan.moe/v3/search/${type}/?q=${query}&page=${page}`, (error, response, body) => {
            let search = JSON.parse(body)[0];

            if (response.statusCode != 200) {
                console.log(response.statusCode);
            }

            if (error) {
                console.log(error);
            }

            if (search == undefined) {
                return message.channel.send('Something happened. Probably a wrong type or page number.');
            }

            try {
                console.log(search);
            }
            catch(err) {
                message.channel.send(`***Error.***\n\`\`\`js\n${err}\n\`\`\``);
            }
        });
    },
};