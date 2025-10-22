# Weighted Benchmark Scoring Feature

## Overview

The VLM Chart now supports **customizable benchmark weighting**, allowing users to personalize model rankings based on what matters most to them. Instead of showing a fixed average across all benchmarks, users can now adjust the importance of individual benchmarks to match their specific use case.

## How It Works

### Default Behavior
By default, all 8 benchmarks are weighted equally (weight = 1.0):
- MMBench_V11
- MMStar
- MMMU_VAL
- MathVista
- OCRBench
- AI2D
- HallusionBench
- MMVet

### Custom Weighting
Users can adjust weights from 0.0 (not important) to 3.0 (very important) for each benchmark. The final score is calculated as:

```
Weighted Score = (Σ benchmark_score × weight) / (Σ weights)
```

### Example
**Default weights (all = 1.0):**
- Model with scores [80, 70, 75, 85, 90, 80, 65, 88]
- Average = 79.1

**OCR-focused (OCRBench = 3.0, rest = 1.0):**
- OCRBench (90) gets 3x importance
- Weighted average = 81.7 (higher because OCR score was 90)

## User Interface

### Weight Controls Component

Located at the top of the controls section, the Weight Controls component includes:

1. **Collapsible Panel** - Click to expand/collapse
2. **Quick Presets** - Pre-configured weight profiles:
   - **Balanced** - Equal weights for all benchmarks
   - **OCR-Focused** - Prioritizes text recognition (OCRBench × 3)
   - **Math-Focused** - Emphasizes mathematical reasoning (MathVista × 3)
   - **Reasoning-Heavy** - Boosts complex reasoning tasks
   - **Reliability-Focused** - Prioritizes hallucination resistance
   - **General Chat** - Optimized for chat applications

3. **Individual Sliders** - Fine-tune each benchmark's weight
   - Visual percentage display
   - Descriptive labels for each benchmark
   - Real-time updates to chart

4. **Reset Button** - Return to default equal weights

### Visual Feedback

- **Live Updates** - Chart re-sorts immediately as you adjust weights
- **Percentage Display** - Shows relative importance of each benchmark
- **Tooltip Details** - Expanded tooltip shows all individual benchmark scores

## Implementation Details

### Data Structure

Each model now includes individual benchmark scores:

```json
{
  "name": "Model-Name",
  "date": "2025-01-15",
  "score": 80.7,
  "params": 7.0,
  "family": "FamilyName",
  "benchmarks": {
    "MMBench_V11": 88.1,
    "MMStar": 75.3,
    "MMMU_VAL": 75.6,
    "MathVista": 76.8,
    "OCRBench": 92.7,
    "AI2D": 90.0,
    "HallusionBench": 63.2,
    "MMVet": 83.9
  }
}
```

### Key Files

**Utilities:**
- `src/utils/weightedScoring.ts` - Core scoring logic and presets
  - `calculateWeightedScore()` - Computes weighted average
  - `WEIGHT_PRESETS` - Pre-configured profiles
  - `BENCHMARK_INFO` - Descriptions for each benchmark

**Components:**
- `src/components/Controls/WeightControls.tsx` - UI component
- `src/components/Controls/WeightControls.css` - Styling
- `src/components/Chart/CustomTooltip.tsx` - Enhanced tooltip with benchmark details

**Data Processing:**
- `scripts/update-models.py` - Updated crawler stores individual scores
- `src/hooks/useModelData.ts` - Loads benchmark data
- `src/App.tsx` - Applies weights and recalculates scores

### Type Safety

Full TypeScript support with interfaces:
```typescript
interface BenchmarkScores {
  MMBench_V11: number;
  MMStar: number;
  MMMU_VAL: number;
  MathVista: number;
  OCRBench: number;
  AI2D: number;
  HallusionBench: number;
  MMVet: number;
}

interface BenchmarkWeights extends BenchmarkScores {}
```

## Use Cases

### 1. OCR-Heavy Applications
For document processing, receipt scanning, or text extraction:
- **Preset:** "OCR-Focused"
- **Custom:** OCRBench (3.0), AI2D (1.5)
- **Result:** Models with strong text recognition rank higher

### 2. Mathematical/Scientific Tools
For education, research, or technical assistance:
- **Preset:** "Math-Focused"
- **Custom:** MathVista (3.0), MMMU_VAL (1.5)
- **Result:** Models with strong reasoning abilities rank higher

### 3. General Chat Applications
For conversational AI or customer support:
- **Preset:** "General Chat"
- **Custom:** MMBench_V11 (2.0), MMVet (2.0), HallusionBench (1.5)
- **Result:** Well-rounded models with good reliability rank higher

### 4. Specialized Reasoning Tasks
For complex problem-solving or analysis:
- **Preset:** "Reasoning-Heavy"
- **Custom:** MMStar (2.0), MMMU_VAL (2.0), MathVista (2.0)
- **Result:** Models excelling at complex reasoning rank higher

## Performance

- **Real-time Calculation** - Scores update instantly
- **Optimized Rendering** - useMemo hooks prevent unnecessary re-renders
- **Smooth Transitions** - Chart animations maintained
- **Responsive Design** - Works on desktop, tablet, and mobile

## Future Enhancements

Possible improvements:
- Save custom weight profiles to localStorage
- Share custom weights via URL parameters
- Add more benchmark categories
- Benchmark importance heatmap visualization
- Compare weight profiles side-by-side
- Export weighted rankings to CSV

## Technical Notes

### Score Normalization

Benchmark scores are already normalized (0-100 scale) by the crawler:
- OCRBench raw scores are divided by 10
- MMBench_V11 averages English and Chinese versions
- Other benchmarks use raw "Overall" scores

### Data Updates

When running `npm run update-models`, the crawler automatically:
1. Fetches latest data from OpenVLM leaderboard
2. Extracts individual benchmark scores
3. Stores both original and weighted averages
4. Maintains backward compatibility

### State Management

Weights are managed via React state:
- `benchmarkWeights` state in App.tsx
- Passed to WeightControls component
- Applied during data processing
- Recalculates on every weight change

## Credits

- Benchmark data from [OpenCompass OpenVLM Leaderboard](https://huggingface.co/spaces/opencompass/open_vlm_leaderboard)
- Inspired by the need for task-specific model evaluation
- Built with React, TypeScript, and Recharts
