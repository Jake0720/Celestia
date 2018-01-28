const Discord = require('discord.js');

module.exports = {
    name: 'server',
    description: 'Displays server information.',
    execute(message, args) {
        const embed = new Discord.RichEmbed()
        	.setAuthor(`${message.guild.name}`)
        	.setColor('#9D00FF')
        	.setDescription(`Created on ${message.guild.createdAt}`)
        	.addField(`Users`, `${message.guild.memberCount}`, true)
        	.addField(`Owner`, `${message.guild.owner.displayName}`, true)
        	.addField(`Region`, `${message.guild.region}`, true)
        	.addField('Roles', `${message.guild.roles}`, true)
        	.setFooter(`Server Info`)
        	.setThumbnail(`${message.guild.iconURL}`)

        message.channel.send(embed);
    },
};