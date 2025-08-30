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

type MealAssessment = {
  calories: number;
  proteinsGrams: number;
  carbsGrams: number;
  fatsGrams: number;
};

export class GeminiApi {
  /**
   * Envia uma imagem de uma refeição e um prompt de texto para o Gemini para análise nutricional.
   * @param prompt O prompt de texto para guiar a análise (ex: "Avalie esta refeição").
   * @param imageBase64 A imagem da refeição codificada como uma string base64.
   * @param mimeType O tipo MIME da imagem (ex: "image/jpeg", "image/png").
   * @returns Uma string contendo a análise nutricional da refeição.
   */

  static async generateAssessmentMeals(
    prompt: string,
    imageBase64: string,
    mimeType: string
  ): Promise<MealAssessment> {
    // <<< TIPO DE RETORNO ATUALIZADO
    try {
      const result = await generativeModel.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: mimeType,
                  data: imageBase64,
                },
              },
            ],
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

      // Limpa a string de possíveis blocos de código markdown e espaços em branco
      const jsonString = responseText
        .replace(/^```json\s*|```\s*$/g, "")
        .trim();

      // Parseia a string para um objeto JSON
      const assessmentData: MealAssessment = JSON.parse(jsonString);

      return assessmentData; // <<< RETORNA O OBJETO JSON PRONTO
    } catch (error) {
      console.error(
        "Erro ao processar a avaliação de refeições da API Gemini:",
        error
      );
      // Se o erro for de parsing (JSON inválido), a mensagem será mais clara.
      throw error;
    }
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
