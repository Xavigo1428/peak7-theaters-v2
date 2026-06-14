export interface Movie {
  id: string;
  name: string;
  year: string;
  duration: string; // e.g., "159" or "2h 15m"
  leadActor: string;
  director: string;
  genre: string[];
  rating: string; // e.g., "PG-13", "R"
  trailer: string; // e.g., "https://www.youtube.com/watch?v=wBDLRvjHVOY"
  synopsis: string;
  type: string; // e.g., "4K HDR", "IMAX"
  img: string; // poster or backdrop image URL
  "1and2"?: boolean; // featured or special grouping
  "3and4"?: boolean; // trending or special grouping
  location?: string; // e.g., "all"
  top10?: number; // e.g. 1 to 10
  timestamp?: any;
}

