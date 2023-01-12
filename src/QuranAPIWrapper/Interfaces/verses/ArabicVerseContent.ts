import ArabicScriptures from "../../types/scriptures/ScriptureTypes";
import VerseContent from "./BaseVerseContent";

declare interface ArabicVerseContent extends VerseContent {
  text: string;
  scripture: ArabicScriptures;
}

export default ArabicVerseContent;
