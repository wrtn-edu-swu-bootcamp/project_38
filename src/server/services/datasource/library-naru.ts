// Library Information Naru API client (국립중앙도서관)

import type { ReferenceData } from "@/types";

const LIBRARY_NARU_API_BASE = "https://www.nl.go.kr/NL/search/openApi/search.do";
const API_KEY = process.env.LIBRARY_NARU_API_KEY!;

/**
 * Search Library Information Naru (도서관 정보나루)
 */
export async function searchLibraryNaru(
  query: string,
  pageSize: number = 10
): Promise<ReferenceData[]> {
  try {
    const url = `${LIBRARY_NARU_API_BASE}?key=${API_KEY}&apiType=json&srchTarget=total&kwd=${encodeURIComponent(
      query
    )}&pageSize=${pageSize}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Library Naru API error: ${response.status}`);
    }

    const data = await response.json();
    const items = data?.result || [];

    return items.map((item: any) => {
      // Determine reference type based on item data
      let type: ReferenceData["type"] = "BOOK";
      if (item.doc_type === "학위논문") {
        type = "THESIS";
      } else if (item.doc_type === "연구보고서") {
        type = "REPORT";
      }

      return {
        type,
        title: item.title_info || item.title || "",
        authors: item.author_info || item.author || "",
        publisher: item.pub_info || item.publisher || "",
        publicationDate: item.pub_year_info || item.pubdate || undefined,
        url: item.title_url || undefined,
        snippet: item.summary || item.description || "",
        isbn: item.isbn || undefined,
      };
    });
  } catch (error) {
    console.error("Library Naru API error:", error);
    return [];
  }
}
