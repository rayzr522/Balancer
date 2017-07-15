function findTrigger(name) {
    return (trigger) => trigger.name === name;
}

exports.run = (client, message, args) => {
    if (args.length < 1) {
        throw 'help';
    }

    const settings = client.settings.get(message.guild.id);
    const triggers = settings.triggers || [];

    const sub = args[0].toLowerCase();

    if (sub === 'list') {
        if (triggers.length < 1) {
            throw 'There are no triggers.';
        }

        return message.channel.send(triggers.map(c => `- \`${c.name}\``));
    } else if (sub === 'info') {
        if (args.length < 2) {
            throw 'Please provide a name.';
        }

        const name = args[1];
        const command = triggers.find(c => c.name === name);

        if (!command) {
            throw 'That command could not be found.';
        }

        // Prevent backticks from breaking things.
        const content = command.content.replace(/`/g, '\\`');

        return message.channel.send(`\`${name}\` \`\`\`\n${content}\n\`\`\``);
    } else if (sub === 'add') {
        if (args.length < 3) {
            throw 'Please provide a name and some content.';
        }

        const name = args[1];
        const content = args.slice(2).join(' ');

        if (triggers.find(findTrigger(name))) {
            throw 'That trigger already exists!';
        }

        triggers.push({ name, content });

        message.channel.send(`:white_check_mark: Added trigger \`${name}\`.`);
    } else if (sub === 'edit') {
        if (args.length < 3) {
            throw 'Please provide a name and some content.';
        }

        const name = args[1];
        const content = args.slice(2).join(' ');

        const index = triggers.findIndex(findTrigger(name));
        if (index > -1) {
            triggers.splice(index, index + 1);
        }

        triggers.push({ name, content });

        message.channel.send(`:white_check_mark: ${index > -1 ? 'Edited' : 'Added'} trigger \`${name}\`.`);
    } else if (sub === 'remove') {
        if (args.length < 2) {
            throw 'Please provide a name.';
        }

        const name = args[1];

        const index = triggers.findIndex(findTrigger(name));
        if (index < 0) {
            throw 'That trigger could not be found.';
        }

        triggers.splice(index, 1);

        message.channel.send(`:white_check_mark: Removed \`${name}\`.`);
    } else {
        throw 'That is not a valid sub-command.';
    }

    settings.triggers = triggers;
    client.settings.set(message.guild.id, settings);
};

exports.info = {
    name: 'trigger',
    usage: 'trigger <list|info|add|edit|remove> [name] [content]',
    description: 'Creates, removes or edits custom triggers',
    permissions: ['MANAGE_GUILD']
};
