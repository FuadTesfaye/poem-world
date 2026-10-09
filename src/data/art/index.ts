import { Artwork } from "./types";
import { ARTWORKS } from "./artworks";

export * from "./types";
export * from "./artworks";

export function getArtwork(slug: string): Artwork | undefined {
  return ARTWORKS.find((a) => a.slug === slug);
}

export function getArtworksByMuseum(museum: string): Artwork[] {
  return ARTWORKS.filter((a) => a.museum === museum);
}

export function getArtworksByMovement(movement: string): Artwork[] {
  return ARTWORKS.filter((a) => a.movement.toLowerCase().includes(movement.toLowerCase()));
}
