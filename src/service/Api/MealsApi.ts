import { TypesMeal } from "@prisma/client";
import Api from ".";

export type TypeMeal = {
  type: TypesMeal;
  description: string;
  time: string;
  imageFile: File;
};

export default class MealsApi {
  static async create(data: TypeMeal | any) {
    return Api.post("/meal", data);
  }
}
