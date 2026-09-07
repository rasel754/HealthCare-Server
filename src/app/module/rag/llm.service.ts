import { envVars } from "../../../config/env";


export class LlmService {
    private apiKey: string;
    private apiUrl: string = "https://openrouter.ai/api/v1";
    private model: string;

    constructor() {
        this.apiKey = envVars.RAG.OPENROUTER_API_KEY || "";
        this.model = envVars.RAG.OPENROUTER_LLM_MODEL || "nvidia/nemotron-3-super-120b-a12b:free";

        if (!this.apiKey) {
            throw new Error("OpenRouter API key or model is not configured");
        }
    }



 async generateResponse(
    prompt: string,
    context: string[] = [],
    asJson: boolean = false,
  ) {
    try {
      // Combine context with prompt for RAG
      let fullPrompt =
        context.length > 0
          ? `Context information:\n${context.join("\n\n")}\n\nQuestion: ${prompt}\n\nAnswer based on the context above.`
          : prompt;

      if (asJson) {
        fullPrompt += `\n\nReturn ONLY a valid JSON object matching this structure: {"doctors": [{"name": "Doctor Name", "reason": "Why they are suitable", "specialty": "Their specialty"}]}. Do not include any markdown formatting like \`\`\`json.`;
      }

      const systemMessage = asJson
        ? "You are a helpful assistant for a healthcare management system. Answer questions based on the provided context. You MUST respond with ONLY valid JSON format. Do not include markdown tags."
        : "You are a helpful assistant for a healthcare management system. Answer questions based on the provided context. If the context does not contain the answer, say you don't have enough information.";

      const bodyPayload: any = {
        model: this.model,
        messages: [
          {
            role: "system",
            content: systemMessage,
          },
          {
            role: "user",
            content: fullPrompt,
          },
        ],
        temperature: 0.1, // Lower temperature for more deterministic JSON
        max_tokens: 1500,
      };

      if (
        asJson &&
        (this.model.includes("gpt") || this.model.includes("openai"))
      ) {
        bodyPayload.response_format = { type: "json_object" };
      }

      const response = await fetch(`${this.apiUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://healthcare-management.local",
          "X-Title": "Healthcare Management System",
        },
        body: JSON.stringify(bodyPayload),
      });

      const responseText = await response.text();
      let data: any;
      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          `OpenRouter API returned invalid JSON (${response.status}): ${responseText.slice(0, 300)}`
        );
      }

      if (!response.ok) {
        const errorMessage =
          data?.error?.message || data?.message || response.statusText || "unknown error";
        throw new Error(`OpenRouter API error: ${response.status} - ${errorMessage}`);
      }

      if (data?.error) {
        const errorMessage =
          typeof data.error === "string"
            ? data.error
            : data.error.message || JSON.stringify(data.error);
        throw new Error(`OpenRouter API error: ${errorMessage}`);
      }

      if (!data?.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
        throw new Error(`OpenRouter API returned no choices: ${JSON.stringify(data)}`);
      }

      const content = data.choices[0]?.message?.content;
      if (content === undefined || content === null) {
        throw new Error(
          `OpenRouter API message content is missing: ${JSON.stringify(data.choices[0])}`
        );
      }

      return content;
    } catch (error) {
      console.error("LLM Service Error:", error);
      throw error;
    }
  }
}