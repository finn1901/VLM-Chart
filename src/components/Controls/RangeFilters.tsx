import { useState, useCallback } from 'react';
import './RangeFilters.css';

export interface RangeFilterValues {
  scoreMin: number;
  scoreMax: number;
  dateMin: number;
  dateMax: number;
  paramsMin: number;
  paramsMax: number;
}

interface RangeFiltersProps {
  values: RangeFilterValues;
  onChange: (values: RangeFilterValues) => void;
  scoreBounds: { min: number; max: number };
  dateBounds: { min: number; max: number };
  paramsBounds: { min: number; max: number };
}

/**
 * Advanced filtering component with range sliders for score, date, and model size
 */
export const RangeFilters = ({ values, onChange, scoreBounds, dateBounds, paramsBounds }: RangeFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleScoreMinChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMin = Number(e.target.value);
      onChange({ ...values, scoreMin: Math.min(newMin, values.scoreMax) });
    },
    [values, onChange],
  );

  const handleScoreMaxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMax = Number(e.target.value);
      onChange({ ...values, scoreMax: Math.max(newMax, values.scoreMin) });
    },
    [values, onChange],
  );

  const handleDateMinChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMin = Number(e.target.value);
      onChange({ ...values, dateMin: Math.min(newMin, values.dateMax) });
    },
    [values, onChange],
  );

  const handleDateMaxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMax = Number(e.target.value);
      onChange({ ...values, dateMax: Math.max(newMax, values.dateMin) });
    },
    [values, onChange],
  );

  const handleParamsMinChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMin = Number(e.target.value);
      onChange({ ...values, paramsMin: Math.min(newMin, values.paramsMax) });
    },
    [values, onChange],
  );

  const handleParamsMaxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMax = Number(e.target.value);
      onChange({ ...values, paramsMax: Math.max(newMax, values.paramsMin) });
    },
    [values, onChange],
  );

  const handleReset = useCallback(() => {
    onChange({
      scoreMin: scoreBounds.min,
      scoreMax: scoreBounds.max,
      dateMin: dateBounds.min,
      dateMax: dateBounds.max,
      paramsMin: paramsBounds.min,
      paramsMax: paramsBounds.max,
    });
  }, [scoreBounds, dateBounds, paramsBounds, onChange]);

  const isFiltered =
    values.scoreMin !== scoreBounds.min ||
    values.scoreMax !== scoreBounds.max ||
    values.dateMin !== dateBounds.min ||
    values.dateMax !== dateBounds.max ||
    values.paramsMin !== paramsBounds.min ||
    values.paramsMax !== paramsBounds.max;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const formatParams = (params: number) => {
    if (params < 1) return `${(params * 1000).toFixed(0)}M`;
    return `${params.toFixed(1)}B`;
  };

  return (
    <div className="range-filters">
      <button
        className={`range-filters-toggle ${isExpanded ? 'expanded' : ''} ${isFiltered ? 'filtered' : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
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
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
        </svg>
        <span>Advanced Filters</span>
        {isFiltered && <span className="filters-badge">Active</span>}
        <svg
          className="toggle-icon"
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
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isExpanded && (
        <div className="range-filters-panel">
          <div className="range-filter">
            <div className="range-filter-header">
              <label className="range-filter-label">Benchmark Score</label>
              <span className="range-filter-values">
                {values.scoreMin.toFixed(1)} - {values.scoreMax.toFixed(1)}
              </span>
            </div>
            <div className="range-slider-container">
              <input
                type="range"
                min={scoreBounds.min}
                max={scoreBounds.max}
                step="0.5"
                value={values.scoreMin}
                onChange={handleScoreMinChange}
                className="range-slider range-slider-min"
              />
              <input
                type="range"
                min={scoreBounds.min}
                max={scoreBounds.max}
                step="0.5"
                value={values.scoreMax}
                onChange={handleScoreMaxChange}
                className="range-slider range-slider-max"
              />
            </div>
          </div>

          <div className="range-filter">
            <div className="range-filter-header">
              <label className="range-filter-label">Release Date</label>
              <span className="range-filter-values">
                {formatDate(values.dateMin)} - {formatDate(values.dateMax)}
              </span>
            </div>
            <div className="range-slider-container">
              <input
                type="range"
                min={dateBounds.min}
                max={dateBounds.max}
                step={86400000} // 1 day in milliseconds
                value={values.dateMin}
                onChange={handleDateMinChange}
                className="range-slider range-slider-min"
              />
              <input
                type="range"
                min={dateBounds.min}
                max={dateBounds.max}
                step={86400000}
                value={values.dateMax}
                onChange={handleDateMaxChange}
                className="range-slider range-slider-max"
              />
            </div>
          </div>

          <div className="range-filter">
            <div className="range-filter-header">
              <label className="range-filter-label">Model Size (Parameters)</label>
              <span className="range-filter-values">
                {formatParams(values.paramsMin)} - {formatParams(values.paramsMax)}
              </span>
            </div>
            <div className="range-slider-container">
              <input
                type="range"
                min={paramsBounds.min}
                max={paramsBounds.max}
                step={paramsBounds.max > 100 ? 10 : 1}
                value={values.paramsMin}
                onChange={handleParamsMinChange}
                className="range-slider range-slider-min"
              />
              <input
                type="range"
                min={paramsBounds.min}
                max={paramsBounds.max}
                step={paramsBounds.max > 100 ? 10 : 1}
                value={values.paramsMax}
                onChange={handleParamsMaxChange}
                className="range-slider range-slider-max"
              />
            </div>
          </div>

          {isFiltered && (
            <button className="range-filters-reset" onClick={handleReset}>
              Reset Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};
