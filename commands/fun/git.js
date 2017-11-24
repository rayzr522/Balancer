const { RichEmbed } = require('discord.js');
const { get } = require('snekfetch');
const { load } = require('cheerio');

const MATCHER = /daily|weekly|monthly/i;

exports.run = async (client, message, args) => {
    if (args.length < 1) {
        throw 'Please specify whether to show daily, weekly or monthly trending repositories.';
    }

    if (!MATCHER.test(args[0])) {
        throw 'Please choose either daily, weekly or monthly.';
    }

    const res = await get(`https://github.com/explore?since=${args[0].toLowerCase()}`);

    const $ = load(res.body.toString());

    const embed = new RichEmbed();

    $('article.border-bottom').each(function () {
        const tag = $('.f3>a', $(this)).text().trim().replace(' / ', '/');
        const description = $('p', $(this)).text().trim().replace(/\n/g, '');

        embed.addField(`\`${tag}\``, `${description}\n\n[View on GitHub](https://github.com/${tag})\n\u200b`);
    });

    embed.setFooter(`Requested by ${message.author.tag}`);

    message.channel.send({ embed });
};

exports.info = {
    name: 'git',
    usage: 'git <daily|weekly|monthly>',
    description: 'Shows the trending GitHub repositories from this day, week or month'
};
