import RequestOptions from "../../Interfaces/misc/RequestOptions";
import ArabicVerseContent from "../../Interfaces/verses/ArabicVerseContent";
import TranslatedVerseContent from "../../Interfaces/verses/TranslatedVerseContent";
import Verse from "../../Interfaces/verses/Verse";
import {
  ChapterNames,
  ChapterNamesToNumberMap,
  ChapterNumbers,
} from "../../types/chapters/Chapters";
import { JuzNamesToNumberMap, JuzNumbers, Juzs } from "../../types/juz/Juzs";
import ChapterVerse from "../../types/pathparams/ChapterVerse";
import ArabicScriptures from "../../types/scriptures/ScriptureTypes";
import {
  Translations,
  TranslationsMap,
  TranslationsType,
} from "../../types/translations/translations";
import FilterHTMLTags from "../../Utilities/FilterHTMLTags";
import UseQuranAPI from "../../Utilities/UseQuranAPI";

/**
 * @function getTranslatedVerse Returns the verse specified with the translation specified
 * @param x The verse in a surah:number format (ex. 10:5)
 * @param tr The translation type (Defaults to Saheeh International)
 * @param r RequestOptions
 */
async function getTranslatedVerse(
  x: string | ChapterVerse,
  tr: TranslationsType = "Saheeh International",
  r?: RequestOptions
): Promise<TranslatedVerseContent | undefined> {
  if (typeof x == "string")
    if (!/[1-9]?[1-9]?[1-9]?:[1-9]?[1-9]?[1-9]/.test(x))
      throw new Error(
        "Invalid verse context passed into getTranslatedVerse(). Expected SURAH:VERSE-like parameter"
      );

  let sv = typeof x == "string" ? x : x.chapter + ":" + x.verse;
  const body = await (
    await UseQuranAPI(
      "/quran/translations/" +
      TranslationsMap[tr] +
      "?verse_key=" +
      sv +
      "&language=" +
      (r != undefined && r.language != undefined ? r.language : "en")
    )
  ).json();
  if (body["translations"].length == 0) {
    return undefined;
  } else {
    let language_: string;
    Object.keys(Translations).forEach((lang: string) => {
      //@ts-ignore
      Translations[lang].includes(tr) ? (language_ = lang) : false;
    });
    return {
      text: FilterHTMLTags(body["translations"][0]["text"]),
      translation: tr,
      surah: parseInt(sv.split(":")[0]),
      number: parseInt(sv.split(":")[1]),
      //@ts-ignore
      language: language_,
    };
  }
}

/**
 * @function getArabicVerse Returns the verse specified with the translation specified
 * @param x The verse in a surah:number format (ex. 10:5)
 * @param sc Scripture (Defaults to Uthmani)
 * @param r RequestOptions
 */
async function getArabicVerse(
  x: string | ChapterVerse,
  sc: ArabicScriptures = "Uthmani",
  r?: RequestOptions
): Promise<ArabicVerseContent | undefined> {
  if (typeof x == "string")
    if (!/[1-9]?[1-9]?[1-9]?:[1-9]?[1-9]?[1-9]/.test(x))
      throw new Error(
        "Invalid verse context passed into getArabicVerse(). Expected SURAH:VERSE-like parameter"
      );

  let scripture;
  switch (sc) {
    case "Uthmani":
      scripture = "uthmani";
    case "Uthmani-Simple":
      scripture = "uthmani_simple";
    case "Imlaei":
      scripture = "imlaei";
    case "Imlaei-Simple":
      scripture = "imlaei_simple";
    case "Indopak":
      scripture = "indopak";
    default:
      scripture = "uthmani";
  }
  let sv = typeof x == "string" ? x : x.chapter + ":" + x.verse;
  const body = await (
    await UseQuranAPI(
      "/quran/verses/" +
      scripture +
      "?verse_key=" +
      sv +
      "&language=" +
      (r != undefined && r.language != undefined ? r.language : "en")
    )
  ).json();
  if (body["verses"].length == 0) {
    return undefined;
  } else
    return {
      text: body["verses"][0]["text_" + scripture],
      scripture: sc,
      surah: parseInt(sv.split(":")[0]),
      number: parseInt(sv.split(":")[1]),
    };
}

/**
 * @function getTranslatedVersesInChapter Returns the translations within a certain chapter
 * @param c The chapter (ex. 1 or "Al-Fathihah")
 * @param tr The translation type (Defaults to Saheeh International)
 * @param r RequestOptions
 * @note The surah and verse of the elements within the arrays are counted via the loop index. The Quran.com API does not return these values
 */
async function getTranslatedVersesInChapter(
  c: ChapterNumbers | ChapterNames,
  tr: TranslationsType = "Saheeh International",
  r?: RequestOptions
) {
  let chapter = typeof c == "number" ? c : ChapterNamesToNumberMap[c];
  const body = await (
    await UseQuranAPI(
      "/quran/translations/" +
      TranslationsMap[tr] +
      "?chapter_number=" +
      chapter +
      "&language=" +
      (r != undefined && r.language != undefined ? r.language : "en")
    )
  ).json();
  let verses: TranslatedVerseContent[] = [];
  let language: string;
  Object.keys(Translations).forEach((lang: string) => {
    //@ts-ignore
    Translations[lang].includes(tr) ? (language = lang) : false;
  });
  body["translations"].forEach((verse: any, i: number) => {
    verses.push({
      text: FilterHTMLTags(verse["text"]),
      translation: tr,
      surah: chapter,
      number: i + 1,
      language: language,
    });
  });
  return verses;
}

/**
 * @function getArabicVersesInChapter Returns the verses within a certain chapter
 * @param c The chapter (ex. 1 or "Al-Fathihah")
 * @param sc Scripture (Defaults to Uthmani)
 * @param r RequestOptions
 * @note The surah and verse of the elements within the arrays are counted via the loop index. The Quran.com API does not return these values
 */
async function getArabicVersesInChapter(
  c: ChapterNames | ChapterNumbers,
  sc: ArabicScriptures = "Uthmani",
  r?: RequestOptions
): Promise<ArabicVerseContent[]> {
  let chapter = typeof c == "number" ? c : ChapterNamesToNumberMap[c];
  let scripture: string;
  switch (sc) {
    case "Uthmani":
      scripture = "uthmani";
    case "Uthmani-Simple":
      scripture = "uthmani_simple";
    case "Imlaei":
      scripture = "imlaei";
    case "Imlaei-Simple":
      scripture = "imlaei_simple";
    case "Indopak":
      scripture = "indopak";
    default:
      scripture = "uthmani";
  }
  const body = await (
    await UseQuranAPI(
      "/quran/verses/" +
      scripture +
      "?chapter_number=" +
      chapter +
      "&language=" +
      (r != undefined && r.language != undefined ? r.language : "en")
    )
  ).json();
  let verses: ArabicVerseContent[] = [];
  body["verses"].forEach((verse: any, i: number) => {
    verses.push({
      text: verse["text_" + scripture],
      scripture: sc,
      surah: chapter,
      number: i + 1,
    });
  });
  return verses;
}

/**
 * @function getTranslatedVersesInJuz Returns the translations of verses within a certain Juz
 * @param j The Juz to get the verses of
 * @param tr The translation type (Defaults to Saheeh International)
 * @param r RequestOptions
 * @note The surah and verse of the elements within the arrays are undefined. The Quran.com API does not return these values
 */
async function getTranslatedVersesInJuz(
  j: Juzs | JuzNumbers,
  tr: TranslationsType = "Saheeh International",
  r?: RequestOptions
): Promise<TranslatedVerseContent[]> {
  let juz = typeof j == "number" ? j : JuzNamesToNumberMap[j];
  const body = await (
    await UseQuranAPI(
      "/quran/translations/" +
      TranslationsMap[tr] +
      "?juz_number=" +
      juz +
      "&language=" +
      (r != undefined && r.language != undefined ? r.language : "en")
    )
  ).json();
  let verses: TranslatedVerseContent[] = [];
  let language: string;
  Object.keys(Translations).forEach((lang: string) => {
    //@ts-ignore
    Translations[lang].includes(tr) ? (language = lang) : false;
  });
  body["translations"].forEach((verse: any) => {
    verses.push({
      text: FilterHTMLTags(verse["text"]),
      translation: tr,
      surah: undefined,
      number: undefined,
      language: language,
    });
  });
  return verses;
}

/**
 * @function getArabicVerseInJuz Returns the verses within a certain Juz
 * @param j The Juz to get the verses of
 * @param sc Scripture (Defaults to Uthmani)
 * @param r RequestOptions
 * @note The surah and verse of the elements within the arrays are undefined. The Quran.com API does not return these values
 */
async function getArabicVersesInJuz(
  j: JuzNumbers | Juzs,
  sc: ArabicScriptures = "Uthmani",
  r?: RequestOptions
): Promise<ArabicVerseContent[]> {
  let juz = typeof j == "number" ? j : JuzNamesToNumberMap[j];
  let scripture: string;
  switch (sc) {
    case "Uthmani":
      scripture = "uthmani";
    case "Uthmani-Simple":
      scripture = "uthmani_simple";
    case "Imlaei":
      scripture = "imlaei";
    case "Imlaei-Simple":
      scripture = "imlaei_simple";
    case "Indopak":
      scripture = "indopak";
    default:
      scripture = "uthmani";
  }
  const body = await (
    await UseQuranAPI(
      "/quran/verses/" +
      scripture +
      "?juz_number=" +
      juz +
      "&language=" +
      (r != undefined && r.language != undefined ? r.language : "en")
    )
  ).json();
  let verses: ArabicVerseContent[] = [];
  body["verses"].forEach((verse: any) => {
    verses.push({
      text: verse["text_" + scripture],
      scripture: sc,
      surah: undefined,
      number: undefined,
    });
  });
  return verses;
}

/**
 * @function getTranslatedVersesInPage Returns the verses within a certain page
 * @param p The page to get the verses of
 * @param tr The translation type (Defaults to Saheeh International)
 * @param r RequestOptions
 * @note The surah and verse of the elements within the arrays are undefined. The Quran.com API does not return these values
 */
async function getTranslatedVersesInPage(
  p: number,
  tr: TranslationsType = "Saheeh International",
  r?: RequestOptions
): Promise<TranslatedVerseContent[] | undefined> {
  if (p < 0 || p > 604) return undefined;
  const body = await (
    await UseQuranAPI(
      "/quran/translations/" +
      TranslationsMap[tr] +
      "?page_number=" +
      p +
      "&language=" +
      (r != undefined && r.language != undefined ? r.language : "en")
    )
  ).json();
  let verses: TranslatedVerseContent[] = [];
  let language: string;
  Object.keys(Translations).forEach((lang: string) => {
    //@ts-ignore
    Translations[lang].includes(tr) ? (language = lang) : false;
  });
  body["translations"].forEach((verse: any) => {
    verses.push({
      text: FilterHTMLTags(verse["text"]),
      translation: tr,
      surah: undefined,
      number: undefined,
      language: language,
    });
  });
  return verses;
}

/**
 * @function getArabicVersesInPage Returns the verses within a certain page
 * @param p The page to get the verses of
 * @param sc Scripture (Defaults to Uthmani)
 * @param r RequestOptions
 * @note The surah and verse of the elements within the arrays are undefined. The Quran.com API does not return these values
 */
async function getArabicVersesInPage(
  p: number,
  sc: ArabicScriptures = "Uthmani",
  r?: RequestOptions
): Promise<ArabicVerseContent[] | undefined> {
  if (p < 0 || p > 604) return undefined;
  let scripture: string;
  switch (sc) {
    case "Uthmani":
      scripture = "uthmani";
    case "Uthmani-Simple":
      scripture = "uthmani_simple";
    case "Imlaei":
      scripture = "imlaei";
    case "Imlaei-Simple":
      scripture = "imlaei_simple";
    case "Indopak":
      scripture = "indopak";
    default:
      scripture = "uthmani";
  }
  const body = await (
    await UseQuranAPI(
      "/quran/verses/" +
      scripture +
      "?page_number=" +
      p +
      "&language=" +
      (r != undefined && r.language != undefined ? r.language : "en")
    )
  ).json();
  let verses: ArabicVerseContent[] = [];
  body["verses"].forEach((verse: any) => {
    verses.push({
      text: verse["text_" + scripture],
      scripture: sc,
      surah: undefined,
      number: undefined,
    });
  });
  return verses;
}

/**
 * @function getTranslatedVersesInHizb Returns the verses within a certain Hizb
 * @param h The hizb to get the verses of
 * @param tr The translation type (Defaults to Saheeh International)
 * @param r RequestOptions
 * @note The surah and verse of the elements within the arrays are undefined. The Quran.com API does not return these values
 */
async function getTranslatedVersesInHizb(
  h: number,
  tr: TranslationsType = "Saheeh International",
  r?: RequestOptions
): Promise<TranslatedVerseContent[] | undefined> {
  if (h < 0 || h > 60) return undefined;
  const body = await (
    await UseQuranAPI(
      "/quran/translations/" +
      TranslationsMap[tr] +
      "?hizb_number=" +
      h +
      "&language=" +
      (r != undefined && r.language != undefined ? r.language : "en")
    )
  ).json();
  let verses: TranslatedVerseContent[] = [];
  let language: string;
  Object.keys(Translations).forEach((lang: string) => {
    //@ts-ignore
    Translations[lang].includes(tr) ? (language = lang) : false;
  });
  body["translations"].forEach((verse: any) => {
    verses.push({
      text: FilterHTMLTags(verse["text"]),
      translation: tr,
      surah: undefined,
      number: undefined,
      language: language,
    });
  });
  return verses;
}

/**
 * @function getArabicVersesInHizb Returns the verses within a certain Hizb
 * @param h The hizb to get the verses of
 * @param sc Scripture (Defaults to Uthmani)
 * @param r RequestOptions
 * @note The surah and verse of the elements within the arrays are undefined. The Quran.com API does not return these values
 */
async function getArabicVersesInHizb(
  h: number,
  sc: ArabicScriptures = "Uthmani",
  r?: RequestOptions
): Promise<ArabicVerseContent[] | undefined> {
  if (h < 0 || h > 60) return undefined;
  let scripture: string;
  switch (sc) {
    case "Uthmani":
      scripture = "uthmani";
    case "Uthmani-Simple":
      scripture = "uthmani_simple";
    case "Imlaei":
      scripture = "imlaei";
    case "Imlaei-Simple":
      scripture = "imlaei_simple";
    case "Indopak":
      scripture = "indopak";
    default:
      scripture = "uthmani";
  }
  const body = await (
    await UseQuranAPI(
      "/quran/verses/" +
      scripture +
      "?hizb_number=" +
      h +
      "&language=" +
      (r != undefined && r.language != undefined ? r.language : "en")
    )
  ).json();
  let verses: ArabicVerseContent[] = [];
  body["verses"].forEach((verse: any) => {
    verses.push({
      text: verse["text_" + scripture],
      scripture: sc,
      surah: undefined,
      number: undefined,
    });
  });
  return verses;
}

/**
 * @function getTranslatedVersesInRub Returns the verses within a certain Rub
 * @deprecated You are unable to get verses by rub from the Quran.com API, I don't know why. This will return all the verses in the Qur'an
 * @param r The Rub to get the verses of
 * @param tr The translation type (Defaults to Saheeh International)
 * @param r RequestOptions
 * @note The surah and verse of the elements within the arrays are undefined. The Quran.com API does not return these values
 */
async function getTranslatedVersesInRub(
  ru: number,
  tr: TranslationsType = "Saheeh International",
  r?: RequestOptions
): Promise<TranslatedVerseContent[] | undefined> {
  if (ru < 0 || ru > 240) return undefined;
  const body = await (
    await UseQuranAPI(
      "/quran/translations/" +
      TranslationsMap[tr] +
      "?rub_number=" +
      ru +
      "&language=" +
      (r != undefined && r.language != undefined ? r.language : "en")
    )
  ).json();
  let verses: TranslatedVerseContent[] = [];
  let language: string;
  Object.keys(Translations).forEach((lang: string) => {
    //@ts-ignore
    Translations[lang].includes(tr) ? (language = lang) : false;
  });
  body["translations"].forEach((verse: any) => {
    verses.push({
      text: FilterHTMLTags(verse["text"]),
      translation: tr,
      surah: undefined,
      number: undefined,
      language: language,
    });
  });
  return verses;
}

/**
 * @function getArabicVersesInRub Returns the verses within a certain Rub
 * @deprecated You are unable to get verses by rub from the Quran.com API, I don't know why. This will return all the verses in the Qur'an
 * @param ru The Rub to get the verses of
 * @param sc Scripture (Defaults to Uthmani)
 * @param r RequestOptions
 * @note The surah and verse of the elements within the arrays are undefined. The Quran.com API does not return these values
 */
async function getArabicVersesInRub(
  ru: number,
  sc: ArabicScriptures = "Uthmani",
  r?: RequestOptions
): Promise<ArabicVerseContent[] | undefined> {
  if (ru < 0 || ru > 60) return undefined;
  let scripture: string;
  switch (sc) {
    case "Uthmani":
      scripture = "uthmani";
    case "Uthmani-Simple":
      scripture = "uthmani_simple";
    case "Imlaei":
      scripture = "imlaei";
    case "Imlaei-Simple":
      scripture = "imlaei_simple";
    case "Indopak":
      scripture = "indopak";
    default:
      scripture = "uthmani";
  }
  const body = await (
    await UseQuranAPI(
      "/quran/verses/" +
      scripture +
      "?rub_number=" +
      ru +
      "&language=" +
      (r != undefined && r.language != undefined ? r.language : "en")
    )
  ).json();
  let verses: ArabicVerseContent[] = [];
  body["verses"].forEach((verse: any) => {
    verses.push({
      text: verse["text_" + scripture],
      scripture: sc,
      surah: undefined,
      number: undefined,
    });
  });
  return verses;
}

export {
  getTranslatedVerse,
  getArabicVerse,
  getTranslatedVersesInChapter,
  getArabicVersesInChapter,
  getTranslatedVersesInJuz,
  getArabicVersesInJuz,
  getTranslatedVersesInPage,
  getArabicVersesInPage,
  getTranslatedVersesInHizb,
  getArabicVersesInHizb,
  getTranslatedVersesInRub,
  getArabicVersesInRub,
};
