import type { ProcessedDataPoint } from '../../types';
import './ModelDetailsPanel.css';

interface ModelDetailsPanelProps {
  model: ProcessedDataPoint | null;
  onClose: () => void;
}

/**
 * Detailed panel displaying comprehensive model information
 * Shows when a bubble is clicked on the chart
 */
export const ModelDetailsPanel = ({ model, onClose }: ModelDetailsPanelProps) => {
  if (!model) return null;

  // Calculate relative performance metrics
  const performanceCategory =
    model.score >= 80 ? 'Excellent' : model.score >= 70 ? 'Very Good' : model.score >= 60 ? 'Good' : 'Moderate';

  const sizeCategory =
    model.params >= 100 ? 'Extra Large' : model.params >= 50 ? 'Large' : model.params >= 10 ? 'Medium' : 'Small';

  const efficiency = model.params > 0 ? (model.score / model.params).toFixed(2) : 'N/A';

  return (
    <>
      <div className="model-details-backdrop" onClick={onClose} />
      <div className="model-details-panel">
        <div className="model-details-header">
          <div>
            <h3 className="model-details-title">{model.name}</h3>
            <p className="model-details-family">{model.family} Family</p>
          </div>
          <button onClick={onClose} className="model-details-close" aria-label="Close details panel">
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

        <div className="model-details-content">
          <div className="model-details-section">
            <h4 className="model-details-section-title">Performance Metrics</h4>
            <div className="model-details-grid">
              <div className="model-details-metric">
                <span className="model-details-metric-label">Benchmark Score</span>
                <span className="model-details-metric-value">{model.score.toFixed(1)}</span>
                <span className="model-details-metric-category">{performanceCategory}</span>
              </div>
              <div className="model-details-metric">
                <span className="model-details-metric-label">Parameters</span>
                <span className="model-details-metric-value">{model.params}B</span>
                <span className="model-details-metric-category">{sizeCategory}</span>
              </div>
              <div className="model-details-metric">
                <span className="model-details-metric-label">Efficiency</span>
                <span className="model-details-metric-value">{efficiency}</span>
                <span className="model-details-metric-category">Score per B params</span>
              </div>
            </div>
          </div>

          <div className="model-details-section">
            <h4 className="model-details-section-title">Model Information</h4>
            <div className="model-details-info-grid">
              <div className="model-details-info-item">
                <span className="model-details-info-label">Release Date</span>
                <span className="model-details-info-value">
                  {model.date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="model-details-info-item">
                <span className="model-details-info-label">Model Family</span>
                <span className="model-details-info-value">{model.family}</span>
              </div>
              <div className="model-details-info-item">
                <span className="model-details-info-label">Model Name</span>
                <span className="model-details-info-value">{model.name}</span>
              </div>
            </div>
          </div>

          <div className="model-details-section">
            <h4 className="model-details-section-title">About the Benchmark</h4>
            <p className="model-details-description">
              Scores are derived from the{' '}
              <a
                href="https://huggingface.co/spaces/opencompass/open_vlm_leaderboard"
                target="_blank"
                rel="noopener noreferrer"
                className="model-details-link"
              >
                HuggingFace OpenVLM Leaderboard
              </a>
              , which evaluates vision-language models across multiple challenging benchmarks including visual question
              answering, reasoning, and multimodal understanding tasks.
            </p>
          </div>

          <div className="model-details-footer">
            <button onClick={onClose} className="model-details-close-btn">
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
