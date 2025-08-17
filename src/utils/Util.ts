import bcrypt from "bcrypt";

export default class Util {
  static async hash(value: string, salt = 8): Promise<string> {
    return bcrypt.hash(value, salt);
  }

  static checkHash(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value || "", hash || "");
  }
}
