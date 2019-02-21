const { prefix } = require('../config.json');

module.exports = {
    name: 'help',
    description: 'List of all the commands or info about a specified command.',
    usage: '[command]',
    execute(message, args) {
        const { commands } = message.client;
        const data = [];

        if (!args.length) {
        	data.push('Command List:');
        	data.push(commands.map(command => command.name).join(', '));
        	data.push(`\nYou can use \`${prefix}help [command]\` to learn about that command.`);
        }
        else {
        	if (!commands.has(args[0])) {
        		return message.channel.send('That\'s not a valid command.');
        	}

        	const command = commands.get(args[0]);

        	data.push(`**Name:** ${command.name}`);

        	if (command.description) data.push(`**Description:** ${command.description}`);
        	if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);
        }

        message.channel.send(data);
    },
};