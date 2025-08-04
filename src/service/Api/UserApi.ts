import { User } from "@prisma/client";
import Api from ".";

export default class UserApi {
  static async create(data: Partial<User>) {
    console.log("🚀 ~ UserApi ~ create ~ data:", data);
    return Api.post("/user", data);
  }
}
