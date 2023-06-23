
# @nicat.dcw/discord-giveaways

[![Version](https://img.shields.io/npm/v/@nicat.dcw/discord-giveaways)]()
[![License](https://img.shields.io/github/license/Nicat-dcw/giveaways#LICENSE)]()

A Giveaway module for managing and running giveaways in your Discord server with Buttons.

## Installation

```bash
npm install @nicat.dcw/discord-giveaways
```

## Usage

```javascript

```

## Features

- Easy setup and usage
- Customizable giveaway options
- Automatic handling of entries, winners, and rerolls
- Supports multiple giveaways simultaneously
- Flexible timeout parsing using `ms` module

## Example

```javascript
import Manager from '@nicat.dcw/discord-giveaways';
import { JsonProvider } from 'ervel.db' // you can also use quick.db
import { Client } from 'discord.js' 

// Create a new instance of Discord Client
const client = new Client({ intents: [3276799] })
// Create a new instance of JsonProvider
const db = new JsonProvider()
// Create a new instance of the Manager
const giveawayManager = new Manager(client, db);

// Set up the necessary event listeners and commands

// Create a giveaway
giveawayManager.createGiveaway({
  prize: 'Nitro',
  channel: message.channel.id,
  owner: message.author.id,
  end: '8s',
  winners: 1,
  messages: {
    button: 'Click to Enter',
    join: 'You joined the giveaway successfully!',
    alreadyJoined: "You've already joined this giveaway.",
    emoji: ':tada:', // Add your preferred emoji here
  },
});

// Reroll a giveaway
giveawayManager.rerollGiveaway(giveawayId);

// Listen for ongoing giveaways
giveawayManager.listen();
```

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/Nicat-dcw/giveaways) file for details.

## Acknowledgments

- Thanks to the authors of the `discord.js`, `@smootie/emitter`, `ervel.db` and `ms` libraries for their excellent work.

## Contributors

- [Nicat-dcw](https://github.com/Nicat-dcw) - Developer

Please feel free to contribute by submitting pull requests or creating issues for any improvements or bug fixes.

## Changelog

### 1.0.0 (2023-06-23)

- Initial release of `@nicat.dcw/discord-giveaways`
