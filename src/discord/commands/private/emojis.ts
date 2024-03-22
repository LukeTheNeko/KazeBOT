import { Command } from "#base";
import { ApplicationCommandOptionType, ApplicationCommandType, AttachmentBuilder } from "discord.js";

new Command({
    name: "emojis",
    description: "Comando de emojis",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    defaultMemberPermissions: ["Administrator"],
    options: [
        {
            name: "servidor",
            description: "🔥 Obter todos os emojis do servidor",
            type: ApplicationCommandOptionType.Subcommand,
        },
    ],
    async run(interaction){
        const { options, guild } = interaction;

        const subcommand = options.getSubcommand(true);

        interface Emojis {
            static: Record<string, string>;
            animated: Record<string, string>;
        }
        const emojis: Emojis = { static: {}, animated: {} };

        switch(subcommand){
            case "servidor":{
                const emojisCache = guild.emojis.cache

                for(const { name, id, animated } of emojisCache.values()){
                    if (!name) continue;
                    emojis[animated ? "animated":"static"][name] = id;
                }

                const buffer = Buffer.from(JSON.stringify(emojis, null, 2), "utf-8");
                const attachment = new AttachmentBuilder(buffer, { name: "emojis.json" });

                interaction.reply({
                    ephemeral, files: [attachment],
                    content: `Emojis do ${subcommand}`
                });
            } 
        }
    }
});