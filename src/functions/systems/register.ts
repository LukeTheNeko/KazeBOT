import { createRegister, db, hasRegister } from "#database";
import { GuildMember } from "discord.js";

export async function registerNewMember(member: GuildMember) {
    const { guild, user } = member;

    if (user.bot) return;

    db.guilds.get(guild.id).then((data) => {
        const roleId = data?.roles?.member?.id || "";
        if (roleId && guild.roles.cache.has(roleId) && !member.roles.cache.has(roleId)) {
            member.roles.add(roleId);
        }
    });

    if (await hasRegister(user.id)) return;
    await createRegister({ id: user.id, guildId: guild.id, username: user.username });
}