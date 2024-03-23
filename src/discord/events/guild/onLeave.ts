import { globalMessage } from "#functions";
import { Event } from "#base";

new Event({
    name: "onleave",
    event: "guildMemberRemove",
    run(member) {
        globalMessage({ member, action: "leave" });
    },
});