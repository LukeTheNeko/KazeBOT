import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import { Command } from "#base";

function encodeToMorse(text: string): string {
    const morseCode: Record<string, string> = {
        'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.',
        'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---',
        'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---',
        'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-',
        'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--',
        'Z': '--..', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
        '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
        '0': '-----', ' ': ' '
    };

    return text.toUpperCase().split('').map(char => morseCode[char] || ' ').join(' ');
}

function decodeFromMorse(morseText: string): string {
    const morseCodeReverse: Record<string, string> = {
        '.-': 'a', '-...': 'b', '-.-.': 'c', '-..': 'd', '.': 'e',
        '..-.': 'f', '--.': 'g', '....': 'h', '..': 'i', '.---': 'j',
        '-.-': 'k', '.-..': 'l', '--': 'm', '-.': 'n', '---': 'o',
        '.--.': 'p', '--.-': 'q', '.-.': 'r', '...': 's', '-': 't',
        '..-': 'u', '...-': 'v', '.--': 'w', '-..-': 'x', '-.--': 'y',
        '--..': 'z', '.----': '1', '..---': '2', '...--': '3', '....-': '4',
        '.....': '5', '-....': '6', '--...': '7', '---..': '8', '----.': '9',
        '-----': '0', ' ': ' '
    };

    return morseText.split(' ').map(morseChar => morseCodeReverse[morseChar] || ' ').join('');
}

new Command({
    name: "morce",
    description: "Codifica ou decodifica um texto de Morse",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "codifica",
            description: "🔣 Codifica para Morse.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "texto",
                    description: "Texto para codificar.",
                    type: ApplicationCommandOptionType.String,
                    required
                },
            ],
        },
        {
            name: "decodifica",
            description: "🔠 Decodifica de Morse.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "texto",
                    description: "Texto para decodificar.",
                    type: ApplicationCommandOptionType.String,
                    required
                },
            ],
        },
    ],
    async run(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const texto = interaction.options.getString("texto");
    
        switch (subcommand) {
            case "codifica":
                if (texto) {
                    const morseCode = encodeToMorse(texto);
                    await interaction.reply(`Texto codificado em Morse: \n\n${morseCode}`);
                }
                break;
            case "decodifica":
                if (texto) {
                    const decodedText = decodeFromMorse(texto);
                    await interaction.reply(`Texto decodificado de Morse: \n\n${decodedText}`);
                }
                break;
            default:
                break;
        }
    }
});