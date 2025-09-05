import admin from "@/service/FirebaseAdmin";
import Prisma from "@/service/Prisma";
import ApiError from "@/utils/ApiError";
import Token from "@/utils/Token";
import { NextApiRequest, NextApiResponse } from "next/types";

export class GoogleController {
  static async authGoogle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { _tokenResponse } = req.body;

      if (!_tokenResponse) {
        throw new ApiError("Autenticação falou, token vazio");
      }

      const { uid, name, email, email_verified } = await admin
        .auth()
        .verifyIdToken(_tokenResponse.idToken);

      if (!email_verified) {
        throw new ApiError("Email não verificado pelo Google");
      }

      const isUser = await Prisma.user.findFirst({
        where: {
          OR: [{ googleId: uid }, { email: email }],
        },
        select: {
          id: true,
          email: true,
          googleId: true,
        },
      });

      if (isUser) {
        const token = await Token.create(
          { id: isUser.id, email: isUser.email },
          60 * 8
        );

        return res.json({ token });
      }

      const nameNewUser = name.split(" ");

      const newUser = await Prisma.user.create({
        data: {
          name: nameNewUser[0] ? nameNewUser[0] : "VAZIO",
          surname: nameNewUser[1] ? nameNewUser[1] : "VAZIO",
          email: email as string,
          googleId: uid,
        },
      });

      const token = await Token.create(
        { id: newUser.id, email: newUser.email },
        60 * 8
      );

      return res.json({ token });
    } catch (error) {
      console.error("Erro na autenticação Google:", error);
      if (error instanceof ApiError) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Erro interno no servidor." });
    }
  }
}
