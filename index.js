const fs = require('fs');
const config = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands');

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	client.commands.set(command.name, command);
}

client.on('ready', () => {
  console.log('Bot online.');
});

client.on('disconnect', () => {
    console.log(`Disconnected at ${new Date()}`);
})

client.on('reconnecting', () => {
    console.log(`Reconnected at ${new Date()}`);
})

//Tell if bot leaves server and when
client.on('guildDelete', guild => {
    console.log(`I have left ${guild.name} at ${new Date()}`);
});

//Tell if bot joins server and when
client.on('guildCreate', guild => {
    console.log(`I have joined ${guild.name} at ${new Date()}`);
});

//Welcome message to new member
client.on('guildMemberAdd', member => {
    let guild = member.guild;
    let enableThis = false;

    if (enableThis) {
        guild.defaultChannel.send(`Welcome to the server, ${member.user.username}.`);
    }
});

//Goodbye message to leaving member
client.on('guildMemberRemove', member => {
    let guild = member.guild;
    let enableThis = false;

    if (enableThis) {
        guild.defaultChannel.send(`Goodbye, ${member.user.username}.`);
    }
});

//Respond to commands
client.on('message', message => {
	if (!message.content.startsWith(config.prefix) || message.author.bot) return;

	const args = message.content.slice(config.prefix.length).split(/\s+/);
	const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    if (command.adminOnly && message.author.id != 221772440647368716) {
        return message.channel.send('This command is set to Admin Only.');
    }

    if (command.WIP) {
        return message.channel.send('This command is a work in progress.');
    }

    if (command.args && !args.length && command.needsArgs) {
    	let reply = `You didn't provide any arguments, ${message.author.username}!`;

    	if (command.usage) {
    		reply += `\nUsage: \`${config.prefix}${command.name} ${command.usage}\``;
    	}

    	return message.channel.send(reply);
    }

    try {
    	command.execute(message, args);
    }
    catch (error) {
    	console.error(error);
    	message.reply('there was an error trying to execute that command.');
    }
});

client.login(config.token);