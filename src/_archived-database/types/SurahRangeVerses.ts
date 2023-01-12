import { Verse } from "./SurahVerses";

type VerseRange = {
  surah: number;
  verses: Verse[];
  start: number;
  end: number;
}

export default VerseRange;