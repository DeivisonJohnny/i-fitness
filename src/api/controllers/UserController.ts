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
        throw new ApiError("Email já registrado");
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

  static async findMe(req: NextApiRequest, res: NextApiResponse) {
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
          physicalAssessment: true,
        },
      });

      if (!user) {
        throw new ApiError("A coleta dos dados do usuario falhou");
      }

      return res.json(user);
    } catch (error) {
      console.log(error);
      return res.json(error);
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

  static async auth(req: NextApiRequest, res: NextApiResponse) {
    const { email, password: passwordInput } = req.body;

    if (!email || !passwordInput) {
      throw new ApiError("Autenticação falhou por falta de dados");
    }

    try {
      const userWithPassword = await Prisma.user.findUnique({
        where: {
          email: email,
        },
        select: {
          id: true,
          name: true,
          surname: true,
          email: true,
          born: true,
          height: true,
          objective: true,
          physical_activity_level: true,
          profession: true,
          sex: true,
          type_training: true,
          weight: true,
          password: true,
        },
      });

      if (!userWithPassword) {
        throw new ApiError("Usuario inválido");
      }

      const { password, ...user } = userWithPassword;
      const checkPassword = await Util.checkHash(passwordInput, password);

      if (!password || !checkPassword) {
        throw new ApiError("Usuario e/ou senha inválida");
      }

      const token = await Token.create(
        { id: user.id, email: user.email },
        60 * 8
      );

      if (!token) {
        throw new ApiError("Erro inesperado ao criar o token de autenticação");
      }

      return res.json({ user, token });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}
