export type MuseumSource =
  | "Art Institute of Chicago"
  | "Rijksmuseum"
  | "The Metropolitan Museum of Art"
  | "Europeana / WikiArt";

export interface Artwork {
  slug: string;
  title: string;
  titleAr?: string;
  artist: string;
  artistAr?: string;
  artistDates?: string;
  date: string;
  medium: string;
  dimensions: string;
  department: string;
  movement: string;
  museum: MuseumSource;
  museumLocation: string;
  galleryPlaque: string;
  curatorialEssay: string;
  provenance: string;
  imageSrc: string;
  iiifUrl?: string;
  openAccessUrl?: string;
  tags: string[];
  relatedPoemSlug?: string;
}
