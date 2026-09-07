import { EmbeddingService } from "./embeddingService";
import { IndexingService } from "./indexingService";

export class RAGService{
    private embeddingService :EmbeddingService;
    // private llmService :LlmService;
    private indexingService : IndexingService;

    constructor(){
        this.embeddingService = new EmbeddingService();
        // this.llmService = llmService;
        this.indexingService = new IndexingService();
    }


   async ingestDoctorData(){
    return this.indexingService.indexDoctorData();
   }
}