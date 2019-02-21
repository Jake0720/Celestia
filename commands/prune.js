module.exports = {
    name: 'prune',
    description: 'Removes the amount of messages specified.',
    args: true,
    needsArgs: true,
    adminOnly: true,
    usage: '<amount>',
    execute(message, args) {
        const amount = parseInt(args[0]) + 1;

		if (isNaN(amount)) {
			return message.channel.send(`${message.author.username}, that isn\'t a valid number.`);
		}
		else if (amount <= 1 || amount > 100) {
			return message.channel.send(`${message.author.username}, you need to input a number between 1 and 100.`);
		}

		message.channel.bulkDelete(amount, true).catch(err => {
			//console.error(err);
			message.channel.send('I do not have the permissions to prune these messages.');
		});
    },
};