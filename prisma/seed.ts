import { PrismaClient } from "@prisma/client";
const Prisma = new PrismaClient();

import { User } from "@prisma/client";

(async () => {
  const userAdmin = {
    name: "Deivison",
    surname: "Johnny",
    password: "931886145",
    // born: new Date('2002-11-18'),
    email: "deivisonjohnny@gmail.com",
    // height:177,
    // weight: 86.5,
    // sex: 'Masculino',
  } as User;
  console.log("🚀 ~ main ~ userAdmin:", userAdmin);

  try {
    await Prisma.user.create({
      data: userAdmin,
    });
  } catch (error) {
    console.log("🚀 ~ main ~ error:", error);
  } finally {
    await Prisma.$disconnect();
  }
})();
