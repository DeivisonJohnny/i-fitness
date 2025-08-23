import { GeminiApi } from "@/service/Api/GeminiApi";
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

      const AssessmentPhysical = await GeminiApi.generateAssessmentPhysical(
        prompt
      );

      if (!AssessmentPhysical) {
        return new Error("Aconteceu um erro ao fazer a avaliação fisica");
      }

      const physicalAssessment = await Prisma.physicalAssessment.create({
        data: {
          userId: user.id,
          bmi: AssessmentPhysical.bmi.value,
          bmiClassification: AssessmentPhysical.bmi.classification,
          bmr: AssessmentPhysical.bmr,
          tdee: AssessmentPhysical.tdee,
          dailyCaloricTarget: AssessmentPhysical.dailyCaloricTarget.value,
          dailyCaloricTargetExplanation:
            AssessmentPhysical.dailyCaloricTarget.explanation,
          weightGoalRecommendation:
            AssessmentPhysical.weightGoal.recommendation,
          proteinsGrams: AssessmentPhysical.macronutrientsSplit.proteinsGrams,
          carbohydratesGrams:
            AssessmentPhysical.macronutrientsSplit.carbohydratesGrams,
          fatsGrams: AssessmentPhysical.macronutrientsSplit.fatsGrams,
          generalRecommendations: AssessmentPhysical.generalRecommendations,
        },
      });

      if (!physicalAssessment) {
        throw new Error("Aconteceu um erro ao salvar a avaliação fisica");
      }

      return res.json({ physicalAssessment });
    } catch (error) {
      return res.json(error);
    }
  }
}
