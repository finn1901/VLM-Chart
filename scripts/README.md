# Data Update Scripts

This directory contains scripts for maintaining and updating the VLM model dataset.

## update-models.py

Automatically fetches the latest Vision-Language Model data from the [OpenCompass Open VLM Leaderboard](https://huggingface.co/spaces/opencompass/open_vlm_leaderboard) and updates the application's `models.json` file.

### Features

- Fetches real-time data from OpenCompass leaderboard API
- Calculates average scores across 8 main benchmarks
- Automatically classifies models into families (Qwen, Llama, GPT, etc.)
- Handles various date and parameter formats
- Validates data before saving

### Usage

```bash
# Update models.json with latest data
python scripts/update-models.py

# Preview changes without saving (dry run)
python scripts/update-models.py --dry-run

# Save to a custom location
python scripts/update-models.py --output path/to/custom.json
```

### Requirements

- Python 3.6+ (uses only standard library, no external dependencies)

### Data Source

- **API Endpoint**: `http://opencompass.openxlab.space/assets/OpenVLM.json`
- **Leaderboard**: https://huggingface.co/spaces/opencompass/open_vlm_leaderboard
- **Benchmarks Used**: MMBench_V11, MMStar, MMMU_VAL, MathVista, OCRBench, AI2D, HallusionBench, MMVet
- **Score Calculation**: Matches official leaderboard methodology:
  - MMBench_V11: Average of English and Chinese versions
  - OCRBench: Normalized by dividing raw score by 10
  - Other benchmarks: Raw "Overall" scores
  - Final score: Average of all 8 benchmarks (rounded to 1 decimal)

### Output Format

The script generates JSON entries in the following format:

```json
{
  "name": "Model-Name",
  "date": "YYYY-MM-DD",
  "score": 75.5,
  "params": 7.0,
  "family": "FamilyName"
}
```

### Automation

To keep your dataset up-to-date automatically, you can:

#### 1. GitHub Actions (Recommended)

Create `.github/workflows/update-models.yml`:

```yaml
name: Update Models Data

on:
  schedule:
    # Run daily at 2 AM UTC
    - cron: '0 2 * * *'
  workflow_dispatch: # Allow manual triggers

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'

      - name: Update models data
        run: python scripts/update-models.py

      - name: Commit changes
        run: |
          git config --local user.email "github-actions[bot]@users.noreply.github.com"
          git config --local user.name "github-actions[bot]"
          git add src/data/models.json
          git diff --staged --quiet || git commit -m "chore: update models data"
          git push
```

#### 2. Cron Job (Linux/macOS)

```bash
# Edit crontab
crontab -e

# Add this line to run daily at 2 AM
0 2 * * * cd /path/to/vlm-chart && python scripts/update-models.py
```

#### 3. Manual Updates

Simply run the script whenever you want to refresh the data:

```bash
npm run update-models  # If you add this to package.json
# or
python scripts/update-models.py
```

### Customization

You can customize the script by editing these sections:

#### Change Benchmarks

Modify `DEFAULT_BENCHMARKS` in the script to use different benchmarks:

```python
DEFAULT_BENCHMARKS = [
    "MMBench_V11",
    "MMStar",
    # Add or remove benchmarks here
]
```

#### Add New Family Patterns

Add patterns to `FAMILY_PATTERNS` to classify new model families:

```python
FAMILY_PATTERNS = {
    "MyNewFamily": r"^MyModel",
    # ... existing patterns
}
```

### Troubleshooting

**No models converted:**
- Check if the API endpoint is accessible
- Verify the data format hasn't changed
- Run with `--dry-run` to see detailed output

**Date parsing errors:**
- The script handles common date formats automatically
- Check console warnings for problematic dates

**Missing families:**
- Models not matching any pattern are classified as "Other"
- Add new patterns to `FAMILY_PATTERNS` as needed

### Data Quality

The script performs validation to ensure:
- All models have valid release dates
- Parameter counts are present and valid
- At least one benchmark score is available
- Scores are calculated from multiple benchmarks for reliability

Models failing validation are skipped with warnings logged to the console.
