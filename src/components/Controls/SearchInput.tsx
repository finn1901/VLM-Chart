import { forwardRef } from 'react';
import './SearchInput.css';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(({ value, onChange }, ref) => {
  return (
    <div className="search-input-wrapper">
      <label className="control-label" htmlFor="model-search">
        Search models
      </label>
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
      </div>
    </div>
  );
});

SearchInput.displayName = 'SearchInput';
