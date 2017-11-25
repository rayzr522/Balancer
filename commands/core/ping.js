exports.run = (client, message) => {
    const now = new Date().getTime();
    message.channel.send(`Pong! \`${now - message.createdTimestamp}ms\``);
};

exports.info = {
    name: 'ping',
    description: 'Pings the bot'
};
