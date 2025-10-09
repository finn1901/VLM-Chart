import { useMemo } from 'react';
import Fuse from 'fuse.js';

interface SearchableData {
  name: string;
  family: string;
}

/**
 * Custom hook for fuzzy searching through model data
 * Uses Fuse.js for intelligent string matching with typo tolerance
 */
export const useFuzzySearch = <T extends SearchableData>(data: T[], query: string): T[] => {
  const fuse = useMemo(() => {
    return new Fuse(data, {
      keys: ['name', 'family'],
      threshold: 0.3, // Lower = stricter matching (0.0 = exact, 1.0 = match anything)
      distance: 100, // Maximum distance for matching
      minMatchCharLength: 2, // Minimum character length for matching
      includeScore: true,
      ignoreLocation: true, // Search in entire string, not just beginning
    });
  }, [data]);

  const results = useMemo(() => {
    if (!query.trim()) {
      return data;
    }

    const searchResults = fuse.search(query);
    return searchResults.map((result) => result.item);
  }, [fuse, query, data]);

  return results;
};
