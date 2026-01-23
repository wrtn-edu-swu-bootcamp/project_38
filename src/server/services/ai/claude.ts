// Claude AI client for fact-checking analysis

import Anthropic from "@anthropic-ai/sdk";

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export interface FactCheckAnalysisRequest {
  content: string;
  references: {
    type: string;
    title: string;
    authors?: string;
    snippet?: string;
    url?: string;
  }[];
}

export interface FactCheckAnalysisResponse {
  trustScore: number; // 0-100
  verdict: "CONFIRMED" | "MOSTLY_TRUE" | "CAUTION" | "FALSE" | "UNVERIFIABLE";
  summary: string;
  explanation: string;
  keyPoints: string[];
  relevantReferences: number[]; // indices of relevant references
}

/**
 * Analyze content using Claude AI
 */
export async function analyzeWithClaude(
  request: FactCheckAnalysisRequest
): Promise<FactCheckAnalysisResponse> {
  try {
    const prompt = createFactCheckPrompt(request);

    const message = await anthropic.messages.create({
      model: "claude-opus-4-20250514",
      max_tokens: 4096,
      temperature: 0.3, // Lower temperature for more consistent analysis
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Extract text from response
    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Parse JSON response
    const analysis = parseClaudeResponse(responseText);

    return analysis;
  } catch (error) {
    console.error("Claude AI error:", error);
    throw new Error("AI 분석 중 오류가 발생했습니다.");
  }
}

/**
 * Create fact-check prompt for Claude
 */
function createFactCheckPrompt(request: FactCheckAnalysisRequest): string {
  const { content, references } = request;

  const referencesText = references
    .map(
      (ref, idx) => `
[${idx}] ${ref.type}
제목: ${ref.title}
${ref.authors ? `저자: ${ref.authors}` : ""}
${ref.snippet ? `내용: ${ref.snippet}` : ""}
${ref.url ? `출처: ${ref.url}` : ""}
`
    )
    .join("\n---\n");

  return `당신은 정보의 신뢰도를 평가하는 전문 팩트체커입니다. 주어진 정보를 학술자료와 신뢰할 수 있는 출처를 바탕으로 검증해주세요.

검증 대상:
"""
${content}
"""

참고 자료:
${referencesText}

다음 형식으로 JSON 응답을 제공해주세요:

{
  "trustScore": 0-100 사이의 신뢰도 점수,
  "verdict": "CONFIRMED" | "MOSTLY_TRUE" | "CAUTION" | "FALSE" | "UNVERIFIABLE" 중 하나,
  "summary": "2-3문장의 간단한 결론 요약",
  "explanation": "상세한 분석 내용 (왜 이런 판정을 내렸는지, 어떤 근거가 있는지)",
  "keyPoints": ["핵심 포인트 1", "핵심 포인트 2", "핵심 포인트 3"],
  "relevantReferences": [관련성이 높은 참고자료의 인덱스 배열]
}

평가 기준:
- CONFIRMED (80-100점): 여러 신뢰할 수 있는 출처에서 명확히 확인됨
- MOSTLY_TRUE (60-79점): 대체로 사실이나 부분적으로 맥락이 필요함
- CAUTION (40-59점): 일부 사실이나 오해의 소지가 있거나 맥락이 중요함
- FALSE (20-39점): 명백한 허위 정보
- UNVERIFIABLE (0-19점): 검증할 수 있는 자료가 부족함

응답은 반드시 유효한 JSON 형식이어야 합니다.`;
}

/**
 * Parse Claude's response to extract JSON
 */
function parseClaudeResponse(responseText: string): FactCheckAnalysisResponse {
  try {
    // Try to extract JSON from code blocks
    const jsonMatch = responseText.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    const jsonText = jsonMatch ? jsonMatch[1] : responseText;

    const parsed = JSON.parse(jsonText);

    // Validate required fields
    if (
      typeof parsed.trustScore !== "number" ||
      typeof parsed.verdict !== "string" ||
      typeof parsed.summary !== "string" ||
      typeof parsed.explanation !== "string"
    ) {
      throw new Error("Invalid response format");
    }

    return {
      trustScore: Math.max(0, Math.min(100, parsed.trustScore)),
      verdict: parsed.verdict,
      summary: parsed.summary,
      explanation: parsed.explanation,
      keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : [],
      relevantReferences: Array.isArray(parsed.relevantReferences)
        ? parsed.relevantReferences
        : [],
    };
  } catch (error) {
    console.error("Failed to parse Claude response:", error);
    console.error("Response text:", responseText);

    // Return default error response
    return {
      trustScore: 0,
      verdict: "UNVERIFIABLE",
      summary: "AI 응답 파싱에 실패했습니다.",
      explanation: "분석 결과를 처리하는 중 오류가 발생했습니다.",
      keyPoints: [],
      relevantReferences: [],
    };
  }
}
