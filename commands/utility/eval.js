const { inspect } = require('util');

const clean = input => `${input}`.replace(/`/g, '\u200b`');

exports.run = async (client, message, args) => {
    if (message.author.id !== '138048234819026944' /* Me ;) */) {
        return message.channel.send(':wink: Nope.');
    }

    if (args.length < 1) {
        throw 'You must provide some code to evaluate!';
    }

    let output;
    try {
        output = inspect(await eval(args.join(' ')));
    } catch (err) {
        return message.channel.send(`:x: An error has occurred! \`\`\`\n${clean(err).substring(0, 1950)}\n\`\`\``);
    }

    while (output.indexOf(client.token) > -1) {
        output = output.replace(client.token, 'BOT_TOKEN');
    }

    message.channel.send(`\`\`\`javascript\n${clean(output).substr(0, 1950)}\`\`\``);
};

exports.info = {
    name: 'eval',
    usage: 'eval <code>',
    hidden: true,
};
