import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import { Command } from "#base";

new Command({
    name: "sala",
    description: "Gerencie uma sala de voz.",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "trancar",
            description: "🔐 Tranque sua sala.",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "destrancar",
            description: "🔓 Destranque sua sala",
            type: ApplicationCommandOptionType.Subcommand,
        }
    ],
    async run(interaction) {
        const { member } = interaction;

        await interaction.deferReply({ ephemeral: true });

        if (!member) return;

        const voiceChannel = member.voice.channel;

        if (!voiceChannel) {
            await interaction.editReply("Você não está em uma sala");
            return;
        }

        if (voiceChannel.name !== member.displayName) {
            await interaction.editReply("Você não é dono dessa Sala");
            return;
        }

        switch (interaction.options.getSubcommand()) {
            case "trancar":
                await voiceChannel.permissionOverwrites.edit(member.guild.id, { Connect: false });
                await interaction.editReply("Sua sala foi trancada. Ninguém pode entrar agora.");
                break;
            case "destrancar":
                await voiceChannel.permissionOverwrites.edit(member.guild.id, { Connect: true });
                await interaction.editReply("Sua sala foi destrancada. Agora todos podem entrar.");
                break;
            default:
                break;
        }
    }
});