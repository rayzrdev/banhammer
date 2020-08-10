exports.run = (bot, msg, args) => {
    if (!bot.config.allowedUsers.includes(msg.author.id)) {
      return msg.channel.send(':x: You are not an authorized user!');
    }
    let dry = false;
    if (args[0] === '--dry') {
        dry = true;
        args.shift();
    }

    if (args.length < 2) {
        throw 'Please provide a user and a reason!';
    }

    const target = msg.mentions.users.first() || bot.users.find(
        user => user.id === args[0]
            || user.username.toLowerCase() === (args[0] || '').toLowerCase()
    ) || args[0];

    if (!target) {
        throw 'Please mention a member or provide their username/ID to ban them!';
    }

    const reason = args.slice(1).join(' ');

    const successful = [];
    const failed = [];

    bot.guilds.forEach(guild => {
        const member = guild.member(target);

        if (member && !member.bannable) {
            failed.push(guild.name);
        } else {
            if (!dry) {
                guild.ban(target, reason);
            }
            successful.push(guild.name);
        }
    });

    let output = `${dry ? '**(DRY)** | ' : ''}${failed.length ? ':warning:' : ':white_check_mark:'} | Banned **${target.tag || target}** for \`${reason}\` | `;

    if (successful.length) {
        output += `Successfully banned in \`${successful.join(', ')}\``;
        if (failed.length) {
            output += ', but ';
        }
    }

    if (failed.length) {
        output += `${successful.length ? 'f' : 'F'}ailed to ban in \`${failed.join(', ')}\``;
    }

    msg.channel.send(output);
};

exports.help = {
    name: 'ban',
    usage: 'ban [--dry] <user> <reason>',
    description: 'Bans a user in all guilds that this bot is in.'
};
