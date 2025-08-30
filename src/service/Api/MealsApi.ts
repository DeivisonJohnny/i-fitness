import { TypesMeal } from "@prisma/client";
import Api from ".";
import { SavedMeal } from "@/pages/add-meals";

export type MealType = {
  type: TypesMeal;
  description: string;
  time: string;
  imageFile: File;
};

export type AssessmentMealsType = {
  calories: number;
  proteinsGrams: number;
  carbsGrams: number;
  fatsGrams: number;
};

export default class MealsApi {
  static async create(data: MealType | any): Promise<SavedMeal> {
    return Api.post("/meal", data);
  }
}
