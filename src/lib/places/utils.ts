// src/lib/places/utils.ts
import type { Filters, LatLng, Place } from './types';

export const EARTH_RADIUS_KM = 6371;

export interface PlaceEvaluation {
  place: Place;
  distanceKm: number | null;
  matches: {
    rating: boolean;
    radius: boolean;
    cuisine: boolean;
    theme: boolean;
    openNow: boolean;
    priceLevel: boolean;
  };
  passes: boolean;
}

/**
 * Calculate the great-circle distance between two coordinates in kilometers.
 */
export function haversineDistanceKm(a: LatLng, b: LatLng): number {
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);

  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * Evaluate a place against the current filters.
 */
export function evaluatePlace(place: Place, filters: Filters): PlaceEvaluation {
  const distanceKm = computeDistance(place, filters.center);
  const matches = {
    rating: matchesRating(place, filters.minRating),
    radius: matchesRadius(distanceKm, filters.radiusKm),
    cuisine: matchesAffinity(place.cuisine, filters.cuisines),
    theme: matchesAffinity(place.theme, filters.themes),
    openNow: matchesOpenState(place.isOpenNow, filters.openNow),
    priceLevel: matchesPriceLevel(place.priceLevel, filters.priceLevels)
  };

  const passes = Object.values(matches).every(Boolean);

  return {
    place,
    distanceKm,
    matches,
    passes
  };
}

/**
 * Apply filters to an array of places and return the passing evaluations.
 */
export function applyFilters(places: Place[], filters: Filters): PlaceEvaluation[] {
  return places.map((place) => evaluatePlace(place, filters)).filter((evaluation) => evaluation.passes);
}

/**
 * Calculate a weighted score for a place evaluation.
 */
export function calculateWeightedScore(evaluation: PlaceEvaluation, filters: Filters): number {
  const { place, distanceKm } = evaluation;

  const ratingScore = normalizeRating(place.rating);
  const distanceScore = normalizeDistance(distanceKm, filters.radiusKm);
  const cuisineScore = affinityScore(place.cuisine, filters.cuisines);
  const themeScore = affinityScore(place.theme, filters.themes);
  const openScore = filters.openNow ? (place.isOpenNow ? 1 : 0) : 0.5;
  const priceScore = filters.priceLevels.length
    ? filters.priceLevels.includes(place.priceLevel ?? -1)
      ? 1
      : 0
    : 0.6;

  const combinedAffinity = Math.max(cuisineScore, themeScore);

  return (
    ratingScore * 0.35 +
    distanceScore * 0.25 +
    combinedAffinity * 0.2 +
    (cuisineScore + themeScore) / 2 * 0.1 +
    openScore * 0.05 +
    priceScore * 0.05
  );
}

function computeDistance(place: Place, center: Filters['center']): number | null {
  if (!center) {
    return null;
  }

  return haversineDistanceKm(center, { lat: place.lat, lng: place.lng });
}

function matchesRating(place: Place, minRating?: number): boolean {
  if (!minRating) {
    return true;
  }
  return (place.rating ?? 0) >= minRating;
}

function matchesRadius(distanceKm: number | null, radiusKm: number): boolean {
  if (!radiusKm || radiusKm <= 0) {
    return true;
  }
  if (distanceKm == null) {
    return true;
  }
  return distanceKm <= radiusKm;
}

function matchesAffinity(values: string[] | undefined, filters: string[]): boolean {
  if (!filters.length) {
    return true;
  }
  if (!values || !values.length) {
    return false;
  }

  const normalized = new Set(values.map((item) => item.toLowerCase()));
  return filters.some((filterValue) => normalized.has(filterValue.toLowerCase()));
}

function matchesOpenState(isOpenNow: boolean | undefined, openNow: boolean | undefined): boolean {
  if (!openNow) {
    return true;
  }
  return Boolean(isOpenNow);
}

function matchesPriceLevel(priceLevel: Place['priceLevel'], levels: Filters['priceLevels']): boolean {
  if (!levels.length) {
    return true;
  }
  if (priceLevel == null) {
    return false;
  }
  return levels.includes(priceLevel);
}

function normalizeRating(rating?: number): number {
  if (rating == null || rating <= 0) {
    return 0.5;
  }
  return Math.max(0, Math.min(1, rating / 5));
}

function normalizeDistance(distanceKm: number | null, radiusKm: number): number {
  if (distanceKm == null || radiusKm <= 0) {
    return 0.75;
  }
  const clamped = Math.max(0, Math.min(radiusKm, distanceKm));
  return 1 - clamped / (radiusKm || 1);
}

function affinityScore(values: string[] | undefined, filters: string[]): number {
  if (!filters.length) {
    return values && values.length ? 0.6 : 0.4;
  }
  if (!values || !values.length) {
    return 0;
  }

  const normalized = values.map((value) => value.toLowerCase());
  const matches = filters.filter((filterValue) => normalized.includes(filterValue.toLowerCase())).length;

  return matches / filters.length;
}
