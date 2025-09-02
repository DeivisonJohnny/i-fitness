// /pages/api/meals.ts (ou onde seu controller está)

import ApiError from "@/utils/ApiError";
import { NextApiRequest, NextApiResponse } from "next/types";
import { GeminiApi } from "@/service/Api/GeminiApi";
import GeminiConstants from "@/utils/GeminiContants";
import Prisma from "@/service/Prisma";
// REMOVA as importações de 'fs', 'path', 'os', e 'mime-types'

export default class MealsController {
  static async createMeal(req: NextApiRequest, res: NextApiResponse) {
    try {
      const id = req.userId;
      const data = req.body;

      // A validação agora checa por uma URL válida
      if (!data || !data.urlImage || !data.urlImage.startsWith("http")) {
        throw new ApiError(
          "URL da imagem é inválida ou não foi fornecida",
          400
        );
      }

      // 1. FAZER O DOWNLOAD DA IMAGEM A PARTIR DA URL PÚBLICA
      const imageResponse = await fetch(data.urlImage);
      if (!imageResponse.ok) {
        throw new ApiError("Falha ao buscar a imagem da URL fornecida", 500);
      }

      // 2. OBTER OS DADOS DA IMAGEM PARA O GEMINI
      const mimeType =
        imageResponse.headers.get("content-type") || "image/jpeg";
      const imageArrayBuffer = await imageResponse.arrayBuffer();
      const fileBuffer = Buffer.from(imageArrayBuffer);
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
          // 3. SALVAR A URL PÚBLICA E PERMANENTE NO BANCO DE DADOS
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

      // Retornar o objeto completo da refeição criada
      return res.status(201).json(meal);
    } catch (error) {
      console.error("Error creating meal:", error);
      const statusCode = error instanceof ApiError ? error.status : 500;
      const message =
        error instanceof Error ? error.message : "Internal server error";
      return res.status(statusCode).json({ error: message });
    }
  }

  // ... os outros métodos (list, findMealsToday, findWeeklyCalories) permanecem os mesmos
  // mas considere as sugestões de melhoria para eles.

  static async list(req: NextApiRequest, res: NextApiResponse) {
    const page = Number(req.query.page) || 1;
    const size = Number(req.query.size) || 10;
    const search = (req.query.search as string) || "";

    const date = req.query.date ? new Date(req.query.date as string) : null;

    const searchTerms = search
      ? search
          .split(",")
          .map((term) => term.trim())
          .filter(Boolean)
      : [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (searchTerms.length > 0) {
      where.OR = searchTerms.map((term) => ({
        description: { contains: term, mode: "insensitive" },
      }));
    }

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      // SUGESTÃO: Considere usar 'hourMeal' em vez de 'createdAt' para maior precisão.
      where.hourMeal = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    const listMeals = await Prisma.meals.findMany({
      where,
      skip: (page - 1) * size,
      take: size,
      include: { AssessmentMeals: true },
      orderBy: { hourMeal: "asc" },
    });

    return res.status(200).json(listMeals);
  }

  static async findMealsToday(req: NextApiRequest, res: NextApiResponse) {
    const id = req.userId;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const mealsToday = await Prisma.meals.findMany({
      where: {
        userId: id,
        // SUGESTÃO: Considere usar 'hourMeal' em vez de 'createdAt' para maior precisão.
        hourMeal: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        AssessmentMeals: true,
      },
    });

    return res.json(mealsToday);
  }

  static async findWeeklyCalories(req: NextApiRequest, res: NextApiResponse) {
    try {
      const id = req.userId;

      const today = new Date();

      const firstDayOfWeek = new Date(today);
      firstDayOfWeek.setDate(today.getDate() - today.getDay());
      firstDayOfWeek.setHours(0, 0, 0, 0);

      const lastDayOfWeek = new Date(firstDayOfWeek);
      lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
      lastDayOfWeek.setHours(23, 59, 59, 999);

      const meals = await Prisma.meals.findMany({
        where: {
          userId: id,
          // SUGESTÃO: Considere usar 'hourMeal' em vez de 'createdAt' para maior precisão.
          hourMeal: {
            gte: firstDayOfWeek,
            lte: lastDayOfWeek,
          },
        },
        select: {
          AssessmentMeals: true,
          hourMeal: true,
        },
      });

      const daysOfWeek = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
      const weeklyData = daysOfWeek.map((day) => ({ day, calories: 0 }));

      // Mapeia o retorno de getDay() (Dom=0, Seg=1...) para um array que começa na Segunda (Seg=0, Ter=1...).
      const dayMap = [6, 0, 1, 2, 3, 4, 5];

      meals.forEach((meal) => {
        const dayIndex = dayMap[meal.hourMeal.getDay()];
        const calories = meal.AssessmentMeals?.calories ?? 0;
        weeklyData[dayIndex].calories += calories;
      });

      return res.status(200).json(weeklyData);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro ao buscar refeições da semana." });
    }
  }
}
