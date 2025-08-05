import ApiError from "@/utils/ApiError";
import Token from "@/utils/Token";
import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";

type TokenData = {
  id: string | null;
};

export default function auth(ignoreError = false) {
  return async (
    req: NextApiRequest,
    res: NextApiResponse,
    next: NextHandler
  ) => {
    let tokenData: TokenData = { id: null };

    try {
      const { authorization } = req.headers;
      if (!authorization) {
        throw new ApiError("Token não informado", 401);
      }

      const [, token] = authorization.split(" ");
      tokenData = await Token.getData<TokenData>(token, {
        expired: new ApiError("Sua sessão expirou", 401),
        invalid: new ApiError("Token inválido", 401),
      });
    } catch (error) {
      if (!ignoreError) {
        throw error;
      }
    }

    req.userId = tokenData.id as string;

    return next();
  };
}
