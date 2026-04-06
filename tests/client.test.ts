import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  ConfigurationError,
  AuthenticationError,
  RateLimitError,
  ServerError,
  APIError,
  QueryError,
  NotFoundError,
  TimeoutError,
  ConnectionError,
} from "../src/errors.js";

const mockRequest = vi.fn();

vi.mock("graphql-request", () => ({
  GraphQLClient: vi.fn().mockImplementation(() => ({
    request: mockRequest,
  })),
  ClientError: class ClientError extends Error {
    response: { status: number; errors?: Array<{ message: string }> };
    constructor(
      response: { status: number; errors?: Array<{ message: string }> },
      _request: unknown,
    ) {
      super("GraphQL Error");
      this.name = "ClientError";
      this.response = response;
    }
  },
}));

// Import after mock setup
import { BibleQLClient } from "../src/client.js";

function getClient() {
  return new BibleQLClient({ apiKey: "test-key" });
}

describe("BibleQLClient", () => {
  beforeEach(() => {
    mockRequest.mockReset();
  });

  describe("constructor", () => {
    it("throws ConfigurationError when apiKey is missing", () => {
      expect(() => new BibleQLClient({ apiKey: "" })).toThrow(
        ConfigurationError,
      );
    });

    it("creates client with valid apiKey", () => {
      expect(() => new BibleQLClient({ apiKey: "test-key" })).not.toThrow();
    });
  });

  describe("translations", () => {
    it("returns list of translations", async () => {
      const mockData = {
        translations: [
          { identifier: "eng-web", name: "World English Bible", language: "English", note: "" },
        ],
      };
      mockRequest.mockResolvedValue(mockData);

      const result = await getClient().translations();
      expect(result).toEqual(mockData.translations);
    });
  });

  describe("translation", () => {
    it("returns a single translation", async () => {
      const mockData = {
        translation: {
          identifier: "eng-web",
          name: "World English Bible",
          language: "English",
          note: "",
          books: [],
        },
      };
      mockRequest.mockResolvedValue(mockData);

      const result = await getClient().translation("eng-web");
      expect(result).toEqual(mockData.translation);
    });
  });

  describe("books", () => {
    it("returns list of books", async () => {
      const mockData = {
        books: [{ bookId: "GEN", name: "Genesis", testament: "OT", position: 1 }],
      };
      mockRequest.mockResolvedValue(mockData);

      const result = await getClient().books();
      expect(result).toEqual(mockData.books);
    });
  });

  describe("languages", () => {
    it("returns list of languages", async () => {
      const mockData = {
        languages: [{ code: "en", translationCount: 5, translations: [] }],
      };
      mockRequest.mockResolvedValue(mockData);

      const result = await getClient().languages();
      expect(result).toEqual(mockData.languages);
    });
  });

  describe("passage", () => {
    it("returns a passage", async () => {
      const mockData = {
        passage: {
          reference: "John 3:16",
          translationId: "eng-web",
          translationName: "World English Bible",
          translationNote: "",
          text: "For God so loved the world...",
          verses: [],
        },
      };
      mockRequest.mockResolvedValue(mockData);

      const result = await getClient().passage("John 3:16");
      expect(result).toEqual(mockData.passage);
    });

    it("accepts optional translation", async () => {
      mockRequest.mockResolvedValue({ passage: { reference: "John 3:16" } });

      await getClient().passage("John 3:16", { translation: "spa-btx" });
      expect(mockRequest).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ translation: "spa-btx" }),
      );
    });
  });

  describe("chapter", () => {
    it("returns chapter verses", async () => {
      const mockData = {
        chapter: [
          { bookId: "GEN", bookName: "Genesis", chapter: 1, verse: 1, text: "In the beginning..." },
        ],
      };
      mockRequest.mockResolvedValue(mockData);

      const result = await getClient().chapter("GEN", 1);
      expect(result).toEqual(mockData.chapter);
    });
  });

  describe("verse", () => {
    it("returns a single verse", async () => {
      const mockData = {
        verse: { bookId: "GEN", bookName: "Genesis", chapter: 1, verse: 1, text: "In the beginning..." },
      };
      mockRequest.mockResolvedValue(mockData);

      const result = await getClient().verse("GEN", 1, 1);
      expect(result).toEqual(mockData.verse);
    });
  });

  describe("randomVerse", () => {
    it("returns a random verse", async () => {
      const mockData = {
        randomVerse: { bookId: "PSA", bookName: "Psalms", chapter: 23, verse: 1, text: "The LORD is my shepherd..." },
      };
      mockRequest.mockResolvedValue(mockData);

      const result = await getClient().randomVerse();
      expect(result).toEqual(mockData.randomVerse);
    });

    it("accepts testament and books options", async () => {
      mockRequest.mockResolvedValue({ randomVerse: { bookId: "GEN" } });

      await getClient().randomVerse({ testament: "OT", books: "GEN,EXO" });
      expect(mockRequest).toHaveBeenCalled();
    });
  });

  describe("search", () => {
    it("returns search results", async () => {
      const mockData = {
        search: [
          { bookId: "JHN", bookName: "John", chapter: 3, verse: 16, text: "For God so loved..." },
        ],
      };
      mockRequest.mockResolvedValue(mockData);

      const result = await getClient().search("love");
      expect(result).toEqual(mockData.search);
    });

    it("accepts optional limit", async () => {
      mockRequest.mockResolvedValue({ search: [] });

      await getClient().search("love", { limit: 5 });
      expect(mockRequest).toHaveBeenCalled();
    });
  });

  describe("verseOfTheDay", () => {
    it("returns verse of the day", async () => {
      const mockData = {
        verseOfTheDay: {
          reference: "Psalm 23:1",
          text: "The LORD is my shepherd...",
          verses: [],
        },
      };
      mockRequest.mockResolvedValue(mockData);

      const result = await getClient().verseOfTheDay();
      expect(result).toEqual(mockData.verseOfTheDay);
    });

    it("accepts optional date", async () => {
      mockRequest.mockResolvedValue({ verseOfTheDay: {} });

      await getClient().verseOfTheDay({ date: "2026-01-01" });
      expect(mockRequest).toHaveBeenCalled();
    });
  });

  describe("bibleIndex", () => {
    it("returns bible index", async () => {
      const mockData = {
        bibleIndex: [
          {
            bookId: "GEN",
            name: "Genesis",
            testament: "OT",
            position: 1,
            chapterCount: 50,
            chapters: [{ number: 1, verseCount: 31 }],
          },
        ],
      };
      mockRequest.mockResolvedValue(mockData);

      const result = await getClient().bibleIndex();
      expect(result).toEqual(mockData.bibleIndex);
    });
  });

  describe("error handling", () => {
    it("throws AuthenticationError on 401", async () => {
      const { ClientError: MockClientError } = await import("graphql-request");
      mockRequest.mockRejectedValue(
        new MockClientError({ status: 401 } as any, {} as any),
      );

      await expect(getClient().translations()).rejects.toThrow(AuthenticationError);
    });

    it("throws RateLimitError on 429", async () => {
      const { ClientError: MockClientError } = await import("graphql-request");
      mockRequest.mockRejectedValue(
        new MockClientError({ status: 429 } as any, {} as any),
      );

      await expect(getClient().translations()).rejects.toThrow(RateLimitError);
    });

    it("throws ServerError on 500", async () => {
      const { ClientError: MockClientError } = await import("graphql-request");
      mockRequest.mockRejectedValue(
        new MockClientError({ status: 500 } as any, {} as any),
      );

      await expect(getClient().translations()).rejects.toThrow(ServerError);
    });

    it("throws APIError on other HTTP errors", async () => {
      const { ClientError: MockClientError } = await import("graphql-request");
      mockRequest.mockRejectedValue(
        new MockClientError({ status: 403 } as any, {} as any),
      );

      await expect(getClient().translations()).rejects.toThrow(APIError);
    });

    it("throws NotFoundError for 'not found' GraphQL errors", async () => {
      const { ClientError: MockClientError } = await import("graphql-request");
      mockRequest.mockRejectedValue(
        new MockClientError(
          { status: 200, errors: [{ message: "Translation not found" }] } as any,
          {} as any,
        ),
      );

      await expect(getClient().translation("invalid")).rejects.toThrow(NotFoundError);
    });

    it("throws QueryError for other GraphQL errors", async () => {
      const { ClientError: MockClientError } = await import("graphql-request");
      mockRequest.mockRejectedValue(
        new MockClientError(
          { status: 200, errors: [{ message: "Invalid query" }] } as any,
          {} as any,
        ),
      );

      await expect(getClient().translations()).rejects.toThrow(QueryError);
    });

    it("throws TimeoutError on timeout", async () => {
      const error = new Error("The operation was aborted due to timeout");
      error.name = "TimeoutError";
      mockRequest.mockRejectedValue(error);

      await expect(getClient().translations()).rejects.toThrow(TimeoutError);
    });

    it("throws ConnectionError on network failure", async () => {
      mockRequest.mockRejectedValue(new Error("fetch failed"));

      await expect(getClient().translations()).rejects.toThrow(ConnectionError);
    });
  });
});
