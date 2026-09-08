import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { EmbeddingService } from "./embeddingService";
import { IndexingService } from "./indexingService";
import { LlmService } from "./llm.service";

export class RAGService {
    private embeddingService: EmbeddingService;
    private llmService: LlmService;
    private indexingService: IndexingService;

    constructor() {
        this.embeddingService = new EmbeddingService();
        this.llmService = new LlmService;
        this.indexingService = new IndexingService();
    }


    async ingestDoctorData() {
        return this.indexingService.indexDoctorData();
    }

    async retrieveReleventDocs(query: string, limit: number = 5, sourceType?: string) {

        try {
            const queryEmbedding = await this.embeddingService.generateEmbeddings(query)

            const vectorLiteral = `[${queryEmbedding.join(",")}]`

            const results = await prisma.$queryRaw(Prisma.sql`
          SELECT id, "chunkKey", "sourceType", "sourceId", "sourceLevel", content, metadata, embedding, "isDeleted", "deletedAt", "createdAt", "updatedAt", 1 - (embedding <=> CAST(${vectorLiteral} AS vector)) as similarity
          FROM "document_embedding"
          WHERE "isDeleted" = false
          ${sourceType ? Prisma.sql`AND "sourceType" = ${sourceType}` : Prisma.empty}
          ORDER BY embedding <=> CAST(${vectorLiteral} AS vector)
          Limit ${limit}
          `);

            return results;


        } catch (error) {
            console.error("Error retrieving relevant docs:", error);
            return [];
        }
    }


    async generateAnswer(query: string, limit: number = 5, sourceType?: string, asJson: boolean = false) {

        try {
            const releventDocs = (await this.retrieveReleventDocs(query, limit, sourceType)) || [];

            //extract content from documents for context 
            const context = (releventDocs as any[])
                .filter((doc: any) => doc && doc.content)
                .map((doc: any) => doc.content);

            let answer = await this.llmService.generateResponse(query, context, asJson);
            let parsedAnswer: any = answer;
            if (asJson && typeof answer === "string") {
                try {
                    let cleaned = answer.trim();
                    if (cleaned.startsWith("```")) {
                        cleaned = cleaned
                            .replace(/^```(?:json)?\s*/i, "")
                            .replace(/\s*```$/i, "")
                            .trim();
                    }
                    parsedAnswer = JSON.parse(cleaned);
                } catch (error) {
                    console.error("Failed to parse JSON response:", error);
                    parsedAnswer = { raw: answer };
                }
            }

            return {
                answer: parsedAnswer,
                sources: (releventDocs as any[]).map((doc: any) => ({
                    id: doc.id,
                    chunkKey: doc.chunkKey,
                    sourceType: doc.sourceType,
                    sourceId: doc.sourceId,
                    sourceLevel: doc.sourceLevel,
                    content: doc.content,
                    similarity: doc.similarity,
                })),
                contextUsed: context.length > 0,
            };
        } catch (error) {
            console.error("Error in generateAnswer:", error);
            throw error;
        }
    }


    async getStats() {
        try {
            const totalDocuments = await prisma.$queryRaw(Prisma.sql`
        SELECT COUNT(*) as count FROM "document_embedding" WHERE "isDeleted" = false;
        `);

            const sourceTypeCounts = await prisma.$queryRaw(Prisma.sql`
        SELECT "sourceType", COUNT(*) as count FROM "document_embedding" WHERE "isDeleted" = false GROUP BY "sourceType"
        `);

            return {
                totalActiveDocuments: Number((totalDocuments as any)[0]?.count ?? 0),
                sourceTypeBreakdown: (sourceTypeCounts as any).reduce(
                    (acc: any, curr: any) => {
                        acc[curr.sourceType] = Number(curr.count);
                        return acc;
                    },
                    {},
                ),
                timestamp: new Date(),
            };
        } catch (error) {
            console.error("Error getting RAG stats:", error);
            throw error;
        }
    }
}