import { ApplicationCommandOptionType, ApplicationCommandType, ComponentType } from "discord.js";
import { db, getRegister } from "#database";
import { Command, Component } from "#base";
import { getWalletMenu, reply } from "#functions";
import { toNull } from "@magicyan/discord";

new Command({
    name: "carteira",
    description: "Gerencia a carteira do usuário",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "exibir",
            description: "🪙 Exibe a carteira do usuário",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "usuário",
                    description: "Mencione algum usuário",
                    type: ApplicationCommandOptionType.User
                }
            ],
        },
        {
            name: "transferir",
            description: "➡️ Transfere moedas para um usuário",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "valor",
                    description: "Especifique o valor que deseja transferir",
                    type: ApplicationCommandOptionType.Number,
                    minValue: 1,
                    required
                },
                {
                    name: "usuário",
                    description: "Mencione algum usuário",
                    type: ApplicationCommandOptionType.User,
                    required
                }
            ],
        },
    ],
    async run(interaction) {
        const { options } = interaction;

        await interaction.deferReply({ ephemeral });

        const subCommand = options.getSubcommand(true);

        switch (subCommand) {
            case "exibir": {
                const user = options.getUser("usuário") || interaction.user;
                if (user.bot) {
                    reply.danger({
                        interaction, update: true,
                        text: "Bots não têm carteira"
                    });
                    return;
                }
            
                const userData = await getRegister(user);
                
                if (userData === null) {
                    reply.danger({
                        interaction, update: true,
                        text: "Os dados do usuário não foram encontrados"
                    });
                    return;
                }
                
                const { embed, row } = getWalletMenu(user, userData);
                interaction.editReply({ embeds: [embed], components: [row] });
                return;
            }
            case "transferir": {
                const mention = options.getUser("usuário", true);
                const value = options.getNumber("valor", true);
                if (mention.bot) {
                    reply.danger({
                        interaction, update: true,
                        text: "Você não pode transferir moedas para um bot!"
                    });
                    return;
                }
                const { member } = interaction;
            
                const memberData = await getRegister(member.user);
                const mentionData = await getRegister(mention);
            
                if (memberData === null || mentionData === null) {
                    reply.danger({
                        interaction, update: true,
                        text: "Dados do usuário não encontrados"
                    });
                    return;
                }
            
                const memberCoins = memberData.wallet?.coins || 0;
                const mentionCoins = mentionData.wallet?.coins || 0;
            
                if (value > memberCoins) {
                    reply.danger({
                        interaction, update: true,
                        text: "Você não tem moedas suficientes para essa transferência!"
                    });
                    return;
                }
            
                await Promise.all([
                    db.members.updateOne({ id: member.id }, { wallet: { coins: memberCoins - value } }),
                    db.members.updateOne({ id: mention.id }, { wallet: { coins: mentionCoins + value } })
                ]);
            
                reply.success({
                    interaction, update: true,
                    text: `Você transferiu ${value} moedas para ${mention} com sucesso!`
                });
                return;
            }
        }
    }
});


new Component({
    customId: "wallet-refresh-button",
    type: ComponentType.Button,
    cache: "cached",
    async run(interaction) {
        const { message, guild } = interaction;

        const walletMemberId = message.embeds[0].footer?.text || "";
        const walletMember = await guild.members.fetch(walletMemberId).catch(toNull);

        if (!walletMember) {
            reply.danger({
                interaction, update: true, clear: true,
                text: "Não foi possível localizar o usuário no servidor!"
            });
            return;
        }

        const walletMemberData = await getRegister(walletMember.user);

        if (walletMemberData === null) {
            reply.danger({
                interaction, update: true, clear: true,
                text: "Os dados do usuário não foram encontrados"
            });
            return;
        }

        const { embed, row } = getWalletMenu(walletMember.user, walletMemberData);
        interaction.update({ embeds: [embed], components: [row] });
    },
});
