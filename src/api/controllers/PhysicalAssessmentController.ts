import Prisma from "@/service/Prisma";
import GeminiConstants from "@/utils/GeminiContants";
import {
  Objective,
  PhysicalActivityLevel,
  Sex,
  TypeTraining,
} from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next/types";

export class PhysicalAssessmentController {
  static async createPhysicalAssessment(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    const userId = req.userId;

    try {
      const user = await Prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          surname: true,
          email: true,
          sex: true,
          profession: true,
          born: true,
          height: true,
          weight: true,
          objective: true,
          physical_activity_level: true,
          type_training: true,
          physicalAssessment: true,
        },
      });

      if (!user) {
        return new Error("Aconteceu um erro na consulta do usuario ");
      }

      if (user?.physicalAssessment) {
        return new Error("Já existe uma avaliação fisica");
      }

      const prompt = GeminiConstants.createPhysicalAssessmentPrompt({
        born: user?.born as Date,
        height: user?.height as number,
        objective: user?.objective as Objective,
        physical_activity_level:
          user?.physical_activity_level as PhysicalActivityLevel,
        sex: user?.sex as Sex,
        type_training: user?.type_training as TypeTraining,
        weight: user?.weight as number,
        profession: user?.profession as string,
      });
      //    Aqui vai chamar api do gemini
      return res.json({ message: "Created" });
    } catch (error) {
      return res.json(error);
    }
  }
}
