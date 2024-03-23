import { UserFlagsBitField } from "discord.js";
import { fileURLToPath } from 'url';
import path from 'path';
import { icon } from "./emojis.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const badgeFolder = path.join(__dirname, '..', '..', '..', 'assets', 'images', 'badges');

export async function mapBadges(flags: number[], outputFormat: 'emoji' | 'img') {
    const badgeMap: Record<number, string> = {
        [UserFlagsBitField.Flags.ActiveDeveloper]: outputFormat === 'emoji' ? `${icon(":s:activeDeveloper")}` : 'Active-Developer.png',
        [UserFlagsBitField.Flags.VerifiedDeveloper]: outputFormat === 'emoji' ? `${icon(":s:VerifiedDeveloper")}` : 'Verified-Developer.png',
        [UserFlagsBitField.Flags.HypeSquadOnlineHouse1]: outputFormat === 'emoji' ? `${icon(":s:hypesquadbravery")}` : 'Hypesquad-Bravery.png',
        [UserFlagsBitField.Flags.HypeSquadOnlineHouse2]: outputFormat === 'emoji' ? `${icon(":s:HypesquadBrilliance")}` : 'Hypesquad-Brilliance.png',
        [UserFlagsBitField.Flags.HypeSquadOnlineHouse3]: outputFormat === 'emoji' ? `${icon(":s:hypesquadbalance")}` : 'Hypesquad-Balance.png',
        [UserFlagsBitField.Flags.PremiumEarlySupporter]: outputFormat === 'emoji' ? `${icon(":s:earlysupporter")}` : 'Early-Supporter.png',
        [UserFlagsBitField.Flags.Hypesquad]: outputFormat === 'emoji' ? `${icon(":s:hypesquad")}` : 'Hypesquad',
        [UserFlagsBitField.Flags.BugHunterLevel1]: outputFormat === 'emoji' ? `${icon(":s:bughunter")}` : 'Bug-Hunter.png',
        [UserFlagsBitField.Flags.BugHunterLevel2]: outputFormat === 'emoji' ? `${icon(":s:goldenbughunter")}` : 'Golden-Bug-Hunter.png',
        [UserFlagsBitField.Flags.Partner]: outputFormat === 'emoji' ? `${icon(":s:partner")}` : 'Partner',
        [UserFlagsBitField.Flags.Staff]: outputFormat === 'emoji' ? `${icon(":s:discordstaff")}` : 'Discord-Staff.png',
        [UserFlagsBitField.Flags.CertifiedModerator]: outputFormat === 'emoji' ? `${icon(":s:discordmod")}` : 'Discord-Mod.png',
    };
    return flags.map((flag: number) => {
        const badgeValue = badgeMap[flag];
        if (badgeValue) {
            if (outputFormat === 'emoji') {
                return badgeValue;
            } else {
                return path.join(badgeFolder, badgeValue);
            }
        }
        return undefined;
    }).filter(Boolean);
}
