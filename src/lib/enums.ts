import {
  Objective,
  PhysicalActivityLevel,
  Sex,
  TypesMeal,
  TypeTraining,
} from "@prisma/client";
// usamos direto o enum do Prisma
export const physicalActivityLevelOptions: Record<
  PhysicalActivityLevel,
  string
> = {
  Sedentario: "Pouco ou nenhum exercício, trabalho majoritariamente sentado",
  Leve: "Caminhadas ocasionais, atividade leve 1–2x por semana",
  Moderado: "Exercícios moderados 3–5x por semana",
  Muito_Ativo: "Exercícios intensos 6–7x por semana",
  Extremo:
    "Atividade física pesada diariamente ou trabalho físico exigente (ex: pedreiro, atleta etc.)",
};

// enum PhysicalActivityLevel {
//   Sedentario  @map("Pouco_exercicio") // <63 chars
//   Leve        @map("Atividade_leve") // <63 chars
//   Moderado    @map("Exercicio_moderado") // <63 chars
//   Muito_Ativo @map("Exercicio_intenso") // <63 chars
//   Extremo     @map("Fisico_exigente") // <63 chars
// }
export const typeTrainingOptions = Object.values(TypeTraining);
export const objectiveOptions = Object.values(Objective);
export const sexOptions = Object.values(Sex);

export const typesMealOptions: Record<TypesMeal, string> = {
  CAFE_DA_MANHA: "Café da Manhã",
  ALMOCO: "Almoço",
  JANTAR: "Jantar",
  LANCHE: "Lanche",
  PRE_TREINO: "Pré-treino",
  POS_TREINO: "Pós-treino",
  CEIA: "Ceia",
  OUTRO: "Outro",
};
