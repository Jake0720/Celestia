module.exports = {
    name: 'choose',
    description: 'Chooses a random item in the given choices.',
    execute(message, args) {
    	args = args.join(' ');
    	args = args.split(', ');
    	var rdmNum = Math.floor(Math.random() * args.length);

        message.channel.send(args[rdmNum]);
    },
};
