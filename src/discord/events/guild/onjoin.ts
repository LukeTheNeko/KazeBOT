import { registerNewMember, globalMessage } from "#functions";
import { Event } from "#base";

new Event({
    name: "onjoin",
    event: "guildMemberAdd",
    run(member) {
        registerNewMember(member);
        globalMessage({ member, action: "join" });
    },
});