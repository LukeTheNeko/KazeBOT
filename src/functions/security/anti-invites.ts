import { Message, EmbedBuilder } from "discord.js";
import { hexToRgb, toNull } from "@magicyan/discord";
import { settings } from "#settings";

const linkCountMap: Map<string, { count: number; timestamp: number }> = new Map();

export async function antilink(message: Message) {
  const { content, channel, member } = message;

  if (!message.guild || member?.id === message.guild.ownerId) return;

  const invite = "https://discord.gg/";

  if (!content.includes(invite)) return;

  const memberId = member?.id || "";
  const memberData = linkCountMap.get(memberId) || { count: 0, timestamp: 0 };

  const currentTime = Date.now();
  const timeDifference = currentTime - memberData.timestamp;

  if (timeDifference > 60000) {
    linkCountMap.set(memberId, { count: 1, timestamp: currentTime });
    return;
  }

  memberData.count += 1;
  linkCountMap.set(memberId, memberData);

  if (memberData.count >= 3) {
    member?.timeout(60000, "Postando muitos convites de servidor");
    return;
  }

  message.delete().catch(toNull);

  const embedMessage = await channel.send({
    embeds: [
      new EmbedBuilder({
        color: hexToRgb(settings.colors.theme.danger),
        description: "Não é permitido o envio de convites de outros servidores!",
        footer: {
          iconURL: message.guild.iconURL() || "",
          text: `Administração ${message.guild.name}`,
        },
      }),
    ],
  });

  setTimeout(() => {
    embedMessage.delete().catch(toNull);
  }, 15000);
}