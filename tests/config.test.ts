import { describe, it, expect, beforeEach } from "vitest";
import {
  configure,
  resetConfig,
  getDefaults,
  resolveConfig,
} from "../src/config.js";

describe("config", () => {
  beforeEach(() => {
    resetConfig();
  });

  describe("configure", () => {
    it("sets global defaults", () => {
      configure({ apiKey: "test-key" });
      expect(getDefaults()).toEqual({ apiKey: "test-key" });
    });

    it("merges with existing defaults", () => {
      configure({ apiKey: "test-key" });
      configure({ defaultTranslation: "spa-btx" });
      expect(getDefaults()).toEqual({
        apiKey: "test-key",
        defaultTranslation: "spa-btx",
      });
    });
  });

  describe("resetConfig", () => {
    it("clears all global defaults", () => {
      configure({ apiKey: "test-key", defaultTranslation: "spa-btx" });
      resetConfig();
      expect(getDefaults()).toEqual({});
    });
  });

  describe("resolveConfig", () => {
    it("uses provided values", () => {
      const resolved = resolveConfig({
        apiKey: "my-key",
        apiUrl: "http://localhost:3000/graphql",
        defaultTranslation: "spa-btx",
        timeout: 5000,
      });
      expect(resolved).toEqual({
        apiKey: "my-key",
        apiUrl: "http://localhost:3000/graphql",
        defaultTranslation: "spa-btx",
        timeout: 5000,
      });
    });

    it("falls back to global defaults", () => {
      configure({ apiKey: "global-key", defaultTranslation: "spa-btx" });
      const resolved = resolveConfig({ apiKey: "" });
      expect(resolved.apiKey).toBe("global-key");
      expect(resolved.defaultTranslation).toBe("spa-btx");
    });

    it("falls back to built-in defaults", () => {
      const resolved = resolveConfig({ apiKey: "my-key" });
      expect(resolved.apiUrl).toBe(
        "https://bibleql-rails.onrender.com/graphql",
      );
      expect(resolved.defaultTranslation).toBe("eng-web");
      expect(resolved.timeout).toBe(30000);
    });
  });
});
