// src/components/Map.tsx
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import maplibregl, {
  type ExpressionSpecification,
  type GeoJSONSource,
  type LngLatLike,
  type Map as MapLibreMap
} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import type { LatLng, Place } from '@/lib/places/types';

interface MapProps {
  center: LatLng;
  places: Place[];
  selectedPlaceId: string | null;
  onSelectPlace?: (_placeId: string) => void;
  onError?: (_message: string | null) => void;
  className?: string;
  mapClassName?: string;
}

interface GeoJsonFeatureProperties {
  id: string;
  name: string;
}

const FALLBACK_CENTER: LatLng = { lat: 40.7128, lng: -74.006 };
const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
const SOURCE_ID = 'datedash-places';
const CLUSTER_LAYER_ID = 'datedash-clusters';
const CLUSTER_COUNT_LAYER_ID = 'datedash-cluster-count';
const UNCLUSTERED_LAYER_ID = 'datedash-unclustered';
const SELECTED_LAYER_ID = 'datedash-selected';

function joinClasses(...classes: Array<string | null | undefined | false>) {
  return classes.filter(Boolean).join(' ');
}

function toGeoJson(places: Place[]) {
  return {
    type: 'FeatureCollection' as const,
    features: places.map((place) => ({
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [place.lng, place.lat]
      },
      properties: {
        id: place.id,
        name: place.name
      } satisfies GeoJsonFeatureProperties
    }))
  };
}

export function Map({
  center,
  places,
  selectedPlaceId,
  onSelectPlace,
  onError,
  className,
  mapClassName
}: MapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [hasError, setHasError] = useState(false);
  const [showEmptyAlert, setShowEmptyAlert] = useState(false);

  const safeCenter = useMemo<LatLng>(() => center ?? FALLBACK_CENTER, [center]);

  const updateSelectedFilter = useCallback(
    (map: MapLibreMap, placeId: string | null) => {
      if (!map.getLayer(SELECTED_LAYER_ID)) {
        return;
      }
      const filter = [
        'all',
        ['!', ['has', 'point_count']],
        ['==', ['get', 'id'], placeId ?? '__none__']
      ] as unknown as ExpressionSpecification;
      map.setFilter(SELECTED_LAYER_ID, filter);
    },
    []
  );

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    const initialCenter: LngLatLike = [safeCenter.lng, safeCenter.lat];

    try {
      const map = new maplibregl.Map({
        container: containerRef.current,
        style: MAP_STYLE,
        center: initialCenter,
        zoom: 12
      });

      map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');
      map.addControl(new maplibregl.FullscreenControl(), 'top-right');

      map.on('load', () => {
        map.addSource(SOURCE_ID, {
          type: 'geojson',
          data: toGeoJson([]),
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 60
        });

        map.addLayer({
          id: CLUSTER_LAYER_ID,
          type: 'circle',
          source: SOURCE_ID,
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': [
              'step',
              ['get', 'point_count'],
              '#6366F1',
              5,
              '#F97316',
              10,
              '#22D3EE'
            ],
            'circle-radius': [
              'step',
              ['get', 'point_count'],
              18,
              5,
              22,
              15,
              28
            ],
            'circle-opacity': 0.85
          }
        });

        map.addLayer({
          id: CLUSTER_COUNT_LAYER_ID,
          type: 'symbol',
          source: SOURCE_ID,
          filter: ['has', 'point_count'],
          layout: {
            'text-field': ['get', 'point_count_abbreviated'],
            'text-font': ['Open Sans Bold'],
            'text-size': 12
          },
          paint: {
            'text-color': '#FFFFFF'
          }
        });

        map.addLayer({
          id: UNCLUSTERED_LAYER_ID,
          type: 'circle',
          source: SOURCE_ID,
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-radius': 9,
            'circle-color': '#F97316',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#FFFFFF',
            'circle-opacity': 0.9
          }
        });

        map.addLayer({
          id: SELECTED_LAYER_ID,
          type: 'circle',
          source: SOURCE_ID,
          filter: ['==', ['get', 'id'], '__none__'],
          paint: {
            'circle-radius': 13,
            'circle-color': '#22D3EE',
            'circle-stroke-width': 3,
            'circle-stroke-color': '#0F172A',
            'circle-opacity': 0.95
          }
        });

        map.on('click', CLUSTER_LAYER_ID, (event) => {
          const features = map.queryRenderedFeatures(event.point, {
            layers: [CLUSTER_LAYER_ID]
          });
          const clusterFeature = features[0];
          if (!clusterFeature) {
            return;
          }
          const clusterId = clusterFeature.properties?.cluster_id as number | undefined;
          const source = map.getSource(SOURCE_ID) as GeoJSONSource;
          if (source && typeof clusterId === 'number') {
            source.getClusterExpansionZoom(clusterId, (error, zoom) => {
              if (error) {
                return;
              }
              const coordinates = (clusterFeature.geometry as { coordinates: [number, number] }).coordinates;
              map.easeTo({ center: coordinates as LngLatLike, zoom });
            });
          }
        });

        map.on('mouseenter', UNCLUSTERED_LAYER_ID, () => {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', UNCLUSTERED_LAYER_ID, () => {
          map.getCanvas().style.cursor = '';
        });

        map.on('click', UNCLUSTERED_LAYER_ID, (event) => {
          const feature = event.features?.[0];
          const id = feature?.properties?.id;
          if (typeof id === 'string') {
            onSelectPlace?.(id);
            updateSelectedFilter(map, id);
          }
        });
      });

      mapRef.current = map;
      setHasError(false);
      onError?.(null);
    } catch (error) {
      setHasError(true);
      const message = error instanceof Error ? error.message : 'Map failed to load.';
      onError?.(message);
    }

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [onError, onSelectPlace, safeCenter.lng, safeCenter.lat, updateSelectedFilter]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    const updateData = () => {
      const source = map.getSource(SOURCE_ID) as GeoJSONSource | undefined;
      if (source) {
        source.setData(toGeoJson(places));
      }
    };

    if (map.isStyleLoaded()) {
      updateData();
    } else {
      map.once('load', updateData);
    }
  }, [places]);

  useEffect(() => {
    setShowEmptyAlert(places.length === 0);
  }, [places]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }
    updateSelectedFilter(map, selectedPlaceId);
  }, [selectedPlaceId, updateSelectedFilter]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }
    const targetCenter: LngLatLike = [safeCenter.lng, safeCenter.lat];
    map.flyTo({ center: targetCenter, essential: true, zoom: Math.max(map.getZoom(), 11) });
  }, [safeCenter.lng, safeCenter.lat]);

  if (hasError) {
    return (
      <div className="alert alert-warning" role="status">
        <span>
          Map failed to load. Double-check your network connection or try again later. MapLibre tiles work without an API key; if you switched to Mapbox, ensure the token and dependency are configured.
        </span>
      </div>
    );
  }

  return (
    <div className={joinClasses('relative', className)}>
      <div
        ref={containerRef}
        className={joinClasses('w-full overflow-hidden', mapClassName ?? 'h-[420px] rounded-2xl border border-base-300')}
        role="presentation"
        aria-label="Map showing filtered date locations"
      />
      {showEmptyAlert ? (
        <div className="pointer-events-auto absolute left-1/2 top-4 z-30 w-[min(360px,90vw)] -translate-x-1/2">
          <div className="alert alert-error shadow-lg flex items-start gap-3">
            <span className="text-sm">
              No matches yet. Try widening your radius, lowering the rating, or toggling off open-now.
            </span>
            <button
              type="button"
              className="btn btn-xs btn-circle btn-ghost"
              onClick={() => setShowEmptyAlert(false)}
              aria-label="Dismiss no results message"
            >
              ✕
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
