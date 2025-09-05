"use client";

import type React from "react";

import { easeOut, motion } from "framer-motion";
import { Key, Trash2, Settings, LineChart, Weight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useAuth } from "@/hooks/useAuth";

import InformationAccount from "@/components/profile/InformationAccount";
import { Sex } from "@prisma/client";
import ResumePhysical from "@/components/profile/ResumePhysical";
import AvaliationPhysical from "@/components/profile/AvaliationPhysical";
import { useEffect, useState } from "react";
import UserApi from "@/service/Api/UserApi";
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from "recharts";

import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useTheme } from "next-themes";

export default function ProfilePage() {
  const { me } = useAuth();
  const [historyWeight, setHistoryWeight] = useState<
    { date: string; weight: number }[]
  >([]);
  const { theme } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: easeOut },
    },
  };

  useEffect(() => {
    (async () => {
      try {
        const historyWeight = await UserApi.findHistoryWeight();
        setHistoryWeight(historyWeight);
      } catch (error) {
        console.log("🚀 ~ ProfilePage ~ error:", error);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br  py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 max-w-4xl"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black dark:text-white mb-2">
            Meu Perfil
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Gerencie seus dados e acompanhe sua evolução no I Fitness.
          </p>
        </motion.div>
        <InformationAccount
          born={me?.born as Date}
          email={me?.email as string}
          name={me?.name as string}
          surname={me?.surname as string}
          profession={me?.profession as string}
          sex={me?.sex as Sex}
        />

        <ResumePhysical
          imc={me?.physicalAssessment?.bmi as number}
          height={me?.height}
          objective={me?.objective}
          physical_activity_level={me?.physical_activity_level}
          type_training={me?.type_training}
          weight={me?.weight}
        />

        <AvaliationPhysical
          bmi={me?.physicalAssessment?.bmi ?? 0}
          bmiClassification={me?.physicalAssessment?.bmiClassification ?? ""}
          bmr={me?.physicalAssessment?.bmr ?? 0}
          tdee={me?.physicalAssessment?.tdee ?? 0}
          dailyCaloricTarget={me?.physicalAssessment?.dailyCaloricTarget ?? 0}
          dailyCaloricTargetExplanation={
            me?.physicalAssessment?.dailyCaloricTargetExplanation ?? ""
          }
          proteinsGrams={me?.physicalAssessment?.proteinsGrams ?? 0}
          carbohydratesGrams={me?.physicalAssessment?.carbohydratesGrams ?? 0}
          fatsGrams={me?.physicalAssessment?.fatsGrams ?? 0}
          weightGoalRecommendation={
            me?.physicalAssessment?.weightGoalRecommendation ?? ""
          }
          generalRecommendations={
            me?.physicalAssessment?.generalRecommendations ?? ""
          }
          createdAt={me?.physicalAssessment?.createdAt ?? new Date()}
        />
        <motion.div variants={itemVariants} className="mb-8">
          <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <LineChart className="w-5 h-5 text-primary" />
                Evolução do Peso
              </CardTitle>
              <CardDescription>
                Acompanhe seu peso ao longo do tempo.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] pt-4">
              {historyWeight.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart
                    data={historyWeight.map((d) => ({
                      ...d,
                      date: format(parseISO(d.date), "dd/MM", { locale: ptBR }),
                    }))}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
                    <YAxis
                      stroke="#9CA3AF"
                      fontSize={12}
                      domain={["dataMin - 2", "dataMax + 2"]}
                      tickFormatter={(value) => `${value} kg`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor:
                          theme == "dark" ? "#292929" : "#f5f5f5",
                        borderRadius: 10,
                      }}
                      formatter={(value: number) => [`${value} kg`, "Peso"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="url(#lineGradient)"
                      strokeWidth={3}
                      dot={{ stroke: "#6366F1", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: "#8B5CF6", strokeWidth: 2 }}
                    />
                    <defs>
                      <linearGradient
                        id="lineGradient"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                      >
                        <stop offset="0%" stopColor="#6366F1" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                    </defs>
                  </RechartsLineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <Weight className="w-12 h-12 mb-4" />
                  <p>Registre mais pesos para ver sua evolução aqui!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-8">
          <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Settings className="w-5 h-5 text-primary" />
                Configurações da Conta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start border-border/50 bg-transparent"
              >
                <Key className="w-4 h-4 mr-2" />
                Alterar Senha
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="w-full justify-start bg-destructive/20 text-destructive hover:bg-destructive/30"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir Conta
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Tem certeza que deseja excluir sua conta?
                    </DialogTitle>
                    <DialogDescription>
                      Esta ação é irreversível. Todos os seus dados serão
                      permanentemente removidos.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline">Cancelar</Button>
                    <Button variant="destructive">
                      Excluir Permanentemente
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
