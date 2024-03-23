import { Event } from "#base";
import { economyChat } from "#functions";
import { Message } from "discord.js";

new Event({
    name: "messagedelete",
    event: "messageDelete",
    run(message: Message) {
        economyChat.messageDelete(message);
    },
})