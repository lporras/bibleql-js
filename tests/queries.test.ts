import { describe, it, expect } from "vitest";
import * as queries from "../src/queries.js";

describe("queries", () => {
  describe("translations", () => {
    it("returns query with no variables", () => {
      const result = queries.translations();
      expect(result.query).toContain("translations");
      expect(result.variables).toEqual({});
    });
  });

  describe("translation", () => {
    it("returns query with identifier variable", () => {
      const result = queries.translation("eng-web");
      expect(result.query).toContain("$identifier: String!");
      expect(result.variables).toEqual({ identifier: "eng-web" });
    });

    it("includes books in the query", () => {
      const result = queries.translation("eng-web");
      expect(result.query).toContain("books");
      expect(result.query).toContain("chapterCount");
    });
  });

  describe("books", () => {
    it("returns query with no variables", () => {
      const result = queries.books();
      expect(result.query).toContain("books");
      expect(result.variables).toEqual({});
    });
  });

  describe("languages", () => {
    it("returns query with no variables", () => {
      const result = queries.languages();
      expect(result.query).toContain("languages");
      expect(result.query).toContain("translationCount");
      expect(result.variables).toEqual({});
    });
  });

  describe("passage", () => {
    it("returns query with reference and translation", () => {
      const result = queries.passage("John 3:16", "eng-web");
      expect(result.query).toContain("$reference: String!");
      expect(result.variables).toEqual({
        reference: "John 3:16",
        translation: "eng-web",
      });
    });

    it("includes verses in the query", () => {
      const result = queries.passage("John 3:16");
      expect(result.query).toContain("verses");
    });
  });

  describe("chapter", () => {
    it("returns query with book, chapter, and translation", () => {
      const result = queries.chapter("GEN", 1, "eng-web");
      expect(result.query).toContain("$book: String!");
      expect(result.query).toContain("$chapter: Int!");
      expect(result.variables).toEqual({
        book: "GEN",
        chapter: 1,
        translation: "eng-web",
      });
    });
  });

  describe("verse", () => {
    it("returns query with book, chapter, verse, and translation", () => {
      const result = queries.verse("GEN", 1, 1, "eng-web");
      expect(result.query).toContain("$verse: Int!");
      expect(result.variables).toEqual({
        book: "GEN",
        chapter: 1,
        verse: 1,
        translation: "eng-web",
      });
    });
  });

  describe("randomVerse", () => {
    it("returns query with translation only", () => {
      const result = queries.randomVerse("eng-web");
      expect(result.query).toContain("randomVerse");
      expect(result.variables).toEqual({ translation: "eng-web" });
    });

    it("includes optional testament and books", () => {
      const result = queries.randomVerse("eng-web", "OT", "GEN,EXO");
      expect(result.variables).toEqual({
        translation: "eng-web",
        testament: "OT",
        books: "GEN,EXO",
      });
    });

    it("omits undefined optional variables", () => {
      const result = queries.randomVerse("eng-web", undefined, undefined);
      expect(result.variables).toEqual({ translation: "eng-web" });
      expect(result.variables).not.toHaveProperty("testament");
      expect(result.variables).not.toHaveProperty("books");
    });
  });

  describe("search", () => {
    it("returns query with query text and translation", () => {
      const result = queries.search("love", "eng-web");
      expect(result.query).toContain("$query: String!");
      expect(result.variables).toEqual({
        query: "love",
        translation: "eng-web",
      });
    });

    it("includes optional limit", () => {
      const result = queries.search("love", "eng-web", 10);
      expect(result.variables).toEqual({
        query: "love",
        translation: "eng-web",
        limit: 10,
      });
    });

    it("omits undefined limit", () => {
      const result = queries.search("love", "eng-web");
      expect(result.variables).not.toHaveProperty("limit");
    });
  });

  describe("semanticSearch", () => {
    it("returns query with query text and translation", () => {
      const result = queries.semanticSearch("love", "eng-web");
      expect(result.query).toContain("$query: String!");
      expect(result.query).toContain("semanticSearch");
      expect(result.variables).toEqual({
        query: "love",
        translation: "eng-web",
      });
    });

    it("includes verse and similarity fields in query", () => {
      const result = queries.semanticSearch("love", "eng-web");
      expect(result.query).toContain("verse");
      expect(result.query).toContain("similarity");
      expect(result.query).toContain("bookId");
      expect(result.query).toContain("bookName");
    });

    it("includes optional limit", () => {
      const result = queries.semanticSearch("love", "eng-web", 10);
      expect(result.variables).toEqual({
        query: "love",
        translation: "eng-web",
        limit: 10,
      });
    });

    it("omits undefined limit", () => {
      const result = queries.semanticSearch("love", "eng-web");
      expect(result.variables).not.toHaveProperty("limit");
    });
  });

  describe("verseOfTheDay", () => {
    it("returns query with translation", () => {
      const result = queries.verseOfTheDay("eng-web");
      expect(result.query).toContain("verseOfTheDay");
      expect(result.variables).toEqual({ translation: "eng-web" });
    });

    it("includes optional date", () => {
      const result = queries.verseOfTheDay("eng-web", "2026-01-01");
      expect(result.variables).toEqual({
        translation: "eng-web",
        date: "2026-01-01",
      });
    });

    it("omits undefined date", () => {
      const result = queries.verseOfTheDay("eng-web");
      expect(result.variables).not.toHaveProperty("date");
    });
  });

  describe("bibleIndex", () => {
    it("returns query with translation", () => {
      const result = queries.bibleIndex("eng-web");
      expect(result.query).toContain("bibleIndex");
      expect(result.query).toContain("chapters");
      expect(result.variables).toEqual({ translation: "eng-web" });
    });
  });
});
