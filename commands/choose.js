module.exports = {
    name: 'choose',
    description: 'Chooses a random item in the given choices.',
    execute(message, args) {
    	let rdmNum = Math.floor(Math.random() * args.length);

        message.channel.send(args[rdmNum]);
    },
};