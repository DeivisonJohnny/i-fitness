import * as fs from "fs";
import { Part } from "@google-cloud/vertexai";
import { generativeModel } from "../Vertex";

type PhysicalAssessment = {
  bmi: {
    value: number;
    classification: string;
  };
  bmr: number;
  tdee: number;
  dailyCaloricTarget: {
    value: number;
    explanation: string;
  };
  weightGoal: {
    recommendation: string;
  };
  macronutrientsSplit: {
    proteinsGrams: number;
    carbohydratesGrams: number;
    fatsGrams: number;
  };
  generalRecommendations: string;
};

export class GeminiApi {
  /**
   * Envia um prompt multimodal (texto e imagem) para a API Gemini e retorna a resposta em texto.
   * @param textPrompt O prompt de texto a ser enviado.
   * @param imagePath O caminho local para o arquivo de imagem.
   * @param mimeType O tipo MIME da imagem (ex: "image/jpeg").
   * @returns A resposta em texto gerada pelo modelo.
   */
  public static async generateContentFromImage(
    textPrompt: string,
    imagePath: string,
    mimeType: string
  ): Promise<string> {
    const imagePart = this.fileToGenerativePart(imagePath, mimeType);
    const textPart: Part = { text: textPrompt };

    const request = {
      contents: [{ role: "user", parts: [imagePart, textPart] }],
    };

    console.log("Enviando requisição para a API Gemini...");

    const result = await generativeModel.generateContent(request);
    const response = result.response;

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error(
        "Não foi possível extrair o texto da resposta da API Gemini."
      );
    }

    return text;
  }

  private static fileToGenerativePart(path: string, mimeType: string): Part {
    if (!fs.existsSync(path)) {
      throw new Error(`Arquivo não encontrado em: ${path}`);
    }
    return {
      inlineData: {
        data: fs.readFileSync(path).toString("base64"),
        mimeType,
      },
    };
  }

  static async generateAssessmentPhysical(
    prompt: string
  ): Promise<PhysicalAssessment> {
    try {
      const result = await generativeModel.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      });

      const response = result.response;
      const responseText = response.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!responseText) {
        throw new Error(
          "A resposta da API da Vertex AI está vazia ou em formato inesperado."
        );
      }

      const jsonString = responseText.replace(/^```json\s*|```\s*$/g, "");

      const assessmentData = JSON.parse(jsonString);

      return assessmentData.physicalAssessment;
    } catch (error) {
      console.error(
        "Erro ao processar a avaliação física da API Gemini:",
        error
      );
      throw error;
    }
  }
}
