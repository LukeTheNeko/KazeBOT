import { db, getRegister } from "../index.js";
import { User } from "discord.js";

type ManageCoinsAction = "add" | "remove";

export async function manageCoins(user: User, amount: number, action: ManageCoinsAction = "add") {
    const userData = await getRegister(user);

    if (!userData) {
        throw new Error("User data not found");
    }

    const currentCoins = userData.wallet?.coins || 0;
    const newCoins = action == "add" ? currentCoins + amount : currentCoins - amount;

    await db.members.updateOne({ id: user.id }, { $set: { "wallet.coins": newCoins } });
}