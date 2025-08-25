import { PhysicalAssessment, Sex, User } from "@prisma/client";
import Api from ".";
import { FormComplementUser } from "@/components/RegisterCompletForm";

export type InformationAccount = {
  name: string;
  surname: string;
  email: string;
  profession: string;
  sex: Sex;
  born: Date;
};

export type ResumePhysical = {
  height?: number | null;
  weight?: number | null;
  physical_activity_level?: string | null;
  type_training?: string | null;
  objective?: string | null;
  imc: number | null;
};

export default class UserApi {
  static async create(data: Partial<User>): Promise<{ token: string }> {
    return Api.post("/user", data);
  }

  static async me(data: {
    email: string;
    token: string;
  }): Promise<User & { physicalAssessment: PhysicalAssessment | null }> {
    return Api.post("/user/me", data);
  }

  static async update(
    data: User | FormComplementUser | InformationAccount | ResumePhysical
  ) {
    return Api.put("/user", data);
  }

  static async auth(data: {
    email: string;
    password: string;
  }): Promise<{ token: string }> {
    return Api.post("/user/auth", data);
  }
}
