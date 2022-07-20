
type Surah = {
    id: number,
    name: string,
    transliteration: string,
    translation: string,
    type: string,
    total_verses: number,
    verses: Verse[]
}

type Verse = {
    id: number,
    text: string,
    translation: string,
    transliteration: string
}