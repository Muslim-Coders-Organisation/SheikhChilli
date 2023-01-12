import ChapterJuzMappings from "../../types/juz/ChapterJuzMappings";

declare interface Juz {
  number: number;
  verses: {
    number: number;
    entirety: {
      start: number;
      end: number;
    };
    relative: ChapterJuzMappings[];
  };
}
