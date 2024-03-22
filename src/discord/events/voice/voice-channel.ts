import { ChannelType, EmbedBuilder, formatEmoji, spoiler, userMention } from "discord.js";
import { log, settings } from "#settings";
import { Event } from "#base";
import { hexToRgb } from "@magicyan/discord";
import { db } from "#database";

new Event({
    name: "voice-channel",
    event: "voiceStateUpdate",
    async run(oldState, newState) {
        const { guild, channel, member } = oldState;

        const guildData = await db.guilds.get(guild.id);
        if (!guildData) return;

        const voiceChannelId = guildData.channels?.voicechannel?.id || "";
        const voiceChannel = guild.channels.cache.get(voiceChannelId);

        if (!voiceChannel?.isVoiceBased()) return;
        if (!member) return;

        if (channel
            && newState.channelId !== channel.id
            && channel.parentId == voiceChannel.parentId
            && channel.name.includes(member.displayName)
        ) {
            channel.delete().catch(log.error);
        }

        if (newState.channelId == voiceChannelId) {

            if (channel?.parentId == voiceChannel.parentId) {
                member?.voice.disconnect();
                return;
            }

            guild.channels.create({
                name: `${member.displayName}`,
                parent: voiceChannel.parentId,
                type: ChannelType.GuildVoice,
                permissionOverwrites: [
                    { id: member.id, allow: ["Connect"] },
                    { id: guild.id, allow: ["Connect"] },
                ]
            })
                .then(voiceChannel => {
                    member.voice.setChannel(voiceChannel);

                    const emoji = formatEmoji(settings.emojis.icons.check);

                    voiceChannel.send({
                        content: spoiler(userMention(member.id)),
                        embeds: [new EmbedBuilder({
                            color: hexToRgb(settings.colors.theme.success),
                            description: `${emoji} Sua sala foi criada com sucesso!`
                        })]
                    });
                })
                .catch((err) => {
                    member.voice.disconnect();
                    log.error(err);
                });
        }
    },
});