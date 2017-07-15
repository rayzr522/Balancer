const snekfetch = require('snekfetch');
const { RichEmbed } = require('discord.js');

const API = 'http://api.urbandictionary.com';
const ENDPOINT = '/v0/define?term=';

async function fetchData(input) {
    return (await snekfetch.get(API + ENDPOINT + encodeURIComponent(input))).body;
}

exports.run = async (client, message, args) => {
    if (args.length < 1) {
        throw 'You must provide something to search for!';
    }

    const input = args.join(' ');

    const data = await fetchData(input);
    if (!data || !data.list || data.list.length < 1) {
        throw 'That word could not be found!';
    }

    const item = data.list[0];

    message.channel.send({
        embed: new RichEmbed()
            .setTitle(input)
            .setDescription(item.definition)
            .setURL(item.permalink)
            .setFooter(`Author: ${item.author} || +${item.thumbs_up}/-${item.thumbs_down}`)
    });
};

exports.info = {
    name: 'urban',
    usage: 'urban <word>',
    description: 'Searches Urban dictionary'
};
