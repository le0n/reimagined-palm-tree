// src/components/PlaceCard.tsx
'use client';

import type { Place } from '@/lib/places/types';

interface PlaceCardProps {
  place: Place;
  distanceKm?: number | null;
  highlight?: boolean;
  className?: string;
  onSelect?: () => void;
}

const PRICE_LABEL: Record<number, string> = {
  0: 'Free',
  1: '$',
  2: '$$',
  3: '$$$',
  4: '$$$$'
};

function joinClasses(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ');
}

export function PlaceCard({ place, distanceKm, highlight = false, className, onSelect }: PlaceCardProps) {
  const priceLabel = place.priceLevel != null ? PRICE_LABEL[place.priceLevel] ?? '$$' : '—';
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.lat},${place.lng}`)}`;
  const rating = place.rating ?? 0;

  return (
    <article
      className={joinClasses(
        'card bg-base-100 shadow-md transition-transform focus-within:scale-[1.01] focus:outline-none',
        highlight ? 'border-2 border-accent' : 'border border-base-200',
        className
      )}
      tabIndex={onSelect ? 0 : undefined}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (onSelect && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          onSelect();
        }
      }}
      aria-label={`Preview ${place.name}`}
    >
      <div className="card-body gap-4">
        <header className="flex flex-col gap-1">
          <h3 className="text-xl font-semibold text-base-content">{place.name}</h3>
          <p className="text-sm text-base-content/70">{place.address}</p>
        </header>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          <div className="rating rating-sm" aria-label={`Rated ${rating.toFixed(1)} out of 5`}>
            {Array.from({ length: 5 }).map((_, index) => {
              const value = index + 1;
              const checked = Math.round(rating) === value;
              return (
                <input
                  key={value}
                  type="radio"
                  name={`rating-${place.id}`}
                  className="mask mask-star-2 bg-warning"
                  checked={checked}
                  readOnly
                  tabIndex={-1}
                />
              );
            })}
          </div>
          <span className="badge badge-outline">{rating ? `${rating.toFixed(1)}★` : 'New'}</span>
          <span className="badge badge-outline">{priceLabel}</span>
          {typeof distanceKm === 'number' ? (
            <span className="badge badge-outline">{distanceKm.toFixed(1)} km away</span>
          ) : null}
          {place.isOpenNow != null ? (
            <span className={joinClasses('badge', place.isOpenNow ? 'badge-success' : 'badge-ghost')}>
              {place.isOpenNow ? 'Open now' : 'Closed now'}
            </span>
          ) : null}
        </div>

        {place.cuisine && place.cuisine.length ? (
          <div className="flex flex-wrap gap-2" aria-label="Cuisine types">
            {place.cuisine.map((item) => (
              <span key={item} className="badge badge-primary badge-outline">
                {item}
              </span>
            ))}
          </div>
        ) : null}

        {place.theme && place.theme.length ? (
          <div className="flex flex-wrap gap-2" aria-label="Themes">
            {place.theme.map((item) => (
              <span key={item} className="badge badge-secondary badge-outline">
                {item}
              </span>
            ))}
          </div>
        ) : null}

        {place.description ? (
          <p className="text-sm text-base-content/70">{place.description}</p>
        ) : null}

        <footer className="flex flex-wrap gap-2">
          <a
            href={mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-outline"
          >
            Open in Maps
          </a>
          {place.website ? (
            <a
              href={place.website}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-ghost"
            >
              Website
            </a>
          ) : null}
        </footer>
      </div>
    </article>
  );
}
