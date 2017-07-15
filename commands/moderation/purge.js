exports.run = async (client, message, args) => {
    if (isNaN(args[0])) {
        throw 'Please provide a number of messages to delete.';
    }

    const amount = parseInt(args[0], 10);
    if (amount < 1 || amount > 100) {
        throw 'You can only purge between 1 and 100 messages.';
    }

    const messages = await message.channel.bulkDelete(Math.min(amount + 1, 100), true);

    (await message.channel.send(`:fire: Purged \`${messages.size - 1}\` messages.`)).delete(5000);
};

exports.info = {
    name: 'purge',
    usage: 'purge <1-100>',
    description: 'Purges up to 100 messages',
    guildOnly: true,
    permissions: ['MANAGE_MESSAGES']
};
