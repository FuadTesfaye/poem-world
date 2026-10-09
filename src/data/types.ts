export interface Poet {
  slug: string;
  name: string;
  ar?: string;
  years: string;
  place: string;
  language: "ar" | "en" | "bilingual";
  era: string;
  eraId?: string;
  tag: string;
  img: string;
  imageSrc?: string;
  pos: string;
  bio: string[];
  works: string[];
  themes: string[];
  sayings?: string[];
}

export interface Poem {
  slug: string;
  title: string;
  titleAr?: string;
  poet: string;
  language: "ar" | "en";
  era: string;
  meter?: string;
  img: string;
  pos: string;
  shape: "arch" | "oval" | "rect";
  frame: "gilt" | "carved" | "none";
  orig: boolean;
  tags: string[];
  plate: string;
  about: string;
  aboutAr?: string;
  text: string;
  translation?: string;
  translator?: string;
  source?: string;
}
