export * from "./types";
export * from "./poets";
export * from "./poems";

export const ROM = [
  "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X",
  "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX",
  "XXI", "XXII", "XXIII", "XXIV", "XXV", "XXVI", "XXVII", "XXVIII", "XXIX", "XXX"
];

export function stripTags(str: string): string {
  return str.replace(/<[^>]*>/g, "");
}
