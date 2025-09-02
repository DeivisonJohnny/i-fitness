import { NextApiRequest, NextApiResponse } from "next/types";
import { put } from "@vercel/blob"; // 1. Importe a função do Vercel Blob

export class AttachmentController {
  static async create(req: NextApiRequest, res: NextApiResponse) {
    try {
      // O tipo 'any' aqui não é ideal, mas mantemos para seguir seu exemplo.
      // Em um projeto real, você poderia estender o tipo Request.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const file = (req as any).file;

      if (!file) {
        return res.status(400).json({ error: "Nenhum arquivo enviado" });
      }

      // Garante que temos o buffer do arquivo
      if (!file.buffer) {
        throw new Error(
          "Arquivo sem buffer. Verifique a configuração do multer para usar memoryStorage."
        );
      }

      // 2. Gere um nome único para o arquivo
      const fileName = `${Date.now()}-${file.originalname}`;

      // 3. Faça o upload do buffer para o Vercel Blob
      const blob = await put(fileName, file.buffer, {
        access: "public", // Torna o arquivo publicamente acessível
        contentType: file.mimetype, // Adiciona o tipo do arquivo
      });

      // 4. O 'blob.url' é a URL pública e permanente que você deve salvar no banco!

      return res.status(201).json({
        message: "Attachment created successfully",
        url: blob.url, // Salve esta URL no seu banco de dados
      });
    } catch (error) {
      console.error("Error creating attachment:", error);
      // Converte o erro para uma string para melhor debugging
      const errorMessage =
        error instanceof Error ? error.message : "Internal server error";
      return res.status(500).json({ error: errorMessage });
    }
  }
}
