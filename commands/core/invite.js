const { RichEmbed } = require('discord.js');

exports.run = (client, message) => {
    if (!client.invite) {
        throw 'The invite is still generating.';
    }

    message.channel.send({
        embed: new RichEmbed()
            .setDescription(`[:paperclip: Click here to invite me to your server](${client.invite})`)
            .setFooter('What are you waiting for?')
    });
};

exports.info = {
    name: 'invite',
    description: 'Gives you an invite link for this bot'
};
