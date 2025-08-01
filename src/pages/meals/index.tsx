"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, easeOut, Variants } from "framer-motion";
import {
  Plus,
  Calendar,
  Edit3,
  Trash2,
  Camera,
  Sparkles,
  Clock,
  Zap,
  Beef,
  Wheat,
  Droplets,
  ChevronLeft,
  ChevronRight,
  Bot,
  Upload,
  Loader2,
} from "lucide-react";
import { format, addDays, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

// Tipagem para nutrientes estimados
interface EstimatedNutrientsType {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface NewMealType {
  type: string;
  description: string;
  time: string;
  image: File | null;
}

// Dados mockados
const mockMeals = [
  {
    id: 1,
    name: "Café da Manhã",
    description: "Aveia com frutas vermelhas e mel",
    image: "/placeholder.svg?height=80&width=80",
    time: "08:30",
    calories: 420,
    protein: 18,
    carbs: 65,
    fat: 12,
    tags: ["Rico em fibras", "Antioxidantes"],
    estimatedByAI: true,
  },
  {
    id: 2,
    name: "Almoço",
    description: "Salmão grelhado com quinoa e legumes",
    image: "/placeholder.svg?height=80&width=80",
    time: "12:45",
    calories: 680,
    protein: 45,
    carbs: 52,
    fat: 28,
    tags: ["Alto em proteína", "Ômega-3", "Low carb"],
    estimatedByAI: true,
  },
  {
    id: 3,
    name: "Lanche",
    description: "Iogurte grego com castanhas",
    image: "/placeholder.svg?height=80&width=80",
    time: "16:20",
    calories: 280,
    protein: 20,
    carbs: 15,
    fat: 18,
    tags: ["Alto em proteína", "Probióticos"],
    estimatedByAI: true,
  },
];

const mealTypes = [
  "Café da manhã",
  "Lanche da manhã",
  "Almoço",
  "Lanche da tarde",
  "Jantar",
  "Ceia",
];

export default function MealsPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEstimating, setIsEstimating] = useState(false);
  const [estimatedNutrients, setEstimatedNutrients] =
    useState<EstimatedNutrientsType | null>(null);
  const [newMeal, setNewMeal] = useState<NewMealType>({
    type: "",
    description: "",
    time: "",
    image: null,
  });

  const handleEstimateNutrients = async () => {
    if (!newMeal.description.trim()) return;

    setIsEstimating(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setEstimatedNutrients({
      calories: Math.floor(Math.random() * 400) + 200,
      protein: Math.floor(Math.random() * 30) + 10,
      carbs: Math.floor(Math.random() * 50) + 20,
      fat: Math.floor(Math.random() * 20) + 5,
    });

    setIsEstimating(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewMeal((prev) => ({ ...prev, image: file }));
    }
  };

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

  // Modal de adicionar refeição
  const AddMealModal = () => (
    <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Adicionar Nova Refeição
        </DialogTitle>
        <DialogDescription>
          Registre sua refeição e deixe nossa IA estimar os nutrientes
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6 py-4">
        {/* Upload de Imagem */}
        <div className="space-y-2">
          <Label htmlFor="image">Foto da Refeição</Label>
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Label htmlFor="image" className="cursor-pointer">
              {newMeal.image ? (
                <div className="space-y-2">
                  <div className="w-20 h-20 mx-auto bg-muted rounded-lg flex items-center justify-center">
                    <Camera className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-foreground">
                    {newMeal.image.name}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Clique para adicionar uma foto
                  </p>
                </div>
              )}
            </Label>
          </div>
        </div>

        {/* Tipo da Refeição */}
        <div className="space-y-2">
          <Label htmlFor="type">Tipo da Refeição</Label>
          <Select
            value={newMeal.type}
            onValueChange={(value: string) =>
              setNewMeal((prev) => ({ ...prev, type: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              {mealTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Descrição */}
        <div className="space-y-2">
          <Label htmlFor="description">Descrição da Refeição</Label>
          <Textarea
            id="description"
            placeholder="Descreva o que você comeu ou vai comer..."
            value={newMeal.description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setNewMeal((prev) => ({ ...prev, description: e.target.value }))
            }
            rows={3}
          />
        </div>

        {/* Horário */}
        <div className="space-y-2">
          <Label htmlFor="time">Horário (opcional)</Label>
          <Input
            id="time"
            type="time"
            value={newMeal.time}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewMeal((prev) => ({ ...prev, time: e.target.value }))
            }
          />
        </div>

        {/* Botão Estimar Nutrientes */}
        <Button
          onClick={handleEstimateNutrients}
          disabled={!newMeal.description.trim() || isEstimating}
          className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
        >
          {isEstimating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              IA Analisando...
            </>
          ) : (
            <>
              <Bot className="w-4 h-4 mr-2" />
              Estimar Nutrientes com IA
            </>
          )}
        </Button>

        {/* Resultado da Estimativa */}
        <AnimatePresence>
          {estimatedNutrients && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <Separator />
              <div className="space-y-3">
                {/* Exibição dos nutrientes estimados */}
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Estimativa por IA</span>
                  <Badge variant="secondary" className="text-xs">
                    Automático
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Calorias */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        Calorias
                      </span>
                      <span className="font-medium">
                        {estimatedNutrients.calories} kcal
                      </span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  {/* Proteínas */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Beef className="w-3 h-3" />
                        Proteínas
                      </span>
                      <span className="font-medium">
                        {estimatedNutrients.protein}g
                      </span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  {/* Carboidratos */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Wheat className="w-3 h-3" />
                        Carboidratos
                      </span>
                      <span className="font-medium">
                        {estimatedNutrients.carbs}g
                      </span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                  {/* Gorduras */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Droplets className="w-3 h-3" />
                        Gorduras
                      </span>
                      <span className="font-medium">
                        {estimatedNutrients.fat}g
                      </span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botões */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => setIsModalOpen(false)}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
            disabled={!newMeal.type || !newMeal.description.trim()}
          >
            Salvar Refeição
          </Button>
        </div>
      </div>
    </DialogContent>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Minhas Refeições
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Visualize e acompanhe suas refeições registradas com estimativas
              nutricionais por IA
            </p>
          </motion.div>

          {/* Date Selector */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-4"
          >
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSelectedDate(subDays(selectedDate, 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="min-w-[200px] justify-center bg-transparent"
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
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </motion.div>

          {/* Add Meal Button */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Adicionar Refeição
                </Button>
              </DialogTrigger>
              <AddMealModal />
            </Dialog>
          </motion.div>

          {/* Meals List */}
          {mockMeals.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-16 text-center"
              style={{ opacity: 0.3 }}
            >
              {/* EmptyState code se preferir */}
              Nenhuma refeição registrada
            </div>
          ) : (
            <motion.div
              variants={itemVariants}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {mockMeals.map((meal, index) => (
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
                            src={meal.image || "/placeholder.svg"}
                            alt={meal.name}
                            className="w-16 h-16 rounded-lg object-cover ring-2 ring-primary/10"
                            width={1000}
                            height={1000}
                          />
                          <div>
                            <CardTitle className="text-lg">
                              {meal.name}
                            </CardTitle>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {meal.time}
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
                          <span>{meal.calories} kcal</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Beef className="w-3 h-3 text-red-500" />
                          <span>{meal.protein}g prot.</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Wheat className="w-3 h-3 text-yellow-500" />
                          <span>{meal.carbs}g carb.</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Droplets className="w-3 h-3 text-blue-500" />
                          <span>{meal.fat}g gord.</span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {meal.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {meal.estimatedByAI && (
                          <Badge
                            variant="outline"
                            className="text-xs border-primary/20 text-primary"
                          >
                            <Bot className="w-3 h-3 mr-1" />
                            IA
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
