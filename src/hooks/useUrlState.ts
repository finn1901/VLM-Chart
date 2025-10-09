import { useCallback, useEffect, useState } from 'react';

interface UrlState {
  families: string[];
  search: string;
  model: string | null;
  compare: string[]; // Array of model names for comparison mode
}

/**
 * Custom hook to sync state with URL parameters
 * Allows for shareable URLs and browser back/forward navigation
 */
export const useUrlState = () => {
  const [urlState, setUrlState] = useState<UrlState>(() => {
    // Initialize from URL on mount, with localStorage fallback for families
    const params = new URLSearchParams(window.location.search);
    const urlFamilies = params.get('families');
    const savedFamilies = localStorage.getItem('vlm-chart-last-families');

    let families: string[] = ['all'];
    if (urlFamilies) {
      families = urlFamilies.split(',');
    } else if (savedFamilies) {
      try {
        families = JSON.parse(savedFamilies);
      } catch {
        families = ['all'];
      }
    }

    const urlCompare = params.get('compare');
    const compare: string[] = urlCompare ? urlCompare.split(',') : [];

    return {
      families,
      search: params.get('search') || '',
      model: params.get('model') || null,
      compare,
    };
  });

  // Update URL when state changes
  useEffect(() => {
    const params = new URLSearchParams();

    if (!urlState.families.includes('all') && urlState.families.length > 0) {
      params.set('families', urlState.families.join(','));
    }

    if (urlState.search) {
      params.set('search', urlState.search);
    }

    if (urlState.model) {
      params.set('model', urlState.model);
    }

    if (urlState.compare.length > 0) {
      params.set('compare', urlState.compare.join(','));
    }

    const newUrl = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname;

    // Use replaceState to avoid creating too many history entries
    window.history.replaceState({}, '', newUrl);

    // Save families preference to localStorage
    if (!urlState.families.includes('all') && urlState.families.length > 0) {
      localStorage.setItem('vlm-chart-last-families', JSON.stringify(urlState.families));
    } else {
      localStorage.removeItem('vlm-chart-last-families');
    }
  }, [urlState]);

  // Listen for browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const urlFamilies = params.get('families');
      let families: string[] = ['all'];
      if (urlFamilies) {
        families = urlFamilies.split(',');
      }

      const urlCompare = params.get('compare');
      const compare: string[] = urlCompare ? urlCompare.split(',') : [];

      setUrlState({
        families,
        search: params.get('search') || '',
        model: params.get('model') || null,
        compare,
      });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const updateUrlState = useCallback((updates: Partial<UrlState>) => {
    setUrlState((prev) => ({ ...prev, ...updates }));
  }, []);

  return { urlState, updateUrlState };
};
