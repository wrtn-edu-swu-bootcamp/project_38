// Integrated data source search system
// Combines multiple APIs to gather comprehensive information

import type { SearchResult } from "@/types";
import { searchNaverAcademic, searchNaverBooks, searchNaverNews } from "./naver";
import { searchLibraryNaru } from "./library-naru";
import { searchAladinBooks } from "./aladin";

/**
 * Search all data sources in parallel
 * Returns combined results from all APIs
 * Uses Promise.allSettled to handle partial failures gracefully
 */
export async function searchAllSources(query: string): Promise<SearchResult> {
  // Execute all searches in parallel
  const results = await Promise.allSettled([
    searchNaverAcademic(query, 10),
    searchNaverBooks(query, 5),
    searchNaverNews(query, 10),
    searchLibraryNaru(query, 10),
    searchAladinBooks(query, undefined, 5),
  ]);

  // Extract successful results, fallback to empty arrays for failures
  const [
    naverAcademicResult,
    naverBooksResult,
    naverNewsResult,
    libraryNaruResult,
    aladinBooksResult,
  ] = results.map((result) =>
    result.status === "fulfilled" ? result.value : []
  );

  // Combine and deduplicate books
  const allBooks = [...naverBooksResult, ...libraryNaruResult, ...aladinBooksResult];
  const uniqueBooks = deduplicateByTitle(allBooks);

  // Limit results
  const papers = naverAcademicResult.slice(0, 10);
  const books = uniqueBooks.slice(0, 10);
  const news = naverNewsResult.slice(0, 10);

  return {
    papers,
    books,
    news,
  };
}

/**
 * Deduplicate references by title (case-insensitive)
 */
function deduplicateByTitle<T extends { title: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const normalizedTitle = item.title.toLowerCase().trim();
    if (seen.has(normalizedTitle)) {
      return false;
    }
    seen.add(normalizedTitle);
    return true;
  });
}

/**
 * Search specific data source by type
 */
export async function searchByType(
  query: string,
  type: "academic" | "book" | "news"
) {
  switch (type) {
    case "academic":
      return await searchNaverAcademic(query, 20);
    case "book":
      const [naverBooks, libraryBooks, aladinBooks] = await Promise.all([
        searchNaverBooks(query, 10),
        searchLibraryNaru(query, 10),
        searchAladinBooks(query, undefined, 10),
      ]);
      return deduplicateByTitle([
        ...naverBooks,
        ...libraryBooks,
        ...aladinBooks,
      ]).slice(0, 20);
    case "news":
      return await searchNaverNews(query, 20);
    default:
      return [];
  }
}
