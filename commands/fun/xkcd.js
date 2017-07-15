const snekfetch = require('snekfetch');
const { RichEmbed } = require('discord.js');

const BASE = 'https://xkcd.com/';
const INFO = '/info.0.json';

async function fetchInfo(id) {
    return (await snekfetch.get(BASE + id + INFO)).body;
}

async function latest() {
    return await fetchInfo('');
}

async function random() {
    const current = await latest();

    const number = Math.floor(Math.random() * current.num);

    return fetchInfo(number === 404 ? 405 : number);
}

exports.run = async (client, message, args) => {
    const data = args.length < 1 ? await random() : await fetchInfo(args[0]);

    if (!data) {
        throw 'That XKCD could not be found!';
    }

    message.channel.send({
        embed: new RichEmbed()
            .setTitle(`${data.num} - ${data.title}`)
            .setImage(data.img)
            .setFooter(data.alt)
            .setURL(`${BASE}/${data.num}`)
    });
};

exports.info = {
    name: 'xkcd',
    usage: 'xkcd [id]',
    description: 'Displays an XKCD web comic'
};

