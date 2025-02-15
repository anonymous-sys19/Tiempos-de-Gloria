export interface Book {
  id: number;
  name: string;
  chapters: number;
  testament: 'old' | 'new';
}

export interface Verse {
  id: number;
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface SearchResult {
  id: number;
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

export type BibleVersion = 'rvr1960' | 'ntv' | 'nvi';