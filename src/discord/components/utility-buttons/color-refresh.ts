import { Component } from "#base";
import { getRandomColorAndRow } from "#functions";
import { ComponentType } from "discord.js";

new Component({
    customId: "color-refresh-button",
    type: ComponentType.Button,
    cache: "cached",
    async run(interaction) {
        const { embed, row } = getRandomColorAndRow();
        await interaction.update({ embeds: [embed], components: [row] });
    },
});