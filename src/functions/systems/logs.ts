import { EmbedBuilder, EmbedData, Guild, User } from "discord.js";
import { brBuilder, hexToRgb } from "@magicyan/discord";
import { db } from "#database";
import { settings } from "#settings";

interface GuildLogProps {
    message: string,
    executor: User,
    guild: Guild,
    thumbnail?: EmbedData["thumbnail"],
    author?: EmbedData["author"],
    title?: string,
    color?: string,
}
export async function guildLog({ message, executor, guild, ...props }: GuildLogProps) {
    const { title, color = settings.colors.theme.primary, author, thumbnail } = props;

    const guildData = await db.guilds.get(guild.id)
    if (!guildData) return;

    const channel = guild.channels.cache.get(guildData.channels?.logs?.id || "");
    if (!channel?.isTextBased()) return;

    const embed = new EmbedBuilder({
        title, author,
        color: hexToRgb(color),
        thumbnail,
        description: message,
        footer: {
            iconURL: executor.displayAvatarURL(),
            text: brBuilder(
                `Administração • ${guild.name}`
            )
        },
        timestamp: new Date(),
    });

    channel.send({ embeds: [embed] });
}