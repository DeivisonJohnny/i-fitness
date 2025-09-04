import Api from ".";
export type PhysicalAssessmentResponse = {
  physicalAssessment: {
    id: string;
    userId: string;
    bmi: number;
    bmiClassification: string;
    bmr: number;
    tdee: number;
    dailyCaloricTarget: number;
    dailyCaloricTargetExplanation: string;
    weightGoalRecommendation: string;
    proteinsGrams: number;
    carbohydratesGrams: number;
    fatsGrams: number;
    generalRecommendations: string;
    createdAt: Date;
    updatedAt: Date;
  };
};

export class PhysicalAssessmentApi {
  static async create(): Promise<PhysicalAssessmentResponse> {
    return Api.post("/assessment");
  }
}
