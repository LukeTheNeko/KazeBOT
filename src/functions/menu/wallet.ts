import { EmbedBuilder, User } from "discord.js";
import { createEmbedAuthor, createRow, hexToRgb } from "@magicyan/discord";
import { ButtonBuilder, ButtonStyle } from "discord.js";
import { settings } from "#settings";
import { icon } from "../utils/emojis.js";

interface UserData {
    id: string;
    guildId: string;
    wallet?: {
        coins: number;
    } | null;
}

export function getWalletMenu(user: User, userData: UserData): { embed: EmbedBuilder, row: any } {
    const currentCoins = userData.wallet?.coins || 0;

    const embed = new EmbedBuilder({
        author: createEmbedAuthor({ user, prefix: "🪙 Carteira de " }),
        color: hexToRgb(settings.colors.theme.darkpurple),
        description: `${user} tem \`${currentCoins}\` moedas na carteira`,
        footer: { text: user.id }
    });

    const row = createRow(
        new ButtonBuilder({
            customId: "wallet-refresh-button",
            label: "Atualizar",
            style: ButtonStyle.Success,
            emoji: icon("replay"),
        })
    );

    return { embed, row };
}

export function getWalletCoins(userData: UserData): number {
    const currentCoins = userData.wallet?.coins || 0;
    return currentCoins;
}