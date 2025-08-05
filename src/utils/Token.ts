import { differenceInSeconds } from "date-fns";
import { SignJWT, jwtVerify, decodeJwt } from "jose";
import { KEY_SECRET_JWT } from "./Constant";

type TokenError = {
  expired?: Error;
  invalid?: Error;
};

const encoder = new TextEncoder();
const secret = encoder.encode(KEY_SECRET_JWT);

export default class Token {
  static async create<T>(payload: Record<string, T>, expiresIn: number = 10) {
    const jwt = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(`${expiresIn * 60}s`)
      .sign(secret);
    return jwt;
  }

  static async getData<T>(token: string, tokenError?: TokenError): Promise<T> {
    try {
      const { payload } = await jwtVerify(token, secret);
      return payload as unknown as T;
    } catch (error: any) {
      if (tokenError) {
        if (error.code === "ERR_JWT_EXPIRED" && tokenError.expired) {
          throw tokenError.expired;
        }

        if (tokenError.invalid) {
          throw tokenError.invalid;
        }
      }

      throw error;
    }
  }

  static expiration(token: string) {
    const data = decodeJwt(token) as { exp?: number };
    if (!data || !data.exp) return 0;

    return differenceInSeconds(data.exp * 1000, new Date());
  }
}
