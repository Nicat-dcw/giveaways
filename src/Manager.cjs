const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const ms = require('ms');
const Emitter = require('@smootie/emitter');

class Manager extends Emitter {
  constructor(client, db) {
    super();
    this.client = client;
    this.db = db;
  }

  createGiveaway(options) {
    const { channel, prize, owner, end, messages, customization, winners } = options || {};

    const channelMention = channel ? channel.replace(/<|#|>/g, '') : owner;
    const buttonLabel = messages.button || 'Enter Giveaway';
    const joinMessage = messages.join || 'You joined the giveaway successfully!';
    const alreadyJoinedMessage = messages.alreadyJoined || "You've already joined this giveaway.";
    const c = customization || {};
    const embedColor = '#FF0000';
    let winChance;
    let entriesCount = 0;

    const updateEmbed = async (embed, sentMessage) => {
      const giveaway = await this.db.get(`giveaway.${sentMessage.id}`) || { entries: [], prize: '', owner: '', guild: '', channel: '', messages, customization };

      const entries = giveaway.entries || [];
      entriesCount = entries.length;

      if (winners) {
        const totalEntries = entriesCount * 100;
        winChance = `${totalEntries || "100"}%`;
      } else {
        winChance = '100';
      }

      embed.fields = [
        { name: 'Prize:', value: prize },
        { name: 'Owner:', value: `<@${owner}>` },
        { name: 'Winner(s):', value: `${winners || 0} (${winChance})` },
        { name: 'Entered Users:', value: entriesCount.toString() },
      ];

      sentMessage.edit({ embeds: [embed] });
    };

    const embed = new MessageEmbed()
      .setColor(embedColor)
      .setTitle('Giveaway')
      .setDescription(`React to enter the giveaway for **${prize}**!\nEnds in <t:${Math.round((Date.now() + parseTimeout(end)) / 1000)}:R>`)
      .addFields([
        { name: 'Prize:', value: prize },
        { name: 'Owner:', value: `<@${owner}>` },
        { name: 'Winner(s):', value: `${winners || 0}` },
        { name: 'Entered Users:', value: entriesCount.toString() },
     ])
      .setFooter('Giveaways | By Nicat-dcw');

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId('giveaway_button')
        .setLabel(buttonLabel)
        .setEmoji(messages.emoji)
        .setStyle('SUCCESS')
    );

    this.client.channels.cache
      .get(channelMention)
      .send({ embeds: [embed], components: [row] })
      .then((sentMessage) => {
        const filter = (interaction) => interaction.customId === 'giveaway_button' && interaction.isButton();
        const collector = sentMessage.createMessageComponentCollector({ filter, time: parseTimeout(end) });

        collector.on('collect', async (interaction) => {
          const giveaway = await this.db.get(`giveaway.${sentMessage.id}`) || { entries: [], prize: '', owner: '', guild: '', channel: '', messages, customization };
          const { user } = interaction;

          const entries = giveaway.entries || [];
          if (!entries.includes(user.id)) {
            await entries.push(user.id);
            await this.db.set(`giveaway.${sentMessage.id}`, giveaway);
            interaction.reply({ content: joinMessage, ephemeral: true });
            this.emit('giveawayJoin', {
              type: 'join',
              giveawayId: sentMessage.id || null,
              user: user.id,
            });
          } else {
            interaction.reply({ content: alreadyJoinedMessage, ephemeral: true });
          }

          // Update the embed after the user joins the giveaway
          updateEmbed(embed, sentMessage);
        });

        collector.on('end', async () => {
          const giveaway = await this.db.get(`giveaway.${sentMessage.id}`) || { entries: [], prize: '', owner: '', guild: '', channel: '' };
          const entries = giveaway.entries || []; // Initialize entries as an empty array if it doesn't exist

          if (entries.length === 0) {
            const endEmbed = new MessageEmbed()
              .setColor(embedColor)
              .setTitle('Giveaway Ended')
              .setDescription('> No one entered the giveaway.')
              .setFooter('Giveaways');

            this.emit('giveawayEnd', {
              type: 'end',
              giveawayId: sentMessage.id,
              winners: 'No one entered the giveaway.',
            });
            row.components[0].setDisabled(true)
            sentMessage.edit({ embeds: [endEmbed], components: [] });
          } else {
            const entries = giveaway.entries;
            const winnersCount = Math.min(winners, entries.length);
            const winnersArray = [];

            for (let i = 0; i < winnersCount; i++) {
              const randomIndex = Math.floor(Math.random() * entries.length);
              const winnerId = entries[randomIndex];
              const winner = await this.client.users.fetch(winnerId);
              winnersArray.push(winner);
              entries.splice(randomIndex, 1);
            }

            const winnerText = winnersArray.map((winner) => `<@${winner.id}>`).join(', ');

            const endEmbed = new MessageEmbed()
              .setColor(embedColor)
              .setTitle('Giveaway Ended')
              .setDescription(`Winner${winnersCount > 1 ? 's' : ''}: ${winnerText}`);

            this.emit('giveawayEnd', {
              type: 'end',
              giveawayId: sentMessage.id,
              winners: `Winner${winnersCount > 1 ? 's' : ''}: ${winnerText}`,
              winnersAsArray: winnerText,
            });
            row.components[0].setDisabled(true)
            sentMessage.reply({ embeds: [endEmbed] });
          }

          this.emit('database', {
            type: 'delete',
            data: this.db.get(`giveaway.${sentMessage.id}`),
            reason: 'Giveaway End',
          });

          await this.db.delete(`giveaway.${sentMessage.id}`);
        });

        setTimeout(() => {
          collector.stop();
        }, parseTimeout(end));
      })
      .catch((error) => {
        console.error('Error creating giveaway:', error);
      });
  }

  async rerollGiveaway(giveawayId) {
    const giveaway = await this.db.get(`giveaway.${giveawayId}`);
    if (giveaway) {
      const { channel, prize, winnersAsArray } = giveaway;
      const channelMention = channel.replace(/<|#|>/g, '');

      const rerollEmbed = new MessageEmbed()
        .setColor('#FF0000')
        .setTitle('Giveaway Rerolled')
        .setDescription(`New Winner${winnersAsArray.includes('<@') ? 's' : ''}: ${winnersAsArray}`);

      this.client.channels.cache.get(channelMention).send({ embeds: [rerollEmbed] });
    }
  }

  async listen() {
    // Retrieve ongoing giveaways from the database
    const ongoingGiveaways = this.db.filter((key) => key.startsWith('giveaway.'));

    // Iterate over each ongoing giveaway and recreate them
    for (const key of ongoingGiveaways.keys()) {
      const giveaway = await this.db.get(key);

      if (giveaway) {
        const { channel, prize, end, messages, customization, winners } = giveaway;
        const channelMention = channel.replace(/<|#|>/g, '');

        // Calculate the remaining time for the giveaway
        const remainingTime = parseTimeout(end) - (Date.now() - giveaway.startTime);

        // If the remaining time is positive, recreate the giveaway
        if (remainingTime > 0) {
          // Update the end time based on the remaining time
          giveaway.end = ms(remainingTime, { long: true });

          // Recreate the giveaway using the createGiveaway method
          this.createGiveaway({
            channel: channelMention,
            prize,
            end: giveaway.end,
            messages,
            customization,
            winners,
          });

          console.log(`Recreated ongoing giveaway with ID: ${key}`);
        } else {
          // If the remaining time is negative, the giveaway has ended
          console.log(`Ongoing giveaway with ID ${key} has ended.`);
          this.db.delete(key);
        }
      }
    }
  }
}

function parseTimeout(timeout) {
  const [, time, unit] = timeout.match(/(\d+)([smhdw])/i);

  const intervals = {
    s: 1000,
    m: 1000 * 60,
    h: 1000 * 60 * 60,
    d: 1000 * 60 * 60 * 24,
    w: 1000 * 60 * 60 * 24 * 7,
  };

  return parseInt(time) * intervals[unit.toLowerCase()];
}

module.exports = Manager;
         