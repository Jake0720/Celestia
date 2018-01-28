module.exports = {
    name: 'servericon',
    description: 'Displays the server icon URL.',
    execute(message, args) {
        message.channel.send(`Server icon's URL: ${message.guild.iconURL}`);
    },
};