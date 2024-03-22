import { icon } from "#functions";
import { settings } from "#settings";
import { brBuilder, createEmbed, createRow } from "@magicyan/discord";
import { ButtonBuilder, ButtonStyle, Guild, time } from "discord.js";

export function settingsMainMenu(guild: Guild){
    
    const humanMembers = guild.members.cache.filter(member => !member.user.bot).size;
    const botMembers = guild.members.cache.filter(member => member.user.bot).size;
    
    const embed = createEmbed({
        color: settings.colors.theme.primary,
        thumbnail: guild.iconURL(),
        description: brBuilder(
            `# ${icon("settings")} Painel de configurações`,
            `> ${icon("home")} **Servidor:** ${guild.name}`,
            `> ${icon("channel")} **Canais:** ${guild.channels.cache.size}`,
            `> ${icon("role")} **Cargos:** ${guild.roles.cache.size}`,
            `> ${icon("member")} **Membros:** ${humanMembers}`,
            `> ${icon("robot")} **Bots:** ${botMembers}`,
            `> ${icon("calendar")} **Fundação:** ${time(guild.createdAt, "D")} | ${time(guild.createdAt, "R")}`,
        ),
        footer: {
            text: `Configurações de ${guild.name}`,
            iconURL: guild.iconURL()
        }
    });

    const row = createRow(
        new ButtonBuilder({
            customId: "menu/settings/channels",
            label: "Canais", emoji: icon("channel"),
            style: ButtonStyle.Secondary
        }),
        new ButtonBuilder({
            customId: "menu/settings/roles",
            label: "Cargos", emoji: icon("role"),
            style: ButtonStyle.Secondary
        })
    );

    return { ephemeral, embeds: [embed], components: [row] };
}