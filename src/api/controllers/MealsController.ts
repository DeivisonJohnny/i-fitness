import { NextApiRequest, NextApiResponse } from "next/types";

export default class MealsController {
  static async createMeal(req: NextApiRequest, res: NextApiResponse) {
    try {
      const id = req.userId;

      const data = req.body;
      console.log("🚀 ~ MealsController ~ createMeal ~ data:", data);
      return res.status(201).json({ message: "Meal created successfully" });
    } catch (error) {
      console.error("Error creating meal:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
