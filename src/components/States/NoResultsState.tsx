interface NoResultsStateProps {
  searchQuery?: string;
  selectedFamily?: string;
  onClearFilters: () => void;
}

export const NoResultsState = ({ searchQuery, selectedFamily, onClearFilters }: NoResultsStateProps) => {
  return (
    <div className="no-results-state">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="no-results-icon"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
        <line x1="14" y1="8" x2="8" y2="14"></line>
      </svg>
      <h3>No models found</h3>
      <p>
        {searchQuery && selectedFamily && selectedFamily !== 'all'
          ? `No models match "${searchQuery}" in the ${selectedFamily} family.`
          : searchQuery
            ? `No models match "${searchQuery}".`
            : selectedFamily && selectedFamily !== 'all'
              ? `No models found in the ${selectedFamily} family.`
              : 'No models match your current filters.'}
      </p>
      <button onClick={onClearFilters} className="clear-filters-btn">
        Clear all filters
      </button>
    </div>
  );
};
