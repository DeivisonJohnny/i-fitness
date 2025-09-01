// Importe os tipos/enums gerados pelo Prisma Client para garantir a tipagem forte.
// O caminho pode variar um pouco dependendo da sua estrutura de pastas.
import {
  Sex,
  PhysicalActivityLevel,
  Objective,
  TypeTraining,
} from "@prisma/client";

/**
 * @interface PhysicalAssessmentUserData
 * @description Define a estrutura do objeto de dados do usuário necessário
 * para criar o prompt de avaliação física.
 */
export interface PhysicalAssessmentUserData {
  sex: Sex;
  born: Date;
  height: number; // Em centímetros
  weight: number; // Em kg
  physical_activity_level: PhysicalActivityLevel;
  profession: string;
  objective: Objective;
  type_training: TypeTraining | string; // Permite o enum ou uma string para o caso "Outros"
}

export default class GeminiConstants {
  /**
   * Gera um prompt completo para solicitar uma avaliação física de um usuário à IA.
   * @param userData O objeto contendo os dados do usuário.
   * @returns O prompt final, com os placeholders substituídos, pronto para ser enviado.
   */
  static createPhysicalAssessmentPrompt(
    userData: PhysicalAssessmentUserData
  ): string {
    // Mapeia os enums do Prisma para as strings descritivas que a IA entenderá melhor.
    const activityLevelMap: Record<PhysicalActivityLevel, string> = {
      [PhysicalActivityLevel.Sedentario]:
        "Sedentário (Pouco ou nenhum exercício, trabalho majoritariamente sentado)",
      [PhysicalActivityLevel.Leve]:
        "Levemente Ativo (Caminhadas ocasionais, atividade leve 1–2x por semana)",
      [PhysicalActivityLevel.Moderado]:
        "Moderadamente Ativo (Exercícios moderados 3–5x por semana)",
      [PhysicalActivityLevel.Muito_Ativo]:
        "Muito Ativo (Exercícios intensos 6–7x por semana)",
      [PhysicalActivityLevel.Extremo]:
        "Extremamente Ativo (Atividade física pesada diariamente ou trabalho físico exigente)",
    };

    const objectiveMap: Record<Objective, string> = {
      [Objective.Perder_peso]: "Perder peso",
      [Objective.Manter_peso]: "Manter peso",
      [Objective.Ganhar_massa]: "Ganhar massa muscular",
    };

    const promptTemplate = `
Você é um assistente de IA especializado em nutrição e preparação física. Sua tarefa é analisar os dados de um usuário e gerar uma avaliação física completa e personalizada.

O resultado da sua análise DEVE ser estritamente um objeto JSON bem-formado, sem nenhum texto introdutório, explicações adicionais ou markdown. O JSON deve seguir a estrutura especificada no final deste prompt.

**Instruções para a Avaliação:**

1.  **Calcular o Índice de Massa Corporal (IMC):** Use a fórmula \`peso(kg) / (altura(m) * altura(m))\` e classifique o resultado (e.g., Abaixo do peso, Peso normal, Sobrepeso, Obesidade).
2.  **Calcular a Taxa Metabólica Basal (TMB):** Utilize a fórmula de Mifflin-St Jeor, que é mais precisa para a população geral.
    * Para homens: \`TMB = 10 * peso(kg) + 6.25 * altura(cm) - 5 * idade(anos) + 5\`
    * Para mulheres: \`TMB = 10 * peso(kg) + 6.25 * altura(cm) - 5 * idade(anos) - 161\`
3.  **Calcular o Gasto Energético Total Diário (GET):** Multiplique a TMB pelo fator de atividade correspondente ao \`physical_activity_level\` do usuário. **// <-- MODIFICADO**
    * \`Sedentario\`: 1.2
    * \`Levemente_Ativo\`: 1.375
    * \`Moderadamente_Ativo\`: 1.55
    * \`Muito_Ativo\`: 1.725
    * \`Extremamente_Ativo\`: 1.9
    **Crucial: Use a \`profession\` do usuário para refinar sua estimativa do GET. Um trabalho fisicamente exigente (ex: 'Pedreiro', 'Atleta') aumenta significativamente o gasto calórico diário, enquanto um trabalho de escritório ('Analista de Sistemas') o diminui. O fator de atividade é um ponto de partida, mas a profissão fornece o contexto real do dia a dia.**
4.  **Definir a Meta Calórica Diária:** Com base no \`objective\` do usuário:
    * \`Perder_peso\`: Crie um déficit de 400-500 calorias em relação ao GET.
    * \`Manter_peso\`: A meta calórica deve ser igual ao GET.
    * \`Ganhar_massa\`: Crie um superávit de 300-500 calorias em relação ao GET.
5.  **Definir a Meta de Peso:**
    * Se o objetivo for \`Perder_peso\` ou \`Ganhar_massa\`, calcule uma meta de alteração de peso (em kg) para que o usuário atinja uma faixa de IMC saudável (18.5 a 24.9). Se já estiver na faixa, sugira uma alteração modesta (e.g., -5kg ou +3kg).
    * Se for \`Manter_peso\`, a meta de alteração é 0.
6.  **Gerar Recomendações:** Escreva um texto curto e motivador com recomendações gerais baseadas nos dados e no objetivo do usuário, considerando também sua profissão e tipo de treino. **// <-- MODIFICADO (pequeno ajuste)**

**Dados do Usuário para Análise:**

{
  "sex": "${userData.sex}",
  "profession": "${userData.profession}",
  "born": "${userData.born.toISOString().split("T")[0]}",
  "height_cm": ${userData.height},
  "weight_kg": ${userData.weight},
  "physical_activity_level": "${
    activityLevelMap[userData.physical_activity_level]
  }",
  "objective": "${objectiveMap[userData.objective]}",
  "type_training": "${userData.type_training}"
}

**Estrutura do Objeto JSON de Saída (Obrigatório):**

{
  "physicalAssessment": {
    "bmi": {
      "value": <number_float_com_2_casas_decimais>,
      "classification": "<string>"
    },
    "bmr": <number_integer>,
    "tdee": <number_integer>,
    "dailyCaloricTarget": {
      "value": <number_integer>,
      "explanation": "<string_curto_explicando_o_calculo>"
    },
    "weightGoal": {
      "recommendation": "<string_com_a_recomendacao_de_peso>"
    },
    "macronutrientsSplit": {
      "proteinsGrams": <number_integer>,
      "carbohydratesGrams": <number_integer>,
      "fatsGrams": <number_integer>
    },
    "generalRecommendations": "<string_com_recomendacoes_gerais>"
  }
}
`;
    return promptTemplate.trim();
  }

  static createMealAssessmentPrompt(description: string): string {
    const promptTemplate = `
Você é um nutricionista especialista em IA. Sua tarefa é analisar a imagem de uma refeição e a descrição fornecida pelo usuário para estimar os valores nutricionais com a maior precisão possível.

A sua resposta DEVE SER ESTRITAMENTE um objeto JSON bem-formado. Não inclua NENHUM texto introdutório, explicações, comentários ou formatação markdown. A resposta deve ser apenas o JSON.

**Instruções para Análise:**

1.  **Análise da Imagem:** Identifique cada alimento presente na imagem. Estime o tamanho das porções em gramas ou unidades comuns (ex: "1 filé de frango de 150g", "1 xícara de arroz", "meio abacate").
2.  **Considerar a Descrição:** Use a descrição do usuário para refinar sua análise. A descrição pode conter informações cruciais que não são visíveis na imagem, como o método de preparo (grelhado, frito, assado), ingredientes de molhos ou temperos, e quantidades específicas.
3.  **Cálculo Nutricional:** Com base nos alimentos e porções identificados, calcule a estimativa total de calorias, proteínas, carboidratos e gorduras da refeição completa.
4.  **Formatação Final:** Agregue todos os valores calculados na estrutura JSON especificada abaixo. Os valores devem ser números inteiros, arredondados para o número mais próximo.

**Dados Fornecidos pelo Usuário:**

{
  "description": "${description}"
}

**Estrutura Obrigatória do JSON de Saída:**

{
  "calories": <number_integer>,
  "proteinsGrams": <number_integer>,
  "carbsGrams": <number_integer>,
  "fatsGrams": <number_integer>
}
`;
    return promptTemplate.trim();
  }
}
