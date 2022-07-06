import { BaseGuildTextChannel, CommandInteraction, Interaction, Message, MessageAttachment, MessageEmbed, MessagePayload, SnowflakeUtil, TextBasedChannelMixin, TextChannel } from "discord.js";
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from "fs";
import { quran } from "../../data/quran/quran";
import { quran_data } from "../../data/quran/quran_data";
import Command from "../classes/Command";
import { getRandomColorHex } from "../utils/hexRandomizer";

new Command("ayah", "Returns an ayah or a range of ayat from the Quran", "MEMBER", command, __filename, ["quran", "ayat"])
async function command(i: CommandInteraction) {
    if (i.options.getNumber("chapter") == null) return;
    const surah: number = i.options.getNumber("chapter") || 1;
    const verse: number = i.options.getNumber("verse") || 1;
    const endVerse: number | null = i.options.getNumber("end");
    let verses: string[][] | null;
    if (endVerse != null) verses = rangeVerse(surah, verse, endVerse); //verses = rangeVerse(surah, verse, endVerse)
    else verses = singularVerse(surah, verse);

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
        for (let i = 0; i != verses.length; i++) {
            message = message + verses[i][1] + "\n " + verses[i][2] + "\n\n"
        }
    }

    if (message.length < 4096) {
        message = ">>> " + message
        let e = new MessageEmbed()
            .setColor(getRandomColorHex())
            .setTitle(quran_data[surah - 1].name + " - " + quran_data[surah - 1].transliteration)
        if (endVerse != null) e.setDescription("(" + verse + " to " + endVerse + ") \n\n" + message)
        else e.setDescription("(" + verse + ")" + "\n\n" + message)
        i.reply({embeds:[e]})
    } else {
        if (!existsSync(__dirname + "/tmp")) await mkdirSync(__dirname + "/tmp")
        let fileName = __dirname + "/tmp/" + i.id + ".txt"
        await writeFileSync(fileName, quran_data[surah - 1].name + " - " + quran_data[surah - 1].transliteration + "\n" + "(" + verse + " to " + endVerse + ") \n\n" + message)
        await i.reply({
            files: [fileName]
        })
        await unlinkSync(fileName)
    }
}

function singularVerse(s: number, v: number): retrievalReturnValue {
    if (s >= 115 || s <= 0) return null;
    if (quran_data[s - 1].total_verses < v) return null;
    return [[v.toString(), quran[s - 1]["verses"][v - 1].text, quran[s - 1]["verses"][v - 1].translation]  ]
}

function rangeVerse(s: number, v: number, ve: number): retrievalReturnValue {
    if (s >= 115 || s <= 0) return null;
    if (v > ve) return null;
    if (quran_data[s - 1].total_verses < ve) ve = quran_data[s - 1].total_verses;
    let returnValue = []
    for (let i = v - 1; i != ve; i++) {
        returnValue.push(
            [
                i.toString(),
                quran[s - 1]["verses"][i].text,
                quran[s - 1]["verses"][i].translation  
            ]
        )
    }
    

    return returnValue;
}

type retrievalReturnValue = string[][] | null;