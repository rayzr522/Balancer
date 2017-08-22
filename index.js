require('dotenv').config();

const path = require('path');
const Discord = require('discord.js');
const client = new Discord.Client();
const guildSettings = client.settings = require('./plugins/settings');

client.commands = require('./plugins/commands');
client.prefix = process.env.PREFIX;

const token = process.env.TOKEN;

token || (() => {
    console.error('Please configure your .env file with a bot token.');
    process.exit(1);
})();

client.getPrefix = (id) => {
    if (!id) {
        return client.prefix;
    }

    return guildSettings.get(id).prefix || client.prefix;
};

client.on('ready', async () => {
    client.commands.load(client, path.resolve(__dirname, 'commands'));

    client.user.setAvatar('./avatar.png').catch(() => { /* ignore */ });
    client.user.setStatus('dnd');
    client.user.setPresence({
        game: {
            name: `${client.prefix}prefix | ${client.prefix}help`,
            type: 0
        }
    });

    client.generateInvite([
        'MANAGE_MESSAGES',
        'KICK_MEMBERS',
        'BAN_MEMBERS',
        'MANAGE_CHANNELS',
        'MANAGE_NICKNAMES',
        'EMBED_LINKS'
    ]).then(invite => {
        client.invite = invite;
    });

    require('./plugins/console').tryStart(client);
});

client.on('message', async message => {
    if (message.author.bot) {
        return;
    }

    // If we're in a guild, get the guild prefix, defaulting to the base prefix
    const prefix = message.guild ? client.getPrefix(message.guild.id) : '';

    if (message.guild) {
        const input = message.content.toLowerCase();

        if (input === `${client.prefix}prefix`) {
            // Server-prefix-agnostic check
            return message.channel.send(`The prefix in this server is \`${prefix}\``);
        }

        const settings = guildSettings.get(message.guild.id);

        const triggers = settings.triggers || [];
        const trigger = triggers.find(t => input.startsWith(t.name.replace(/{prefix}/g, prefix).toLowerCase()));

        if (trigger) {
            const args = message.content.substr(trigger.name.replace(/{prefix}/g, prefix).length).split(' ');

            const output = trigger.content
                .replace(/{user}/g, message.author.toString())
                .replace(/{channel}/g, message.channel.toString())
                .replace(/{guild}/g, message.guild.toString())
                .replace(/\$(\d+)(\+)?/g, (match, index, extend) => {
                    let start = parseInt(index, 10);
                    let value = args[start] || '';

                    if (extend) {
                        value += ' ' + args.slice(start + 1).join(' ');
                    }

                    return value;
                });

            if (output.trim()) {
                message.channel.send(output.substr(0, 2000));
            }

            return;
        }
    }

    if (!message.content.startsWith(prefix)) {
        return;
    }

    const split = message.content.substr(prefix.length).split(' ');
    const commandLabel = split[0];
    const args = split.slice(1);

    handleCommand(message, commandLabel, args);
});

async function handleCommand(message, commandLabel, args) {
    const command = client.commands.find(commandLabel);

    if (!command) {
        return;
    }

    if (!message.guild && command.info.guildOnly === true) {
        return message.channel.send(':x: That command can only be used in guilds.');
    }

    if (command.info.permissions instanceof Array) {
        if (!message.member.hasPermission(command.info.permissions)) {
            return message.channel.send(`:x: You need the permission \`${command.info.permissions[0]}\` to do that.`);
        }
    }

    try {
        await command.run(client, message, args);
    } catch (error) {
        if (error === 'help') {
            return handleCommand(message, 'help', [command.info.name]);
        }

        message.channel.send(`:x: ${error}`)
            .then(m => m.delete(5000));
    }
}

process.on('unhandledRejection', console.error);

client.start = function () {
    return client.login(token);
};

client.start();
