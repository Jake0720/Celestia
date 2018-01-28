const Discord = require('discord.js');

module.exports = {
    name: 'reeee',
    description: 'REEEEEEEEEEEEEEEEE',
    adminOnly: false,
    execute(message, args) {
        const embed = new Discord.RichEmbed()
        	.setAuthor('REEEEEEEEEEEEEEEEEEEEEEEEEEEEE', 'https://i.imgur.com/aOmU0Qc.png')
        	.setColor('#ff00ff')
        	.setURL('https://www.youtube.com/watch?v=DmNpjCFSkZw')
        	.setTitle('REEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE')
        	.setFooter('REEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE', 'https://i.imgur.com/aOmU0Qc.png')
        	.setImage('https://i.imgur.com/aOmU0Qc.png')
        	.setDescription('REEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE')
        	.addField('REEEEEEEEEEEEEEEEEEEEEEEEEE', 'REEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE')
        	.addField('REEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE', 'REEEEEEEEEEEEEEEEEEEEEEEEEEE')
        	.setThumbnail('https://i.imgur.com/aOmU0Qc.png');

        message.channel.send(embed);
    },
};