// src/lib/places/mock.ts
import type { Filters, Place, PlacesProvider } from './types';
import { applyFilters, evaluatePlace } from './utils';

const MOCK_PLACES: Place[] = [
  {
    id: 'sunset-rooftop-lounge',
    name: 'Sunset Rooftop Lounge',
    address: '123 Skyline Ave, New York, NY',
    lat: 40.7242,
    lng: -74.0018,
    rating: 4.6,
    cuisine: ['cocktails', 'small plates'],
    theme: ['romantic', 'rooftop'],
    isOpenNow: true,
    priceLevel: 3,
    description: 'Panoramic skyline views, live jazz on weekends, and a sparkling cocktail menu.'
  },
  {
    id: 'brooklyn-noodle-bar',
    name: 'Brooklyn Noodle Bar',
    address: '456 River St, Brooklyn, NY',
    lat: 40.7063,
    lng: -73.9903,
    rating: 4.4,
    cuisine: ['ramen', 'asian'],
    theme: ['comfort food', 'casual'],
    isOpenNow: false,
    priceLevel: 2,
    description: 'Steamy bowls, cozy booths, and an indie vinyl soundtrack for laid-back evenings.'
  },
  {
    id: 'midnight-mini-golf',
    name: 'Midnight Mini Golf',
    address: '89 Harbor Way, Jersey City, NJ',
    lat: 40.7124,
    lng: -74.0381,
    rating: 4.8,
    theme: ['playful', 'adventure'],
    isOpenNow: true,
    priceLevel: 2,
    description: 'Glow-in-the-dark putting, neon murals, and mocktail flights until 1 AM.'
  },
  {
    id: 'greenhouse-cafe',
    name: 'Greenhouse Cafe & Conservatory',
    address: '301 Botanical Ln, Queens, NY',
    lat: 40.7412,
    lng: -73.8462,
    rating: 4.7,
    cuisine: ['vegetarian', 'brunch'],
    theme: ['nature', 'relaxed'],
    isOpenNow: true,
    priceLevel: 2,
    description: 'Lush indoor greenhouse with seasonal plates and fresh-pressed juices.'
  },
  {
    id: 'art-house-cinema',
    name: 'Art House Cinema & Lounge',
    address: '57 Mercer St, New York, NY',
    lat: 40.7204,
    lng: -74.0023,
    rating: 4.5,
    theme: ['artsy', 'cozy'],
    isOpenNow: true,
    priceLevel: 1,
    description: 'Indie films, plush sofas, and curated snacks perfect for a quiet night out.'
  },
  {
    id: 'latin-dance-lab',
    name: 'Latin Dance Lab',
    address: '12 Grove St, Hoboken, NJ',
    lat: 40.7372,
    lng: -74.0307,
    rating: 4.9,
    theme: ['adventure', 'music'],
    isOpenNow: false,
    priceLevel: 2,
    description: 'Beginner-friendly salsa and bachata classes with a post-lesson social hour.'
  },
  {
    id: 'gelato-stroll',
    name: 'Gelato & Gallery Stroll',
    address: '220 Water St, Brooklyn, NY',
    lat: 40.7038,
    lng: -73.9901,
    rating: 4.3,
    cuisine: ['dessert', 'italian'],
    theme: ['artsy', 'walkable'],
    isOpenNow: true,
    priceLevel: 1,
    description: 'Small-batch gelato next to a rotating local art gallery for sweet conversation starters.'
  }
];

/**
 * Sleep helper to mimic a network call without freezing the main thread.
 */
async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class MockPlacesProvider implements PlacesProvider {
  private readonly places: Place[];

  constructor(seed: Place[] = MOCK_PLACES) {
    this.places = seed;
  }

  /**
   * Return a filtered list of mock places, preserving debug ordering by rating.
   */
  async list(filters?: Filters): Promise<Place[]> {
    await delay(100);
    if (!filters) {
      return [...this.places];
    }
    const evaluations = applyFilters(this.places, filters);
    return evaluations
      .map((evaluation) => evaluation.place)
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  }

  async getById(id: string): Promise<Place | null> {
    await delay(30);
    const match = this.places.find((place) => place.id === id);
    return match ? { ...match } : null;
  }

  /**
   * Retrieve evaluation metadata for debugging UI components.
   */
  evaluate(filters: Filters) {
    return this.places.map((place) => evaluatePlace(place, filters));
  }
}

export const mockPlaces = MOCK_PLACES;
