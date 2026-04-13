export interface Verse {
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface Passage {
  reference: string;
  translationId: string;
  translationName: string;
  translationNote: string;
  text: string;
  verses: Verse[];
}

export interface Book {
  bookId: string;
  name: string;
  testament: string;
  position: number;
}

export interface Chapter {
  number: number;
  verseCount: number;
  verses?: Verse[];
}

export interface LocalizedBook {
  bookId: string;
  name: string;
  testament: string;
  position: number;
  chapterCount: number;
  chapters?: Chapter[];
}

export interface Translation {
  identifier: string;
  name: string;
  language: string;
  note: string;
  books?: LocalizedBook[];
}

export interface Language {
  code: string;
  translationCount: number;
  translations: Translation[];
}

export interface SearchResult {
  totalCount: number;
  verses: Verse[];
}

export interface SemanticSearchResult {
  verse: Verse;
  similarity: number;
}
