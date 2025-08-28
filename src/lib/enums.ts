import { Objective, Sex, TypesMeal, TypeTraining } from "@prisma/client";

export enum PhysicalActivityLevelEnum {
  Sedentario = "Sedentario",
  LevementeAtivo = "Levemente_Ativo",
  ModeradamenteAtivo = "Moderadamente_Ativo",
  MuitoAtivo = "Muito_Ativo",
  ExtremamenteAtivo = "Extremamente_Ativo",
}
export const physicalActivityLevelOptions: Record<
  PhysicalActivityLevelEnum,
  string
> = {
  [PhysicalActivityLevelEnum.Sedentario]:
    "Pouco ou nenhum exercício, trabalho majoritariamente sentado",
  [PhysicalActivityLevelEnum.LevementeAtivo]:
    "Caminhadas ocasionais, atividade leve 1–2x por semana",
  [PhysicalActivityLevelEnum.ModeradamenteAtivo]:
    "Exercícios moderados 3–5x por semana",
  [PhysicalActivityLevelEnum.MuitoAtivo]: "Exercícios intensos 6–7x por semana",
  [PhysicalActivityLevelEnum.ExtremamenteAtivo]:
    "Atividade física pesada diariamente ou trabalho físico exigente (ex: pedreiro, atleta etc.)",
};

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
