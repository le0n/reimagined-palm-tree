// src/app/explore/page.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { FiltersPanel } from '@/components/FiltersPanel';
import { Map } from '@/components/Map';
import { PlaceCard } from '@/components/PlaceCard';
import { SuggestionDrawer } from '@/components/SuggestionDrawer';
import { useDateDashStore } from '@/lib/store';
import { applyFilters } from '@/lib/places/utils';
import type { Filters, Place } from '@/lib/places/types';

const FALLBACK_CENTER = { lat: 40.7128, lng: -74.006 }; // Downtown NYC fallback

export default function ExplorePage() {
  const initialized = useRef(false);
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

  useEffect(() => {
    if (suggestion?.place) {
      setSelectedPlaceId(suggestion.place.id);
    }
  }, [suggestion?.place?.id]);

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

  const handleFiltersChange = (update: Partial<Filters>) => {
    setFilters(update);
  };

  const handleApply = async () => {
    setMode('weighted');
    await refreshSuggestion('weighted');
  };

  const handleReset = async () => {
    resetFilters();
    setMode('weighted');
    await refreshSuggestion('weighted');
    setSelectedPlaceId(null);
  };

  const handleSurprise = async () => {
    setMode('random');
    await refreshSuggestion('random');
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
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="flex flex-col gap-6">
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
        />

        {error ? (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        ) : null}

        <Map
          center={filters.center ?? FALLBACK_CENTER}
          places={filteredPlaces}
          selectedPlaceId={selectedPlaceId}
          onSelectPlace={setSelectedPlaceId}
          onError={setMapError}
        />

        {mapError ? (
          <div className="alert alert-warning">
            <span>{mapError}</span>
          </div>
        ) : null}

        {activePlace ? (
          <div>
            <h2 className="mb-3 text-xl font-semibold">Highlighted spot</h2>
            <PlaceCard
              place={activePlace}
              distanceKm={activeEvaluation?.distanceKm ?? undefined}
              highlight
            />
          </div>
        ) : null}
      </div>

      <SuggestionDrawer
        suggestion={suggestion}
        loading={loading}
        onAnotherIdea={handleAnotherIdea}
        onResetFilters={handleReset}
      />
    </div>
  );
}
