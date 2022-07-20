type Verse = {
  surah: number,
  verse: number,
  verseContentEnglish: string,
  verseContentArabic: string,
  verseContentTransliteration: string,
}

type Verses = {
  surah: number,
  verses: Verse[],
}

export default Verses;
export type { Verse };