type Juzs =
  | "Alīf-Lām-Mīm"
  | "Sayaqūlu"
  | "Tilka ’r-Rusulu"
  | "Lan Tana Lu"
  | "Wa’l-muḥṣanātu"
  | "Lā yuḥibbu-’llāhu"
  | "Wa ’Idha Samiʿū"
  | "Wa-law annanā"
  | "Qāla ’l-mala’u"
  | "Wa-’aʿlamū "
  | "Yaʿtazerūn"
  | "Wa mā min dābbatin"
  | "Wa mā ubarri’u"
  | "Alīf-Lām-Rā’"
  | "Rubama"
  | "Subḥāna ’lladhī"
  | "Qāla ’alam"
  | "Iqtaraba li’n-nāsi"
  | "Qad ’aflaḥa"
  | "Wa-qāla ’lladhīna"
  | "’A’man Khalaqa"
  | "Otlu ma oohiya"
  | "Wa-man yaqnut"
  | "Wa-Mali"
  | "Fa-man ’aẓlamu"
  | "Ilayhi yuraddu"
  | "Ḥā’ Mīm"
  | "Qāla fa-mā khaṭbukum"
  | "Qad samiʿa ’llāhu"
  | "Tabāraka ’lladhī"
  | "‘Amma";

type JuzNumbers =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30;

const JuzNamesToNumberMap = {
  "Alīf-Lām-Mīm": 1,
  Sayaqūlu: 2,
  "Tilka ’r-Rusulu": 3,
  "Lan Tana Lu": 4,
  "Wa’l-muḥṣanātu": 5,
  "Lā yuḥibbu-’llāhu": 6,
  "Wa ’Idha Samiʿū": 7,
  "Wa-law annanā": 8,
  "Qāla ’l-mala’u": 9,
  "Wa-’aʿlamū ": 10,
  Yaʿtazerūn: 11,
  "Wa mā min dābbatin": 12,
  "Wa mā ubarri’u": 13,
  "Alīf-Lām-Rā’": 14,
  Rubama: 14,
  "Subḥāna ’lladhī": 15,
  "Qāla ’alam": 16,
  "Iqtaraba li’n-nāsi": 17,
  "Qad ’aflaḥa": 18,
  "Wa-qāla ’lladhīna": 19,
  "’A’man Khalaqa": 20,
  "Otlu ma oohiya": 21,
  "Wa-man yaqnut": 22,
  "Wa-Mali": 23,
  "Fa-man ’aẓlamu": 24,
  "Ilayhi yuraddu": 25,
  "Ḥā’ Mīm": 26,
  "Qāla fa-mā khaṭbukum": 27,
  "Qad samiʿa ’llāhu": 28,
  "Tabāraka ’lladhī": 29,
  "‘Amma": 30,
};

export { Juzs, JuzNumbers, JuzNamesToNumberMap };
