import Chapter from "../../Interfaces/chapters/Chapter";
import ChapterInfo from "../../Interfaces/chapters/ChapterInfo";
import RequestOptions from "../../Interfaces/misc/RequestOptions";
import {
  ChapterNames,
  ChapterNamesToNumberMap,
  ChapterNumbers,
} from "../../types/chapters/Chapters";
import UseQuranAPI from "../../Utilities/UseQuranAPI";

/**
 * @function chapter
 * @param x The chapter name or ID to get
 * @param r RequestOptions
 */
async function getChapter(
  x: ChapterNumbers | ChapterNames,
  r?: RequestOptions
): Promise<Chapter> {
  const i = typeof x == "string" ? ChapterNamesToNumberMap[x] : x;
  const body = await (
    await UseQuranAPI(
      "/chapters/" +
        i +
        "?language=" +
        (r != undefined && r.language != undefined ? r.language : "en")
    )
  ).json();
  return {
    id: body["chapter"]["id"],
    revelationaryOrder: body["chapter"]["revelation_order"],
    type:
      body["chapter"]["revelation_place"] == "makkah" ? "Meccan" : "Medinan",
    hasBismillah: body["chapter"]["bismillah_pre"],
    name: {
      english: {
        simple: body["chapter"]["name_simple"],
        complex: body["chapter"]["name_complex"],
      },
      arabic: body["chapter"]["name_arabic"],
      translated: {
        language: body["chapter"]["translated_name"]["language_name"],
        name: body["chapter"]["translated_name"]["name"],
      },
    },
  };
}

/**
 * @function getChapterInfo Returns the chapter information of the specified chapter
 * @param x The chapter name or ID to get
 * @param r RequestOptions
 */
async function getChapterInfo(
  x: ChapterNumbers | ChapterNames,
  r?: RequestOptions
): Promise<ChapterInfo> {
  const i = typeof x == "string" ? ChapterNamesToNumberMap[x] : x;
  const body = await (
    await UseQuranAPI(
      "/chapters/" +
        i +
        "/info" +
        "?language=" +
        (r != undefined && r.language != undefined ? r.language : "en")
    )
  ).json();
  return {
    chapter: body["chapter_info"]["chapter_id"],
    language: body["chapter_info"]["language_name"],
    information: {
      short: body["chapter_info"]["short_text"],
      base: body["chapter_info"]["text"],
      source: body["chapter_info"]["source"],
    },
  };
}

/**
 * @function listChapters Returns a chapter array with all chapters in the Qur'an
 * @param r RequestOptions
 */
async function listChapters(r?: RequestOptions): Promise<any> {
  const body = await (
    await UseQuranAPI(
      "/chapters" +
        "?language=" +
        (r != undefined && r.language != undefined ? r.language : "en")
    )
  ).json();
  let chapters: Chapter[] = [];
  body["chapters"].forEach((chapter: any) => {
    chapters.push({
      id: chapter["id"],
      revelationaryOrder: chapter["revelation_order"],
      type: chapter["revelation_place"] == "makkah" ? "Meccan" : "Medinan",
      hasBismillah: chapter["bismillah_pre"],
      name: {
        english: {
          simple: chapter["name_simple"],
          complex: chapter["name_complex"],
        },
        arabic: chapter["name_arabic"],
        translated: {
          language: chapter["translated_name"]["language_name"],
          name: chapter["translated_name"]["name"],
        },
      },
    });
  });
  return chapters;
}

export { getChapter, getChapterInfo, listChapters };
