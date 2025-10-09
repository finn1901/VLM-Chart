import './LoadingSkeleton.css';

/**
 * Loading skeleton component that mimics the chart layout
 * Provides better perceived performance than a simple spinner
 */
export const LoadingSkeleton = () => {
  return (
    <div className="loading-skeleton">
      <div className="skeleton-header">
        <div className="skeleton-title"></div>
        <div className="skeleton-subtitle"></div>
        <div className="skeleton-controls">
          <div className="skeleton-control"></div>
          <div className="skeleton-control"></div>
        </div>
      </div>

      <div className="skeleton-chart-card">
        <div className="skeleton-chart-header">
          <div className="skeleton-chart-title"></div>
        </div>
        <div className="skeleton-chart-content">
          {/* Simulate chart axes */}
          <div className="skeleton-axis skeleton-y-axis"></div>
          <div className="skeleton-axis skeleton-x-axis"></div>

          {/* Simulate data bubbles */}
          {Array.from({ length: 20 }).map((_, index) => (
            <div
              key={index}
              className="skeleton-bubble"
              style={{
                left: `${10 + (index % 10) * 9}%`,
                top: `${20 + Math.floor(index / 10) * 40 + (index % 3) * 10}%`,
                width: `${20 + (index % 3) * 15}px`,
                height: `${20 + (index % 3) * 15}px`,
                animationDelay: `${index * 0.05}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="skeleton-insights-card">
        <div className="skeleton-insights-title"></div>
        <div className="skeleton-insights-items">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="skeleton-insights-item"></div>
          ))}
        </div>
      </div>
    </div>
  );
};
