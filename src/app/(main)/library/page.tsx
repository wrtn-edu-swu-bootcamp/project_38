"use client";

import { useState } from "react";
import { api } from "@/lib/trpc";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export default function LibraryPage() {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [searchRadius, setSearchRadius] = useState(5000);

  const { data: libraries, refetch } = api.library.searchNearby.useQuery(
    {
      latitude: latitude!,
      longitude: longitude!,
      radius: searchRadius,
    },
    {
      enabled: latitude !== null && longitude !== null,
    }
  );

  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          alert("위치 정보를 가져올 수 없습니다: " + error.message);
        }
      );
    } else {
      alert("이 브라우저는 위치 정보를 지원하지 않습니다");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            주변 도서관 찾기
          </h1>
          <p className="text-lg text-gray-600">
            내 주변 도서관을 찾아보세요
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>위치 설정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="primary"
              onClick={handleGetLocation}
              className="w-full"
            >
              내 위치 가져오기
            </Button>
            {latitude && longitude && (
              <p className="text-sm text-gray-600 text-center">
                현재 위치: {latitude.toFixed(4)}, {longitude.toFixed(4)}
              </p>
            )}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                검색 반경 (미터)
              </label>
              <Input
                type="number"
                value={searchRadius}
                onChange={(e) => setSearchRadius(Number(e.target.value))}
                min={500}
                max={10000}
                step={500}
              />
            </div>
            {latitude && longitude && (
              <Button variant="secondary" onClick={() => refetch()} className="w-full">
                도서관 검색
              </Button>
            )}
          </CardContent>
        </Card>

        {libraries && libraries.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              검색 결과 ({libraries.length}개)
            </h2>
            {libraries.map((library) => (
              <Card key={library.id}>
                <CardContent className="py-6">
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    {library.name}
                  </h3>
                  <p className="mb-1 text-sm text-gray-600">
                    📍 {library.address}
                  </p>
                  {library.phone && (
                    <p className="mb-1 text-sm text-gray-600">
                      📞 {library.phone}
                    </p>
                  )}
                  {library.distance && (
                    <p className="mb-2 text-sm text-primary-600 font-medium">
                      내 위치에서 {(library.distance / 1000).toFixed(1)}km
                    </p>
                  )}
                  {library.website && (
                    <a
                      href={library.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 hover:underline"
                    >
                      홈페이지 방문 →
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {libraries && libraries.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600">
                주변에 도서관을 찾을 수 없습니다.
                <br />
                검색 반경을 늘려보세요.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
