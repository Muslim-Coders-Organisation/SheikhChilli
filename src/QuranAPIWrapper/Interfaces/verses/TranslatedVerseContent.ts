import VerseContent from "./BaseVerseContent";

declare interface TranslatedVerseContent extends VerseContent {
  text: string;
  language: string;
  translation: string;
}

export default TranslatedVerseContent;
