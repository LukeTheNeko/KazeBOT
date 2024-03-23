import { ApplicationCommandOptionType, ApplicationCommandType, EmbedBuilder, UserFlagsBitField, time } from "discord.js";
import { brBuilder, createEmbed, createEmbedAsset, hexToRgb } from "@magicyan/discord";
import { mapBadges, reply } from "#functions";
import { Command } from "#base";
import { settings } from "#settings";

new Command({
    name: "user",
    description: "funções de membros.",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "avatar",
            description: "👤 Visualizar o avatar um membro.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "user",
                    description: "Membro para ver o avatar.",
                    type: ApplicationCommandOptionType.User,
                },
            ],
        },
        {
            name: "banner",
            description: "🖼️ Visualizar o banner um membro.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "user",
                    description: "Membro para ver o banner",
                    type: ApplicationCommandOptionType.User,
                },
            ],
        },
        {
            name: "info",
            description: "🧾 Visualizar as informações de um membro",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "user",
                    description: "Membro para ver as informações",
                    type: ApplicationCommandOptionType.User,
                },
            ],
        }
    ],
    async run(interaction) {
        const subcommand = interaction.options.getSubcommand();
        switch (subcommand) {
            case "avatar": {
                const user = interaction.options.getUser('user') ?? interaction.user;
                const avatarUrl = user.displayAvatarURL({ size: 4096 });

                const embed = new EmbedBuilder({
                    color: hexToRgb(settings.colors.theme.darkpurple),
                    title: `Avatar de ${user.displayName}`,
                    image: createEmbedAsset(avatarUrl)
                });

                await interaction.reply({ embeds: [embed] });
                break;
            }
            case "banner": {
                async function getUserBannerUrl(userId: string) {
                    try {
                        const user = await interaction.client.users.fetch(userId, { force: true });
                        return user.bannerURL({ size: 512 }) ?? null;
                    } catch (error) {
                        console.error(`Erro ao obter o banner do usuário ${userId}:`, error);
                        return null;
                    }
                }

                const user = interaction.options.getUser('user') ?? interaction.user;
                const bannerUrl = await getUserBannerUrl(user.id);

                if (!bannerUrl) {
                    reply.danger({
                        interaction, ephemeral: true, text: brBuilder(
                            `O usuário **${user.displayName}** não tem um banner.`,
                        )
                    });
                    return;
                }

                if (bannerUrl) {
                    const embed = new EmbedBuilder({
                        color: hexToRgb(settings.colors.theme.darkpurple),
                        title: `Banner de ${user.displayName}`,
                        image: createEmbedAsset(bannerUrl)
                    });

                    await interaction.reply({ embeds: [embed] });
                }
                break;
            }
            case "info": {
                let targetUser = interaction.options.getUser('user');
                if (!targetUser) {
                    targetUser = interaction.user;
                }
            
                const guildNick = interaction.guild.members.cache.get(targetUser.id)?.nickname;
                const member = interaction.guild.members.cache.get(targetUser.id);
                const joinedAt = member ? (member.joinedAt ? time(member.joinedAt) : 'N/A') : 'N/A';
                const userColor = member ? (member.displayColor || '#99AAB5') : '#99AAB5';
                const userRoles = interaction.guild.members.cache.get(targetUser.id)?.roles.highest;
            
                let badgeEmojis: (string | undefined)[] = [];
                if (member && member.user.flags) {
                    const flags = member.user.flags.toArray();
                    badgeEmojis = await mapBadges(flags.map(flag => UserFlagsBitField.Flags[flag]), 'emoji');
                }
            
                const validBadgeEmojis = badgeEmojis.filter(emoji => emoji !== null && emoji !== undefined) as string[];
                const badgesString = validBadgeEmojis.length > 0 ? validBadgeEmojis.join(' ') : 'N/A';
            
                const embed = createEmbed({
                    title: `Informações de ${targetUser.displayName}`,
                    color: userColor,
                    description: brBuilder(
                        `**ID:** ${targetUser.id} `,
                        `**Username:** ${targetUser.username} `,
                        `**DisplayName:** ${targetUser.displayName}`,
                        `**Nick:** ${guildNick || "N/A"}`,
                        `**Cor:** #${userColor || "N/A"}`,
                        `**Insígnias:** ${badgesString}`,
                        '',
                        `**Conta Criada:**`,
                        `${time(targetUser.createdAt, "D")} |  ${time(targetUser.createdAt, "R")}`,
                        '',
                        `**Ingressou em:** ${interaction.guild.name} `,
                        `${joinedAt}`,
                        '',
                        `**Cargo:**`,
                        `${userRoles || "N/A"}`,
                    ),
                    thumbnail: createEmbedAsset(targetUser.displayAvatarURL())
                });
            
                await interaction.reply({ embeds: [embed] });
            
                break;
            }                  
            default:
                break;
        }
    }
});