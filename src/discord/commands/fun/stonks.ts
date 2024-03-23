import { ApplicationCommandType, AttachmentBuilder } from "discord.js";
import { Canvas, loadImage } from "@napi-rs/canvas";
import { Command } from "#base";
import { createEmbed, createEmbedAsset, hexToRgb } from "@magicyan/discord";
import { settings } from "#settings";
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

new Command({
    name: "stonks",
    description: "📈 fazer stonks.",
    dmPermission: true,
    type: ApplicationCommandType.ChatInput,
    async run(interaction) {
        const canvas = new Canvas(900, 500);
        const context = canvas.getContext("2d");

        const imgFolder = path.join(__dirname, '..', '..', '..', '..', 'assets', 'images', 'memes');
        const imgStonks = 'stonks.png';

        const backgroundImage = await loadImage(path.join(imgFolder, imgStonks));
        context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

        const radius = 127.5;
        const x = 96;
        const y = 44;

        const memberURL = interaction.user.displayAvatarURL({ size: 512 });

        if (memberURL) {
            const member = await loadImage(memberURL);

            context.save();
            context.beginPath();
            context.arc(x + radius, y + radius, radius, 0, Math.PI * 2);
            context.closePath();
            context.clip();
            context.drawImage(member, x, y, 2 * radius, 2 * radius);
            context.restore();
        }

        const buffer = await canvas.encode("png");
        const attachment = new AttachmentBuilder(buffer, { name: "stonks.png" });

        const embed = createEmbed({
            color: hexToRgb(settings.colors.theme.success),
            title: `Stonks`,
            image: createEmbedAsset(`attachment://stonks.png`)
        });

        await interaction.reply({
            embeds: [embed], files: [ attachment ]
        });
    },
});