// src/lib/places/types.ts
/**
 * Geographic coordinate for map operations.
 */
export interface LatLng {
  lat: number;
  lng: number;
}

export type SuggestionMode = 'random' | 'weighted';

/**
 * Supported place price levels (0 = free, 4 = premium).
 */
export type PriceLevel = 0 | 1 | 2 | 3 | 4;

/**
 * Place represents a candidate destination for a date.
 */
export interface Place {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  rating?: number;
  cuisine?: string[];
  theme?: string[];
  isOpenNow?: boolean;
  priceLevel?: PriceLevel;
  description?: string;
  website?: string;
}

/**
 * Filters applied before surfacing suggestions.
 */
export interface Filters {
  center: LatLng | null;
  radiusKm: number;
  minRating?: number;
  cuisines: string[];
  themes: string[];
  openNow?: boolean;
  priceLevels: PriceLevel[];
}

/**
 * Detailed debug data describing how a suggestion was selected.
 */
export interface SuggestionDebugEntry {
  id: string;
  score?: number;
  distanceKm?: number;
  matches: {
    rating: boolean;
    radius: boolean;
    cuisine: boolean;
    theme: boolean;
    openNow: boolean;
    priceLevel: boolean;
  };
}

export interface SuggestionDebug {
  mode: SuggestionMode;
  totalCandidates: number;
  filteredCount: number;
  entries: SuggestionDebugEntry[];
  note?: string;
}

export interface SuggestionResult {
  place: Place | null;
  debug: SuggestionDebug;
}

/**
 * Minimal contract for a place provider.
 */
export interface PlacesProvider {
  list: (_filters?: Filters) => Promise<Place[]>;
  getById: (_id: string) => Promise<Place | null>;
}
