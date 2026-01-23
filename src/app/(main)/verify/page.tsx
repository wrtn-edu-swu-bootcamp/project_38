"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/trpc";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";

export default function VerifyPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"text" | "url" | "image">("text");
  const [textInput, setTextInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const createFactCheck = api.factCheck.create.useMutation({
    onSuccess: (data) => {
      router.push(`/result/${data.id}`);
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleTextSubmit = () => {
    if (textInput.length < 10) {
      setError("최소 10자 이상 입력해주세요");
      return;
    }
    setError("");
    createFactCheck.mutate({
      inputType: "TEXT",
      content: textInput,
    });
  };

  const handleUrlSubmit = () => {
    try {
      new URL(urlInput);
    } catch {
      setError("유효한 URL을 입력해주세요");
      return;
    }
    setError("");
    createFactCheck.mutate({
      inputType: "URL",
      content: urlInput,
    });
  };

  const handleImageSubmit = async () => {
    if (!imageFile) {
      setError("이미지를 선택해주세요");
      return;
    }

    // For MVP, just use image filename as content
    // In production, you would upload the image and use OCR
    setError("");
    createFactCheck.mutate({
      inputType: "IMAGE",
      content: `이미지 팩트체크: ${imageFile.name}`,
      imageUrl: URL.createObjectURL(imageFile),
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            정보 검증하기
          </h1>
          <p className="text-lg text-gray-600">
            검증하고 싶은 정보를 입력하면 AI가 학술자료를 바탕으로 분석합니다
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>입력 방식 선택</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="text"
              onValueChange={(value) =>
                setActiveTab(value as "text" | "url" | "image")
              }
            >
              <TabsList className="mb-6 w-full">
                <TabsTrigger value="text" className="flex-1">
                  텍스트
                </TabsTrigger>
                <TabsTrigger value="url" className="flex-1">
                  URL
                </TabsTrigger>
                <TabsTrigger value="image" className="flex-1">
                  이미지
                </TabsTrigger>
              </TabsList>

              {/* Text Input */}
              <TabsContent value="text" className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    검증할 내용을 입력하세요
                  </label>
                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="예: 비타민 C가 감기 예방에 효과적이다..."
                    className="w-full rounded-lg border border-gray-300 p-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    rows={8}
                    maxLength={5000}
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    {textInput.length} / 5000자
                  </p>
                </div>
                {error && <p className="text-sm text-danger">{error}</p>}
                <Button
                  variant="primary"
                  size="large"
                  onClick={handleTextSubmit}
                  loading={createFactCheck.isPending}
                  disabled={createFactCheck.isPending}
                  className="w-full"
                >
                  검증 시작하기
                </Button>
              </TabsContent>

              {/* URL Input */}
              <TabsContent value="url" className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    검증할 웹페이지 URL을 입력하세요
                  </label>
                  <Input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com/article"
                    error={!!error}
                    helperText={error}
                  />
                </div>
                <Button
                  variant="primary"
                  size="large"
                  onClick={handleUrlSubmit}
                  loading={createFactCheck.isPending}
                  disabled={createFactCheck.isPending}
                  className="w-full"
                >
                  검증 시작하기
                </Button>
              </TabsContent>

              {/* Image Input */}
              <TabsContent value="image" className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    검증할 이미지를 업로드하세요
                  </label>
                  <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                    {imageFile ? (
                      <div>
                        <p className="mb-2 text-sm font-medium text-gray-700">
                          {imageFile.name}
                        </p>
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => setImageFile(null)}
                        >
                          다른 파일 선택
                        </Button>
                      </div>
                    ) : (
                      <>
                        <svg
                          className="mb-4 h-12 w-12 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-gray-600">
                          클릭하거나 드래그하여 이미지 업로드
                        </p>
                        <p className="text-xs text-gray-500">
                          JPG, PNG, GIF (최대 10MB)
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            setImageFile(e.target.files?.[0] || null)
                          }
                          className="mt-4"
                        />
                      </>
                    )}
                  </div>
                  {error && <p className="text-sm text-danger">{error}</p>}
                </div>
                <Button
                  variant="primary"
                  size="large"
                  onClick={handleImageSubmit}
                  loading={createFactCheck.isPending}
                  disabled={createFactCheck.isPending || !imageFile}
                  className="w-full"
                >
                  검증 시작하기
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <h3 className="mb-2 font-semibold text-gray-900">
                💡 검증 팁
              </h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• 구체적인 주장일수록 정확한 검증이 가능합니다</li>
                <li>• 여러 정보를 한 번에 입력하기보다 하나씩 검증하세요</li>
                <li>• 이미지는 텍스트가 명확히 보이는 것이 좋습니다</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="mb-2 font-semibold text-gray-900">
                ⏱️ 소요 시간
              </h3>
              <p className="text-sm text-gray-600">
                일반적으로 30초~2분 정도 소요됩니다. 복잡한 내용이나 많은 자료가
                필요한 경우 더 오래 걸릴 수 있습니다.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
