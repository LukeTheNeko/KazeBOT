import { ApplicationCommandOptionType, ApplicationCommandType, ColorResolvable } from "discord.js";
import { createEmbed, createEmbedAsset } from "@magicyan/discord";
import { Command } from "#base";

new Command({
    name: "corno",
    description: "🐮 Ver o quanto alguém é corno.",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "membro",
            description: "Membro que você quer ver se é corno.",
            type: ApplicationCommandOptionType.User,
        },
    ],
    async run(interaction) {
        const member = interaction.options.getUser('membro') ?? interaction.user;
        const nivelcorno = Math.floor(Math.random() * 100) + 1;
        const title = member.id !== interaction.user.id ? `**${member.displayName}** é **${nivelcorno}%** corno` : `Você é **${nivelcorno}%** corno`;
        
        let color: ColorResolvable;
        if (nivelcorno > 80) {
            color = '#FF0000';
        } else if (nivelcorno > 30) {
            color = '#FFA500';
        } else {
            color = '#008000';
        }

        const embed = createEmbed({
            color: color,
            title: title,
            image: createEmbedAsset(member.displayAvatarURL({ size: 4096 }))
        });

        await interaction.reply({ embeds: [embed] });

    },
});