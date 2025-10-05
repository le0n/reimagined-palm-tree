// src/components/SuggestionDrawer.tsx
'use client';

import { useMemo } from 'react';

import type { SuggestionResult } from '@/lib/places/types';
import { PlaceCard } from './PlaceCard';

interface SuggestionDrawerProps {
  suggestion: SuggestionResult | null;
  loading?: boolean;
  onAnotherIdea: () => void;
  onResetFilters: () => void;
  className?: string;
}

function joinClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function SuggestionDrawer({
  suggestion,
  loading = false,
  onAnotherIdea,
  onResetFilters,
  className
}: SuggestionDrawerProps) {
  const place = suggestion?.place ?? null;

  const mapsHref = useMemo(() => {
    if (!place) {
      return null;
    }
    const query = encodeURIComponent(`${place.lat},${place.lng}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  }, [place]);

  return (
    <aside className={joinClasses('w-full', className)}>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body gap-4">
          <header className="flex flex-col gap-2">
            <h2 className="card-title text-2xl">Your date dash pick</h2>
            <p className="text-sm text-base-content/70">
              We mix rating, proximity, and vibe tags to surface something delightful. Feeling bold? Shuffle again.
            </p>
          </header>

          {loading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-6 w-3/4 rounded bg-base-200" />
              <div className="h-4 w-full rounded bg-base-200" />
              <div className="h-20 w-full rounded bg-base-200" />
            </div>
          ) : null}

          {!loading && !place ? (
            <div className="alert alert-info">
              <div>
                <h3 className="font-semibold">No match just yet</h3>
                <p className="text-sm">
                  Relax the filters or expand the radius, then try “Surprise us!” again.
                </p>
              </div>
              <div className="flex gap-2">
                <button type="button" className="btn btn-sm btn-outline" onClick={onResetFilters}>
                  Reset filters
                </button>
                <button type="button" className="btn btn-sm btn-primary" onClick={onAnotherIdea}>
                  Try again
                </button>
              </div>
            </div>
          ) : null}

          {place ? (
            <PlaceCard place={place} highlight className="border border-base-200" />
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="button" className="btn btn-outline flex-1" onClick={onResetFilters}>
              Widen filters
            </button>
            <button
              type="button"
              className="btn btn-secondary flex-1"
              onClick={onAnotherIdea}
              disabled={loading}
            >
              Another idea
            </button>
          </div>

          {place && mapsHref ? (
            <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Take me there
            </a>
          ) : null}

          {suggestion?.debug ? (
            <details className="collapse collapse-arrow border border-base-200 bg-base-100">
              <summary className="collapse-title text-sm font-medium">Peek under the hood</summary>
              <div className="collapse-content text-xs text-base-content/70">
                <p>Mode: {suggestion.debug.mode}</p>
                <p>Candidates passing filters: {suggestion.debug.filteredCount}</p>
                {suggestion.debug.note ? <p>Note: {suggestion.debug.note}</p> : null}
              </div>
            </details>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
