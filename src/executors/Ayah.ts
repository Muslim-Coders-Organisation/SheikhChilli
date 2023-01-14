import { BaseGuildTextChannel, CommandInteraction, Interaction, Message, MessageAttachment, MessageEmbed, MessagePayload, SnowflakeUtil, TextBasedChannelMixin, TextChannel } from "discord.js";
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from "fs";
import Command from "../classes/Command";
import { getRandomColorHex } from "../utils/hexRandomizer";
import { getChapterMetadata } from "../../data/quran/SurahMetadata";
import { getArabicVerse, getArabicVersesInChapter, getTranslatedVersesInChapter } from "../QuranAPIWrapper/Functions/Verses/verses";
import { ChapterNamesToNumberMap, ChapterNumbers } from "../QuranAPIWrapper/types/chapters/Chapters";

new Command("ayah", "Returns an ayah or a range of ayat from the Quran", "MEMBER", command, __filename, ["quran", "ayat"])
async function command(i: CommandInteraction) {
    if (i.options.getNumber("chapter") == null) return;
    const surah: number = i.options.getNumber("chapter") || 1;
    const verse: number = i.options.getNumber("verse") || 1;
    let endVerse: number | null = i.options.getNumber("end");
    // Check if the surah/verse are valid
    if (surah >= 115 || surah <= 0) {
        i.reply({
            ephemeral: true,
            content: "Surah is not within the valid range (1-114)"
        })
    }

    const SurahInfo = getChapterMetadata(surah)
    if (verse <= 0 || verse >= SurahInfo.totalVerses + 1) {
        i.reply({
            ephemeral: true,
            content: "The verse is not a valid number for this surah. The surah `" + SurahInfo.name + "` has `" + SurahInfo.totalVerses + "` verses"
        })
        return;
    }

    if (endVerse != null) {
        if (endVerse <= 0 || endVerse >= SurahInfo.totalVerses + 1) {
            endVerse = SurahInfo.totalVerses
        }

        if (endVerse < verse) {
            i.reply({
                ephemeral: true,
                content: "The end of the verse range is smaller than the starting verse. The surah `" + SurahInfo.name + "` has `" + SurahInfo.totalVerses + "` verses"
            })
            return;
        }
    }

    i.deferReply();

    const ArabicVerseContent = await getArabicVersesInChapter(surah as ChapterNumbers, "Uthmani")
    const EnglishVerseContent = await getTranslatedVersesInChapter(surah as ChapterNumbers, "Saheeh International")

    const embed = new MessageEmbed()
        .setTitle(SurahInfo.name + " - " + SurahInfo.arabicName)

    let content = "";
    for (let i = (verse - 1); i != (endVerse == undefined ? verse : endVerse); i++) {
        content += `${surah + ":" + (i + 1)}\n---------\n${ArabicVerseContent[i].text}\n${EnglishVerseContent[i].text}\n\n`
    }

    let fileName = __dirname + "/tmp/" + i.id + ".txt"
    if (content.length > 4096) {
        if (!existsSync(__dirname + "/tmp")) await mkdirSync(__dirname + "/tmp")
        await writeFileSync(fileName, content)
        embed.setDescription("Verse" + (endVerse == undefined ? (" `" + verse + "`") : ("s `" + verse + "-" + endVerse + "`")) + "of `" + SurahInfo.transliteration + "/" + SurahInfo.name + "`")
    } else {
        embed.setDescription("Verse" + (endVerse == undefined ? (" `" + verse + "`") : ("s `" + verse + "-" + endVerse + "`")) + "of `" + SurahInfo.transliteration + "/" + SurahInfo.name + "`\n\n```" + content + "```")
    }
    await new Promise(n => setTimeout(n, 500))

    try {
        if (content.length > 4096) {
            await i.editReply({
                embeds: [
                    embed
                ],
                files: [fileName]
            })
            unlinkSync(fileName)
        } else {
            i.editReply({
                embeds: [
                    embed
                ],
            })
        }
    } catch (e) { }
}