import { brBuilder, createEmbed, createEmbedAsset, createRow, hexToRgb } from "@magicyan/discord";
import { Guild, GuildMember, time } from "discord.js";
import { ButtonBuilder, ButtonStyle } from "discord.js";
import { settings } from "#settings";
import { icon } from "./emojis.js";

export function getRandomMember(guild: Guild) {
    const members = Array.from(guild.members.cache.values()) as GuildMember[];

    const randomMember = members[Math.floor(Math.random() * members.length)];
    const guildNick = randomMember.nickname ?? 'N/A';
    const joinedAt = randomMember.joinedAt ? time(randomMember.joinedAt, "D") : 'N/A';

    const embed = createEmbed({
        title: `Membro aleatório`,
        color: hexToRgb(settings.colors.theme.darkpurple),
        description: brBuilder(
            `**ID:** ${randomMember.id}`,
            `**Username:** ${randomMember.user.username}`,
            `**DisplayName:** ${randomMember.user.displayName}`,
            `**Nick:** ${guildNick}`,
            `**Ingressou em :** ${joinedAt}`
        ),
        thumbnail: createEmbedAsset(randomMember.displayAvatarURL())
    });

    const row = createRow(
        new ButtonBuilder({
            customId: "member-refresh-button",
            style: ButtonStyle.Primary,
            emoji: icon("replay"),
        })
    );

    return { embed: embed, row };
}