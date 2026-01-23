// FactCheck analyzer service - orchestrates the entire fact-checking process

import { db } from "@/lib/prisma";
import { searchAllSources } from "@/server/services/datasource";
import { analyzeWithClaude } from "@/server/services/ai/claude";
import type { ReferenceData } from "@/types";

/**
 * Main fact-check analysis function
 * Orchestrates: data collection → AI analysis → database update
 */
export async function analyzeFactCheck(
  factCheckId: string,
  content: string
): Promise<void> {
  try {
    // 1. Update status to PROCESSING
    await db.factCheck.update({
      where: { id: factCheckId },
      data: { status: "PROCESSING" },
    });

    // 2. Search for references from all sources
    const searchResults = await searchAllSources(content);

    // Combine all references
    const allReferences: ReferenceData[] = [
      ...searchResults.papers,
      ...searchResults.books,
      ...searchResults.news,
    ];

    // 3. Analyze with Claude AI
    const analysis = await analyzeWithClaude({
      content,
      references: allReferences.map((ref) => ({
        type: ref.type,
        title: ref.title,
        authors: ref.authors,
        snippet: ref.snippet,
        url: ref.url,
      })),
    });

    // 4. Save references to database
    const savedReferences = await saveReferences(
      factCheckId,
      allReferences,
      analysis.relevantReferences
    );

    // 5. Update fact-check with results
    await db.factCheck.update({
      where: { id: factCheckId },
      data: {
        status: "COMPLETED",
        trustScore: analysis.trustScore,
        verdict: analysis.verdict,
        summary: analysis.summary,
        explanation: analysis.explanation,
      },
    });

    console.log(`✅ FactCheck ${factCheckId} completed successfully`);
  } catch (error) {
    console.error(`❌ FactCheck ${factCheckId} failed:`, error);

    // Update status to FAILED
    await db.factCheck.update({
      where: { id: factCheckId },
      data: {
        status: "FAILED",
        summary: "분석 중 오류가 발생했습니다.",
      },
    });

    throw error;
  }
}

/**
 * Save references to database
 */
async function saveReferences(
  factCheckId: string,
  references: ReferenceData[],
  relevantIndices: number[]
): Promise<void> {
  const relevantSet = new Set(relevantIndices);

  // Create references with relevance scores
  const referencesToCreate = references.map((ref, index) => ({
    factCheckId,
    type: ref.type,
    title: ref.title,
    authors: ref.authors,
    publisher: ref.publisher,
    publicationDate: ref.publicationDate,
    url: ref.url,
    snippet: ref.snippet,
    isbn: ref.isbn,
    doi: ref.doi,
    imageUrl: ref.imageUrl,
    relevanceScore: relevantSet.has(index) ? 1.0 : 0.5,
    trustScore: calculateTrustScore(ref.type),
  }));

  // Batch insert references
  await db.reference.createMany({
    data: referencesToCreate,
  });
}

/**
 * Calculate trust score based on reference type
 */
function calculateTrustScore(type: string): number {
  const scores: Record<string, number> = {
    ACADEMIC_PAPER: 0.95,
    JOURNAL: 0.9,
    THESIS: 0.85,
    BOOK: 0.8,
    REPORT: 0.75,
    NEWS: 0.6,
    WEB: 0.5,
  };

  return scores[type] ?? 0.5;
}

/**
 * Extract keywords from content for better search
 */
export function extractKeywords(content: string): string[] {
  // Remove common Korean particles and conjunctions
  const stopWords = [
    "은",
    "는",
    "이",
    "가",
    "을",
    "를",
    "의",
    "에",
    "와",
    "과",
    "도",
    "으로",
    "로",
    "에서",
    "하고",
  ];

  // Simple keyword extraction (can be improved with NLP)
  const words = content
    .replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length >= 2 && !stopWords.includes(word));

  // Get unique words
  return Array.from(new Set(words)).slice(0, 10);
}
