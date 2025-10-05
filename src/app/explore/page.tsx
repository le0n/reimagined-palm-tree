// src/app/explore/page.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { FiltersPanel } from '@/components/FiltersPanel';
import { Map } from '@/components/Map';
import { PlaceCard } from '@/components/PlaceCard';
import { SuggestionDrawer } from '@/components/SuggestionDrawer';
import { applyFilters } from '@/lib/places/utils';
import { useDateDashStore } from '@/lib/store';
import type { Filters, Place } from '@/lib/places/types';

const FALLBACK_CENTER = { lat: 40.7128, lng: -74.006 }; // Downtown NYC fallback
const MAP_HEIGHT_CLASS = 'h-[calc(100vh_-_5rem)]';

export default function ExplorePage() {
  const initialized = useRef(false);
  const filterButtonRef = useRef<HTMLButtonElement | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  const {
    filters,
    places,
    suggestion,
    loading,
    error,
    mode,
    setFilters,
    resetFilters,
    setCenter,
    setMode,
    loadPlaces,
    refreshSuggestion
  } = useDateDashStore((state) => ({
    filters: state.filters,
    places: state.places,
    suggestion: state.suggestion,
    loading: state.loading,
    error: state.error,
    mode: state.mode,
    setFilters: state.setFilters,
    resetFilters: state.resetFilters,
    setCenter: state.setCenter,
    setMode: state.setMode,
    loadPlaces: state.loadPlaces,
    refreshSuggestion: state.refreshSuggestion
  }));

  useEffect(() => {
    if (initialized.current) {
      return;
    }
    initialized.current = true;

    if (!filters.center) {
      setCenter(FALLBACK_CENTER);
    }

    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        () => {
          setCenter(filters.center ?? FALLBACK_CENTER);
        },
        { enableHighAccuracy: false, timeout: 5000 }
      );
    } else {
      setCenter(filters.center ?? FALLBACK_CENTER);
    }

    void loadPlaces().then(() => refreshSuggestion('weighted'));
    setMode('weighted');
  }, [filters.center, loadPlaces, refreshSuggestion, setCenter, setMode]);

  const suggestionPlaceId = suggestion?.place?.id ?? null;

  useEffect(() => {
    if (suggestionPlaceId) {
      setSelectedPlaceId(suggestionPlaceId);
    }
  }, [suggestionPlaceId]);

  const handleFiltersChange = (update: Partial<Filters>) => {
    setFilters(update);
  };

  const closeFilters = () => {
    setFiltersOpen(false);
    filterButtonRef.current?.focus();
  };

  useEffect(() => {
    if (!filtersOpen) {
      return;
    }
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeFilters();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [filtersOpen]);

  const filteredEvaluations = useMemo(() => applyFilters(places, filters), [places, filters]);
  const filteredPlaces: Place[] = useMemo(
    () => filteredEvaluations.map((evaluation) => evaluation.place),
    [filteredEvaluations]
  );

  const activePlace = useMemo(() => {
    if (!selectedPlaceId) {
      return null;
    }
    return filteredPlaces.find((place) => place.id === selectedPlaceId) ?? null;
  }, [filteredPlaces, selectedPlaceId]);

  useEffect(() => {
    if (selectedPlaceId && !filteredPlaces.some((place) => place.id === selectedPlaceId)) {
      setSelectedPlaceId(filteredPlaces[0]?.id ?? null);
    }
  }, [filteredPlaces, selectedPlaceId]);

  const availableCuisines = useMemo(() => {
    const set = new Set<string>();
    for (const place of places) {
      place.cuisine?.forEach((item) => set.add(item));
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [places]);

  const availableThemes = useMemo(() => {
    const set = new Set<string>();
    for (const place of places) {
      place.theme?.forEach((item) => set.add(item));
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [places]);

  const handleApply = async () => {
    setMode('weighted');
    await refreshSuggestion('weighted');
    closeFilters();
  };

  const handleReset = async () => {
    resetFilters();
    setMode('weighted');
    await refreshSuggestion('weighted');
    setSelectedPlaceId(null);
    closeFilters();
  };

  const handleSurprise = async () => {
    setMode('random');
    await refreshSuggestion('random');
    closeFilters();
  };

  const handleAnotherIdea = async () => {
    await refreshSuggestion(mode);
  };

  const activeEvaluation = useMemo(() => {
    if (!activePlace) {
      return null;
    }
    return filteredEvaluations.find((evaluation) => evaluation.place.id === activePlace.id) ?? null;
  }, [activePlace, filteredEvaluations]);

  return (
    <div className="relative h-full min-h-[calc(100vh_-_5rem)] w-full">
      <Map
        center={filters.center ?? FALLBACK_CENTER}
        places={filteredPlaces}
        selectedPlaceId={selectedPlaceId}
        onSelectPlace={setSelectedPlaceId}
        onError={setMapError}
        className="h-full w-full"
        mapClassName={`${MAP_HEIGHT_CLASS} w-full rounded-none border-0`}
      />

      <div className="pointer-events-none absolute inset-0">
        <div className="pointer-events-auto absolute left-4 top-4 z-40 flex flex-col gap-3">
          <button
            ref={filterButtonRef}
            type="button"
            className="btn btn-primary"
            onClick={() => setFiltersOpen((value) => !value)}
            aria-expanded={filtersOpen}
            aria-controls="filters-panel"
          >
            {filtersOpen ? 'Hide filters' : 'Show filters'}
          </button>
          {filtersOpen ? (
            <div
              id="filters-panel"
              className="w-[min(90vw,22rem)]"
              onClick={(event) => event.stopPropagation()}
            >
              <FiltersPanel
                filters={filters}
                availableCuisines={availableCuisines}
                availableThemes={availableThemes}
                mode={mode}
                loading={loading}
                onFiltersChange={handleFiltersChange}
                onApply={handleApply}
                onReset={handleReset}
                onSurprise={handleSurprise}
                onModeChange={setMode}
                onClose={closeFilters}
              />
            </div>
          ) : null}
        </div>

        {filtersOpen ? (
          <button
            type="button"
            aria-label="Close filters"
            className="pointer-events-auto fixed inset-0 z-30 bg-base-100/20 backdrop-blur-sm"
            onClick={closeFilters}
          />
        ) : null}

        <div className="pointer-events-auto absolute right-4 top-4 z-30 max-w-sm">
          {error ? (
            <div className="alert alert-error shadow-lg">
              <span>{error}</span>
            </div>
          ) : null}
          {mapError ? (
            <div className="alert alert-warning mt-2 shadow-lg">
              <span>{mapError}</span>
            </div>
          ) : null}
        </div>

        <div className="pointer-events-auto absolute bottom-4 right-4 z-30 w-[min(90vw,24rem)]">
          <SuggestionDrawer
            suggestion={suggestion}
            loading={loading}
            onAnotherIdea={handleAnotherIdea}
            onResetFilters={handleReset}
          />
        </div>

        {activePlace ? (
          <div className="pointer-events-auto absolute bottom-4 left-4 z-30 w-[min(90vw,24rem)]">
            <PlaceCard
              place={activePlace}
              distanceKm={activeEvaluation?.distanceKm ?? undefined}
              highlight
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
