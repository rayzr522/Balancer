const snekfetch = require('snekfetch');
const RichEmbed = require('discord.js').RichEmbed;

function makeCommand(type, endpoint, transformer) {
    return {
        info: {
            name: type,
            description: `Fetches a random ${type} image`
        },
        run: async (client, message) => {
            const response = await snekfetch.get(endpoint);

            await message.channel.send({
                embed: new RichEmbed().setImage(transformer(response.body))
            })
        }
    }
}

module.exports = [
    makeCommand('cat', 'http://random.cat/meow', body => body.file),
    makeCommand('dog', 'http://random.dog/woof', body => `http://random.dog/${body}`)
];
