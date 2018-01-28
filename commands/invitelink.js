const { inviteurl } = require('../config.json');

module.exports = {
    name: 'invitelink',
    description: 'Sends the invite link for the bot.',
    execute(message, args) {
        message.channel.send(`<${inviteurl}>`);
    },
};