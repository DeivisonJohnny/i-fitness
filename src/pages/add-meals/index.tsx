"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence, easeOut } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Camera,
  Upload,
  Sparkles,
  Bot,
  Loader2,
  Utensils,
  Clock,
  BookOpen,
  Flame,
  Beef,
  Wheat,
  Droplets,
  Save,
  X,
  AlertCircle,
  Edit3,
} from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
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
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Image from "next/image";

type Nutrients = {
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
};

export default function AddMeals() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mealData, setMealData] = useState({
    type: "",
    description: "",
    time: format(new Date(), "HH:mm"), // Default current time
    imageFile: null as File | null,
    imagePreviewUrl: "",
  });

  const [estimationState, setEstimationState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const [estimatedNutrients, setEstimatedNutrients] = useState<
    Partial<Nutrients>
  >({});

  const [showManualInput, setShowManualInput] = useState(false);

  const mealTypesOptions = [
    "Café da manhã",
    "Almoço",
    "Jantar",
    "Lanche",
    "Pré-treino",
    "Pós-treino",
    "Ceia",
    "Outro",
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMealData((prev) => ({
        ...prev,
        imageFile: file,
        imagePreviewUrl: URL.createObjectURL(file),
      }));
      setEstimationState("idle");
      setEstimatedNutrients({});
      setShowManualInput(false);
    }
  };

  const handleEstimateNutrients = async () => {
    if (!mealData.imageFile && !mealData.description.trim()) {
      toast.error("Campos Obrigatórios", {
        description:
          "Por favor, envie uma imagem ou descreva a refeição para estimar.",
      });
      return;
    }

    setEstimationState("loading");
    setEstimatedNutrients({});
    setShowManualInput(false);

    // Simula processamento da IA
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Simula resultado (80% sucesso)
    if (Math.random() > 0.2) {
      setEstimatedNutrients({
        calories: Math.floor(Math.random() * 600) + 300,
        protein: Math.floor(Math.random() * 40) + 15,
        carbs: Math.floor(Math.random() * 80) + 30,
        fat: Math.floor(Math.random() * 30) + 10,
      });
      setEstimationState("success");
      toast("Estimativa Concluída!", {
        description: "Nutrientes estimados com sucesso pela IA.",
      });
    } else {
      setEstimationState("error");
      toast("Erro na Estimativa", {
        description:
          "Não foi possível estimar os nutrientes. Tente novamente ou insira os dados manualmente abaixo.",
      });
      setShowManualInput(true);
    }
  };

  const handleSaveMeal = () => {
    if (!mealData.type || !mealData.description.trim() || !mealData.time) {
      toast("Erro de Validação", {
        description:
          "Por favor, preencha o tipo, descrição e horário da refeição.",
      });
      return;
    }

    if (estimationState !== "success" && !showManualInput) {
      toast("Estimativa Pendente", {
        description:
          "Por favor, estime os nutrientes com IA ou insira manualmente.",
      });
      return;
    }

    // Simula salvamento dos dados
    console.log({
      mealData,
      estimatedNutrients,
      manualInput: showManualInput,
    });

    toast("Refeição Salva!", {
      description: "Sua refeição foi registrada com sucesso.",
    });

    router.push("/meals");
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: easeOut },
    },
  };

  const handleCaloriesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEstimatedNutrients((prev) => ({
      ...prev,
      calories: Number(e.target.value),
    }));
  };

  const handleProteinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEstimatedNutrients((prev) => ({
      ...prev,
      protein: Number(e.target.value),
    }));
  };

  const handleCarbsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEstimatedNutrients((prev) => ({
      ...prev,
      carbs: Number(e.target.value),
    }));
  };

  const handleFatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEstimatedNutrients((prev) => ({
      ...prev,
      fat: Number(e.target.value),
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 max-w-2xl"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/meals")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Adicionar Refeição
            </h1>
            <div className="w-10" /> {/* Placeholder para alinhamento */}
          </div>
          <p className="text-lg text-muted-foreground text-center max-w-xl mx-auto">
            Envie uma foto e descreva sua refeição para obter estimativas
            nutricionais com IA.
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 shadow-lg">
            <CardContent className="space-y-8 py-6">
              {/* Upload */}
              <div className="space-y-4 text-center">
                <Label
                  htmlFor="image-upload"
                  className="block text-lg font-semibold text-foreground"
                >
                  Foto da Refeição
                </Label>
                <div
                  className="relative border-2 border-dashed border-border rounded-xl p-6 cursor-pointer hover:border-primary/50 transition-colors group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    ref={fileInputRef}
                  />
                  {mealData.imagePreviewUrl ? (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden">
                      <Image
                        src={mealData.imagePreviewUrl || "/placeholder.svg"}
                        alt="Preview da Refeição"
                        className="w-full h-full object-cover"
                        width={1000}
                        height={1000}
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 py-4">
                      <Upload className="w-12 h-12 mx-auto text-muted-foreground/60" />
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-primary">
                          Clique para enviar
                        </span>{" "}
                        ou arraste e solte
                      </p>
                      <p className="text-xs text-muted-foreground/80">
                        Tire uma foto ou envie uma imagem do seu prato
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Detalhes da Refeição */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-primary" />
                  Detalhes da Refeição
                </h3>

                {/* Tipo de Refeição */}
                <div className="space-y-2">
                  <Label htmlFor="mealType" className="flex items-center gap-1">
                    Tipo de Refeição
                  </Label>
                  <Select
                    value={mealData.type}
                    onValueChange={(value) =>
                      setMealData((prev) => ({ ...prev, type: value }))
                    }
                    required
                  >
                    <SelectTrigger id="mealType">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {mealTypesOptions.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Horário */}
                <div className="space-y-2">
                  <Label htmlFor="mealTime" className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    Horário (Opcional)
                  </Label>
                  <Input
                    id="mealTime"
                    type="time"
                    value={mealData.time}
                    onChange={(e) =>
                      setMealData((prev) => ({ ...prev, time: e.target.value }))
                    }
                  />
                </div>

                {/* Descrição */}
                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="flex items-center gap-1"
                  >
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    Descrição da Refeição
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Ex: arroz integral, peito de frango grelhado, salada de alface, tomate e pepino..."
                    value={mealData.description}
                    onChange={(e) =>
                      setMealData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={4}
                    required
                  />
                </div>

                {/* Botão Estimar Nutrientes */}
                <Button
                  onClick={handleEstimateNutrients}
                  disabled={
                    estimationState === "loading" ||
                    (!mealData.imageFile && !mealData.description.trim())
                  }
                  className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                >
                  {estimationState === "loading" ? (
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
              </div>

              {/* Estimativa Nutricional */}
              <AnimatePresence mode="wait">
                {estimationState === "success" && estimatedNutrients && (
                  <motion.div
                    key="estimation-success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <Separator />
                    <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      Estimativa Nutricional
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Flame className="w-3 h-3 text-orange-500" />
                            Calorias
                          </span>
                          <span className="font-medium text-foreground">
                            {estimatedNutrients.calories} kcal
                          </span>
                        </div>
                        <Progress
                          value={
                            ((estimatedNutrients.calories ?? 0) / 1000) * 100
                          }
                          className="h-2"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Beef className="w-3 h-3 text-red-500" />
                            Proteínas
                          </span>
                          <span className="font-medium text-foreground">
                            {estimatedNutrients.protein}g
                          </span>
                        </div>
                        <Progress
                          value={
                            ((estimatedNutrients.protein ?? 0) / 100) * 100
                          }
                          className="h-2"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Wheat className="w-3 h-3 text-yellow-500" />
                            Carboidratos
                          </span>
                          <span className="font-medium text-foreground">
                            {estimatedNutrients.carbs}g
                          </span>
                        </div>
                        <Progress
                          value={((estimatedNutrients.carbs ?? 0) / 200) * 100}
                          className="h-2"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Droplets className="w-3 h-3 text-blue-500" />
                            Gorduras
                          </span>
                          <span className="font-medium text-foreground">
                            {estimatedNutrients.fat}g
                          </span>
                        </div>
                        <Progress
                          value={((estimatedNutrients.fat ?? 0) / 80) * 100}
                          className="h-2"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground text-center mt-4">
                      Estimado automaticamente com IA. Pode conter variações.
                    </p>
                  </motion.div>
                )}

                {estimationState === "error" && (
                  <motion.div
                    key="estimation-error"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4 text-center p-4 rounded-lg bg-destructive/10 border border-destructive/30"
                  >
                    <AlertCircle className="w-8 h-8 text-destructive mx-auto" />
                    <p className="text-destructive font-medium">
                      Não foi possível estimar os nutrientes com IA.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Por favor, tente novamente ou insira os dados manualmente
                      abaixo.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setShowManualInput(true)}
                      className="mt-4"
                    >
                      Inserir Dados Manualmente
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input Manual */}
              <AnimatePresence>
                {showManualInput && (
                  <motion.div
                    key="manual-input"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-6 overflow-hidden"
                  >
                    <Separator />
                    <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                      <Edit3 className="w-5 h-5 text-primary" />
                      Inserir Nutrientes Manualmente
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="manual-calories">Calorias (kcal)</Label>
                        <Input
                          id="manual-calories"
                          type="number"
                          placeholder="Ex: 450"
                          value={estimatedNutrients.calories ?? ""}
                          onChange={handleCaloriesChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="manual-protein">Proteínas (g)</Label>
                        <Input
                          id="manual-protein"
                          type="number"
                          placeholder="Ex: 30"
                          value={estimatedNutrients.protein ?? ""}
                          onChange={handleProteinChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="manual-carbs">Carboidratos (g)</Label>
                        <Input
                          id="manual-carbs"
                          type="number"
                          placeholder="Ex: 50"
                          value={estimatedNutrients.carbs ?? ""}
                          onChange={handleCarbsChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="manual-fat">Gorduras (g)</Label>
                        <Input
                          id="manual-fat"
                          type="number"
                          placeholder="Ex: 15"
                          value={estimatedNutrients.fat ?? ""}
                          onChange={handleFatChange}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Botões de ação */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  onClick={handleSaveMeal}
                  disabled={
                    estimationState === "loading" ||
                    (Object.keys(estimatedNutrients).length === 0 &&
                      !showManualInput)
                  }
                  className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-md"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Refeição
                </Button>
                <Button
                  onClick={() => router.push("/meals")}
                  variant="outline"
                  className="flex-1 border-border/50 bg-transparent"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
