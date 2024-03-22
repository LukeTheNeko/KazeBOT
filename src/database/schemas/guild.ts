import { Schema } from "mongoose";
import { t } from "../utils.js";

const channelInfo = new Schema({ id: t.string, url: { type: String, default: false } }, { _id: false });

export const guildSchema = new Schema(
    {
        id: t.string,
        channels: {
            global: channelInfo,
            logs: channelInfo,
            audit: channelInfo,
            voicechannel: channelInfo,
        },
        roles: {
            member: channelInfo,
            staff: channelInfo,
        }
    },
    {
        statics: {
            async get(id: string) {
                return await this.findOne({ id }) ?? this.create({ id });
            }
        }
    }
);