import { forwardRef, useState, useEffect, useRef } from 'react';
import type { ProcessedDataPoint } from '../../types';
import './SearchInput.css';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  suggestions?: ProcessedDataPoint[];
  onSelectSuggestion?: (modelName: string) => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onChange, suggestions = [], onSelectSuggestion }, ref) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close suggestions when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setShowSuggestions(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Show suggestions when typing
    useEffect(() => {
      if (value.trim().length >= 2 && suggestions.length > 0) {
        setShowSuggestions(true);
        setSelectedIndex(-1);
      } else {
        setShowSuggestions(false);
      }
    }, [value, suggestions.length]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!showSuggestions || suggestions.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case 'Enter':
          if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
            e.preventDefault();
            handleSelectSuggestion(suggestions[selectedIndex].name);
          }
          break;
        case 'Escape':
          setShowSuggestions(false);
          setSelectedIndex(-1);
          break;
      }
    };

    const handleSelectSuggestion = (modelName: string) => {
      onChange(modelName);
      setShowSuggestions(false);
      setSelectedIndex(-1);
      if (onSelectSuggestion) {
        onSelectSuggestion(modelName);
      }
    };

    const highlightMatch = (text: string, query: string) => {
      if (!query.trim()) return text;

      const parts = text.split(new RegExp(`(${query})`, 'gi'));
      return parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={index} className="search-highlight">
            {part}
          </mark>
        ) : (
          part
        ),
      );
    };

    const displayedSuggestions = suggestions.slice(0, 8); // Limit to 8 suggestions

    return (
      <div className="search-input-wrapper" ref={containerRef}>
        <div className="search-input-container">
          <svg
            className="search-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            ref={ref}
            id="model-search"
            type="text"
            className="search-input"
            placeholder="Search by model name... (Press / to focus)"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
          />
          {value && (
            <button className="search-clear" onClick={() => onChange('')} aria-label="Clear search">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}

          {showSuggestions && displayedSuggestions.length > 0 && (
            <ul className="search-suggestions" role="listbox">
              {displayedSuggestions.map((model, index) => (
                <li
                  key={model.name}
                  className={`search-suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
                  onClick={() => handleSelectSuggestion(model.name)}
                  role="option"
                  aria-selected={index === selectedIndex}
                >
                  <div className="suggestion-main">
                    <span className="suggestion-name">{highlightMatch(model.name, value)}</span>
                    <span className="suggestion-score">{model.score.toFixed(1)}</span>
                  </div>
                  <div className="suggestion-meta">
                    <span className="suggestion-family">{model.family}</span>
                    <span className="suggestion-params">{model.params}B params</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  },
);

SearchInput.displayName = 'SearchInput';
