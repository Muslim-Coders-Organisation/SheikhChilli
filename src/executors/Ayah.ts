import { BaseGuildTextChannel, CommandInteraction, Interaction, Message, MessageAttachment, MessageEmbed, MessagePayload, SnowflakeUtil, TextBasedChannelMixin, TextChannel } from "discord.js";
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from "fs";
import Command from "../classes/Command";
import QuranUtils from "../database/IndirectUtils";
import { getDatabase } from "../init";
import { getRandomColorHex } from "../utils/hexRandomizer";

new Command("ayah", "Returns an ayah or a range of ayat from the Quran", "MEMBER", command, __filename, ["quran", "ayat"])
async function command(i: CommandInteraction) {
    const qutils = new QuranUtils(getDatabase())

    if (i.options.getNumber("chapter") == null) return;
    const surah: number = i.options.getNumber("chapter") || 1;
    const verse: number = i.options.getNumber("verse") || 1;
    const endVerse: number | null = i.options.getNumber("end");
    const includeTransliteration: boolean | null = i.options.getBoolean("include_transliteration")
    let verses: string[][] | null;
    if (endVerse != null) verses = await rangeVerse(surah, verse, endVerse, includeTransliteration || false);
    else verses = await singularVerse(surah, verse, includeTransliteration || false);

    let message: string;

    if (verses == null) {
        message = "Error while getting verse " + verse + " from chapter " + surah + ". Maybe it doesn't exist?"
        let e = new MessageEmbed()
            .setTitle("Error")
            .setDescription(message)
        i.reply({ embeds: [e] })
        return;
    } else {
        message = ""
        if (includeTransliteration) {
            for (let i = 0; i != verses.length; i++) {
                message = message + verses[i][1] + "\n " + verses[i][2] + "\n_" + verses[i][3] + "_\n\n"
            }
        } else {
            for (let i = 0; i != verses.length; i++) {
                message = message + verses[i][1] + "\n " + verses[i][2] + "\n\n"
            }
        }

    }

    const SurahMetadata = await qutils.getSurahMetadata(surah)
    const QuranVerses = await qutils.getSurahVerses(surah)

    if (message.length < 4096) {
        message = ">>> " + message
        let e = new MessageEmbed()
            .setColor(getRandomColorHex())
            .setTitle(SurahMetadata.nameEnglish + " - " + SurahMetadata.nameTransliteration)
        if (endVerse != null) e.setDescription("(" + verse + " to " + endVerse + ") \n\n" + message)
        else e.setDescription("(" + verse + ")" + "\n\n" + message)
        i.reply({ embeds: [e] })
    } else {
        if (!existsSync(__dirname + "/tmp")) await mkdirSync(__dirname + "/tmp")
        let fileName = __dirname + "/tmp/" + i.id + ".txt"
        await writeFileSync(fileName, SurahMetadata.nameEnglish + " - " + SurahMetadata.nameTransliteration + "\n" + "(" + verse + " to " + endVerse + ") \n\n" + message)
        await i.reply({
            files: [fileName]
        })
        await unlinkSync(fileName)
    }
}

async function singularVerse(s: number, v: number, tr: boolean): Promise<RetrievalReturnValue> {
    const qutils = new QuranUtils(getDatabase())
    const SurahMetadata = await qutils.getSurahMetadata(s)
    const QuranVerses = await qutils.getSurahVersesRange(s, v, v)
    if (s >= 115 || s <= 0) return null;
    if (SurahMetadata.verseCount < v) return null;
    if (!tr) return [[v.toString(), QuranVerses.verses[0].verseContentArabic, QuranVerses.verses[0].verseContentEnglish]]
    else return [[v.toString(), QuranVerses.verses[0].verseContentArabic, QuranVerses.verses[0].verseContentEnglish, QuranVerses.verses[0].verseContentTransliteration]]
}

async function rangeVerse(s: number, v: number, ve: number, tr: boolean): Promise<RetrievalReturnValue> {
    const qutils = new QuranUtils(getDatabase())
    const SurahMetadata = await qutils.getSurahMetadata(s)
    const QuranVerses = await qutils.getSurahVersesRange(s, v, ve)

    if (s >= 115 || s <= 0) return null;
    if (v > ve) return null;

    if (SurahMetadata.verseCount < ve) ve = SurahMetadata.verseCount;
    let returnValue = []
    for (let i = v - 1; i != ve; i++) {
        if (!tr) {
            returnValue.push(
                [
                    i.toString(),
                    QuranVerses.verses[i].verseContentArabic,
                    QuranVerses.verses[i].verseContentEnglish
                ]
            )
        } else {
            returnValue.push(
                [
                    i.toString(),
                    QuranVerses.verses[i].verseContentArabic,
                    QuranVerses.verses[i].verseContentTransliteration,
                    QuranVerses.verses[i].verseContentEnglish
                ]
            )
        }
    }


    return returnValue;
}

type RetrievalReturnValue = string[][] | null;