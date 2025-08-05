import Prisma from "@/service/Prisma";
import ApiError from "@/utils/ApiError";
import Token from "@/utils/Token";
import Util from "@/utils/Util";
import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default class UserController {
  static async createUser(req: NextApiRequest, res: NextApiResponse) {
    const { name, surname, email, password } = req.body as User;

    try {
      const emailUsed = await Prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (emailUsed) {
        throw Error("Email já registrado");
      }

      const newUser = await Prisma.user.create({
        data: { name, surname, email, password: await Util.hash(password) },
        select: {
          id: true,
          name: true,
          surname: true,
          email: true,
        },
      });

      const token = await Token.create({
        email: newUser.email,
        id: newUser.id,
      });

      return res.json({ token });
    } catch (error) {
      console.log(error);
      return res.json({ message: error });
    }
  }

  static async authMe(req: NextApiRequest, res: NextApiResponse) {
    const { email, token } = req.body;

    try {
      if (!email || !token) {
        throw new ApiError("Dados incompletos");
      }

      const notExpire = Token.expiration(token);
      if (!notExpire) {
        throw new ApiError("Token de acesso expirado, faça o login novamente");
      }
      const { email: emailToken } = (await Token.getData(token)) as {
        email: string;
      };

      if (!emailToken || emailToken !== email) {
        throw new ApiError("Credencias incorretas");
      }

      const user = await Prisma.user.findUnique({
        where: { email: emailToken },
        select: {
          id: true,
          name: true,
          surname: true,
          email: true,
          sex: true,
          profession: true,
          born: true,
          height: true,
          weight: true,
          objective: true,
          physical_activity_level: true,
          type_training: true,
        },
      });

      return res.json(user);
    } catch (error) {
      console.log(error);
      return res.json({ message: error });
    }
  }

  static async updateUser(req: NextApiRequest, res: NextApiResponse) {
    const userForUpdate = req.body;
    const id = req.userId;

    try {
      if (!userForUpdate) {
        throw new ApiError("Dados não recebidos");
      }
      const userUpdated = await Prisma.user.update({
        where: {
          id: id,
        },

        data: {
          ...userForUpdate,
        },
      });

      return res.json(userUpdated);
    } catch (error) {
      return res.json(error);
    }
  }
}
