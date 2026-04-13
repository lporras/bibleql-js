// Runtime check: warn if accidentally used in a browser environment
if (typeof window !== "undefined") {
  console.warn(
    "[bibleql-js] WARNING: This package is designed for server-side (Node.js) use only. " +
      "Using it in a browser will expose your API key. " +
      "See https://github.com/lporras/bibleql-js for more information.",
  );
}

export { BibleQLClient } from "./client.js";
export { configure, resetConfig, getDefaults } from "./config.js";
export type { BibleQLConfig, ResolvedConfig } from "./config.js";
export type {
  Verse,
  Passage,
  Translation,
  Book,
  Chapter,
  LocalizedBook,
  Language,
  SearchResult,
  SemanticSearchResult,
} from "./types.js";
export {
  BibleQLError,
  ConfigurationError,
  ConnectionError,
  TimeoutError,
  APIError,
  AuthenticationError,
  RateLimitError,
  ServerError,
  QueryError,
  NotFoundError,
} from "./errors.js";

import { BibleQLClient as _BibleQLClient } from "./client.js";
import type { BibleQLConfig as _BibleQLConfig } from "./config.js";

export function createClient(config: _BibleQLConfig) {
  return new _BibleQLClient(config);
}
