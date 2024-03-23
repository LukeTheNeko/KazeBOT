import { Message, PartialMessage } from "discord.js";
import { manageCoins } from "#database";
import { randomNumber } from "@magicyan/discord";

const userInCooldown: Set<string> = new Set();

const regex = /\b(?:([a-zA-Z0-9])\1{3,}|[a-zA-Z0-9]{1,2})\b/;

export const economyChat = {
    messageCreate(message: Message) {
        const { author: user, content } = message;

        if (user.bot || userInCooldown.has(user.id) || regex.test(content)) {
            return;
        }

        const randomCoins = randomNumber(5, 20);
        manageCoins(user, randomCoins);

        userInCooldown.add(user.id);
        setTimeout(() => userInCooldown.delete(user.id), 60000);
    },
    messageDelete(message: Message | PartialMessage) {
        const { author: user } = message;

        if (!user || user.bot) return;

        manageCoins(user, 10, "remove");
    }
};