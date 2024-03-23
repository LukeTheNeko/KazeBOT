import { brBuilder, createEmbed, createEmbedAsset, createRow } from "@magicyan/discord";
import { ButtonBuilder, ButtonStyle } from "discord.js";
import { icon } from "./emojis.js";

function hexToRgb(hex: string) {
    hex = hex.replace(/^#/, '');
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    return { r, g, b };
}

function randomHexColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

function generateNewColorAndEmbed() {
    let hexColor = randomHexColor();
    let rgbColor = hexToRgb(hexColor);
    const imgColor = `https://api.alexflipnote.dev/color/image/${hexColor.replace('#', '')}`;

    const newEmbed = createEmbed({
        color: hexColor,
        description: brBuilder(
            `**HEX:**`,
            `${hexColor}`,
            `**RGB:**`,
            `${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}`,
        ),
        thumbnail: createEmbedAsset(imgColor),
    });

    return newEmbed;
}

const row = createRow(
    new ButtonBuilder({
        customId: "color-refresh-button",
        style: ButtonStyle.Primary,
        emoji: icon("replay"),
    })
);

export function getRandomColorAndRow() {
    const newEmbed = generateNewColorAndEmbed();
    return { embed: newEmbed, row };
}