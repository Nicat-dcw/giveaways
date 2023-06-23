import Manager from './src/Manager.js';
import Discord from 'discord.js';
import { QuickDB } from 'quick.db';

const client = new Discord.Client({ intents: [3276799] });
const db = new QuickDB();

const giveaway = new Manager(client, db);

// Example usage
client.on("messageCreate", async message => {
  const prefix = "!";
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === "gw") {
    giveaway.createGiveaway({
      prize: 'Nitro',
      channel: message.channel.id,
      owner: message.author.id,
      end: '8s',
      winners: 1,
      messages: {
        button: 'Click to Enter',
        join: 'You joined the giveaway successfully!',
        alreadyJoined: "You've already joined this giveaway.",
      }
    });

    giveaway.on("giveawayJoin", (data) => console.log(data));
  }

  if (command === "!reroll") {
    const giveawayId = args[0];
    giveaway.rerollGiveaway(giveawayId);
    message.reply("Giveaway Rerolled");
  }
});

client.login(process.env["BOT_TOKEN"]);
