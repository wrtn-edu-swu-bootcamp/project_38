// Kakao API client for library locations

import type { LibraryLocation } from "@/types";

const KAKAO_API_BASE = "https://dapi.kakao.com/v2/local";
const REST_API_KEY = process.env.KAKAO_REST_API_KEY!;

interface KakaoPlace {
  id: string;
  place_name: string;
  address_name: string;
  phone: string;
  place_url: string;
  x: string; // longitude
  y: string; // latitude
  distance?: string;
}

/**
 * Search for libraries near a location using Kakao Local API
 */
export async function searchKakaoLibraries(
  latitude: number,
  longitude: number,
  radius: number = 5000 // meters
): Promise<LibraryLocation[]> {
  try {
    const url = `${KAKAO_API_BASE}/search/keyword.json?query=도서관&x=${longitude}&y=${latitude}&radius=${radius}&size=15`;

    const response = await fetch(url, {
      headers: {
        Authorization: `KakaoAK ${REST_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Kakao API error: ${response.status}`);
    }

    const data = await response.json();
    const places: KakaoPlace[] = data.documents || [];

    return places.map((place) => ({
      id: place.id,
      name: place.place_name,
      address: place.address_name,
      phone: place.phone || undefined,
      website: place.place_url || undefined,
      latitude: parseFloat(place.y),
      longitude: parseFloat(place.x),
      distance: place.distance ? parseFloat(place.distance) : undefined,
    }));
  } catch (error) {
    console.error("Kakao API error:", error);
    return [];
  }
}

/**
 * Search for libraries by keyword
 */
export async function searchKakaoLibrariesByKeyword(
  keyword: string,
  page: number = 1,
  size: number = 15
): Promise<LibraryLocation[]> {
  try {
    const url = `${KAKAO_API_BASE}/search/keyword.json?query=${encodeURIComponent(
      keyword + " 도서관"
    )}&page=${page}&size=${size}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `KakaoAK ${REST_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Kakao API error: ${response.status}`);
    }

    const data = await response.json();
    const places: KakaoPlace[] = data.documents || [];

    return places.map((place) => ({
      id: place.id,
      name: place.place_name,
      address: place.address_name,
      phone: place.phone || undefined,
      website: place.place_url || undefined,
      latitude: parseFloat(place.y),
      longitude: parseFloat(place.x),
    }));
  } catch (error) {
    console.error("Kakao API error:", error);
    return [];
  }
}
