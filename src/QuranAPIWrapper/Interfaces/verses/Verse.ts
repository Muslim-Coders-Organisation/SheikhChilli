declare interface Verse {
  key: string; // i.e. 10:5

  number: {
    entirety: number; // i.e. 1369,
    relative: number; // i.e. 5

    juz: number;
    hizb: number;
    rubElHizb: number;
    ruku: number;
    manzil: number;
    sajdah: number | null;
    page: number;
  };
}

export default Verse;
