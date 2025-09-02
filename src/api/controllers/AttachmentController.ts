import { NextApiRequest, NextApiResponse } from "next/types";
import { put } from "@vercel/blob";

export class AttachmentController {
  static async create(req: NextApiRequest, res: NextApiResponse) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const file = (req as any).file;

      if (!file) {
        return res.status(400).json({ error: "Nenhum arquivo enviado" });
      }

      if (!file.buffer) {
        throw new Error(
          "Arquivo sem buffer. Verifique a configuração do multer para usar memoryStorage."
        );
      }

      const fileName = `${Date.now()}-${file.originalname}`;

      const blob = await put(fileName, file.buffer, {
        access: "public",
        contentType: file.mimetype,
      });

      return res.status(201).json({
        message: "Attachment created successfully",
        url: blob.url,
      });
    } catch (error) {
      console.error("Error creating attachment:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Internal server error";
      return res.status(500).json({ error: errorMessage });
    }
  }
}
