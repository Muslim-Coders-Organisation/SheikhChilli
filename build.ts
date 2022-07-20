import { writeFileSync } from "fs";
import { chapterMetadata } from "./source/Chapterdata";
import { data } from "./source/quranEnTranslit";

const CHAPTER_METADATA_TABLE_NAME = "surah";
const QURAN_TABLE_NAME = "quran";

const QURAN_METADATA_TABLE_CREATION_QUERY = `CREATE TABLE quran (surah INT NOT NULL,verse INT NOT NULL,verseContentEnglish TEXT NOT NULL,verseContentArabic TEXT NOT NULL,verseContentTransliteration TEXT NOT NULL);`
const CHAPTER_METADATA_TABLE_CREATION_QUERY = `CREATE TABLE surah (id INT NOT NULL,nameArabic TEXT NOT NULL,nameEnglish TEXT NOT NULL,nameTransliteration TEXT NOT NULL,verseCount INT NOT NULL);`

const AllQueries: string[] = []
const ChapterMetadataQueries: string[] = []
const QuranQueries: string[] = []


chapterMetadata.data.forEach(chapter => {
  const QUERY = `INSERT INTO ${CHAPTER_METADATA_TABLE_NAME} (id, nameArabic, nameEnglish, nameTransliteration, verseCount) VALUES (${chapter.id}, "${chapter.arabicName}", "${chapter.name.replace(/"/g, '""')}", "${chapter.transliteration}", ${chapter.totalVerses});`;

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
writeFileSync(__dirname + "/dist/quran-table-query.sql", QURAN_METADATA_TABLE_CREATION_QUERY)
writeFileSync(__dirname + "/dist/chapter-metadata-table-query.sql", CHAPTER_METADATA_TABLE_CREATION_QUERY)