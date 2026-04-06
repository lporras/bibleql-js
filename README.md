# bibleql-js

> **Server-side only** - This package is designed for Node.js (>=18). Never use it in browser/frontend code as it would expose your API key.

JavaScript/TypeScript SDK for the [BibleQL](https://bibleql-rails.onrender.com) GraphQL API.

## Installation

```bash
npm install bibleql-js
```

## Quick Start

```typescript
import { BibleQLClient } from "bibleql-js";

const client = new BibleQLClient({
  apiKey: process.env.BIBLEQL_API_KEY!,
});

// Get a passage
const passage = await client.passage("John 3:16");
console.log(passage.text);

// Get verse of the day
const votd = await client.verseOfTheDay();
console.log(votd.reference, votd.text);
```

## Configuration

```typescript
import { BibleQLClient } from "bibleql-js";

const client = new BibleQLClient({
  apiKey: "bql_live_...",               // Required
  apiUrl: "https://custom-api.com/graphql", // Optional (default: https://bibleql-rails.onrender.com/graphql)
  defaultTranslation: "spa-btx",        // Optional (default: "eng-web")
  timeout: 10000,                        // Optional, in ms (default: 30000)
});
```

You can also set global defaults:

```typescript
import { configure, BibleQLClient } from "bibleql-js";

configure({
  apiKey: process.env.BIBLEQL_API_KEY!,
  defaultTranslation: "spa-btx",
});

const client = new BibleQLClient({
  apiKey: process.env.BIBLEQL_API_KEY!,
});
```

## API Methods

### `translations()`

Fetch all available translations.

```typescript
const translations = await client.translations();
// [{ identifier: "eng-web", name: "World English Bible", language: "English", note: "..." }]
```

### `translation(identifier)`

Fetch a single translation with its books.

```typescript
const translation = await client.translation("eng-web");
// { identifier: "eng-web", name: "...", books: [...] }
```

### `books()`

Fetch all books.

```typescript
const books = await client.books();
// [{ bookId: "GEN", name: "Genesis", testament: "OT", position: 1 }]
```

### `languages()`

Fetch all languages with their translations.

```typescript
const languages = await client.languages();
// [{ code: "en", translationCount: 5, translations: [...] }]
```

### `passage(reference, options?)`

Fetch a passage by reference.

```typescript
const passage = await client.passage("John 3:16-18");
const passage = await client.passage("Genesis 1:1", { translation: "spa-btx" });
```

### `chapter(book, chapterNum, options?)`

Fetch all verses in a chapter.

```typescript
const verses = await client.chapter("GEN", 1);
// [{ bookId: "GEN", bookName: "Genesis", chapter: 1, verse: 1, text: "..." }, ...]
```

### `verse(book, chapterNum, verseNum, options?)`

Fetch a single verse.

```typescript
const verse = await client.verse("GEN", 1, 1);
// { bookId: "GEN", bookName: "Genesis", chapter: 1, verse: 1, text: "In the beginning..." }
```

### `randomVerse(options?)`

Fetch a random verse.

```typescript
const verse = await client.randomVerse();
const verse = await client.randomVerse({ testament: "OT", books: "GEN,EXO" });
```

### `search(query, options?)`

Search for verses.

```typescript
const verses = await client.search("love");
const verses = await client.search("faith", { limit: 10 });
```

### `verseOfTheDay(options?)`

Fetch the verse of the day.

```typescript
const passage = await client.verseOfTheDay();
const passage = await client.verseOfTheDay({ date: "2026-01-01" });
```

### `bibleIndex(options?)`

Fetch the complete Bible index with chapter and verse counts.

```typescript
const index = await client.bibleIndex();
// [{ bookId: "GEN", name: "Genesis", chapterCount: 50, chapters: [{ number: 1, verseCount: 31 }] }]
```

## Error Handling

```typescript
import {
  BibleQLClient,
  ConfigurationError,
  AuthenticationError,
  RateLimitError,
  ServerError,
  NotFoundError,
  QueryError,
  TimeoutError,
  ConnectionError,
} from "bibleql-js";

try {
  const passage = await client.passage("InvalidRef");
} catch (error) {
  if (error instanceof NotFoundError) {
    console.error("Not found:", error.message);
  } else if (error instanceof AuthenticationError) {
    console.error("Invalid API key");
  } else if (error instanceof RateLimitError) {
    console.error("Rate limited, try again later");
  } else if (error instanceof TimeoutError) {
    console.error("Request timed out");
  } else if (error instanceof ConnectionError) {
    console.error("Network error:", error.message);
  }
}
```

### Error Hierarchy

```
BibleQLError
  ConfigurationError
  ConnectionError
    TimeoutError
  APIError (status, body)
    AuthenticationError (401)
    RateLimitError (429)
    ServerError (5xx)
  QueryError (errors[])
    NotFoundError
```

## TypeScript

All types are exported:

```typescript
import type {
  Verse,
  Passage,
  Translation,
  Book,
  Chapter,
  LocalizedBook,
  Language,
  SearchResult,
  BibleQLConfig,
} from "bibleql-js";
```

## License

MIT
