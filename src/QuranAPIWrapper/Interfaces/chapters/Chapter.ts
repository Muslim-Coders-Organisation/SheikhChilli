declare interface Chapter {
  id: string;
  type: "Meccan" | "Medinan";
  revelationaryOrder: number; // the number of the surah in chronological order
  hasBismillah: boolean;
  name: {
    english: {
      simple: string;
      complex: string;
    };
    arabic: string;
    translated: {
      language: string; // Language of which it is translated into
      name: string; // Translated name
    };
  };
}

export default Chapter;
