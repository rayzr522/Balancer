exports.run = (client, message, args) => {
    const me = message.guild.members.get(client.user.id);

    if (args.length < 1) {
        me.setNickname(null);
        message.channel.send(':white_check_mark: Nickname cleared.');
    } else {
        const input = args.join(' ');
        me.setNickname(input);
        message.channel.send(`:white_check_mark: Set nickname to \`${input}\``);
    }
};

exports.info = {
    name: 'setname',
    usage: 'setname [name]',
    description: 'Sets my nickname on this server',
    guildOnly: true,
    permissions: ['MANAGE_GUILD']
};
