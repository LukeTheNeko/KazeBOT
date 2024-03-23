import { brBuilder, createEmbed, createEmbedAsset } from "@magicyan/discord";
import { ApplicationCommandType } from "discord.js";
import { createPagination } from "#functions";
import { Command } from "#base";

new Command({
    name: "membros",
    description: "👤 Verificar membros do servidor",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    async run(interaction) {
        const { member, guild } = interaction;

        createPagination({
            embeds: guild.members.cache.map(member => createEmbed({
                title: member.displayName,
                color: member.displayColor,
                description: brBuilder(
                    `> ${member} **@${member.user.username}**`,
                    `> Cargo: ${member.roles.highest}`,
                ),
                thumbnail: createEmbedAsset(member.displayAvatarURL())
            })),
            render: (embeds, components) => interaction.reply({
                fetchReply, ephemeral, embeds, components,
            }),
            filter(interaction) {
                const isExecutor = interaction.user.id === member.id;
                if (!isExecutor) interaction.deferUpdate();
                return isExecutor;
            },
            onUpdate(embed, index, length) {
                embed.setFooter({ text: `Página: ${index + 1}/${length}` });
            },
            onEnd: () => interaction.deleteReply()
        })
    }
});