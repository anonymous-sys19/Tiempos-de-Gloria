export interface BibleVersion {
    name: string;
    version: string;
    uri: string;
  }
  
  export interface Verse {
    verse: string;
    number: number;
    study: string;
    id: number;
  }
  
  export type Verses = Verse[];
  
  export const BIBLE_VERSIONS: BibleVersion[] = [
    {
      name: "Reina Valera 1960",
      version: "rv1960",
      uri: "/api/read/rv1960"
    },
    {
      name: "Reina Valera 1995",
      version: "rv1995",
      uri: "/api/read/rv1995"
    },
    {
      name: "Nueva versión internacional",
      version: "nvi",
      uri: "/api/read/nvi"
    },
    {
      name: "Dios habla hoy",
      version: "dhh",
      uri: "/api/read/dhh"
    },
    {
      name: "Palabra de Dios para todos",
      version: "pdt",
      uri: "/api/read/pdt"
    }
  ];