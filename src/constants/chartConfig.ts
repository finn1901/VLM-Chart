export const FAMILY_COLORS: Record<string, string> = {
  Qwen: '#8884d8',
  Kimi: '#82ca9d',
  SmolVLM: '#ffc658',
  CogVLM: '#ff8042',
  Llama: '#a4de6c',
  LLaVA: '#d0ed57',
  InternVL: '#8dd1e1',
  Phi: '#83a6ed',
  DeepSeek: '#8884d8',
  BlueLM: '#ea5545',
  OpenAI: '#f46a9b',
  Anthropic: '#ef9b20',
  Google: '#4285f4',
  Granite: '#ede15b',
  PaliGemma: '#95e1d3',
  NVLM: '#38ada9',
  GLM: '#ee5a6f',
  Molmo: '#c7ecee',
  ShareGPT: '#786fa6',
  Pixtral: '#f8a5c2',
  MiMo: '#63cdda',
  InstructBLIP: '#cf6a87',
  Mantis: '#b8e994',
  Yi: '#e55039',
  Other: '#999999',
};

export const BUBBLE_SIZE = {
  MIN: 200,
  MAX: 1200,
} as const;

export const CHART_MARGINS = {
  top: 20,
  right: 20,
  bottom: 60,
  left: 60,
} as const;

export const Y_AXIS_CONFIG = {
  TICK_INTERVAL: 10,
  PADDING: 5,
} as const;
