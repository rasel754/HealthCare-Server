import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { EmbeddingService } from "./embeddingService";
import { IndexingService } from "./indexingService";
import { LlmService } from "./llm.service";

export class RAGService{
    private embeddingService :EmbeddingService;
    private llmService :LlmService;
    private indexingService : IndexingService;

    constructor(){
        this.embeddingService = new EmbeddingService();
        this.llmService =new LlmService;
        this.indexingService = new IndexingService();
    }


   async ingestDoctorData(){
    return this.indexingService.indexDoctorData();
   }

    async retrieveReleventDocs(query:string , limit:number=5 , sourceType?:string){

      try {
         const queryEmbedding= await this.embeddingService.generateEmbeddings(query)

         const vectorLiteral= `[${queryEmbedding.join(",")}]`

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
        console.log(error)
      }
    }
    

 async generateAnswer(query:string , limit:number=5 , sourceType?:string, asJson:boolean=false){
    
    try {
        const releventDocs = await this.retrieveReleventDocs(query,limit,sourceType)

        //extract content from documents for context 
        const context = (releventDocs as any).filter((doc:any)=> doc.content).map((doc:any)=> doc.content)

        let answer = await this.llmService.generateResponse(query,context,asJson)
           let parsedAnswer: any = answer;
      if (asJson) {
        try {
          // If the model wrapped the JSON in markdown blocks, clean it up
          if (answer.startsWith("```json")) {
            answer = answer
              .replace(/```json\n?/, "")
              .replace(/```$/, "")
              .trim();
          } else if (answer.startsWith("```")) {
            answer = answer
              .replace(/```\n?/, "")
              .replace(/```$/, "")
              .trim();
          }
          parsedAnswer = JSON.parse(answer);
        } catch (error) {
          console.log(error);
        }
      }



      return {
        answer: parsedAnswer,
        sources: (releventDocs as any).map((doc: any) => ({
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
      console.log(error);
      throw error;
    }
  }
}