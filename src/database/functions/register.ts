import { db } from "../index.js";
import { User } from "discord.js";

export async function hasRegister(id: string) {
    const data = await db.members.findOne({ id });
    return !!data;
}

export async function createRegister({ username, id, guildId }: { username: string, id: string, guildId: string }) {
    const newUser = new db.members({ id, username, guildId });
    await newUser.save();
    return await db.members.findOne({ id });
}

export async function getRegister(user: User) {
    const data = await db.members.findOne({ id: user.id });
    if (data) return data;
    return await createRegister({ id: user.id, username: user.username, guildId: '' });
}