import { TypesMeal } from "@prisma/client";
import Api from ".";
import { SavedMeal } from "@/pages/add-meals";
import { useQuery } from "../QueryClient";
import { date } from "yup";

export interface Paginate<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

type ListArgs = {
  page?: number;
  size?: number;
  search?: string;
  department?: string;
  date?: Date;
};

export type MealType = {
  id?: string;
  type: TypesMeal;
  description: string;
  time: string;
  imageFile?: File;
  imgUrl?: string;
  hourMeal?: Date;
  AssessmentMeals?: AssessmentMealsType;
};

export type AssessmentMealsType = {
  id?: string;
  calories: number;
  proteinsGrams: number;
  carbsGrams: number;
  fatsGrams: number;

  mealId?: String;

  createdAt?: Date;
  updatedAt?: Date;
};

export type WeekCaloriesType = {
  day: string;
  calories: number;
};

export default class MealsApi {
  static async create(data: MealType | any): Promise<SavedMeal> {
    return Api.post("/meal", data);
  }

  static async list(args?: ListArgs): Promise<MealType[]> {
    return Api.get("/meal", {
      params: {
        page: args?.page,
        size: args?.size,
        search: args?.search,
        date: args?.date,
      },
    });
  }

  static listWithPromise(args?: ListArgs): Promise<MealType[]> {
    return Api.get("/meal", {
      params: {
        page: args?.page,
        size: args?.size,
        search: args?.search,
        date: args?.date,
      },
    });
  }

  static async findMealsToday(): Promise<MealType[]> {
    return Api.get("/meal/today");
  }

  static async findWeeklyCalories(): Promise<WeekCaloriesType[]> {
    return Api.get("/meal/calories");
  }
}
