module.exports = {
    name: 'ping',
    description: 'Ping!',
    execute(message, args) {
        message.channel.send(`Pong! ${new Date().getTime() - message.createdTimestamp}ms`);
    },
};