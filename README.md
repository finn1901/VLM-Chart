# VLM Chart - Vision-Language Model Landscape

An interactive visualization tool for exploring and comparing Vision-Language Models (VLMs) based on benchmark performance over time. This project visualizes 65+ models from 2023-2025, showing how multimodal AI systems have evolved.

![VLM Chart Preview](https://img.shields.io/badge/React-18.2.0-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0.2-blue) ![Vite](https://img.shields.io/badge/Vite-4.4.5-purple)

## Features

### Core Functionality
- 📊 **Interactive Bubble Chart** - Visualize models over time with parameter count represented by bubble size
- 🔍 **Real-time Search** - Filter models by name with instant results
- 🏷️ **Family Filtering** - Filter by model family (Qwen, GPT, Claude, etc.)
- 📈 **65+ Models** - Comprehensive dataset from 2023-2025
- 💡 **Model Selection** - Click any bubble to view detailed model information

### User Experience
- ⌨️ **Keyboard Shortcuts**:
  - Press `/` to focus search input
  - Press `Escape` to clear selection or search
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🎨 **Dark Theme** - Modern, easy-on-the-eyes design
- ⚡ **Fast & Optimized** - Memoized calculations and efficient rendering

### Technical Features
- 🧩 **Component Architecture** - Clean, modular, maintainable code
- 🔄 **Custom Hooks** - Reusable logic for data loading and keyboard shortcuts
- 🎯 **TypeScript** - Fully typed for better development experience
- ♿ **Loading States** - Proper loading, error, and empty state handling

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/finn1901/VLM-Chart.git
cd VLM-Chart

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will open at `http://localhost:5173`

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

### Deployment

```bash
# Deploy to GitHub Pages
npm run deploy
```

## Usage

### Searching for Models
1. Click the search input or press `/` to focus
2. Type the model name (e.g., "Qwen", "GPT", "Claude")
3. Results update in real-time
4. Press `Escape` to clear the search

### Filtering by Family
1. Use the "Filter by family" dropdown
2. Select a family to view only those models
3. Combine with search for precise filtering

### Viewing Model Details
1. Click any bubble on the chart
2. Tooltip shows:
   - Model name
   - Benchmark score
   - Parameter count
   - Release date
   - Model family
3. Click "Clear selection" or press `Escape` to dismiss

### Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `/` | Focus search input |
| `Escape` | Clear selection or search |

## Adding New Models

To add new models to the dataset:

1. Open `src/data/models.json`
2. Add a new entry following this format:

```json
{
  "name": "Model-Name",
  "date": "YYYY-MM-DD",
  "score": 75.5,
  "params": 7.0,
  "family": "FamilyName"
}
```

3. If adding a new family, update the color in `src/constants/chartConfig.ts`:

```typescript
export const FAMILY_COLORS: Record<string, string> = {
  // ... existing colors
  NewFamily: '#yourcolor',
};
```

## Project Structure

```
src/
├── components/
│   ├── Chart/
│   │   ├── BubbleChart.tsx          # Main chart component
│   │   └── CustomTooltip.tsx        # Tooltip display
│   ├── Controls/
│   │   ├── FamilyFilter.tsx         # Family dropdown filter
│   │   ├── SearchInput.tsx          # Search functionality
│   │   └── SearchInput.css
│   └── States/
│       ├── LoadingState.tsx         # Loading spinner
│       ├── ErrorState.tsx           # Error display
│       ├── EmptyState.tsx           # No data message
│       └── NoResultsState.tsx       # No search results
├── constants/
│   └── chartConfig.ts               # Colors, sizes, chart config
├── data/
│   └── models.json                  # Model dataset
├── hooks/
│   ├── useModelData.ts              # Data loading hook
│   └── useKeyboardShortcuts.ts      # Keyboard shortcuts hook
├── types/
│   └── index.ts                     # TypeScript interfaces
├── App.tsx                          # Main application component
├── App.css                          # Application styles
└── main.tsx                         # Application entry point
```

## Technology Stack

- **React 18.2** - UI framework
- **TypeScript 5.0** - Type safety
- **Vite 4.4** - Build tool and dev server
- **Recharts 3.2** - Charting library
- **ESLint** - Code linting
- **GitHub Pages** - Deployment

## Data Source

The benchmark scores in this visualization represent model performance on standardized vision-language tasks. The dataset includes:
- Model release dates
- Benchmark scores (0-100 scale)
- Parameter counts (in billions)
- Model families/organizations

**Note:** This is a visualization tool. For specific benchmark methodology and detailed results, please refer to the original benchmark papers and model documentation.

## Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm run deploy   # Deploy to GitHub Pages
```

### Code Quality

The project uses:
- **ESLint** for code linting
- **TypeScript strict mode** for type checking
- **Component modularity** for maintainability
- **Custom hooks** for logic reusability

## Contributing

Contributions are welcome! Here's how you can help:

1. **Add new models** - Update `models.json` with latest VLM releases
2. **Report bugs** - Open an issue with details
3. **Suggest features** - Share ideas for improvements
4. **Submit PRs** - Fix bugs or add features

### Contribution Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Roadmap

Planned features:
- [ ] Export data to CSV
- [ ] Export chart as PNG/SVG
- [ ] Model comparison mode
- [ ] Benchmark methodology info section
- [ ] Date range filtering
- [ ] Chart zoom and pan
- [ ] Additional visualization types

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Model data compiled from public benchmark results
- Built with React, TypeScript, and Recharts
- Inspired by the rapid advancement in vision-language models

## Links

- **Live Demo**: [https://finn1901.github.io/VLM-Chart](https://finn1901.github.io/VLM-Chart)
- **Repository**: [https://github.com/finn1901/VLM-Chart](https://github.com/finn1901/VLM-Chart)
- **Issues**: [https://github.com/finn1901/VLM-Chart/issues](https://github.com/finn1901/VLM-Chart/issues)

---

Made with ❤️ by [finn1901](https://github.com/finn1901)
