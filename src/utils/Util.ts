import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

export default class Util {
  static async hash(value: string, salt = 8): Promise<string> {
    return bcrypt.hash(value, salt);
  }

  static checkHash(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value || "", hash || "");
  }
  static uuid(length?: number) {
    let uuid = uuidv4();

    if (length) {
      uuid = uuid.replace(/-/g, "").slice(0, length);
    }

    return uuid;
  }

  static getExtName(path: string, removeDot = false) {
    if (!path) return null;

    if (path.includes("?")) {
      path = path.split("?")[0];
    }

    const match = path.match(/\.(?!.*\.).+$/i);
    if (match && match.length > 0) {
      let ext = match[0].toLowerCase();

      if (ext == ".gz" && /\.tar\.gz$/i.test(path)) {
        ext = ".tar.gz";
      }

      if (removeDot) {
        ext = ext.replace(".", "");
      }

      return ext;
    }

    return null;
  }
}
