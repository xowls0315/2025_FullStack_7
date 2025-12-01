type Tanker = "말파이트" | "오른" | "쉔";
type Magicion = "럭스" | "르블랑" | "베이가";
type Bruiser = "잭스" | "리신" | "리븐" | "이렐리아";
type Assasin = "탈론" | "제드" | "케인";
type ADC = "루시안" | "케이틀린" | "이즈리얼";
type Utility = "잔나" | "룰루" | "유미";

type LOL<
  T extends Tanker | Bruiser,
  J extends Tanker | Bruiser | Assasin,
  M extends Magicion | Assasin,
  B extends ADC,
  S extends Utility | Tanker
> = {
  top: T;
  jg: J;
  mid: M;
  bot: B;
  sp: S;
};

const t1: LOL<Tanker, Assasin, Magicion, ADC, Utility> = {
  top: "말파이트",
  jg: "케인",
  mid: "르블랑",
  bot: "케이틀린",
  sp: "유미",
};
