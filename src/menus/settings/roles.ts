import { GuildSchema } from "#database";
import { formatedRoleMention, icon } from "#functions";
import { settings } from "#settings";
import { brBuilder, createEmbed, createRow } from "@magicyan/discord";
import { RoleSelectMenuBuilder, StringSelectMenuBuilder } from "discord.js";
import { settingsNav } from "./nav.js";

export const settingsRolesOptions = [
    { emoji: "👤", label: "member", value: "member", description: "member" },
    { emoji: "👮‍♂️", label: "staff", value: "staff", description: "staff" },
] as const;

export function settingsRolesMenu(guildData: GuildSchema){
    const roles = guildData.roles??{};

    const display = settingsRolesOptions.map(({ emoji, label, value }) => 
        `- ${emoji} ${label} ${formatedRoleMention(roles[value]?.id, "`Não definido`")}`
    );

    const embed = createEmbed({
        color: settings.colors.theme.primary,
        description: brBuilder(
            `${icon("role")} Configurar cargos`,
            "",
            display
        )
    });

    const row = createRow(
        new StringSelectMenuBuilder({
            customId: "menu/settings/roles/select",
            placeholder: "Selecione o cargo que deseja",
            options: Array.from(settingsRolesOptions)
        })
    );

    const navRow = createRow(settingsNav.main);

    return { ephemeral, embeds: [embed], components: [row, navRow] };
}

export function settingsRoleMenu(guildData: GuildSchema, selected: string){
    const roles = (guildData.roles ?? {}) as Record<string, { id: string }>;

    const { emoji, label } = settingsRolesOptions.find(({ value }) => value === selected)!;

    const embed = createEmbed({
        color: settings.colors.theme.warn,
        description: brBuilder(
            `${icon("settings")} Alterar o cargo ${emoji} ${label}`,
            `Atual: ${formatedRoleMention(roles[selected]?.id, "`Não definido`")}`
        )
    });

    const selectRow = createRow(
        new RoleSelectMenuBuilder({
            customId: `menu/settings/role/${selected}`,
            placeholder: "Selecione o cargo que deseja definir",
        })
    );

    const navRow = createRow(
        settingsNav.back("roles"),
        settingsNav.main,
    );

    return { ephemeral, embeds: [embed], components: [selectRow, navRow] };
}