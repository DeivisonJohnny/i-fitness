import * as fs from "fs";
import { Part } from "@google-cloud/vertexai";
import { generativeModel } from "../Vertex";

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
}
