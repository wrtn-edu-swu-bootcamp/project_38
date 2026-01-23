// Aladin API client for book details

import type { ReferenceData } from "@/types";

const ALADIN_API_BASE = "http://www.aladin.co.kr/ttb/api";

/**
 * Search Aladin books
 */
export async function searchAladinBooks(
  query: string,
  ttbKey?: string,
  maxResults: number = 10
): Promise<ReferenceData[]> {
  try {
    const key = ttbKey || process.env.ALADIN_TTB_KEY;
    if (!key) {
      console.warn("Aladin TTB Key not configured");
      return [];
    }

    const url = `${ALADIN_API_BASE}/ItemSearch.aspx?ttbkey=${key}&Query=${encodeURIComponent(
      query
    )}&QueryType=Title&MaxResults=${maxResults}&start=1&SearchTarget=Book&output=js&Version=20131101`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Aladin API error: ${response.status}`);
    }

    const data = await response.json();
    const items = data.item || [];

    return items.map((item: any) => ({
      type: "BOOK" as const,
      title: item.title || "",
      authors: item.author || "",
      publisher: item.publisher || "",
      publicationDate: item.pubDate || undefined,
      url: item.link || undefined,
      snippet: item.description || "",
      isbn: item.isbn13 || item.isbn || undefined,
      imageUrl: item.cover || undefined,
    }));
  } catch (error) {
    console.error("Aladin API error:", error);
    return [];
  }
}

/**
 * Get book details by ISBN
 */
export async function getAladinBookByISBN(
  isbn: string,
  ttbKey?: string
): Promise<ReferenceData | null> {
  try {
    const key = ttbKey || process.env.ALADIN_TTB_KEY;
    if (!key) {
      console.warn("Aladin TTB Key not configured");
      return null;
    }

    const url = `${ALADIN_API_BASE}/ItemLookUp.aspx?ttbkey=${key}&itemIdType=ISBN13&ItemId=${isbn}&output=js&Version=20131101`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Aladin API error: ${response.status}`);
    }

    const data = await response.json();
    const item = data.item?.[0];

    if (!item) return null;

    return {
      type: "BOOK" as const,
      title: item.title || "",
      authors: item.author || "",
      publisher: item.publisher || "",
      publicationDate: item.pubDate || undefined,
      url: item.link || undefined,
      snippet: item.description || "",
      isbn: item.isbn13 || item.isbn || undefined,
      imageUrl: item.cover || undefined,
    };
  } catch (error) {
    console.error("Aladin API error:", error);
    return null;
  }
}
