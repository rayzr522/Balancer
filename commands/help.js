const stripIndents = require('common-tags').stripIndents;
const RichEmbed = require('discord.js').RichEmbed;

exports.run = async (client, message, args) => {
    if (args.length < 1) {
        throw 'Please provide a command to view the help for.'
    }

    const commands = args[0].toLowerCase() === 'all' ? client.commands.all() : [client.commands.find(args[0])];

    if (commands.length < 1) {
        throw `No commands could be found that matched \`${args[0]}\`.`;
    }

    // 20 commands at a time
    for (let i = 0; i < commands.length; i += 20) {
        const embed = new RichEmbed();

        commands.slice(i, i + 20).forEach(command => {
            embed.addField(command.info.name, stripIndents`
                **Usage:** \`${client.prefix}${command.info.usage || command.info.name}\`
                **Description:** ${command.info.description || 'None'}
                **Aliases:** ${command.info.aliases.join(', ') || 'None'}
            `);
        });

        await message.author.send({ embed });
    }

    message.guild && message.channel.send(':mailbox_with_mail: Sent you a DM with help.');
};

exports.info = {
    name: 'help',
    usage: 'help all|<command>',
    description: 'Shows help for one or all commands'
};