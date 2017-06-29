const path = require('path');
const fse = require('fs-extra');
const read = require('readdir-recursive');

exports._commands = [];

function assignDefaults(item) {
    item.info = Object.assign({
        aliases: [],
        description: 'N/A'
    }, item.info);

    return item;
}

function flatMap(memory, next) {
    if (next instanceof Array) {
        next.reduce(flatMap, memory);
    } else {
        memory.push(next);
    }
}

function checkCommand(command) {
    let error;

    if (typeof command !== 'object') {
        error = new Error('Command export should be an object');
    } else if (typeof command.run !== 'function') {
        error = new Error('Command is missing a run method');
    } else if (typeof command.info !== 'object') {
        error = new Error('Command is missing an info object');
    } else if (typeof command.info.name !== 'string') {
        error = new Error('Command is missing a name');
    }

    if (error) {
        return { command, error };
    }

    return command;
}

function logErrors(object) {
    if (!object) {
        return false;
    }

    if (object && object.error instanceof Error) {
        console.error(`Failed to load command "${path.basename(object.command.file)}": ${object.error.message}`);
        return false;
    }

    return true;
}

exports.load = (bot, dir) => {
    if (!fse.existsSync(dir) || !fse.statSync(dir).isDirectory) {
        throw Error('dir must exist and it must be a directory');
    }

    const files = read.fileSync(dir);

    this._commands = files.filter(file => file.endsWith('.js') && !path.basename(file).startsWith('_'))
        .map(file => {
            try {
                const object = require(file) || {};
                object.file = file;
                return object;
            } catch (ignore) {

            }
        })
        .reduce((memory, command) => {
            if (command instanceof Array) {
                memory = memory.concat(command);
            } else {
                memory.push(command);
            }
            return memory;
        }, [])
        .map(checkCommand)
        .filter(logErrors)
        .map(assignDefaults);

    this._commands.forEach(command => {
        if (typeof command.init === 'function') {
            command.init(client);
        }
    });
};

exports.find = (label) => {
    const commandLabel = label.toLowerCase();

    return this._commands.find(item => item.info.name === commandLabel ||
        item.info.aliases.map(alias => alias.toLowerCase()).indexOf(commandLabel) > -1);
}

exports.all = () => this._commands;