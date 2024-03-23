import { ApplicationCommandType, ApplicationCommandOptionType, AttachmentBuilder } from "discord.js";
import { Canvas, loadImage } from "@napi-rs/canvas";
import { Command } from "#base";
import { createEmbed, createEmbedAsset, hexToRgb } from "@magicyan/discord";
import { settings } from "#settings";
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

new Command({
    name: "profission",
    description: "🍰 Vergonha da profissão",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "membro",
            description: "Membro um que é vergonha da profissão.",
            type: ApplicationCommandOptionType.User,
            required
        },
    ],
    async run(interaction) {
        const canvas = new Canvas(960, 660);
        const context = canvas.getContext("2d");
        const imgFolder = path.join(__dirname, '..', '..', '..', '..', 'assets', 'images', 'memes');
        const imgProfission = 'profission.png';
        const backgroundImage = await loadImage(path.join(imgFolder, imgProfission));
        context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

        const radius0 = 140;
        const x0 = 528;
        const y0 = 44;

        const radius1 = 85;
        const x1 = 142;
        const y1 = 99;

        const member1URL = interaction.user.displayAvatarURL({ size: 512 });
        const memberURL = interaction.options.getUser("membro")?.displayAvatarURL({ size: 512 });

        if (memberURL) {
            const member = await loadImage(memberURL);

            context.save();
            context.beginPath();
            context.arc(x0 + radius0, y0 + radius0, radius0, 0, Math.PI * 2);
            context.closePath();
            context.clip();
            context.drawImage(member, x0, y0, 2 * radius0, 2 * radius0);
            context.restore();
        }

        if (member1URL) {
            const member1 = await loadImage(member1URL);

            context.save();
            context.beginPath();
            context.arc(x1 + radius1, y1 + radius1, radius1, 0, Math.PI * 2);
            context.closePath();
            context.clip();
            context.drawImage(member1, x1, y1, 2 * radius1, 2 * radius1);
            context.restore();
        }

        const buffer = await canvas.encode("png");
        const attachment = new AttachmentBuilder(buffer, { name: "profission.png" });

        const nick1 = interaction.options.getUser("membro")?.displayName ?? "";

        const embed = createEmbed({
            color: hexToRgb(settings.colors.theme.darkpurple),
            title: `${nick1} é a vergonha da profissão.`,
            image: createEmbedAsset(`attachment://profission.png`)
        });

        await interaction.reply({
            embeds: [embed], files: [ attachment ]
        });
    },
});