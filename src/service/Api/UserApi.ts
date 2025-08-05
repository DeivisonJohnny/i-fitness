import { User } from "@prisma/client";
import Api from ".";
import { FormComplementUser } from "@/pages/auth/[form]";

export default class UserApi {
  static async create(data: Partial<User>): Promise<{ token: string }> {
    return Api.post("/user", data);
  }

  static async me(data: {
    email: string;
    token: string;
  }): Promise<User | null> {
    return Api.post("/user/me", data);
  }

  static async update(data: User | FormComplementUser) {
    return Api.put("/user", data);
  }
}
