// Because the Quran API returns superscript tags (<sup></sup>)
function FilterHTMLTags(str: string) {
  return str.replace(/<[a-zA-Z]+.*[a-zA-Z]+>/, "");
}

export default FilterHTMLTags;
