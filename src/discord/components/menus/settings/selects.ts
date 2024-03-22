import { Component } from "#base";
import { db } from "#database";
import { menus } from "#menus";
import { findRole } from "@magicyan/discord";
import { ComponentType } from "discord.js";

new Component({
    customId: "menu/settings/:menu/:[args]",
    type: ComponentType.ActionRow, cache: "cached",
    async run(interaction, { menu, args }) {
        if (!interaction.isAnySelectMenu()) return;

        const { values, guild } = interaction;

        await interaction.deferUpdate();

        const guildData = await db.guilds.get(guild.id);

        switch(menu){
            case "channels":{
                const [channelName] = values;
                interaction.editReply(menus.settings.channels.submenu(guildData, channelName));
                return;
            }
            case "channel":{
                const [channelName] = args;
                const [channelId] = values;
            
                const channel = guild.channels.cache.get(channelId);
                
                if (channel) {
                    const id = channel.id;
                    const url = channel.isTextBased() || channel.isVoiceBased() ? `https://discord.com/channels/${guild.id}/${channel.id}` : null;
            
                    await guildData.$set(`channels.${channelName}`, { id, url }).save();
            
                    interaction.editReply(menus.settings.channels.main(guildData));
                    return;
                }
            
                interaction.editReply("Canal não encontrado.");
                return;
            }
            case "roles":{
                const [roleName] = values;
                interaction.editReply(menus.settings.roles.submenu(guildData, roleName));
                return;
            }
            case "role":{
                const [roleName] = args;
                const [roleId] = values;
            
                const { id } = findRole(guild).byId(roleId)!;
            
                await guildData.$set(`roles.${roleName}`, { id, }).save();
            
                interaction.editReply(menus.settings.roles.main(guildData));
                return;
            }
        }
    },
});