import Prisma from "@/service/Prisma";
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
          name: true,
          surname: true,
          email: true,
        },
      });

      const tokenRegister = await Token.create({ email: newUser.email });

      return res.json({ ...newUser, tokenRegister });
    } catch (error) {
      console.log(error);
      return res.json({ message: error });
    }
  }
}
