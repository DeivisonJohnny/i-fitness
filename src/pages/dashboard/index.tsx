"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Zap, Beef, Wheat, Droplets } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/hooks/useTheme";
import Image from "next/image";
import { useEffect, useState } from "react";
import MealsApi, { MealType, WeekCaloriesType } from "@/service/Api/MealsApi";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const [meals, setMeals] = useState<MealType[]>([]);
  const [caloriesConsumed, setCaloriesConsumed] = useState(0);
  const [proteinsGrams, setProteinsGrams] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fats, setFats] = useState(0);
  const [weeklyCalories, setWeeklyCalories] = useState<WeekCaloriesType[]>([]);
  const { me } = useAuth();
  const { theme } = useTheme();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };
  useEffect(() => {
    (async () => {
      try {
        const mealsToday = await MealsApi.findMealsToday();
        const weekCalories = await MealsApi.findWeeklyCalories();
        const totalCalories = mealsToday.reduce(
          (sum, item) => sum + (item.AssessmentMeals?.calories ?? 0),
          0
        );
        const totalProteins = mealsToday.reduce(
          (sum, item) => sum + (item.AssessmentMeals?.proteinsGrams ?? 0),
          0
        );
        const totalCarbs = mealsToday.reduce(
          (sum, item) => sum + (item.AssessmentMeals?.carbsGrams ?? 0),
          0
        );
        const totalFats = mealsToday.reduce(
          (sum, item) => sum + (item.AssessmentMeals?.fatsGrams ?? 0),
          0
        );
        setCaloriesConsumed(totalCalories);
        setProteinsGrams(totalProteins);
        setCarbs(totalCarbs);
        setFats(totalFats);
        setMeals(mealsToday);
        setWeeklyCalories(weekCalories);
      } catch (error) {
        console.log("🚀 ~ DashboardPage ~ error:", error);
      }
    })();
  }, []);

  return (
    <div className={`min-h-screen ${theme}`}>
      <div className="flex min-h-screen bg-slate-950 dark:bg-background">
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-6 overflow-auto">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                <Card className="bg-slate-900 dark:bg-card border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Calorias
                    </CardTitle>
                    <Zap className="h-4 w-4 text-orange-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">
                      {caloriesConsumed}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      de {me?.physicalAssessment?.dailyCaloricTarget} kcal
                    </p>
                    <div className="w-full bg-slate-800 rounded-full h-2 mt-2">
                      <div
                        className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full"
                        style={{
                          width: `${
                            (caloriesConsumed /
                              (me?.physicalAssessment?.dailyCaloricTarget ??
                                0)) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900 dark:bg-card border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Proteínas
                    </CardTitle>
                    <Beef className="h-4 w-4 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">
                      {proteinsGrams}g
                    </div>
                    <p className="text-xs text-muted-foreground">
                      de {me?.physicalAssessment?.proteinsGrams}g
                    </p>
                    <div className="w-full bg-slate-800 rounded-full h-2 mt-2">
                      <div
                        className="bg-gradient-to-r from-red-500 to-pink-500 h-2 rounded-full"
                        style={{
                          width: `${
                            (proteinsGrams /
                              (me?.physicalAssessment?.proteinsGrams ?? 0)) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900 dark:bg-card border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Carboidratos
                    </CardTitle>
                    <Wheat className="h-4 w-4 text-yellow-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">
                      {carbs}g
                    </div>
                    <p className="text-xs text-muted-foreground">
                      de {me?.physicalAssessment?.carbohydratesGrams}g
                    </p>
                    <div className="w-full bg-slate-800 rounded-full h-2 mt-2">
                      <div
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full"
                        style={{
                          width: `${
                            (carbs /
                              (me?.physicalAssessment?.carbohydratesGrams ??
                                0)) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900 dark:bg-card border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Gorduras
                    </CardTitle>
                    <Droplets className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">
                      {fats}g
                    </div>
                    <p className="text-xs text-muted-foreground">
                      de {me?.physicalAssessment?.fatsGrams}g
                    </p>
                    <div className="w-full bg-slate-800 rounded-full h-2 mt-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full"
                        style={{
                          width: `${
                            (fats / (me?.physicalAssessment?.fatsGrams ?? 1)) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div variants={itemVariants}>
                  <Card className="bg-slate-900 dark:bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground">
                        Ingestão Semanal
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Calorias consumidas nos últimos 7 dias
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={weeklyCalories}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#374151"
                          />
                          <XAxis dataKey="day" stroke="#9CA3AF" fontSize={12} />
                          <YAxis
                            stroke="#9CA3AF"
                            fontSize={12}
                            domain={[
                              0,
                              (dataMax) =>
                                Math.max(
                                  dataMax,
                                  Number(
                                    me?.physicalAssessment
                                      ?.dailyCaloricTarget || 0
                                  )
                                ) * 1.1,
                            ]}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1F2937",
                              border: "1px solid #374151",
                              borderRadius: "8px",
                              color: "#F9FAFB",
                            }}
                          />
                          <Bar
                            dataKey="calories"
                            fill="url(#gradient)"
                            radius={[4, 4, 0, 0]}
                          />
                          {me?.physicalAssessment?.dailyCaloricTarget && (
                            <ReferenceLine
                              y={Number(
                                me.physicalAssessment.dailyCaloricTarget
                              )}
                              stroke="#F87171"
                              strokeDasharray="4 4"
                              label={{
                                value: "Meta diária",
                                position: "insideTopRight",
                                fill: "#F87171",
                                fontSize: 12,
                              }}
                            />
                          )}
                          <defs>
                            <linearGradient
                              id="gradient"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop offset="0%" stopColor="#6366F1" />
                              <stop offset="100%" stopColor="#8B5CF6" />
                            </linearGradient>
                          </defs>
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card className="bg-slate-900 dark:bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground">
                        Refeições de Hoje
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Analisadas por IA
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {meals.map((meal, index) => (
                        <motion.div
                          key={meal.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-4 p-3 rounded-lg bg-slate-800 dark:bg-accent/50"
                        >
                          <Image
                            src={meal.imgUrl || "/placeholder.svg"}
                            alt={meal.type}
                            className="w-12 h-12 rounded-lg object-cover"
                            width={1000}
                            height={1000}
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-foreground">
                                {meal.type}
                              </h4>
                              <span className="text-sm text-muted-foreground">
                                {meal.time}
                              </span>
                            </div>
                            <div className="flex gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {meal.AssessmentMeals?.calories} kcal
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                P: {meal.AssessmentMeals?.proteinsGrams}g
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                C: {meal.AssessmentMeals?.carbsGrams}g
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                G: {meal.AssessmentMeals?.fatsGrams}g
                              </Badge>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
