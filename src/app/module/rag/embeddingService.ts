import { envVars } from "../../../config/env";

export class EmbeddingService {
    private apiKey: string;
    private apiUrl: string = "https://openrouter.ai/api/v1";
    private embeddingModel: string;

    constructor() {
        this.apiKey = envVars.RAG.OPENROUTER_API_KEY || "";
        this.embeddingModel = envVars.RAG.OPENROUTER_EMBEDDING_MODEL || "nvidia/nemotron-3-embed-1b:free";

        if (!this.apiKey) {
            throw new Error("OPENROUTER_API_KEY is not set in env");
        }
    }

    async generateEmbeddings(text: string): Promise<number[]> {
        try {
            const response = await fetch(`${this.apiUrl}/embeddings`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${this.apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    input: text,
                    model: this.embeddingModel,
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`OpenRouter API error ${response.status}: ${errorText}`);
            }

            const data = await response.json();

            if (!data.data || data.data.length === 0) {
                throw new Error("No embedding data returned from OpenRouter");
            }

            return data.data[0].embedding;
        } catch (error) {
            console.error("Failed to generate embeddings:", error);
            throw error;
        }
    }
}
