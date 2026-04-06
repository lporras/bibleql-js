export interface BibleQLConfig {
  apiKey: string;
  apiUrl?: string;
  defaultTranslation?: string;
  timeout?: number;
}

export interface ResolvedConfig {
  apiKey: string;
  apiUrl: string;
  defaultTranslation: string;
  timeout: number;
}

const DEFAULT_API_URL = "https://bibleql-rails.onrender.com/graphql";
const DEFAULT_TRANSLATION = "eng-web";
const DEFAULT_TIMEOUT = 30000;

let globalDefaults: Partial<BibleQLConfig> = {};

export function configure(config: Partial<BibleQLConfig>): void {
  globalDefaults = { ...globalDefaults, ...config };
}

export function resetConfig(): void {
  globalDefaults = {};
}

export function getDefaults(): Partial<BibleQLConfig> {
  return { ...globalDefaults };
}

export function resolveConfig(config: BibleQLConfig): ResolvedConfig {
  return {
    apiKey: config.apiKey || globalDefaults.apiKey || "",
    apiUrl: config.apiUrl || globalDefaults.apiUrl || DEFAULT_API_URL,
    defaultTranslation:
      config.defaultTranslation ||
      globalDefaults.defaultTranslation ||
      DEFAULT_TRANSLATION,
    timeout: config.timeout ?? globalDefaults.timeout ?? DEFAULT_TIMEOUT,
  };
}
