import { Command } from "#base";
import { getRandomColorAndRow, getRandomMember } from "#functions";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";

new Command({
    name: "utility",
    description: "utility commands.",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "random",
            description: "Choose option",
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: "color",
                    nameLocalizations: { "pt-BR": "cor" },
                    description: "🌟 Choose random color",
                    descriptionLocalizations: { "pt-BR": "🎲 Escolher uma cor aleatória" },
                    type: ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: "member",
                    nameLocalizations: { "pt-BR": "membro" },
                    description: "🎲 Choose random member",
                    descriptionLocalizations: { "pt-BR": "🎲 Escolher um membro aleatório" },
                    type: ApplicationCommandOptionType.Subcommand,
                }
            ],
        }
    ],
    async run(interaction) {
        const subcommandGroup = interaction.options.getSubcommandGroup();
        const subcommand = interaction.options.getSubcommand();

        switch (subcommandGroup) {
            case "random": {
                switch (subcommand) {
                    case "color": {
                        await interaction.deferReply({ ephemeral: false });

                        const { embed, row } = getRandomColorAndRow();

                        interaction.editReply({ embeds: [embed], components: [row] });

                        break;
                    }
                    case "member": {
                        await interaction.deferReply({ ephemeral: false });

                        const { embed, row } = getRandomMember(interaction.guild);

                        interaction.editReply({ embeds: [embed], components: [row] });

                        break;
                    }
                    default:
                        break;
                }
                break;
            }
            default:
                break;
        }
    }
});