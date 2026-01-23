"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/trpc";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";

export default function LibraryPage() {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [searchRadius, setSearchRadius] = useState(5000);
  const [keyword, setKeyword] = useState("");
  const [searchMode, setSearchMode] = useState<"location" | "keyword">("location");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Location-based search
  const {
    data: nearbyLibraries,
    isLoading: isLoadingNearby,
    refetch: refetchNearby,
  } = api.library.searchNearby.useQuery(
    {
      latitude: latitude!,
      longitude: longitude!,
      radius: searchRadius,
    },
    {
      enabled: latitude !== null && longitude !== null && searchMode === "location",
    }
  );

  // Keyword-based search
  const {
    data: keywordLibraries,
    isLoading: isLoadingKeyword,
    refetch: refetchKeyword,
  } = api.library.searchByKeyword.useQuery(
    {
      keyword,
      userLatitude: latitude || undefined,
      userLongitude: longitude || undefined,
    },
    {
      enabled: keyword.length > 0 && searchMode === "keyword",
    }
  );

  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      setIsLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setIsLoadingLocation(false);
        },
        (error) => {
          alert("위치 정보를 가져올 수 없습니다: " + error.message);
          setIsLoadingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      alert("이 브라우저는 위치 정보를 지원하지 않습니다");
    }
  };

  const handleKeywordSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      refetchKeyword();
    }
  };

  const libraries = searchMode === "location" ? nearbyLibraries : keywordLibraries;
  const isLoading = searchMode === "location" ? isLoadingNearby : isLoadingKeyword;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            도서관 찾기
          </h1>
          <p className="text-lg text-gray-600">
            내 주변 도서관을 찾거나 지역명으로 검색하세요
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <Tabs
              defaultValue="location"
              onValueChange={(value) => setSearchMode(value as "location" | "keyword")}
            >
              <TabsList className="mb-6 w-full">
                <TabsTrigger value="location" className="flex-1">
                  내 위치 기반
                </TabsTrigger>
                <TabsTrigger value="keyword" className="flex-1">
                  키워드 검색
                </TabsTrigger>
              </TabsList>

              <TabsContent value="location" className="space-y-4">
                <Button
                  variant="primary"
                  onClick={handleGetLocation}
                  loading={isLoadingLocation}
                  disabled={isLoadingLocation}
                  className="w-full"
                >
                  {latitude && longitude ? "위치 다시 가져오기" : "내 위치 가져오기"}
                </Button>
                
                {latitude && longitude && (
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-4">
                      현재 위치를 기준으로 검색합니다
                    </p>
                    <div className="flex items-center gap-4">
                      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                        검색 반경
                      </label>
                      <select
                        value={searchRadius}
                        onChange={(e) => setSearchRadius(Number(e.target.value))}
                        className="flex-1 rounded-lg border border-gray-300 p-2 text-sm"
                      >
                        <option value={1000}>1km</option>
                        <option value={2000}>2km</option>
                        <option value={3000}>3km</option>
                        <option value={5000}>5km</option>
                        <option value={10000}>10km</option>
                        <option value={20000}>20km</option>
                      </select>
                      <Button
                        variant="secondary"
                        onClick={() => refetchNearby()}
                        disabled={isLoadingNearby}
                      >
                        검색
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="keyword" className="space-y-4">
                <form onSubmit={handleKeywordSearch} className="flex gap-2">
                  <Input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="지역명을 입력하세요 (예: 강남, 종로)"
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={!keyword.trim() || isLoadingKeyword}
                  >
                    검색
                  </Button>
                </form>
                {!latitude && !longitude && (
                  <p className="text-xs text-gray-500 text-center">
                    위치 권한을 허용하면 거리 정보도 확인할 수 있습니다.
                    <button
                      type="button"
                      onClick={handleGetLocation}
                      className="ml-1 text-primary-600 hover:underline"
                    >
                      위치 가져오기
                    </button>
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-r-transparent" />
            <p className="mt-4 text-gray-600">도서관을 검색하는 중...</p>
          </div>
        )}

        {!isLoading && libraries && libraries.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              검색 결과 ({libraries.length}개)
            </h2>
            {libraries.map((library) => (
              <Card key={library.id} className="hover:border-primary-200 transition-colors">
                <CardContent className="py-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="mb-2 text-lg font-semibold text-gray-900">
                        {library.name}
                      </h3>
                      <p className="mb-1 text-sm text-gray-600">
                        {library.address}
                      </p>
                      {library.phone && (
                        <p className="mb-1 text-sm text-gray-600">
                          {library.phone}
                        </p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      {library.distance !== undefined && library.distance !== null && (
                        <p className="text-lg font-bold text-primary-600">
                          {library.distance >= 1000
                            ? `${(library.distance / 1000).toFixed(1)}km`
                            : `${Math.round(library.distance)}m`}
                        </p>
                      )}
                      {library.website && (
                        <a
                          href={library.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary-600 hover:underline"
                        >
                          상세보기 →
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && libraries && libraries.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <svg
                className="mx-auto mb-4 h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <p className="text-gray-600">
                {searchMode === "location"
                  ? "주변에 도서관을 찾을 수 없습니다. 검색 반경을 늘려보세요."
                  : "검색 결과가 없습니다. 다른 키워드로 검색해보세요."}
              </p>
            </CardContent>
          </Card>
        )}

        {!isLoading && !libraries && searchMode === "location" && !latitude && (
          <Card>
            <CardContent className="py-12 text-center">
              <svg
                className="mx-auto mb-4 h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <p className="text-gray-600">
                위치 정보를 가져온 후 주변 도서관을 검색할 수 있습니다.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
