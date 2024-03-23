import { ApplicationCommandOptionType, ApplicationCommandType, ChannelType, EmbedBuilder, time } from "discord.js";
import { brBuilder, createEmbedAsset, hexToRgb } from "@magicyan/discord";
import { Command } from "#base";
import { settings } from "#settings";
import { reply } from "#functions";

new Command({
    name: "server",
    description: "funções do servidor.",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "icon",
            description: "🖼️ Ver o ícone do servidor.",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "banner",
            description: "🖼️ Ver o banner do servidor.",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "info",
            description: "📶 Ver o status do servidor.",
            type: ApplicationCommandOptionType.Subcommand,
        }
    ],
    async run(interaction) {
        const subcommand = interaction.options.getSubcommand();
        switch (subcommand) {
            case "icon": {
                const iconUrl = interaction.guild.iconURL({ size: 4096 });

                if (!iconUrl) {
                    reply.danger({
                        interaction, ephemeral: true, text: brBuilder(
                            `O servidor **${interaction.guild.name}** não tem um icon.`,
                        )
                    });
                    return;
                }

                if (iconUrl) {
                    const embed = new EmbedBuilder({
                        color: hexToRgb(settings.colors.theme.darkpurple),
                        title: `Icon de ${interaction.guild.name}`,
                        image: createEmbedAsset(iconUrl)
                    });

                    await interaction.reply({ embeds: [embed] });
                }
                break;
            }
            case "banner": {
                const bannerUrl = interaction.guild.bannerURL({ size: 512 });

                if (!bannerUrl) {
                    reply.danger({
                        interaction, ephemeral: true, text: brBuilder(
                            `O servidor **${interaction.guild.name}** não tem um banner.`,
                        )
                    });
                    return;
                }

                if (bannerUrl) {
                    const embed = new EmbedBuilder({
                        color: hexToRgb(settings.colors.theme.darkpurple),
                        title: `Banner de ${interaction.guild.name}`,
                        image: createEmbedAsset(bannerUrl)
                    });

                    await interaction.reply({ embeds: [embed] });
                }
                break;
            }
            case "info": {
                const humanMembersCount = interaction.guild.members.cache.filter(member => !member.user.bot).size;
                const botMembersCount = interaction.guild.members.cache.filter(member => member.user.bot).size;
                const guildTextCount = interaction.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText).size;
                const guildVoiceCount = interaction.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildVoice).size;
                const guildDate = time(interaction.guild.createdAt);
                const guildEmojis = interaction.guild.emojis.cache.size;
                const guildRoles = interaction.guild.roles.cache.size;
                const guildId = interaction.guild.id;
                const guildOwnerId = interaction.guild.ownerId;
                const guildOwner = await interaction.client.users.fetch(guildOwnerId);
                const guildOwnerMention = `<@${guildOwner.id}>`;
                const guildName = interaction.guild.name;

                const embed = new EmbedBuilder({
                    color: hexToRgb(settings.colors.theme.success),
                    description: brBuilder(
                        `## Servidor ${guildName}`,
                        '',
                        `🆔 **ID:** ${guildId}`,
                        `👑 **Dono:** ${guildOwnerMention}`,
                        `📅 **Fundação** ${guildDate} `,
                        `👤 **Membros:** ${humanMembersCount}`,
                        `🤖 **Bots:** ${botMembersCount}`,
                        `💬 **Canais de Texto:** ${guildTextCount}`,
                        `🔊 **Canais de Voz:** ${guildVoiceCount}`,
                        `😺 **Emojis:** ${guildEmojis}`,
                        `🔥 **Cargos:** ${guildRoles}`,
                    ),
                    thumbnail: createEmbedAsset(interaction.guild.iconURL())
                });
                await interaction.reply({ embeds: [embed], });
                break;
            }
            default:
                break;
        }
    }
});