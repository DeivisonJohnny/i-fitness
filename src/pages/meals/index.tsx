"use client";

import React, { useEffect, useState } from "react";
import { motion, easeOut, Variants } from "framer-motion";
import {
  Plus,
  Calendar,
  Edit3,
  Trash2,
  Clock,
  Zap,
  Beef,
  Wheat,
  Droplets,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format, addDays, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import Image from "next/image";
import { useRouter } from "next/router";
import MealsApi, { MealType } from "@/service/Api/MealsApi";

export default function MealsPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [listMeals, setlistMeals] = useState<MealType[] | null>(null);

  const router = useRouter();

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
  const itemVariants: Variants = {
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
        const data = await MealsApi.list({
          date: selectedDate,
        });
        setlistMeals(data);
      } catch (error) {
        console.error("Erro ao buscar refeições:", error);
      }
    })();
  }, [selectedDate]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] dark:bg-gradient-to-br dark:from-background dark:via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-black dark:text-white ">
              Minhas Refeições
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Visualize e acompanhe suas refeições registradas com estimativas
              nutricionais por IA
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-4"
          >
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSelectedDate(subDays(selectedDate, 1))}
              className="bg-white dark:bg-background"
            >
              <ChevronLeft className="w-4 h-4 text-black dark:text-white" />
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="min-w-[200px] justify-center bg-transparent dark:text-white text-black  "
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  {format(selectedDate, "dd 'de' MMMM, yyyy", { locale: ptBR })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <CalendarComponent
                  mode="single"
                  required
                  selected={selectedDate}
                  onSelect={(date: Date) => date && setSelectedDate(date)}
                  locale={ptBR}
                  className="rounded-lg border"
                />
              </PopoverContent>
            </Popover>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setSelectedDate(addDays(selectedDate, 1))}
              className="bg-white dark:bg-background"
            >
              <ChevronRight className="w-4 h-4  text-black dark:text-white" />
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className="flex justify-center">
            <Button
              size="lg"
              className=" bg-background dark:border dark:text-white dark:hover:bg-white/20 cursor-pointer "
              onClick={() => router.push("/add-meals")}
            >
              <Plus className="w-5 h-5 mr-2" />
              Adicionar Refeição
            </Button>
          </motion.div>

          {listMeals && listMeals.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-16 text-center"
              style={{ opacity: 0.3 }}
            >
              Nenhuma refeição registrada
            </div>
          ) : (
            <motion.div
              variants={itemVariants}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {listMeals
                ? listMeals.map((meal, index) => (
                    <motion.div
                      key={meal.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 bg-gradient-to-br from-card to-card/50 overflow-hidden">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              {/* Substitua por next/image para melhor performance */}
                              <Image
                                src={meal.imgUrl || "/placeholder.svg"}
                                alt={meal.type}
                                className="w-16 h-16 rounded-lg object-cover ring-2 ring-primary/10"
                                width={1000}
                                height={1000}
                              />
                              <div>
                                <CardTitle className="text-lg">
                                  {meal.type}
                                </CardTitle>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Clock className="w-3 h-3" />
                                  {meal?.hourMeal &&
                                    new Date(meal.hourMeal).toLocaleTimeString(
                                      "pt-BR",
                                      {
                                        timeZone: "America/Sao_Paulo",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false,
                                      }
                                    )}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <Edit3 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            {meal.description}
                          </p>

                          {/* Nutrientes */}
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                              <Zap className="w-3 h-3 text-orange-500" />
                              <span>
                                {meal?.AssessmentMeals?.calories} kcal
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Beef className="w-3 h-3 text-red-500" />
                              <span>
                                {meal?.AssessmentMeals?.proteinsGrams}g prot.
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Wheat className="w-3 h-3 text-yellow-500" />
                              <span>
                                {meal?.AssessmentMeals?.carbsGrams}g carb.
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Droplets className="w-3 h-3 text-blue-500" />
                              <span>
                                {meal?.AssessmentMeals?.fatsGrams}g gord.
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                : ""}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
