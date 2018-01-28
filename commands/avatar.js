module.exports = {
    name: 'avatar',
    description: 'Displays the avatars mentioned.',
    args: true,
    needsArgs: false,
    usage: '<user1> <user2> ... <user293> or ~avatar',
    execute(message, args) {
        if (!message.mentions.users.size) {
			return message.channel.send(`Your avatar: ${message.author.displayAvatarURL.replace('?size=2048', '')}`);
		}

		const avatarList = message.mentions.users.map(user => {
			return `${user.username}'s avatar: ${user.displayAvatarURL.replace('?size=2048', '')}`;
		});

		message.channel.send(avatarList);
    },
};