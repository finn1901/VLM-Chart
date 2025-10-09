import './ComparisonToggle.css';

interface ComparisonToggleProps {
  enabled: boolean;
  count: number;
  onToggle: () => void;
  onCompare: () => void;
}

/**
 * Toggle button for comparison mode
 * Allows users to multi-select models for side-by-side comparison
 */
export const ComparisonToggle = ({ enabled, count, onToggle, onCompare }: ComparisonToggleProps) => {
  return (
    <div className="comparison-toggle-wrapper">
      <button
        onClick={onToggle}
        className={`comparison-toggle ${enabled ? 'active' : ''}`}
        title={enabled ? 'Exit comparison mode' : 'Enter comparison mode to select multiple models'}
      >
        <svg
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
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
        <span>Compare Mode</span>
        {count > 0 && <span className="comparison-count">{count}</span>}
      </button>

      {enabled && count > 1 && (
        <button onClick={onCompare} className="comparison-view-btn" title="View comparison">
          <svg
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
            <polyline points="9 11 12 14 22 4"></polyline>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
          </svg>
          <span>Compare {count}</span>
        </button>
      )}
    </div>
  );
};
