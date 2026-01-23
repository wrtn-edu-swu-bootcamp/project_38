// Naver API client for academic papers, books, and news

import type { ReferenceData } from "@/types";

const NAVER_API_BASE = "https://openapi.naver.com/v1/search";

interface NaverApiHeaders {
  "X-Naver-Client-Id": string;
  "X-Naver-Client-Secret": string;
  [key: string]: string;
}

const headers: NaverApiHeaders = {
  "X-Naver-Client-Id": process.env.NAVER_API_CLIENT_ID!,
  "X-Naver-Client-Secret": process.env.NAVER_API_CLIENT_SECRET!,
};

// Helper function to strip HTML tags
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

/**
 * Search Naver Academic (학술정보)
 */
export async function searchNaverAcademic(
  query: string,
  display: number = 10
): Promise<ReferenceData[]> {
  try {
    const url = `${NAVER_API_BASE}/doc.json?query=${encodeURIComponent(
      query
    )}&display=${display}`;

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`Naver Academic API error: ${response.status}`);
    }

    const data = await response.json();

    return (data.items || []).map((item: any) => ({
      type: "ACADEMIC_PAPER" as const,
      title: stripHtml(item.title),
      authors: stripHtml(item.author || ""),
      publisher: stripHtml(item.publisher || ""),
      publicationDate: item.pubdate || undefined,
      url: item.link,
      snippet: stripHtml(item.description || ""),
    }));
  } catch (error) {
    console.error("Naver Academic API error:", error);
    return [];
  }
}

/**
 * Search Naver Books (도서)
 */
export async function searchNaverBooks(
  query: string,
  display: number = 10
): Promise<ReferenceData[]> {
  try {
    const url = `${NAVER_API_BASE}/book.json?query=${encodeURIComponent(
      query
    )}&display=${display}`;

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`Naver Books API error: ${response.status}`);
    }

    const data = await response.json();

    return (data.items || []).map((item: any) => ({
      type: "BOOK" as const,
      title: stripHtml(item.title),
      authors: stripHtml(item.author || ""),
      publisher: stripHtml(item.publisher || ""),
      publicationDate: item.pubdate || undefined,
      url: item.link,
      snippet: stripHtml(item.description || ""),
      isbn: item.isbn,
      imageUrl: item.image,
    }));
  } catch (error) {
    console.error("Naver Books API error:", error);
    return [];
  }
}

/**
 * Search Naver News (뉴스)
 */
export async function searchNaverNews(
  query: string,
  display: number = 10
): Promise<ReferenceData[]> {
  try {
    const url = `${NAVER_API_BASE}/news.json?query=${encodeURIComponent(
      query
    )}&display=${display}&sort=sim`;

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`Naver News API error: ${response.status}`);
    }

    const data = await response.json();

    return (data.items || []).map((item: any) => ({
      type: "NEWS" as const,
      title: stripHtml(item.title),
      publisher: stripHtml(item.originallink || ""),
      publicationDate: item.pubDate || undefined,
      url: item.link,
      snippet: stripHtml(item.description || ""),
    }));
  } catch (error) {
    console.error("Naver News API error:", error);
    return [];
  }
}
