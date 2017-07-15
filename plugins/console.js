const chalk = require('chalk');

// You could set this to something if you wanted
let prefix;

const commands = [
    {
        name: 'help',
        description: 'Lists all available commands',
        handler: () => {
            commands.forEach(command => log(`${prefix}${chalk.yellow(command.name)}: ${command.description}`));
        }
    },
    {
        name: 'reload',
        description: 'Reloads the bot',
        handler: async client => {
            const start = process.hrtime();

            log('Disconnecting...');
            await client.destroy();
            log('Reconnecting...');
            await client.start();

            const diff = process.hrtime(start);

            log(`Reloaded the bot in ${(diff[0] * 1e3 + diff[1] / 1e6).toFixed(2)}ms`);
        }
    },
    {
        name: 'exit',
        description: 'Exits the bot cleanly',
        handler: async client => {
            log('Destroying client...');
            await client.destroy();
            log('Exiting...');
            process.exit(0);
        }
    },
    {
        name: 'invite',
        description: 'Gives you an invite link for the bot',
        handler: client => {
            if (!client.invite) {
                log('The invite has not been generated yet.');
            } else {
                log(client.invite);
            }
        }
    },
    {
        name: 'consoleprefix',
        description: 'Sets the console command prefix',
        handler: (client, args) => {
            prefix = args.join(' ');
            client.settings.global({ consolePrefix: prefix });
            log(prefix ? `Set prefix to '${prefix}'` : 'Removed prefix');
        }
    }
];

function prompt() {
    process.stdout.write(chalk.green('> '));
}

function now() {
    const date = new Date();
    return `[${date.getDate()}/${date.getMonth() + 1}/${date.getUTCFullYear()}] [${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}]`;
}

const raw = console.log;

function log(message) {
    raw(`${chalk.gray(now())} ${message}`);
}

function start(client) {
    process.stdin.on('data', async chunk => {
        const input = `${chunk}`.trim();

        if (!input.startsWith(prefix)) {
            return prompt();
        }

        const split = input.substr(prefix.length).split(' ');
        const label = split[0].toLowerCase();
        const args = split.slice(1);

        const command = commands.find(command => command.name === label);
        if (!command) {
            log(`The command '${label}' could not be found. Type ${prefix}help for a list of commands.`);
        } else {
            try {
                await command.handler(client, args);
            } catch (err) {
                console.error(err);
            }
        }

        prompt();
    });

    prompt();
}

exports.tryStart = client => {
    if (this.started) return;

    this.started = true;

    prefix = client.settings.global().consolePrefix || '';

    start(client);
};
