"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Home,
  Utensils,
  TrendingUp,
  User,
  LogOut,
  Plus,
  Sun,
  Moon,
  Zap,
  Beef,
  Wheat,
  Droplets,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Dados mockados
const nutritionData = {
  calories: { consumed: 1850, target: 2200 },
  protein: { consumed: 95, target: 120 },
  carbs: { consumed: 220, target: 275 },
  fat: { consumed: 65, target: 80 },
};

const weeklyData = [
  { day: "Seg", calories: 2100 },
  { day: "Ter", calories: 1950 },
  { day: "Qua", calories: 2300 },
  { day: "Qui", calories: 1850 },
  { day: "Sex", calories: 2050 },
  { day: "Sáb", calories: 2400 },
  { day: "Dom", calories: 1900 },
];

const meals = [
  {
    id: 1,
    name: "Café da Manhã",
    time: "08:30",
    image: "/placeholder.svg?height=60&width=60",
    calories: 420,
    protein: 18,
    carbs: 45,
    fat: 15,
  },
  {
    id: 2,
    name: "Almoço",
    time: "12:45",
    image: "/placeholder.svg?height=60&width=60",
    calories: 680,
    protein: 35,
    carbs: 85,
    fat: 22,
  },
  {
    id: 3,
    name: "Lanche",
    time: "16:20",
    image: "/placeholder.svg?height=60&width=60",
    calories: 250,
    protein: 12,
    carbs: 30,
    fat: 8,
  },
  {
    id: 4,
    name: "Jantar",
    time: "19:15",
    image: "/placeholder.svg?height=60&width=60",
    calories: 500,
    protein: 30,
    carbs: 60,
    fat: 20,
  },
];

const sidebarItems = [
  { icon: Home, label: "Visão Geral", active: true },
  { icon: Utensils, label: "Refeições", active: false },
  { icon: TrendingUp, label: "Progresso", active: false },
  { icon: User, label: "Perfil", active: false },
  { icon: LogOut, label: "Sair", active: false },
];

export default function DashboardPage() {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

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

  return (
    <div className={`min-h-screen ${isDark ? "dark" : ""}`}>
      <div className="flex min-h-screen bg-slate-950 dark:bg-background">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}

          {/* Dashboard Content */}
          <main className="flex-1 p-6 overflow-auto">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* Nutrition Summary Cards */}
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
                      {nutritionData.calories.consumed}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      de {nutritionData.calories.target} kcal
                    </p>
                    <div className="w-full bg-slate-800 rounded-full h-2 mt-2">
                      <div
                        className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full"
                        style={{
                          width: `${
                            (nutritionData.calories.consumed /
                              nutritionData.calories.target) *
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
                      {nutritionData.protein.consumed}g
                    </div>
                    <p className="text-xs text-muted-foreground">
                      de {nutritionData.protein.target}g
                    </p>
                    <div className="w-full bg-slate-800 rounded-full h-2 mt-2">
                      <div
                        className="bg-gradient-to-r from-red-500 to-pink-500 h-2 rounded-full"
                        style={{
                          width: `${
                            (nutritionData.protein.consumed /
                              nutritionData.protein.target) *
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
                      {nutritionData.carbs.consumed}g
                    </div>
                    <p className="text-xs text-muted-foreground">
                      de {nutritionData.carbs.target}g
                    </p>
                    <div className="w-full bg-slate-800 rounded-full h-2 mt-2">
                      <div
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full"
                        style={{
                          width: `${
                            (nutritionData.carbs.consumed /
                              nutritionData.carbs.target) *
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
                      {nutritionData.fat.consumed}g
                    </div>
                    <p className="text-xs text-muted-foreground">
                      de {nutritionData.fat.target}g
                    </p>
                    <div className="w-full bg-slate-800 rounded-full h-2 mt-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full"
                        style={{
                          width: `${
                            (nutritionData.fat.consumed /
                              nutritionData.fat.target) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Chart and Meals Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weekly Chart */}
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
                        <BarChart data={weeklyData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#374151"
                          />
                          <XAxis dataKey="day" stroke="#9CA3AF" fontSize={12} />
                          <YAxis stroke="#9CA3AF" fontSize={12} />
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

                {/* Meals List */}
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
                          <img
                            src={meal.image || "/placeholder.svg"}
                            alt={meal.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-foreground">
                                {meal.name}
                              </h4>
                              <span className="text-sm text-muted-foreground">
                                {meal.time}
                              </span>
                            </div>
                            <div className="flex gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {meal.calories} kcal
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                P: {meal.protein}g
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                C: {meal.carbs}g
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                G: {meal.fat}g
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

        {/* Floating Action Button */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
          className="fixed bottom-6 right-6"
        >
          <Button
            size="lg"
            className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
