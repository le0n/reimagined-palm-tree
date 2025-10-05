// src/components/FiltersPanel.tsx
'use client';

import { useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';

import type { Filters, PriceLevel, SuggestionMode } from '@/lib/places/types';

interface FiltersPanelProps {
  filters: Filters;
  availableCuisines: string[];
  availableThemes: string[];
  mode: SuggestionMode;
  loading?: boolean;
  onFiltersChange: (_update: Partial<Filters>) => void;
  onApply: () => void;
  onReset: () => void;
  onSurprise: () => void;
  onModeChange?: (_mode: SuggestionMode) => void;
  onClose?: () => void;
}

const PRICE_LEVEL_OPTIONS: { value: PriceLevel; label: string }[] = [
  { value: 0, label: 'Free' },
  { value: 1, label: '$' },
  { value: 2, label: '$$' },
  { value: 3, label: '$$$' },
  { value: 4, label: '$$$$' }
];

export function FiltersPanel(props: FiltersPanelProps) {
  const {
    filters,
    availableCuisines,
    availableThemes,
    mode,
    loading = false,
    onFiltersChange,
    onApply,
    onReset,
    onSurprise,
    onModeChange,
    onClose
  } = props;

  const [showAdvanced, setShowAdvanced] = useState(false);

  const ratingLabel = useMemo(() => {
    return filters.minRating ? `${filters.minRating.toFixed(1)}★ & up` : 'Any rating';
  }, [filters.minRating]);

  const handleCuisineChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selections = Array.from(event.target.selectedOptions).map((option) => option.value);
    onFiltersChange({ cuisines: selections });
  };

  const handleThemeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selections = Array.from(event.target.selectedOptions).map((option) => option.value);
    onFiltersChange({ themes: selections });
  };

  const handlePriceToggle = (value: PriceLevel) => {
    const current = new Set(filters.priceLevels);
    if (current.has(value)) {
      current.delete(value);
    } else {
      current.add(value);
    }
    onFiltersChange({ priceLevels: Array.from(current).sort((a, b) => a - b) as PriceLevel[] });
  };

  const handleModeChange = (newMode: SuggestionMode) => {
    onModeChange?.(newMode);
  };

  return (
    <section aria-label="Filter date suggestions" className="card bg-base-100 shadow-xl">
      <form
        className="card-body gap-6"
        onSubmit={(event) => {
          event.preventDefault();
          onApply();
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="card-title text-2xl">Fine-tune the vibe</h2>
            <p className="text-base-content/70 text-sm">
              Set your must-haves—radius, rating, cuisine cravings, and more. Hit “Apply” to update the map or “Surprise us!” to spin the wheel.
            </p>
          </div>
          {onClose ? (
            <button
              type="button"
              className="btn btn-circle btn-ghost btn-sm"
              onClick={onClose}
              aria-label="Close filters"
            >
              ✕
            </button>
          ) : null}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Radius</span>
              <span className="badge badge-outline">{filters.radiusKm} km</span>
            </div>
            <input
              id="filter-radius"
              type="range"
              min={1}
              max={50}
              step={1}
              value={filters.radiusKm}
              onChange={(event) => onFiltersChange({ radiusKm: Number(event.target.value) })}
              className="range range-primary"
              aria-describedby="filter-radius-help"
            />
            <div id="filter-radius-help" className="label text-xs text-base-content/60">
              Keep it close or broaden the search radius.
            </div>
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Minimum rating</span>
              <span className="badge badge-outline">{ratingLabel}</span>
            </div>
            <input
              id="filter-rating"
              type="range"
              min={0}
              max={5}
              step={0.5}
              value={filters.minRating ?? 0}
              onChange={(event) => onFiltersChange({ minRating: Number(event.target.value) })}
              className="range range-secondary"
            />
            <div className="label text-xs text-base-content/60">
              Weigh toward crowd favorites—or go rogue with “Any rating”.
            </div>
          </label>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <label className="form-control">
            <div className="label">
              <span className="label-text">Cuisine cravings</span>
              <span className="label-text-alt text-xs">Choose all that apply</span>
            </div>
            <select
              id="filter-cuisine"
              multiple
              value={filters.cuisines}
              onChange={handleCuisineChange}
              className="select select-bordered h-auto min-h-[3.5rem]"
              aria-describedby="filter-cuisine-help"
            >
              {availableCuisines.length ? (
                availableCuisines.map((cuisine) => (
                  <option key={cuisine} value={cuisine}>
                    {cuisine}
                  </option>
                ))
              ) : (
                <option disabled value="">
                  No cuisine tags yet
                </option>
              )}
            </select>
            <div id="filter-cuisine-help" className="label text-xs text-base-content/60">
              Hold ⌘/Ctrl to select multiple cuisines.
            </div>
          </label>

          <label className="form-control">
            <div className="label">
              <span className="label-text">Date themes</span>
              <button
                type="button"
                className="btn btn-ghost btn-xs"
                onClick={() => setShowAdvanced((value) => !value)}
                aria-expanded={showAdvanced}
              >
                {showAdvanced ? 'Hide suggestions' : 'Need ideas?'}
              </button>
            </div>
            <select
              id="filter-theme"
              multiple
              value={filters.themes}
              onChange={handleThemeChange}
              className="select select-bordered h-auto min-h-[3.5rem]"
            >
              {availableThemes.length ? (
                availableThemes.map((theme) => (
                  <option key={theme} value={theme}>
                    {theme}
                  </option>
                ))
              ) : (
                <option disabled value="">
                  Themes coming soon
                </option>
              )}
            </select>
            <div className="label text-xs text-base-content/60">
              Capture the mood—romantic, playful, artsy, adventurous…
            </div>
          </label>
        </div>

        {showAdvanced ? (
          <div className="alert alert-info text-sm">
            <span>Try combining contrasting vibes like “playful” + “cozy” for unexpected pairings.</span>
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-3">
          <label className="form-control">
            <div className="label">
              <span className="label-text">Open now</span>
            </div>
            <label className="label cursor-pointer justify-between">
              <span className="label-text text-base-content/70">Only show places open right now</span>
              <input
                id="filter-open-now"
                type="checkbox"
                className="toggle toggle-primary"
                checked={Boolean(filters.openNow)}
                onChange={(event) => onFiltersChange({ openNow: event.target.checked })}
              />
            </label>
          </label>

          <fieldset className="form-control md:col-span-2">
            <legend className="label">
              <span className="label-text">Price levels</span>
              <span className="label-text-alt text-xs">Tap to include/exclude</span>
            </legend>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by price level">
              {PRICE_LEVEL_OPTIONS.map(({ value, label }) => {
                const active = filters.priceLevels.includes(value);
                return (
                  <button
                    key={value}
                    type="button"
                    className={`btn btn-sm ${active ? 'btn-secondary' : 'btn-outline'}`}
                    onClick={() => handlePriceToggle(value)}
                    aria-pressed={active}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>

        <div className="divider my-1" role="presentation" />

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <div className="join join-horizontal md:col-span-2">
            <button type="submit" className="btn btn-primary join-item" disabled={loading}>
              {loading ? 'Applying…' : 'Apply filters'}
            </button>
            <button type="button" className="btn btn-outline join-item" onClick={onReset}>
              Reset
            </button>
          </div>
          <div className="join join-horizontal">
            <button
              type="button"
              className="btn btn-accent join-item"
              onClick={() => {
                handleModeChange('random');
                onSurprise();
              }}
            >
              Surprise us!
            </button>
            <button
              type="button"
              className="btn btn-outline join-item"
              onClick={() => handleModeChange(mode === 'random' ? 'weighted' : 'random')}
              aria-pressed={mode === 'random'}
            >
              Mode: {mode === 'random' ? 'Random' : 'Weighted'}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
