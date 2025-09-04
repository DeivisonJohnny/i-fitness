import { UserCredential } from "firebase/auth";
import Api from "./Api";

export class GoogleApi {
  static async auth(data: UserCredential): Promise<{ token: string }> {
    return Api.post("/auth/google", data);
  }
}
