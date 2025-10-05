// src/lib/places/random.ts
import { calculateWeightedScore, evaluatePlace } from './utils';
import type { Filters, Place, SuggestionMode, SuggestionResult } from './types';

/**
 * Select a suggestion from the provided places using the desired mode.
 */
export function pickSuggestion(
  places: Place[],
  filters: Filters,
  mode: SuggestionMode = 'random'
): SuggestionResult {
  const evaluations = places.map((place) => evaluatePlace(place, filters));
  const filtered = evaluations.filter((evaluation) => evaluation.passes);

  const debugEntries = evaluations.map((evaluation) => {
    const score = mode === 'weighted' ? calculateWeightedScore(evaluation, filters) : undefined;
    return {
      id: evaluation.place.id,
      score,
      distanceKm: evaluation.distanceKm ?? undefined,
      matches: evaluation.matches
    };
  });

  if (!filtered.length) {
    return {
      place: null,
      debug: {
        mode,
        totalCandidates: places.length,
        filteredCount: 0,
        entries: debugEntries,
        note: 'No places matched the active filters.'
      }
    };
  }

  if (mode === 'random') {
    const randomIndex = Math.floor(Math.random() * filtered.length);
    const selection = filtered[randomIndex].place;
    return {
      place: selection,
      debug: {
        mode,
        totalCandidates: places.length,
        filteredCount: filtered.length,
        entries: debugEntries,
        note: `Randomly selected index ${randomIndex}.`
      }
    };
  }

  const weighted = filtered.map((evaluation) => ({
    evaluation,
    score: calculateWeightedScore(evaluation, filters)
  }));

  const totalScore = weighted.reduce((sum, item) => sum + item.score, 0);

  if (totalScore <= 0) {
    const fallbackIndex = Math.floor(Math.random() * filtered.length);
    const selection = filtered[fallbackIndex].place;
    return {
      place: selection,
      debug: {
        mode,
        totalCandidates: places.length,
        filteredCount: filtered.length,
        entries: debugEntries,
        note: 'Weighted scores were zero; reverted to uniform random selection.'
      }
    };
  }

  let threshold = Math.random() * totalScore;
  for (const item of weighted) {
    threshold -= item.score;
    if (threshold <= 0) {
      return {
        place: item.evaluation.place,
        debug: {
          mode,
          totalCandidates: places.length,
          filteredCount: filtered.length,
          entries: debugEntries,
          note: `Weighted pick with totalScore ${totalScore.toFixed(2)}.`
        }
      };
    }
  }

  const [best] = weighted.sort((a, b) => b.score - a.score);
  return {
    place: best.evaluation.place,
    debug: {
      mode,
      totalCandidates: places.length,
      filteredCount: filtered.length,
      entries: debugEntries,
      note: 'Fallback to highest-scoring place after distribution walk-through.'
    }
  };
}
