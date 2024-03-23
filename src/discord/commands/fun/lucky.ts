import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import { brBuilder, createEmbed, createEmbedAsset, hexToRgb } from "@magicyan/discord";
import { Command } from "#base";
import { settings } from "#settings";

new Command({
    name: "sorte",
    description: "🍀 Abra um biscoito da sorte.",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "membro",
            description: "Abrir biscoito da sorte para alguém.",
            type: ApplicationCommandOptionType.User,
        },
    ],

    async run(interaction) {
        const member = interaction.options.getUser('membro') || interaction.user;
        const Lucky = Math.floor(Math.random() * 100) + 1;
        const Money = Math.floor(Math.random() * 100) + 1;
        const Life = Math.floor(Math.random() * 100) + 1;
        const Love = Math.floor(Math.random() * 100) + 1;

        const title = member.id !== interaction.user.id ? `Previsões de ${member.username} são:` : "Suas previsões são:";

        const embed = createEmbed({
            color: hexToRgb(settings.colors.theme.success),
            title: title,
            description: brBuilder(
                `🍀 **Sorte:** ${Lucky}%`,
                `💸 **Dinheiro:** ${Money}%`,
                `💘 **Amor:** ${Love}%`,
                `💉 **Saúde:** ${Life}%`
            ),
            thumbnail: createEmbedAsset(member.displayAvatarURL())
        });

        await interaction.reply({ embeds: [embed] });
    }
});