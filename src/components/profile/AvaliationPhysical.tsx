import { easeOut, motion } from "framer-motion";
import { Card, CardHeader, CardDescription, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import {
  Calculator,
  Info,
  Zap,
  TrendingUp,
  Target,
  FileText,
  Apple,
  Beef,
  Wheat,
  Droplets,
  Scale,
  Sparkles,
  Plus,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PhysicalAssessment {
  bmi: number;
  bmiClassification: string;
  bmr: number;
  tdee: number;
  dailyCaloricTarget: number;
  dailyCaloricTargetExplanation: string;
  proteinsGrams: number;
  carbohydratesGrams: number;
  fatsGrams: number;
  weightGoalRecommendation: string;
  generalRecommendations: string;
  createdAt: Date;
}

export default function AvaliationPhysical(props: PhysicalAssessment) {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: easeOut },
    },
  };

  return (
    <motion.div variants={itemVariants} className="mb-8">
      <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 shadow-lg rounded-2xl">
        <CardHeader>
          <CardDescription>
            Análise completa dos seus dados físicos e recomendações
            personalizadas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {props ? (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Calculator className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-1">
                      IMC
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-3 h-3 text-blue-500 hover:text-blue-600 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            <strong>Índice de Massa Corporal</strong>
                            <br />
                            Medida que relaciona peso e altura para avaliar se
                            uma pessoa está no peso ideal, abaixo ou acima do
                            peso recomendado.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {props.bmi}
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">
                    {props.bmiClassification}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 p-4 rounded-xl border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-300 flex items-center gap-1">
                      TMB
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-3 h-3 text-green-500 hover:text-green-600 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            <strong>Taxa Metabólica Basal</strong>
                            <br />
                            Quantidade mínima de energia (calorias) que seu
                            corpo precisa para manter as funções vitais em
                            repouso, como respiração e circulação.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {props.bmr}
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400">
                    kcal/dia
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm font-medium text-purple-700 dark:text-purple-300 flex items-center gap-1">
                      TDEE
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-3 h-3 text-purple-500 hover:text-purple-600 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            <strong>Total Daily Energy Expenditure</strong>
                            <br />
                            Gasto energético diário total, incluindo metabolismo
                            basal, atividade física e digestão. Representa todas
                            as calorias que você queima por dia.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {props.tdee}
                  </div>
                  <div className="text-xs text-purple-600 dark:text-purple-400">
                    kcal/dia
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50 p-4 rounded-xl border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                      Meta Calórica
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                    {props.dailyCaloricTarget}
                  </div>
                  <div className="text-xs text-orange-600 dark:text-orange-400">
                    kcal/dia
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-xl border border-border/50">
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground mb-1">
                      Explicação da Meta Calórica
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {props.dailyCaloricTargetExplanation}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Apple className="w-4 h-4 text-primary" />
                  Distribuição de Macronutrientes
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/50 p-4 rounded-xl border border-red-200 dark:border-red-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Beef className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <span className="text-sm font-medium text-red-700 dark:text-red-300">
                        Proteínas
                      </span>
                    </div>
                    <div className="text-xl font-bold text-red-900 dark:text-red-100">
                      {props.proteinsGrams}g
                    </div>
                    <div className="text-xs text-red-600 dark:text-red-400">
                      por dia
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/50 p-4 rounded-xl border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Wheat className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                        Carboidratos
                      </span>
                    </div>
                    <div className="text-xl font-bold text-amber-900 dark:text-amber-100">
                      {props.carbohydratesGrams}g
                    </div>
                    <div className="text-xs text-amber-600 dark:text-amber-400">
                      por dia
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/50 dark:to-yellow-900/50 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Droplets className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                      <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                        Gorduras
                      </span>
                    </div>
                    <div className="text-xl font-bold text-yellow-900 dark:text-yellow-100">
                      {props.fatsGrams}g
                    </div>
                    <div className="text-xs text-yellow-600 dark:text-yellow-400">
                      por dia
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-2">
                  <Scale className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                      Recomendação de Peso
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {props.weightGoalRecommendation}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/50 dark:to-emerald-900/50 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                      Recomendações Personalizadas
                    </h4>
                    <p className="text-sm text-emerald-700 dark:text-emerald-300 leading-relaxed">
                      {props?.generalRecommendations}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border/50">
                Avaliação realizada em{" "}
                {props?.createdAt
                  ? format(props?.createdAt, "dd/MM/yyyy 'às' HH:mm", {
                      locale: ptBR,
                    })
                  : ""}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Calculator className="w-16 h-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Avaliação Física Não Disponível
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Complete suas informações físicas para gerar uma avaliação
                personalizada com recomendações de calorias e macronutrientes.
              </p>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4 mr-2" />
                Gerar Avaliação Física
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
