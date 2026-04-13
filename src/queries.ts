export interface QueryPayload {
  query: string;
  variables: Record<string, unknown>;
}

function omitUndefined(
  obj: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result;
}

export function translations(): QueryPayload {
  return {
    query: `query {
  translations {
    identifier
    name
    language
    note
  }
}`,
    variables: {},
  };
}

export function translation(identifier: string): QueryPayload {
  return {
    query: `query($identifier: String!) {
  translation(identifier: $identifier) {
    identifier
    name
    language
    note
    books {
      bookId
      name
      testament
      position
      chapterCount
    }
  }
}`,
    variables: { identifier },
  };
}

export function books(): QueryPayload {
  return {
    query: `query {
  books {
    bookId
    name
    testament
    position
  }
}`,
    variables: {},
  };
}

export function languages(): QueryPayload {
  return {
    query: `query {
  languages {
    code
    translationCount
    translations {
      identifier
      name
      language
      note
    }
  }
}`,
    variables: {},
  };
}

export function passage(
  reference: string,
  translation?: string,
): QueryPayload {
  return {
    query: `query($reference: String!, $translation: String) {
  passage(reference: $reference, translation: $translation) {
    reference
    translationId
    translationName
    translationNote
    text
    verses {
      bookId
      bookName
      chapter
      verse
      text
    }
  }
}`,
    variables: { reference, translation },
  };
}

export function chapter(
  book: string,
  chapterNum: number,
  translation?: string,
): QueryPayload {
  return {
    query: `query($book: String!, $chapter: Int!, $translation: String) {
  chapter(book: $book, chapter: $chapter, translation: $translation) {
    bookId
    bookName
    chapter
    verse
    text
  }
}`,
    variables: { book, chapter: chapterNum, translation },
  };
}

export function verse(
  book: string,
  chapterNum: number,
  verseNum: number,
  translation?: string,
): QueryPayload {
  return {
    query: `query($book: String!, $chapter: Int!, $verse: Int!, $translation: String) {
  verse(book: $book, chapter: $chapter, verse: $verse, translation: $translation) {
    bookId
    bookName
    chapter
    verse
    text
  }
}`,
    variables: { book, chapter: chapterNum, verse: verseNum, translation },
  };
}

export function randomVerse(
  translation?: string,
  testament?: string,
  booksFilter?: string,
): QueryPayload {
  return {
    query: `query($translation: String, $testament: String, $books: String) {
  randomVerse(translation: $translation, testament: $testament, books: $books) {
    bookId
    bookName
    chapter
    verse
    text
  }
}`,
    variables: omitUndefined({ translation, testament, books: booksFilter }),
  };
}

export function search(
  queryText: string,
  translation?: string,
  limit?: number,
): QueryPayload {
  return {
    query: `query($query: String!, $translation: String, $limit: Int) {
  search(query: $query, translation: $translation, limit: $limit) {
    bookId
    bookName
    chapter
    verse
    text
  }
}`,
    variables: omitUndefined({ query: queryText, translation, limit }),
  };
}

export function semanticSearch(
  queryText: string,
  translation?: string,
  limit?: number,
): QueryPayload {
  return {
    query: `query($query: String!, $translation: String, $limit: Int) {
  semanticSearch(query: $query, translation: $translation, limit: $limit) {
    verse {
      bookId
      bookName
      chapter
      verse
      text
    }
    similarity
  }
}`,
    variables: omitUndefined({ query: queryText, translation, limit }),
  };
}

export function verseOfTheDay(
  translation?: string,
  date?: string,
): QueryPayload {
  return {
    query: `query($translation: String, $date: ISO8601Date) {
  verseOfTheDay(translation: $translation, date: $date) {
    reference
    translationId
    translationName
    translationNote
    text
    verses {
      bookId
      bookName
      chapter
      verse
      text
    }
  }
}`,
    variables: omitUndefined({ translation, date }),
  };
}

export function bibleIndex(translation?: string): QueryPayload {
  return {
    query: `query($translation: String) {
  bibleIndex(translation: $translation) {
    bookId
    name
    testament
    position
    chapterCount
    chapters {
      number
      verseCount
    }
  }
}`,
    variables: { translation },
  };
}
