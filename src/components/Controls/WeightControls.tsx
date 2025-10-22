import { useState } from 'react';
import { BenchmarkWeights, BenchmarkName } from '../../types';
import { BENCHMARK_INFO, WEIGHT_PRESETS, DEFAULT_WEIGHTS } from '../../utils/weightedScoring';
import './WeightControls.css';

interface WeightControlsProps {
  weights: BenchmarkWeights;
  onWeightsChange: (weights: BenchmarkWeights) => void;
}

export function WeightControls({ weights, onWeightsChange }: WeightControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const benchmarkNames = Object.keys(weights) as BenchmarkName[];

  const handleWeightChange = (benchmark: BenchmarkName, value: number) => {
    onWeightsChange({
      ...weights,
      [benchmark]: value,
    });
  };

  const handlePresetSelect = (presetName: string) => {
    const preset = WEIGHT_PRESETS.find((p) => p.name === presetName);
    if (preset) {
      onWeightsChange(preset.weights);
    }
  };

  const handleReset = () => {
    onWeightsChange(DEFAULT_WEIGHTS);
  };

  return (
    <div className="weight-controls">
      <button
        className="weight-controls-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        title="Adjust which benchmarks matter most to you"
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
          <line x1="4" y1="21" x2="4" y2="14"></line>
          <line x1="4" y1="10" x2="4" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12" y2="3"></line>
          <line x1="20" y1="21" x2="20" y2="16"></line>
          <line x1="20" y1="12" x2="20" y2="3"></line>
          <line x1="1" y1="14" x2="7" y2="14"></line>
          <line x1="9" y1="8" x2="15" y2="8"></line>
          <line x1="17" y1="16" x2="23" y2="16"></line>
        </svg>
        <span>Customize Weights</span>
      </button>

      {isExpanded && (
        <div className="weight-controls-content">
          <div className="weight-controls-header">
            <h3>Benchmark Weights</h3>
            <p className="weight-controls-description">
              Adjust the importance of each benchmark to personalize model rankings based on your use case.
            </p>
          </div>

          <div className="weight-presets">
            <label>Quick Presets:</label>
            <div className="preset-buttons">
              {WEIGHT_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  className="preset-button"
                  onClick={() => handlePresetSelect(preset.name)}
                  title={preset.description}
                >
                  {preset.name}
                </button>
              ))}
              <button className="preset-button reset-button" onClick={handleReset}>
                Reset
              </button>
            </div>
          </div>

          <div className="weight-sliders">
            {benchmarkNames.map((benchmark) => {
              const info = BENCHMARK_INFO[benchmark];
              const weight = weights[benchmark];

              return (
                <div key={benchmark} className="weight-slider">
                  <div className="slider-header">
                    <label htmlFor={`weight-${benchmark}`}>
                      <span className="benchmark-name">{info.name}</span>
                      <span className="benchmark-description">{info.description}</span>
                    </label>
                    <span className="weight-value">{weight.toFixed(1)}×</span>
                  </div>
                  <input
                    id={`weight-${benchmark}`}
                    type="range"
                    min="0"
                    max="3"
                    step="0.1"
                    value={weight}
                    onChange={(e) => handleWeightChange(benchmark, parseFloat(e.target.value))}
                    className="weight-input"
                  />
                  <div className="slider-labels">
                    <span>0× (ignore)</span>
                    <span>1× (normal)</span>
                    <span>3× (critical)</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="weight-controls-footer">
            <p className="weight-note">
              Note: Weights are multipliers. A weight of 2.0× means the benchmark is twice as important as a benchmark
              with weight 1.0×.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
