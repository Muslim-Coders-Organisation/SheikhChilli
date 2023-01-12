declare interface ChapterInfo {
  chapter: number;
  language: string;
  information: {
    short: string;
    base: string;
    source: string;
  };
}

export default ChapterInfo;
