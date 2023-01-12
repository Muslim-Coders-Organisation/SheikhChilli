import { Connection, Query } from "mysql";
import Database from "./DirectUtils";
import SurahMetadata from "./types/SurahMetadata";
import VerseRange from "./types/SurahRangeVerses";
import Verses from "./types/SurahVerses";

class QuranUtils {

  protected sql: Database | null = null;

  constructor(sql: Database) {
    this.sql = sql;
  }

  async getSurahMetadata(surah: number): Promise<SurahMetadata> {
    if (this.sql == null) throw new Error('No database connection');
    const QUERY = `SELECT * FROM surah WHERE id = ${surah}`;
    const RESULTS = await this.sql.query(QUERY)
    return {
      id: RESULTS[0].id,
      nameArabic: RESULTS[0].nameArabic,
      nameEnglish: RESULTS[0].nameEnglish,
      nameTransliteration: RESULTS[0].nameTransliteration,
      verseCount: RESULTS[0].verseCount,
    }
  }

  async getSurahVerses(surah: number): Promise<Verses> {
    if (this.sql == null) throw new Error('No database connection');
    const QUERY = `SELECT * FROM quran WHERE surah = ${surah}`;
    const RESULTS = await this.sql.query(QUERY)
    return {
      surah: surah,
      verses: RESULTS.map((verse: any) => {
        return {
          verse: verse.verse,
          verseContentEnglish: verse.verseContentEnglish,
          verseContentArabic: verse.verseContentArabic,
          verseContentTransliteration: verse.verseContentTransliteration,
        }
      })
    }
  }

  async getSurahVersesRange(surah: number, start: number, end: number): Promise<VerseRange> {
    if (this.sql == null) throw new Error('No database connection');
    const QUERY = `SELECT * FROM quran WHERE surah = ${surah} AND verse >= ${start} AND verse <= ${end}`;
    const RESULTS = await this.sql.query(QUERY)
    return {
      surah: surah,
      verses: RESULTS.map((verse: any) => {
        return {
          verse: verse.verse,
          verseContentEnglish: verse.verseContentEnglish,
          verseContentArabic: verse.verseContentArabic,
          verseContentTransliteration: verse.verseContentTransliteration,
        }
      }),
      start: start,
      end: end
    }
  }
}


export default QuranUtils;