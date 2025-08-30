import ApiError from "@/utils/ApiError";
import { NextApiRequest, NextApiResponse } from "next/types";
import fs from "fs";
import path from "path";
import { GeminiApi } from "@/service/Api/GeminiApi";
import GeminiConstants from "@/utils/GeminiContants";
import mime from "mime-types";
import Prisma from "@/service/Prisma";

export default class MealsController {
  static async createMeal(req: NextApiRequest, res: NextApiResponse) {
    try {
      const id = (req as any).userId;
      const data = req.body;

      if (!data || !data.urlImage) {
        throw new ApiError("Dados incompletos");
      }

      const absolutePath = path.join(process.cwd(), "public", data.urlImage);

      if (!fs.existsSync(absolutePath)) {
        throw new ApiError("Arquivo de imagem não encontrado");
      }

      const mimeType = mime.lookup(absolutePath) || "image/jpeg";
      const fileBuffer = fs.readFileSync(absolutePath);
      const imageBase64 = fileBuffer.toString("base64");

      const prompt = GeminiConstants.createMealAssessmentPrompt(
        data.description
      );

      const resultAssessment = await GeminiApi.generateAssessmentMeals(
        prompt,
        imageBase64,
        mimeType
      );

      const [hours, minutes] = data.time.split(":").map(Number);
      const now = new Date();
      now.setHours(hours, minutes, 0, 0);

      const meal = await Prisma.meals.create({
        data: {
          userId: id,
          description: data.description,
          imgUrl: data.urlImage,
          type: data.type,
          hourMeal: now,

          AssessmentMeals: {
            create: {
              calories: resultAssessment.calories,
              proteinsGrams: resultAssessment.proteinsGrams,
              carbsGrams: resultAssessment.carbsGrams,
              fatsGrams: resultAssessment.fatsGrams,
            },
          },
        },
        include: {
          AssessmentMeals: true,
        },
      });

      return res.status(201).json(meal);
    } catch (error) {
      console.error("Error creating meal:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
