import { registerNewMember, economyChat, antilink,  } from "#functions";
import { Event } from "#base";

new Event({
    name: "messagecreate",
    event: "messageCreate",
    run(message) {
        const { member } = message;

        if (member) registerNewMember(member);

    // levelling.onMessage(message);
        economyChat.messageCreate(message);

        antilink(message);
    }
});