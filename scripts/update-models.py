#!/usr/bin/env python3
"""
OpenVLM Leaderboard Data Crawler
==================================
Fetches the latest VLM model data from OpenCompass leaderboard and updates models.json

Data Source: http://opencompass.openxlab.space/assets/OpenVLM.json
Leaderboard: https://huggingface.co/spaces/opencompass/open_vlm_leaderboard

Usage:
    python scripts/update-models.py [--output path/to/models.json]
"""

import json
import re
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional
from urllib.request import urlopen
from urllib.error import URLError

# Configuration
LEADERBOARD_URL = "http://opencompass.openxlab.space/assets/OpenVLM.json"
DEFAULT_OUTPUT_PATH = "src/data/models.json"

# Benchmark configuration for calculating overall score
# These are the 8 default benchmarks from the leaderboard
# Format: (benchmark_name, normalization_factor)
# - None means no normalization (score used as-is)
# - Number means divide score by that factor
DEFAULT_BENCHMARKS = [
    ("MMBench_V11", None),      # Average of EN and CN
    ("MMStar", None),
    ("MMMU_VAL", None),
    ("MathVista", None),
    ("OCRBench", 10),           # Normalized by dividing by 10
    ("AI2D", None),
    ("HallusionBench", None),
    ("MMVet", None)
]

# Model family classification patterns
FAMILY_PATTERNS = {
    "Qwen": r"^Qwen",
    "Kimi": r"^Kimi",
    "SmolVLM": r"^SmolVLM",
    "CogVLM": r"^CogVLM",
    "Llama": r"^Llama",
    "LLaVA": r"^LLaVA",
    "PaliGemma": r"^PaliGemma",
    "Mantis": r"^Mantis",
    "NVLM": r"^NVLM",
    "GLM": r"^GLM",
    "Molmo": r"^Molmo",
    "Yi": r"^Yi",
    "InternVL": r"^InternVL",
    "Phi": r"^Phi",
    "DeepSeek": r"^DeepSeek",
    "BlueLM": r"^BlueLM",
    "ShareGPT": r"^ShareGPT",
    "Pixtral": r"^Pixtral",
    "Granite": r"^granite",
    "MiMo": r"^MiMo",
    "InstructBLIP": r"^InstructBLIP",
    "OpenAI": r"^(GPT|gpt)",
    "Anthropic": r"^Claude",
    "Google": r"^Gemini",
}

# Parameter estimates for API models and models without known params
# Based on public information, research papers, and industry estimates
# Order matters - more specific patterns should come first
PARAM_ESTIMATES = {
    # OpenAI models - specific versions first
    r"^ChatGPT-4o": 200.0,         # ChatGPT-4o variants
    r"^GPT-5.*nano": 7.0,          # GPT-5 nano variants
    r"^GPT-5.*mini": 50.0,         # GPT-5 mini variants
    r"^GPT-5": 300.0,              # GPT-5 base estimated ~300B
    r"^GPT-4\.5": 250.0,           # GPT-4.5 estimated ~250B
    r"^GPT-4\.1.*nano": 7.0,       # GPT-4.1 nano variants
    r"^GPT-4\.1.*mini": 50.0,      # GPT-4.1 mini variants
    r"^GPT-4\.1": 220.0,           # GPT-4.1 estimated ~220B
    r"^GPT-4o.*mini": 50.0,        # GPT-4o mini variants
    r"^GPT-4o": 200.0,             # GPT-4o estimated ~200B
    r"^GPT-4v": 220.0,             # GPT-4v (vision) estimated ~220B
    r"^GPT-4": 220.0,              # GPT-4 base estimated ~220B

    # Anthropic Claude models - specific versions first
    r"^Claude3\.7": 120.0,         # Claude 3.7 estimated ~120B
    r"^Claude3\.5": 100.0,         # Claude 3.5 estimated ~100B
    r"^Claude3.*Haiku": 40.0,      # Claude 3 Haiku (small)
    r"^Claude3.*Sonnet": 100.0,    # Claude 3 Sonnet (medium)
    r"^Claude3.*Opus": 175.0,      # Claude 3 Opus (large)
    r"^Claude3": 80.0,             # Claude 3 base estimated ~80B
    r"^Claude2": 52.0,             # Claude 2 estimated ~52B

    # Google Gemini models - specific versions first
    r"^Gemini.*Nano": 3.0,         # Gemini Nano is tiny
    r"^Gemini.*Flash": 8.0,        # Gemini Flash models are smaller
    r"^Gemini.*2\.5": 70.0,        # Gemini 2.5 estimated ~70B
    r"^Gemini.*2\.0": 70.0,        # Gemini 2.0 estimated ~70B
    r"^Gemini.*1\.5.*Pro": 60.0,   # Gemini 1.5 Pro estimated ~60B
    r"^Gemini.*1\.5": 60.0,        # Gemini 1.5 base
    r"^Gemini.*1\.0": 50.0,        # Gemini 1.0 estimated ~50B

    # Chinese API models
    r"^GLM-4v": 13.0,              # GLM-4v estimated ~13B
    r"^Qwen-VL": 72.0,             # Qwen-VL API estimated ~72B
    r"^Yi-Vision": 34.0,           # Yi-Vision estimated ~34B
    r"^Step-1\.5V": 30.0,          # Step-1.5V estimated ~30B
    r"^Step-1o": 30.0,             # Step-1o estimated ~30B
    r"^HunYuan": 52.0,             # HunYuan estimated ~52B
    r"^SenseNova": 40.0,           # SenseNova estimated ~40B
    r"^moonshot": 8.0,             # Moonshot estimated ~8B
    r"^CongRong": 14.0,            # CongRong estimated ~14B
    r"^TeleMM": 8.0,               # TeleMM estimated ~8B
    r"^Taiyi": 7.0,                # Taiyi estimated ~7B
    r"^JT-VL": 7.0,                # JT-VL estimated ~7B
    r"^abab6": 70.0,               # MiniMax abab6 estimated ~70B
    r"^abab7": 100.0,              # MiniMax abab7 estimated ~100B

    # Other API models
    r"^Reka.*Flash": 21.0,         # Reka Flash estimated ~21B
    r"^Reka.*Edge": 7.0,           # Reka Edge estimated ~7B
    r"^grok-2": 314.0,             # xAI Grok-2 estimated ~314B

    # Add more patterns as needed
}


def fetch_leaderboard_data() -> Dict[str, Any]:
    """Fetch the latest data from OpenVLM leaderboard."""
    print(f"Fetching data from {LEADERBOARD_URL}...")
    try:
        response = urlopen(LEADERBOARD_URL, timeout=30)
        data = json.loads(response.read())
        print(f"Successfully fetched data (timestamp: {data.get('time', 'unknown')})")
        return data
    except URLError as e:
        print(f"Error fetching data: {e}")
        raise
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
        raise


def classify_family(model_name: str) -> str:
    """Determine model family based on name patterns."""
    for family, pattern in FAMILY_PATTERNS.items():
        if re.match(pattern, model_name, re.IGNORECASE):
            return family
    return "Other"


def parse_date(date_str: Optional[str]) -> Optional[str]:
    """Convert various date formats to YYYY-MM-DD format."""
    if not date_str:
        return None

    # Try common formats
    formats = [
        "%Y/%m/%d",  # 2024/05/31
        "%Y-%m-%d",  # 2024-05-31
        "%Y%m%d",    # 20240531
        "%d/%m/%Y",  # 31/05/2024
    ]

    for fmt in formats:
        try:
            dt = datetime.strptime(date_str, fmt)
            return dt.strftime("%Y-%m-%d")
        except ValueError:
            continue

    print(f"Warning: Could not parse date '{date_str}'")
    return None


def extract_benchmark_scores(model_data: Dict[str, Any], benchmarks: List[tuple]) -> Optional[Dict[str, float]]:
    """
    Extract individual benchmark scores from model data.

    Returns a dictionary with benchmark names as keys and normalized scores as values.
    Returns None if any benchmark is missing.
    """
    scores = {}

    for benchmark_name, normalization in benchmarks:
        score = None

        # Special handling for MMBench_V11 (average of EN and CN)
        if benchmark_name == "MMBench_V11":
            en_score = None
            cn_score = None

            if "MMBench_TEST_EN_V11" in model_data:
                en_data = model_data["MMBench_TEST_EN_V11"]
                if isinstance(en_data, dict) and "Overall" in en_data:
                    en_score = en_data["Overall"]

            if "MMBench_TEST_CN_V11" in model_data:
                cn_data = model_data["MMBench_TEST_CN_V11"]
                if isinstance(cn_data, dict) and "Overall" in cn_data:
                    cn_score = cn_data["Overall"]

            # Calculate average of EN and CN
            if en_score is not None and cn_score is not None:
                score = (en_score + cn_score) / 2
            elif en_score is not None:
                score = en_score
            elif cn_score is not None:
                score = cn_score

        # Standard benchmark handling
        elif benchmark_name in model_data:
            bench_data = model_data[benchmark_name]

            # Extract 'Overall' or 'Final Score' for OCRBench
            if isinstance(bench_data, dict):
                if "Overall" in bench_data:
                    score = bench_data["Overall"]
                elif benchmark_name == "OCRBench" and "Final Score" in bench_data:
                    score = bench_data["Final Score"]
            elif isinstance(bench_data, (int, float)):
                score = bench_data

        # Apply normalization if specified
        if score is not None and isinstance(score, (int, float)):
            if score == "N/A" or (isinstance(score, str) and score.strip() == ""):
                return None

            try:
                score = float(score)
                if normalization is not None:
                    score = score / normalization
                scores[benchmark_name] = round(score, 1)
            except (ValueError, TypeError):
                return None
        else:
            # Missing benchmark
            return None

    return scores if len(scores) == len(benchmarks) else None


def calculate_average_score(benchmark_scores: Dict[str, float]) -> float:
    """Calculate average score from benchmark scores dictionary."""
    if not benchmark_scores:
        return None
    return round(sum(benchmark_scores.values()) / len(benchmark_scores), 1)


def extract_params(model_data: Dict[str, Any]) -> Optional[float]:
    """Extract parameter count from model metadata."""
    meta = model_data.get("META", {})

    # Try different field names
    param_fields = ["Parameters", "Params (B)", "Param (B)", "params"]

    for field in param_fields:
        if field in meta:
            param_value = meta[field]

            # Skip empty values
            if not param_value or param_value == "":
                continue

            # Handle string values like "7B", "1.5B", etc.
            if isinstance(param_value, str):
                # Remove 'B' suffix and convert
                param_value = param_value.replace("B", "").replace("b", "").strip()
                try:
                    return float(param_value)
                except ValueError:
                    continue
            elif isinstance(param_value, (int, float)):
                return float(param_value)

    return None


def estimate_params(model_name: str) -> Optional[float]:
    """
    Estimate parameter count for models without known parameters.
    Uses pattern matching against PARAM_ESTIMATES dictionary.

    Returns None if no estimate pattern matches.
    """
    for pattern, estimate in PARAM_ESTIMATES.items():
        if re.match(pattern, model_name, re.IGNORECASE):
            return estimate
    return None


def convert_to_app_format(leaderboard_data: Dict[str, Any], skip_no_params: bool = False) -> List[Dict[str, Any]]:
    """Convert leaderboard data to application's models.json format."""
    models = []
    results = leaderboard_data.get("results", {})

    print(f"Processing {len(results)} models...")

    for model_name, model_data in results.items():
        meta = model_data.get("META", {})

        # Extract metadata
        release_date = parse_date(meta.get("Time") or meta.get("Publish Date") or meta.get("Release Date"))
        if not release_date:
            # Skip models without dates
            print(f"  Skipping {model_name}: no date")
            continue

        params = extract_params(model_data)
        params_estimated = False

        if params is None:
            # Try to estimate parameters based on model name patterns
            params = estimate_params(model_name)

            if params is not None:
                # Successfully estimated
                params_estimated = True
            else:
                if skip_no_params:
                    # Skip models without parameter info
                    print(f"  Skipping {model_name}: no parameter info")
                    continue
                else:
                    # Use a conservative default for truly unknown models
                    # This should be rare now with estimation
                    params = 10.0
                    params_estimated = True
                    print(f"  Warning: Using default 10B for {model_name}")

        # Extract individual benchmark scores
        benchmark_scores = extract_benchmark_scores(model_data, DEFAULT_BENCHMARKS)
        if benchmark_scores is None:
            # Skip models without valid scores
            print(f"  Skipping {model_name}: no valid scores")
            continue

        # Calculate average score
        avg_score = calculate_average_score(benchmark_scores)

        # Classify family
        family = classify_family(model_name)

        # Create model entry with benchmark scores
        model = {
            "name": model_name,
            "date": release_date,
            "score": avg_score,
            "params": params,
            "family": family,
            "benchmarks": benchmark_scores
        }

        # Add paramsEstimated flag if parameters were estimated
        if params_estimated:
            model["paramsEstimated"] = True

        models.append(model)

    # Sort by date
    models.sort(key=lambda x: x["date"])

    print(f"Successfully converted {len(models)} models")
    return models


def save_models(models: List[Dict[str, Any]], output_path: str):
    """Save models to JSON file."""
    output_file = Path(output_path)
    output_file.parent.mkdir(parents=True, exist_ok=True)

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(models, f, indent=2, ensure_ascii=False)

    print(f"Saved {len(models)} models to {output_path}")


def main():
    """Main execution function."""
    import argparse

    parser = argparse.ArgumentParser(
        description="Update models.json with latest data from OpenVLM leaderboard"
    )
    parser.add_argument(
        "--output",
        default=DEFAULT_OUTPUT_PATH,
        help=f"Output path for models.json (default: {DEFAULT_OUTPUT_PATH})"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Fetch and process data without saving"
    )
    parser.add_argument(
        "--skip-no-params",
        action="store_true",
        help="Skip models without parameter information (default: estimate based on model patterns)"
    )

    args = parser.parse_args()

    try:
        # Fetch data
        leaderboard_data = fetch_leaderboard_data()

        # Convert to app format
        models = convert_to_app_format(leaderboard_data, skip_no_params=args.skip_no_params)

        if not models:
            print("Warning: No models were converted. Check data format.")
            return 1

        # Display statistics
        print("\nStatistics:")
        print(f"  Total models: {len(models)}")
        families = {}
        for model in models:
            family = model["family"]
            families[family] = families.get(family, 0) + 1

        print(f"  Families: {len(families)}")
        for family, count in sorted(families.items(), key=lambda x: -x[1]):
            print(f"    {family}: {count}")

        # Save or display
        if args.dry_run:
            print("\nDry run - not saving. Sample models:")
            for model in models[:5]:
                print(f"  {model}")
        else:
            save_models(models, args.output)
            print(f"\n✓ Successfully updated {args.output}")

        return 0

    except Exception as e:
        print(f"\n✗ Error: {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    exit(main())
