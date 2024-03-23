import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import { createEmbed, createEmbedAsset, hexToRgb } from "@magicyan/discord";
import { Command } from "#base";
import { settings } from "#settings";
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

new Command({
    name: "banana",
    description: "🍌 Ver o tamanho da banana de alguém.",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "membro",
            description: "Membro que você quer ver o tamanho da banana.",
            type: ApplicationCommandOptionType.User,
        },
    ],
    async run(interaction) {
        const member = interaction.options.getUser('membro') || interaction.user;
        const bananaImg = path.join(__dirname, '..', '..', '..', '..', 'assets', 'images', 'memes', 'banana.png');
        const banana = Math.floor(Math.random() * (30 - 5 + 1)) + 5;
        const title = member.id !== interaction.user.id ? `**A banana de ${member.displayName}** tem **${banana}**cm` : `Sua banana tem **${banana}**cm`;

        const embed = createEmbed({
            color: hexToRgb(settings.colors.theme.darkpurple),
            title: title,
            image: createEmbedAsset(`attachment://banana.png`)
        });    

        await interaction.reply({ embeds: [embed], files: [{ attachment: bananaImg, name: 'banana.png' }]
        });
    },
});