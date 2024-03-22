import { Event } from "#base";
import { antiFloodCall } from "#functions";

new Event({
    name: "antifloodcall",
    event: "voiceStateUpdate",
    run(oldState, newState) {
        antiFloodCall(oldState, newState);
    },
});