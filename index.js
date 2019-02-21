const fs = require('fs');
const config = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();
const request = require('request');
const rss = require('rss-emitter-ts');
const feed = new rss.FeedEmitter({
    userAgent: 'Anime notifications - Powered by https://github.com/Jake0720/Celestia'
});
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

    if (command.adminOnly && config.adminIDs.includes(message.author.id)) {
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

feed.add({ url: 'https://www.livechart.me/feeds/episodes', refresh: 10000, ignoreFirst: true });

feed.on('item:new', (item) => {
    let show = item.title;
    request(`https://api.jikan.moe/v3/search/anime?q=${encodeURIComponent(show.split(' #')[0])}`, (error, response, data) => {
        const result = JSON.parse(data).results[0];
        const numFormat = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        const startDate = new Date(result.start_date).toLocaleDateString();
        const endDate = new Date(result.end_date).toLocaleDateString();
        const theDate = result.airing ? 'Currently airing' : endDate;
        const color = result.airing ? 0x00FF04 : 0xFF0000;
        const rating = result.rated != null ? result.rated : 'Unknown';
        const episodes = result.episodes != 0 ? result.episodes : 'No episodes.';

        const embed = new Discord.RichEmbed()
            .setTitle(result.title)
            .setURL(result.url)
            .setDescription(`A new episode of ${result.title} has released!`)
            .addField('Episodes', result.episodes, true)
            .addField('Rating', result.rated, true)
            .addField('Air Dates', `${startDate} - ${theDate}`)
            .setFooter(`Members: ${numFormat(result.members)}・Score: ${result.score}`)
            .setThumbnail(result.image_url)
            .setColor(color)

        client.channels.get('385287162838384641').send(embed).catch(console.error);
    });
});

feed.on('feed:error:', (err) => {
    console.log(err);
});

client.login(config.token);