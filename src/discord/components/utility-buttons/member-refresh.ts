import { Component } from "#base";
import { getRandomMember } from "#functions";
import { ComponentType } from "discord.js";

new Component({
    customId: "member-refresh-button",
    type: ComponentType.Button,
    cache: "cached",
    async run(interaction) {
        const { embed, row } = getRandomMember(interaction.guild);
        await interaction.update({ embeds: [embed], components: [row] });
    },
});