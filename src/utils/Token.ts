import jwt, { TokenExpiredError } from "jsonwebtoken";
import { KEY_SECRET_JWT } from "./Constant";

type TokenError = {
  expired?: Error;
  invalid?: Error;
};

export default class Token {
  static async create<T>(payload: Record<string, T>, expiresIn: number = 10) {
    return jwt.sign(payload, KEY_SECRET_JWT, { expiresIn: 60 * expiresIn });
  }

  static getData<T>(token: string, tokenError?: TokenError): T {
    try {
      return jwt.verify(token, KEY_SECRET_JWT) as Record<string, unknown> as T;
    } catch (error) {
      if (tokenError) {
        if (error instanceof TokenExpiredError && tokenError.expired) {
          throw tokenError.expired;
        }

        if (tokenError.invalid) {
          throw tokenError.invalid;
        }
      }

      throw error;
    }
  }
}
