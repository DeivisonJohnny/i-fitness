import * as yup from "yup";
import { easeOut, motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Activity,
  Dumbbell,
  Edit,
  Plus,
  Ruler,
  Save,
  Scale,
  Sparkles,
  Target,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  objectiveOptions,
  physicalActivityLevelOptions,
  typeTrainingOptions,
} from "@/lib/enums";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import UserApi, {
  ResumePhysical as ResumePhysicalProps,
} from "@/service/Api/UserApi";
import { UtilClient } from "@/utils/UtilClient";

export default function ResumePhysical(props: ResumePhysicalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: easeOut },
    },
  };

  function formatEnumLabel(value: string): string {
    return value
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/^(\w)/, (match) => match.toUpperCase());
  }

  const schemaResumePhysical = yup.object({
    height: yup
      .number()
      .typeError("Altura deve ser um número")
      .required("Altura é obrigatória")
      .min(0.5, "Altura deve ser no mínimo 0.5 metros")
      .max(2.5, "Altura deve ser no máximo 2.5 metros"),
    weight: yup
      .number()
      .typeError("Peso deve ser um número")
      .required("Peso é obrigatório")
      .min(20, "Peso deve ser no mínimo 20 kg")
      .max(500, "Peso deve ser no máximo 500 kg"),
    physical_activity_level: yup
      .string()
      .oneOf(
        Object.keys(physicalActivityLevelOptions),
        "Selecione um nível de atividade válido"
      )
      .required("Nível de atividade é obrigatório"),
    type_training: yup
      .string()
      .oneOf(typeTrainingOptions, "Selecione um tipo de treino válido")
      .required("Tipo de treino é obrigatório"),
    objective: yup
      .string()
      .oneOf(objectiveOptions, "Selecione um objetivo válido")
      .required("Objetivo é obrigatório"),
  });

  type FormData = yup.InferType<typeof schemaResumePhysical>;

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schemaResumePhysical),
    mode: "onChange",
    defaultValues: {
      height: props?.height ?? undefined,
      weight: props?.weight ?? undefined,
      physical_activity_level: props?.physical_activity_level ?? undefined,
      type_training: typeTrainingOptions.includes(
        props?.type_training as (typeof typeTrainingOptions)[number]
      )
        ? (props?.type_training as (typeof typeTrainingOptions)[number])
        : undefined,
      objective: objectiveOptions.includes(
        props?.objective as (typeof objectiveOptions)[number]
      )
        ? (props?.objective as (typeof objectiveOptions)[number])
        : undefined,
    },
  });

  const onSubmit = async (data: FormData) => {
    console.log("Dados enviados:", data);
    setLoading(true);
    try {
      const response = await UserApi.update(data as ResumePhysicalProps);
      console.log("Resposta da API:", response);
      if (response) {
        toast.success("Informações físicas atualizadas com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao atualizar informações físicas:", error);
      toast.error("Erro ao atualizar informações físicas.", {
        description: (error as Error).message,
      });
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <motion.div variants={itemVariants} className="mb-8">
      <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 shadow-lg rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Dumbbell className="w-5 h-5 text-primary" />
            Resumo Físico
          </CardTitle>
          {!isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {props?.height ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1 text-muted-foreground">
                    <Ruler className="w-4 h-4" />
                    Altura (m)
                  </Label>
                  <Controller
                    name="height"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="height"
                        value={
                          field.value
                            ? String(field.value).replace(".", ",")
                            : ""
                        }
                        onChange={(e) => {
                          const formatted = UtilClient.formatHeight(
                            e.target.value
                          );
                          field.onChange(formatted.replace(",", "."));
                        }}
                        disabled={!isEditing}
                      />
                    )}
                  />
                  {errors.height && (
                    <p className="text-red-500">{errors.height.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1 text-muted-foreground">
                    <Scale className="w-4 h-4" />
                    Peso Atual (kg)
                  </Label>

                  <Controller
                    name="weight"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="weight"
                        value={
                          field.value
                            ? String(field.value).replace(".", ",")
                            : ""
                        }
                        onChange={(e) => {
                          const formatted = UtilClient.formatWeight(
                            e.target.value
                          );
                          field.onChange(formatted.replace(",", "."));
                        }}
                        disabled={!isEditing}
                      />
                    )}
                  />

                  {errors.weight && (
                    <p className="text-red-500">{errors.weight.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1 text-muted-foreground">
                    <Zap className="w-4 h-4" />
                    IMC
                  </Label>
                  <Input value={props?.imc ?? 0} disabled />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-1 text-muted-foreground">
                    <Activity className="w-4 h-4" />
                    Nível de Atividade
                  </Label>
                  <Controller
                    name="physical_activity_level"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value} // importante!
                        onValueChange={field.onChange} // mapear para o RHF
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(physicalActivityLevelOptions).map(
                            ([key, value]) => (
                              <SelectItem key={key} value={key}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <p>{formatEnumLabel(key)}</p>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{value}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />

                  {errors.physical_activity_level && (
                    <p className="text-red-500">
                      {errors.physical_activity_level.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-1 text-muted-foreground">
                    <Dumbbell className="w-4 h-4" />
                    Tipo de Treino
                  </Label>
                  <Controller
                    name="type_training"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {typeTrainingOptions.map((item) => (
                            <SelectItem value={item} key={item}>
                              {formatEnumLabel(item)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />

                  {errors.type_training && (
                    <p className="text-red-500">
                      {errors.type_training.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-1 text-muted-foreground">
                    <Target className="w-4 h-4" />
                    Objetivo Principal
                  </Label>
                  <Controller
                    name="objective"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {objectiveOptions.map((item) => (
                            <SelectItem value={item} key={item}>
                              {formatEnumLabel(item)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.objective && (
                    <p className="text-red-500">{errors.objective.message}</p>
                  )}
                </div>
              </div>
              {isEditing && (
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="text-white transition-all duration-300 cursor-pointer "
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button type="submit" className="cursor-pointer">
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Salvando...</span>
                      </div>
                    ) : (
                      "Salvar"
                    )}
                  </Button>
                </div>
              )}
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Sparkles className="w-16 h-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Complete seu perfil físico
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Adicione sua altura, peso e outras informações para obter
                recomendações personalizadas e acompanhar sua evolução.
              </p>
              <Button onClick={() => setIsEditing(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Informações Físicas
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
