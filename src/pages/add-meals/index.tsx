"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence, easeOut } from "framer-motion";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import {
  Camera,
  Upload,
  Sparkles,
  Utensils,
  Clock,
  BookOpen,
  Flame,
  Beef,
  Wheat,
  Droplets,
  Save,
  X,
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
import Image from "next/image";
import { typesMealOptions } from "@/lib/enums";
import MealsApi, { TypeMeal } from "@/service/Api/MealsApi";
import AttachmentApi from "@/service/Api/AttechmentApi";
import { toast } from "sonner";

type Nutrients = {
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
};

const mealValidationSchema = Yup.object({
  type: Yup.string().required("O tipo da refeição é obrigatório."),
  description: Yup.string()
    .max(500, "A descrição deve ter no máximo 500 caracteres.")
    .optional(),
  time: Yup.string().optional(),
  imageFile: Yup.mixed()
    .nullable()
    .test(
      "fileSize",
      "O arquivo é muito grande (máximo 5MB)",
      // @ts-ignore
      (value) => !value || (value && value.size <= 50 * 1024 * 1024) // 5MB
    )
    .test(
      "fileType",
      "Formato de arquivo não suportado",
      // @ts-ignore
      (value) =>
        !value ||
        (value &&
          value instanceof File &&
          ["image/jpeg", "image/png", "image/webp"].includes(value.type))
    ),
});

export default function AddMeals() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mealData, setMealData] = useState({
    type: "",
    description: "",
    time: format(new Date(), "HH:mm"),
    imageFile: null as File | null,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");

  const [estimationState, setEstimationState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [estimatedNutrients, setEstimatedNutrients] = useState<
    Partial<Nutrients>
  >({});

  const handleChange = (field: string, value: string | File | null) => {
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    setMealData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleChange("imageFile", file);

    if (file) {
      setImagePreviewUrl(URL.createObjectURL(file));
      setEstimationState("idle");
      setEstimatedNutrients({});
    } else {
      setImagePreviewUrl("");
    }
  };

  const handleSaveMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      await mealValidationSchema.validate(mealData, { abortEarly: false });

      let imageUrl = "";

      if (mealData.imageFile) {
        const newAttachment = await AttachmentApi.create({
          modelId: "",
          model: "meal",
          file: mealData.imageFile,
        });

        imageUrl = newAttachment?.url || "";
      }

      const response = await MealsApi.create({
        ...mealData,
        urlImage: imageUrl,
      });

      if (response) {
        toast.success("Refeição adicionada com sucesso");
      }
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const newErrors: { [key: string]: string } = {};
        err.inner.forEach((error) => {
          if (error.path) newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
        console.log("Erros de validação:", newErrors);
      } else {
        toast.error((err as Error).message);
      }
    } finally {
      setIsSubmitting(false);
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: easeOut },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-foreground via-foreground to-muted/80 dark:bg-gradient-to-br dark:from-background dark:via-background dark:to-muted/20 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 max-w-2xl"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-3xl font-bold dark:bg-gradient-to-r dark:from-foreground dark:to-foreground/80 dark:bg-clip-text dark:text-transparent  text-black   ">
              Adicionar Refeição
            </h1>
            <div className="w-10" />
          </div>
          <p className="text-lg text-muted-foreground text-center max-w-xl mx-auto">
            Envie uma foto e descreva sua refeição para obter estimativas
            nutricionais com IA.
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <form onSubmit={handleSaveMeal}>
            <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 shadow-lg">
              <CardContent className="space-y-8 py-6">
                <div className="space-y-4 text-center">
                  <Label
                    htmlFor="image-upload"
                    className="block text-lg font-semibold  text-black dark:text-foreground"
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
                    {imagePreviewUrl ? (
                      <div className="relative w-full h-48 rounded-lg overflow-hidden">
                        <Image
                          src={imagePreviewUrl}
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
                  {errors.imageFile && (
                    <div className="text-red-500 text-sm text-left">
                      {errors.imageFile}
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-back dark:text-foreground flex items-center gap-2">
                    <Utensils className="w-5 h-5 dark:text-primary" />
                    Detalhes da Refeição
                  </h3>

                  <div className="space-y-2">
                    <Label
                      htmlFor="mealType"
                      className="flex items-center gap-1"
                    >
                      Tipo de Refeição
                    </Label>

                    <Select
                      value={mealData.type}
                      onValueChange={(value) => handleChange("type", value)}
                    >
                      <SelectTrigger
                        id="mealType"
                        className={errors.type ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(typesMealOptions).map(
                          ([key, label]) => {
                            return (
                              <SelectItem key={key} value={key}>
                                {label}
                              </SelectItem>
                            );
                          }
                        )}
                      </SelectContent>
                    </Select>
                    {errors.type && (
                      <div className="text-red-500 text-sm">{errors.type}</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="mealTime"
                      className="flex items-center gap-1"
                    >
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      Horário (Opcional)
                    </Label>
                    <Input
                      id="mealTime"
                      type="time"
                      value={mealData.time}
                      onChange={(e) => handleChange("time", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="description"
                      className="flex items-center gap-1"
                    >
                      <BookOpen className="w-4 h-4 text-muted-foreground" />
                      Descrição da Refeição (Opcional)
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Ex: arroz integral, peito de frango grelhado, salada de alface, tomate e pepino..."
                      rows={8}
                      value={mealData.description}
                      onChange={(e) =>
                        handleChange("description", e.target.value)
                      }
                    />
                    {errors.description && (
                      <div className="text-red-500 text-sm">
                        {errors.description}
                      </div>
                    )}
                  </div>
                </div>

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
                            value={
                              ((estimatedNutrients.carbs ?? 0) / 200) * 100
                            }
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
                </AnimatePresence>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-black shadow-md border-[0.1px] border-white/40 dark:text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Salvando..." : "Salvar Refeição"}
                  </Button>
                  <Button
                    type="button"
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
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}
