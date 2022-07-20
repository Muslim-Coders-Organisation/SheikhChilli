import { writeFileSync } from "fs";
import { chapterMetadata } from "./source/Chapterdata";
import { data } from "./source/quranEnTranslit";

const CHAPTER_METADATA_TABLE_NAME = "chapter_metadata";
const QURAN_TABLE_NAME = "quran";

const AllQueries: string[] = []
const ChapterMetadataQueries: string[] = []
const QuranQueries: string[] = []

chapterMetadata.data.forEach(chapter => {
  const QUERY = `INSERT INTO ${CHAPTER_METADATA_TABLE_NAME} (id, nameArabic, nameEnglish, nameTransliteration, verseCount) VALUES (${chapter.id}, "${chapter.arabicName}", "${chapter.name}", "${chapter.transliteration}", ${chapter.totalVerses});`;

  ChapterMetadataQueries.push(QUERY)
  AllQueries.push(QUERY)
})

data.forEach(chapter => {
  chapter.verses.forEach(verse => {
    // replace all double quotes with double double quotes
    const QUERY = `INSERT INTO ${QURAN_TABLE_NAME} (surah, verse, verseContentEnglish, verseContentArabic, verseContentTransliteration) VALUES (${chapter.id}, ${verse.id}, "${verse.translation.replace(/"/g, '""')}", "${verse.text}", "${verse.transliteration}");`
    AllQueries.push(QUERY)
    QuranQueries.push(QUERY)  
  })
})

writeFileSync(__dirname + "/dist/all-queries.sql", AllQueries.join("\n"))
writeFileSync(__dirname + "/dist/chapter-metadata-queries.sql", ChapterMetadataQueries.join("\n"))
writeFileSync(__dirname + "/dist/quran-queries.sql", QuranQueries.join("\n"))