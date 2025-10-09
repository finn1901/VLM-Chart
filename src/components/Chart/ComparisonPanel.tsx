import type { ProcessedDataPoint } from '../../types';
import './ComparisonPanel.css';

interface ComparisonPanelProps {
  models: ProcessedDataPoint[];
  onClose: () => void;
  onRemoveModel: (modelName: string) => void;
}

/**
 * Side-by-side comparison panel for multiple models
 * Allows users to compare key metrics across selected models
 */
export const ComparisonPanel = ({ models, onClose, onRemoveModel }: ComparisonPanelProps) => {
  if (models.length === 0) return null;

  // Calculate comparative metrics
  const highestScore = Math.max(...models.map((m) => m.score));
  const lowestParams = Math.min(...models.map((m) => m.params));
  const mostRecent = new Date(Math.max(...models.map((m) => m.date.getTime())));

  return (
    <>
      <div className="comparison-backdrop" onClick={onClose} />
      <div className="comparison-panel">
        <div className="comparison-header">
          <div>
            <h3 className="comparison-title">Model Comparison</h3>
            <p className="comparison-subtitle">Comparing {models.length} models</p>
          </div>
          <button onClick={onClose} className="comparison-close" aria-label="Close comparison panel">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
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
        </div>

        <div className="comparison-content">
          <div className="comparison-grid">
            {models.map((model) => {
              const isHighestScore = model.score === highestScore;
              const isLowestParams = model.params === lowestParams;
              const isNewest = model.date.getTime() === mostRecent.getTime();
              const efficiency = model.params > 0 ? (model.score / model.params).toFixed(2) : 'N/A';

              return (
                <div key={model.name} className="comparison-card">
                  <div className="comparison-card-header">
                    <div>
                      <h4 className="comparison-card-title">{model.name}</h4>
                      <p className="comparison-card-family">{model.family}</p>
                    </div>
                    <button
                      onClick={() => onRemoveModel(model.name)}
                      className="comparison-remove"
                      aria-label={`Remove ${model.name} from comparison`}
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
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>

                  <div className="comparison-metrics">
                    <div className={`comparison-metric ${isHighestScore ? 'best' : ''}`}>
                      <span className="comparison-metric-label">Score</span>
                      <span className="comparison-metric-value">{model.score.toFixed(1)}</span>
                      {isHighestScore && <span className="comparison-badge">Best</span>}
                    </div>

                    <div className={`comparison-metric ${isLowestParams ? 'best' : ''}`}>
                      <span className="comparison-metric-label">Parameters</span>
                      <span className="comparison-metric-value">{model.params}B</span>
                      {isLowestParams && <span className="comparison-badge">Smallest</span>}
                    </div>

                    <div className="comparison-metric">
                      <span className="comparison-metric-label">Efficiency</span>
                      <span className="comparison-metric-value">{efficiency}</span>
                    </div>

                    <div className={`comparison-metric ${isNewest ? 'best' : ''}`}>
                      <span className="comparison-metric-label">Release Date</span>
                      <span className="comparison-metric-value">
                        {model.date.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                        })}
                      </span>
                      {isNewest && <span className="comparison-badge">Newest</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="comparison-footer">
            <button onClick={onClose} className="comparison-close-btn">
              Close Comparison
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
