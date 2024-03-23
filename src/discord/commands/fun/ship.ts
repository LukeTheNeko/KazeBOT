import { ApplicationCommandType, ApplicationCommandOptionType, AttachmentBuilder, formatEmoji } from "discord.js";
import { Canvas, loadImage } from "@napi-rs/canvas";
import { Command } from "#base";
import { settings } from "#settings";
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

new Command({
    name: "ship",
    description: "😻 Check if your dream couple would work.",
    descriptionLocalizations: { "pt-BR": "😻 Sippar um casal." },
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "member1",
            nameLocalizations: { "pt-BR": "membro1" },
            description: "The user that you want to ship.",
            descriptionLocalizations: { "pt-BR": "Membro um que você quer shipar." },
            type: ApplicationCommandOptionType.User,
            required
        },
        {
            name: "member2",
            nameLocalizations: { "pt-BR": "membro2" },
            description: "The user that you want to ship.",
            descriptionLocalizations: { "pt-BR": "Membro um que você quer shipar." },
            type: ApplicationCommandOptionType.User,
            required
        },
    ],
    async run(interaction) {
        const canvas = new Canvas(610, 200);
        const context = canvas.getContext("2d");
        const imgFolder = path.join(__dirname, '..', '..', '..', '..', 'assets', 'images', 'ship');
        const archives = await fs.readdir(imgFolder);
        const imgRandom = archives[Math.floor(Math.random() * archives.length)];
        const backgroundImage = await loadImage(path.join(imgFolder, imgRandom));

        context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

        const x = 15;
        const y = 13;
        const width = 580;
        const height = 172;
        const opacity = 0.4;
        const rectangleColor = "#000000";

        context.globalAlpha = opacity;
        context.fillStyle = rectangleColor;
        context.beginPath();
        context.moveTo(x + 10, y);
        context.arcTo(x + width, y, x + width, y + height, 25);
        context.arcTo(x + width, y + height, x, y + height, 25);
        context.arcTo(x, y + height, x, y, 25);
        context.arcTo(x, y, x + width, y, 25);
        context.closePath();
        context.fill();
        context.globalAlpha = 1;

        const radius = 157 / 2;
        const heartPath = path.join(__dirname, '..', '..', '..', '..', 'assets', 'images', 'icons', 'heart.png');
        const heartBuffer = await fs.readFile(heartPath);
        const heart = await loadImage(heartBuffer);
        const centerX = canvas.width / 2 - heart.width / 2;
        const centerY = canvas.height / 2 + 10 - heart.height / 2;

        context.drawImage(heart, centerX, centerY);

        const borderWidth = 1;
        const circleRadius = radius + borderWidth;

        const member1URL = interaction.options.getUser("member1")?.displayAvatarURL({ size: 512 });
        if (member1URL) {
            const member1 = await loadImage(member1URL);
            context.save();
            context.beginPath();
            context.arc(45 + radius, 20 + radius, circleRadius, 0, Math.PI * 2);
            context.fillStyle = "#ffffff";
            context.fill();
            context.beginPath();
            context.arc(45 + radius, 20 + radius, radius, 0, Math.PI * 2);
            context.closePath();
            context.clip();
            context.drawImage(member1, 45, 20, 2 * radius, 2 * radius);
            context.restore();
        }

        const member2URL = interaction.options.getUser("member2")?.displayAvatarURL({ size: 512 });
        if (member2URL) {
            const member2 = await loadImage(member2URL);
            context.save();
            context.beginPath();
            context.arc(407 + radius, 20 + radius, circleRadius, 0, Math.PI * 2);
            context.fillStyle = "#ffffff";
            context.fill();
            context.beginPath();
            context.arc(407 + radius, 20 + radius, radius, 0, Math.PI * 2);
            context.closePath();
            context.clip();
            context.drawImage(member2, 407, 20, 2 * radius, 2 * radius);
            context.restore();
        }

        const percentage = calculatePercentage();
        const text = `${percentage.toFixed(0)}%`;

        context.font = `bold 45px Arial`;
        context.fillStyle = "#ffffff";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(text, canvas.width / 2, canvas.height / 2);

        const buffer = await canvas.encode("png");
        const attachment = new AttachmentBuilder(buffer, { name: "ship.png" });
        const nick1 = interaction.options.getUser("member1")?.displayName ?? "";
        const nick2 = interaction.options.getUser("member2")?.displayName ?? "";
        const metadeNick1 = nick1.substring(0, Math.ceil(nick1.length / 2));
        const metadeNick2 = nick2.substring(Math.floor(nick2.length / 2));
        const emoji = formatEmoji(settings.emojis.icons.catheart);

        const textMessages = [
            `${emoji} **|** O Nome do ship é **${metadeNick1}${metadeNick2}**`,
            `${emoji} **|** A chance do casal **${nick1}** + **${nick2}** é de **${percentage.toFixed(0)}%**`
        ];

        await interaction.reply({
            content: textMessages.join("\n"),
            files: [attachment],
            embeds: [{
                title: `A chance do casal é de: ${percentage.toFixed(0)}%`,
                color: parseInt("b103fc", 16),
                image: {
                    url: `attachment://ship.png`
                }
            }]
        });
    },
});

function calculatePercentage() {
    return Math.floor(Math.random() * 101);
}