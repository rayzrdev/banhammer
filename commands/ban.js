exports.run = (bot, msg, args) => {
    let dry = false;
    if (args[0] === '--dry') {
        dry = true;
        args.shift();
    }

    if (args.length < 2) {
        throw 'Please provide a user and a reason!';
    }

    const target = msg.mentions.members.first()
        || msg.guild.members.find(member => member.id === args[0]
            || member.user.username.toLowerCase() === (args[0] || '').toLowerCase());

    if (!target) {
        throw 'Please mention a member or provide their username/ID to ban them!';
    }

    const reason = args.slice(1).join(' ');

    const successful = [];
    const failed = [];

    bot.guilds.forEach(guild => {
        const member = guild.member(target.user);

        if (!member) {
            return;
        }

        if (!member.bannable) {
            failed.push(guild.name);
        } else {
            if (!dry) {
                guild.ban(member, reason);
            }
            successful.push(guild.name);
        }
    });

    let output = `${dry ? '**(DRY)** | ' : ''}${failed.length ? ':warning:' : ':white_check_mark:'} | Banned **${target.user.username}** for \`${reason}\` | `;

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
