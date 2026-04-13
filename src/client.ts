import { GraphQLClient, ClientError } from "graphql-request";
import type { BibleQLConfig, ResolvedConfig } from "./config.js";
import { resolveConfig } from "./config.js";
import * as queries from "./queries.js";
import {
  ConfigurationError,
  ConnectionError,
  TimeoutError,
  AuthenticationError,
  RateLimitError,
  ServerError,
  APIError,
  QueryError,
  NotFoundError,
} from "./errors.js";
import type {
  Verse,
  Passage,
  Translation,
  Book,
  Language,
  LocalizedBook,
  SemanticSearchResult,
} from "./types.js";

interface TranslationOptions {
  translation?: string;
}

interface RandomVerseOptions extends TranslationOptions {
  testament?: string;
  books?: string;
}

interface SearchOptions extends TranslationOptions {
  limit?: number;
}

interface VerseOfTheDayOptions extends TranslationOptions {
  date?: string;
}

export class BibleQLClient {
  private client: GraphQLClient;
  private config: ResolvedConfig;

  constructor(config: BibleQLConfig) {
    this.config = resolveConfig(config);

    if (!this.config.apiKey) {
      throw new ConfigurationError(
        "apiKey is required. Pass it to the BibleQLClient constructor.",
      );
    }

    this.client = new GraphQLClient(this.config.apiUrl, {
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      requestMiddleware: (request) => {
        return {
          ...request,
          signal: AbortSignal.timeout(this.config.timeout),
        };
      },
    });
  }

  async translations(): Promise<Translation[]> {
    const data = await this.execute(queries.translations());
    return data.translations;
  }

  async translation(identifier: string): Promise<Translation> {
    const data = await this.execute(queries.translation(identifier));
    return data.translation;
  }

  async books(): Promise<Book[]> {
    const data = await this.execute(queries.books());
    return data.books;
  }

  async languages(): Promise<Language[]> {
    const data = await this.execute(queries.languages());
    return data.languages;
  }

  async passage(
    reference: string,
    options?: TranslationOptions,
  ): Promise<Passage> {
    const t = options?.translation || this.config.defaultTranslation;
    const data = await this.execute(queries.passage(reference, t));
    return data.passage;
  }

  async chapter(
    book: string,
    chapterNum: number,
    options?: TranslationOptions,
  ): Promise<Verse[]> {
    const t = options?.translation || this.config.defaultTranslation;
    const data = await this.execute(queries.chapter(book, chapterNum, t));
    return data.chapter;
  }

  async verse(
    book: string,
    chapterNum: number,
    verseNum: number,
    options?: TranslationOptions,
  ): Promise<Verse> {
    const t = options?.translation || this.config.defaultTranslation;
    const data = await this.execute(
      queries.verse(book, chapterNum, verseNum, t),
    );
    return data.verse;
  }

  async randomVerse(options?: RandomVerseOptions): Promise<Verse> {
    const t = options?.translation || this.config.defaultTranslation;
    const data = await this.execute(
      queries.randomVerse(t, options?.testament, options?.books),
    );
    return data.randomVerse;
  }

  async search(queryText: string, options?: SearchOptions): Promise<Verse[]> {
    const t = options?.translation || this.config.defaultTranslation;
    const data = await this.execute(
      queries.search(queryText, t, options?.limit),
    );
    return data.search;
  }

  async semanticSearch(
    queryText: string,
    options?: SearchOptions,
  ): Promise<SemanticSearchResult[]> {
    const t = options?.translation || this.config.defaultTranslation;
    const data = await this.execute(
      queries.semanticSearch(queryText, t, options?.limit),
    );
    return data.semanticSearch;
  }

  async verseOfTheDay(options?: VerseOfTheDayOptions): Promise<Passage> {
    const t = options?.translation || this.config.defaultTranslation;
    const data = await this.execute(
      queries.verseOfTheDay(t, options?.date),
    );
    return data.verseOfTheDay;
  }

  async bibleIndex(options?: TranslationOptions): Promise<LocalizedBook[]> {
    const t = options?.translation || this.config.defaultTranslation;
    const data = await this.execute(queries.bibleIndex(t));
    return data.bibleIndex;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async execute(payload: queries.QueryPayload): Promise<any> {
    try {
      return await this.client.request(payload.query, payload.variables);
    } catch (error) {
      if (error instanceof ClientError) {
        const status = error.response.status;

        if (status === 401) {
          throw new AuthenticationError(
            `HTTP ${status}`,
            status,
            JSON.stringify(error.response),
          );
        }
        if (status === 429) {
          throw new RateLimitError(
            `HTTP ${status}`,
            status,
            JSON.stringify(error.response),
          );
        }
        if (status >= 500 && status <= 599) {
          throw new ServerError(
            `HTTP ${status}`,
            status,
            JSON.stringify(error.response),
          );
        }
        if (status >= 300) {
          throw new APIError(
            `HTTP ${status}`,
            status,
            JSON.stringify(error.response),
          );
        }

        // GraphQL-level errors (status 200 but errors in response)
        const gqlErrors = error.response.errors;
        if (gqlErrors && gqlErrors.length > 0) {
          const messages = gqlErrors.map(
            (e: { message: string }) => e.message,
          );
          const fullMessage = messages.join("; ");

          if (
            messages.some((m: string) =>
              m.toLowerCase().includes("not found"),
            )
          ) {
            throw new NotFoundError(fullMessage, gqlErrors as Array<{ message: string }>);
          }

          throw new QueryError(fullMessage, gqlErrors as Array<{ message: string }>);
        }
      }

      if (error instanceof Error) {
        if (
          error.name === "TimeoutError" ||
          error.name === "AbortError" ||
          error.message.includes("timeout") ||
          error.message.includes("aborted")
        ) {
          throw new TimeoutError(`Request timed out: ${error.message}`);
        }

        throw new ConnectionError(`Connection failed: ${error.message}`);
      }

      throw new ConnectionError(`Connection failed: ${String(error)}`);
    }
  }
}
