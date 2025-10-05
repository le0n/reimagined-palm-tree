// src/lib/store.ts
'use client';

import { create } from 'zustand';

import { MockPlacesProvider, mockPlaces } from './places/mock';
import { pickSuggestion } from './places/random';
import type {
  Filters,
  LatLng,
  Place,
  SuggestionMode,
  SuggestionResult
} from './places/types';

const provider = new MockPlacesProvider();

const INITIAL_PLACES: Place[] = mockPlaces.map((place) => ({ ...place }));

export const DEFAULT_FILTERS: Filters = {
  center: null,
  radiusKm: 5,
  minRating: 4,
  cuisines: [],
  themes: [],
  openNow: false,
  priceLevels: [1, 2, 3]
};

/**
 * Function signature used when callers provide a filter updater function.
 */
type FiltersUpdater = (_filters: Filters) => Filters;

type FiltersInput = Partial<Filters> | FiltersUpdater;

interface DateDashState {
  filters: Filters;
  places: Place[];
  suggestion: SuggestionResult | null;
  mode: SuggestionMode;
  loading: boolean;
  error: string | null;
  setFilters: (_input: FiltersInput) => void;
  setCenter: (_center: LatLng | null) => void;
  setMode: (_mode: SuggestionMode) => void;
  resetFilters: () => void;
  loadPlaces: () => Promise<void>;
  refreshSuggestion: (_mode?: SuggestionMode) => Promise<void>;
}

/**
 * Shared Zustand store wiring filters, place cache, and suggestion state.
 */
export const useDateDashStore = create<DateDashState>((set, get) => ({
  filters: DEFAULT_FILTERS,
  places: INITIAL_PLACES,
  suggestion: null,
  mode: 'weighted',
  loading: false,
  error: null,
  setFilters: (input) =>
    set((state) => {
      const nextFilters =
        typeof input === 'function'
          ? (input as FiltersUpdater)(state.filters)
          : { ...state.filters, ...input };
      return { filters: nextFilters };
    }),
  setCenter: (center) =>
    set((state) => ({
      filters: { ...state.filters, center }
    })),
  setMode: (mode) => set({ mode }),
  resetFilters: () => set({ filters: { ...DEFAULT_FILTERS } }),
  loadPlaces: async () => {
    const { filters } = get();
    set({ loading: true, error: null });
    try {
      const places = await provider.list(filters);
      set({ places, loading: false });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load places'
      });
    }
  },
  refreshSuggestion: async (incomingMode) => {
    const activeMode = incomingMode ?? get().mode;
    const { filters } = get();

    if (!get().places.length) {
      await get().loadPlaces();
    }

    const { places } = get();
    const suggestion = pickSuggestion(places, filters, activeMode);

    set({
      suggestion,
      mode: activeMode,
      error: suggestion.place ? null : 'Try widening your filters to see more places.'
    });
  }
}));

export type { DateDashState };
