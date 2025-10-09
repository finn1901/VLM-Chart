import { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import './App.css';
import type { ProcessedDataPoint } from './types';
import { LoadingSkeleton } from './components/States/LoadingSkeleton';
import { ErrorState } from './components/States/ErrorState';
import { EmptyState } from './components/States/EmptyState';
import { NoResultsState } from './components/States/NoResultsState';
import { MultiFamilyFilter } from './components/Controls/MultiFamilyFilter';
import { SearchInput } from './components/Controls/SearchInput';
import { CopyLinkButton } from './components/Controls/CopyLinkButton';
import { ExportButton } from './components/Controls/ExportButton';
import { ComparisonToggle } from './components/Controls/ComparisonToggle';
import { BubbleChart } from './components/Chart/BubbleChart';
import { ComparisonPanel } from './components/Chart/ComparisonPanel';
import { useModelData } from './hooks/useModelData';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useDebounce } from './hooks/useDebounce';
import { useUrlState } from './hooks/useUrlState';
import { useFuzzySearch } from './hooks/useFuzzySearch';

const VLMBubbleChart = () => {
  const { urlState, updateUrlState } = useUrlState();
  const [searchInput, setSearchInput] = useState<string>(urlState.search);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounce search input to avoid excessive re-renders
  const debouncedSearch = useDebounce(searchInput, 300);

  const { data, isLoading, error } = useModelData();

  // Sync URL state with local state
  const selectedFamilies = urlState.families;
  const selectedModel = urlState.model;
  const searchQuery = debouncedSearch;
  const comparedModels = urlState.compare;

  const [comparisonMode, setComparisonMode] = useState(false);
  const [showComparisonPanel, setShowComparisonPanel] = useState(false);

  // Update search input when URL changes (browser back/forward)
  useEffect(() => {
    setSearchInput(urlState.search);
  }, [urlState.search]);

  // Update URL when debounced search changes
  useEffect(() => {
    if (debouncedSearch !== urlState.search) {
      updateUrlState({ search: debouncedSearch });
    }
  }, [debouncedSearch, urlState.search, updateUrlState]);

  const availableFamilies = useMemo(() => Array.from(new Set(data.map((d) => d.family))), [data]);

  const families = ['all', ...availableFamilies];

  const filteredByFamily = useMemo(() => {
    // Filter by families first
    if (!selectedFamilies.includes('all') && selectedFamilies.length > 0) {
      return data.filter((d) => selectedFamilies.includes(d.family));
    }
    return data;
  }, [data, selectedFamilies]);

  // Apply fuzzy search to family-filtered data
  const fuzzySearchResults = useFuzzySearch(filteredByFamily, searchQuery);

  const filteredData = useMemo(() => {
    return fuzzySearchResults;
  }, [fuzzySearchResults]);

  const processedData: ProcessedDataPoint[] = useMemo(
    () =>
      filteredData.map((d) => ({
        ...d,
        x: d.date.getTime(),
        y: d.score,
        z: Math.max(d.params, 0),
      })),
    [filteredData],
  );

  const filterInfo = useMemo(() => {
    if (!searchQuery && selectedFamilies.includes('all')) return null;

    const parts = [`Showing ${processedData.length} of ${data.length} models`];
    if (searchQuery) parts.push(` matching "${searchQuery}"`);
    if (!selectedFamilies.includes('all')) {
      if (selectedFamilies.length === 1) {
        parts.push(` in ${selectedFamilies[0]} family`);
      } else {
        parts.push(` in ${selectedFamilies.length} families`);
      }
    }

    return parts.join('');
  }, [searchQuery, selectedFamilies, processedData.length, data.length]);

  const handleFamiliesChange = useCallback(
    (families: string[]) => {
      updateUrlState({ families, model: null });
    },
    [updateUrlState],
  );

  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchInput(query);
      // Clear model selection when searching
      if (selectedModel) {
        updateUrlState({ model: null });
      }
    },
    [selectedModel, updateUrlState],
  );

  const handleModelSelect = useCallback(
    (modelName: string) => {
      updateUrlState({ model: modelName });
    },
    [updateUrlState],
  );

  const handleClearFilters = useCallback(() => {
    setSearchInput('');
    updateUrlState({ search: '', families: ['all'], model: null, compare: [] });
    setComparisonMode(false);
  }, [updateUrlState]);

  const handleToggleComparisonMode = useCallback(() => {
    setComparisonMode((prev) => {
      if (prev) {
        // Exiting comparison mode, clear compared models
        updateUrlState({ compare: [] });
      }
      return !prev;
    });
  }, [updateUrlState]);

  const handleToggleComparison = useCallback(
    (modelName: string) => {
      const newCompare = comparedModels.includes(modelName)
        ? comparedModels.filter((m) => m !== modelName)
        : [...comparedModels, modelName];
      updateUrlState({ compare: newCompare, model: null });
    },
    [comparedModels, updateUrlState],
  );

  const handleShowComparison = useCallback(() => {
    setShowComparisonPanel(true);
  }, []);

  const handleCloseComparison = useCallback(() => {
    setShowComparisonPanel(false);
  }, []);

  const handleRemoveFromComparison = useCallback(
    (modelName: string) => {
      const newCompare = comparedModels.filter((m) => m !== modelName);
      updateUrlState({ compare: newCompare });
      if (newCompare.length === 0) {
        setShowComparisonPanel(false);
      }
    },
    [comparedModels, updateUrlState],
  );

  const handleEscape = useCallback(() => {
    if (selectedModel) {
      updateUrlState({ model: null });
    } else if (searchInput) {
      setSearchInput('');
      updateUrlState({ search: '' });
    }
  }, [selectedModel, searchInput, updateUrlState]);

  const handleSlash = useCallback(() => {
    searchInputRef.current?.focus();
  }, []);

  useKeyboardShortcuts({
    onEscape: handleEscape,
    onSlash: handleSlash,
  });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (data.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="app-shell">
      <div className="app-content">
        <header className="app-header">
          <h1 className="app-title">Vision-Language Model Landscape</h1>
          <p className="app-subtitle">
            Benchmark scores from 2023–2025 show how quickly multimodal systems are improving. Bubble size represents
            parameter count.
          </p>
          <div className="controls-wrapper">
            <MultiFamilyFilter
              families={families}
              selectedFamilies={selectedFamilies}
              onFamiliesChange={handleFamiliesChange}
            />
            <SearchInput ref={searchInputRef} value={searchInput} onChange={handleSearchChange} />
            <ComparisonToggle
              enabled={comparisonMode}
              count={comparedModels.length}
              onToggle={handleToggleComparisonMode}
              onCompare={handleShowComparison}
            />
            <CopyLinkButton />
            <ExportButton data={processedData} />
          </div>
        </header>

        <section className="chart-card">
          <div className="chart-heading">
            <h2>Performance over time</h2>
            <p>
              Click on any bubble to inspect model details.
              {selectedModel && (
                <button onClick={() => updateUrlState({ model: null })} className="clear-selection-btn">
                  Clear selection
                </button>
              )}
            </p>
            {filterInfo && <p className="filter-info">{filterInfo}</p>}
          </div>

          {processedData.length === 0 ? (
            <NoResultsState
              searchQuery={searchQuery}
              selectedFamily={selectedFamilies.includes('all') ? 'all' : selectedFamilies.join(', ')}
              onClearFilters={handleClearFilters}
            />
          ) : (
            <BubbleChart
              processedData={processedData}
              availableFamilies={availableFamilies}
              selectedModel={selectedModel}
              onModelSelect={handleModelSelect}
              comparisonMode={comparisonMode}
              comparedModels={comparedModels}
              onToggleComparison={handleToggleComparison}
            />
          )}
        </section>

        <section className="insights-card">
          <h3>Key insights</h3>
          <ul>
            <li>65+ models evaluated from 2023–2025</li>
            <li>Performance improved from ~30 to 80+ average score</li>
            <li>Efficient 2–4B models now rival larger 2024 releases</li>
            <li>InternVL3, BlueLM, and Gemini families show strong recent performance</li>
            <li>Clear trend: newer models achieve better scores with smaller sizes</li>
          </ul>
        </section>

        <footer className="app-footer">
          <p>
            Data sourced from the{' '}
            <a
              href="https://huggingface.co/spaces/opencompass/open_vlm_leaderboard"
              target="_blank"
              rel="noopener noreferrer"
            >
              HuggingFace OpenVLM Leaderboard
            </a>
            . Benchmark scores reflect performance across multiple vision-language tasks including VQA, reasoning, and
            multimodal understanding.
          </p>
        </footer>
      </div>

      {showComparisonPanel && (
        <ComparisonPanel
          models={processedData.filter((d) => comparedModels.includes(d.name))}
          onClose={handleCloseComparison}
          onRemoveModel={handleRemoveFromComparison}
        />
      )}
    </div>
  );
};

export default VLMBubbleChart;
