import { NextApiRequest, NextApiResponse } from "next/types";
import path from "path";
import fs from "fs";
import os from "os"; // Adicionado

export class AttachmentController {
  static async create(req: NextApiRequest, res: NextApiResponse) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const file = (req as any).file;

      if (!file) {
        return res.status(400).json({ error: "Nenhum arquivo enviado" });
      }

      const uploadDir = path.join(os.tmpdir(), "uploads/meals/");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = `${Date.now()}-${file.originalname}`;
      const filePath = path.join(uploadDir, fileName);

      if (file.buffer) {
        fs.writeFileSync(filePath, file.buffer);
      } else if (file.path) {
        fs.copyFileSync(file.path, filePath);
      } else {
        throw new Error("Arquivo sem buffer ou path válido.");
      }

      const fileUrl = `/uploads/meals/${fileName}`;

      return res.status(201).json({
        message: "Attachment created successfully",
        url: fileUrl,
      });
    } catch (error) {
      console.error("Error creating attachment:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
