import Api from ".";

export class PhysicalAssessmentApi {
  static async create() {
    return Api.post("/assessment");
  }
}
