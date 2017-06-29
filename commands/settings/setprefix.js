exports.run = (client, message, args) => {
    const settings = client.settings.get(message.guild.id);

    if (args.length < 1) {
        delete settings.prefix;
        message.channel.send(':white_check_mark: Reset prefix to default.')
    } else {
        settings.prefix = args[0];
        message.channel.send(`:white_check_mark: Set prefix to \`${args[0]}\`.`);
    }

    client.settings.set(message.guild.id, settings);
};

exports.info = {
    name: 'setprefix',
    usage: 'setprefix [prefix]',
    description: 'Sets or resets the custom prefix for this guild',
    guildOnly: true,
    permissions: ['MANAGE_GUILD']
};