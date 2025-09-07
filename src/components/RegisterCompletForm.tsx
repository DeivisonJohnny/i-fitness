import UserApi from "@/service/Api/UserApi";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import * as yup from "yup";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRouter } from "next/router";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  objectiveOptions,
  physicalActivityLevelOptions,
  sexOptions,
  typeTrainingOptions,
} from "@/lib/enums";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { UtilClient } from "@/utils/UtilClient";

export type FormComplementUser = {
  sex: string;
  born: Date;
  height: number;
  weight: number;
  profession: string;
  physical_activity_level: string;
  type_training: string;
  objective: string;
};

function formatEnumLabel(value: string): string {
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/^(\w)/, (match) => match.toUpperCase());
}

export default function CompletRegister() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<"next" | "back">("next");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const validationSchemaComplement = yup.object().shape({
    sex: yup.string().required("Campo obrigatório"),
    born: yup
      .date()
      .required("Data de nascimento é obrigatória")
      .typeError("Data inválida"),
    height: yup
      .number()
      .min(1, "Altura mínima: 1m")
      .max(3, "Altura máxima: 3m")
      .required("Altura é obrigatória")
      .typeError("Precisa ser numero"),

    weight: yup
      .number()
      .min(10, "Peso mínimo: 10kg")
      .max(500, "Peso máximo: 500kg")
      .required("Peso é obrigatório")
      .typeError("Precisa ser numero"),
    objective: yup.string().required("O campo deve ser preenchido"),
    physical_activity_level: yup
      .string()
      .required("O campo deve ser preenchido"),
    profession: yup
      .string()
      .min(3, "O campo deve ter ao menos 3 caracteres")
      .max(30, "O campo deve ter no maximo 30 caracteres")
      .required("O campo deve ser preenchido"),

    type_training: yup.string().required("O campo deve ser preenchido"),
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    trigger,
  } = useForm<FormComplementUser>({
    resolver: yupResolver(validationSchemaComplement),

    mode: "onChange",
  });

  const handleNext = async (fields: string[] = []) => {
    const isStepValid = await trigger(fields as (keyof FormComplementUser)[]);
    if (isStepValid) {
      setDirection("next");
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setDirection("back");
    setStep((prev) => prev - 1);
  };

  const slideVariants = {
    initial: (custom: "next" | "back") => ({
      x: custom === "next" ? 300 : -300,
      opacity: 0,
      position: "absolute" as const,
    }),
    animate: {
      x: 0,
      opacity: 1,
      position: "relative" as const,
      transition: {
        type: "spring" as const,
        stiffness: 130,
        damping: 15,
      },
    },
    exit: (custom: "next" | "back") => ({
      x: custom === "next" ? -300 : 300,
      opacity: 0,
      position: "absolute" as const,
    }),
  };

  async function handleCompletRegister(data: FormComplementUser) {
    setIsLoading(true);
    try {
      const userUpdated = await UserApi.update(data);

      if (userUpdated) {
        router.push("/dashboard");
      }
    } catch (error: unknown) {
      console.log("🚀 ~ handleCompletRegister ~ error:", error);

      if (error instanceof Error) {
        toast("Erro ao atualizar o cadastro", {
          description: error.message,
        });
      } else {
        toast("Erro ao atualizar o cadastro", {
          description: "Erro desconhecido",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  function formatDecimal(value: string): string {
    let onlyNums = value.replace(/\D/g, "");

    if (!onlyNums) {
      return "";
    }

    if (onlyNums.length > 3) {
      onlyNums = onlyNums.slice(0, 3);
    }

    if (onlyNums.length === 1) {
      return onlyNums;
    } else {
      return `${onlyNums[0]},${onlyNums.substring(1)}`;
    }
  }

  return (
    <form
      onSubmit={handleSubmit(handleCompletRegister)}
      className="relative min-h-[250px] overflow-hidden space-y-4"
    >
      {" "}
      <AnimatePresence mode="wait" custom={direction}>
        {step === 1 && (
          <motion.div
            key="step1"
            custom={direction}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="flex flex-col gap-[5px] mb-[10px]">
              <Label htmlFor="sex">Sexo</Label>
              <Controller
                name="sex"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="sex" className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {sexOptions &&
                        sexOptions.map((sex) => (
                          <SelectItem key={sex} value={sex}>
                            {formatEnumLabel(sex)}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.sex && (
                <AnimatePresence mode="wait">
                  <motion.p
                    key="sex-error"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="text-red-500 text-sm"
                  >
                    {errors.sex.message}
                  </motion.p>
                </AnimatePresence>
              )}
            </div>
            <div className="flex flex-col gap-[5px]">
              <Label htmlFor="born">Data de Nascimento</Label>
              <Input id="born" {...register("born")} type="date" />
              {errors.born && (
                <AnimatePresence mode="wait">
                  <motion.p
                    key="born-error"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="text-red-500 text-sm"
                  >
                    {errors.born.message}
                  </motion.p>
                </AnimatePresence>
              )}
            </div>
            <div className="flex flex-col gap-[5px]">
              <Label htmlFor="height" className="mt-4">
                Altura (m)
              </Label>
              <Controller
                name="height"
                control={control}
                render={({ field }) => (
                  <Input
                    id="height"
                    value={
                      field.value ? String(field.value).replace(".", ",") : ""
                    }
                    onChange={(e) => {
                      const formatted = formatDecimal(e.target.value);
                      field.onChange(formatted.replace(",", "."));
                    }}
                  />
                )}
              />
              {errors.height && (
                <AnimatePresence mode="wait">
                  <motion.p
                    key="height-error"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="text-red-500 text-sm"
                  >
                    {errors.height.message}
                  </motion.p>
                </AnimatePresence>
              )}
            </div>
            <div className="flex flex-col gap-[5px]">
              <Label htmlFor="weight" className="mt-4">
                Peso (kg)
              </Label>
              <Controller
                name="weight"
                control={control}
                render={({ field }) => (
                  <Input
                    id="weight"
                    value={
                      field.value ? String(field.value).replace(".", ",") : ""
                    }
                    onChange={(e) => {
                      const formatted = UtilClient.formatWeight(e.target.value);
                      e.target.value = formatted;
                      field.onChange(formatted.replace(",", "."));
                    }}
                  />
                )}
              />
              {errors.weight && (
                <AnimatePresence mode="wait">
                  <motion.p
                    key="weight-error"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="text-red-500 text-sm"
                  >
                    {errors.weight.message}
                  </motion.p>
                </AnimatePresence>
              )}
            </div>
            <div className="flex justify-between gap-2 mt-4">
              <Button
                type="button"
                onClick={() => handleNext(["born", "height", "weight"])}
                className="w-full"
              >
                Próximo
              </Button>
            </div>
          </motion.div>
        )}
        {step === 2 && (
          <motion.div
            key="step2"
            custom={direction}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="flex flex-col gap-[5px]">
              <div className="flex flex-col gap-[5px]">
                <Label htmlFor="objective" className="mt-4">
                  Objetivo
                </Label>
                <Controller
                  name="objective"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="objective" className="w-full">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {objectiveOptions &&
                          objectiveOptions.map((objective) => (
                            <SelectItem key={objective} value={objective}>
                              {formatEnumLabel(objective)}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.objective && (
                  <AnimatePresence mode="wait">
                    <motion.p
                      key="objective-error"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.3 }}
                      className="text-red-500 text-sm"
                    >
                      {errors.objective.message}
                    </motion.p>
                  </AnimatePresence>
                )}
              </div>

              <div className="flex flex-col gap-[5px]">
                <Label htmlFor="profession" className="mt-4">
                  Profissão
                </Label>

                <Input
                  id="profession"
                  {...register("profession")}
                  placeholder="Ex: Desenvolvedor, Vendedor, Pedreiro"
                  type="text"
                />
                {errors.profession && (
                  <AnimatePresence mode="wait">
                    <motion.p
                      key="profession-error"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.3 }}
                      className="text-red-500 text-sm"
                    >
                      {errors.profession.message}
                    </motion.p>
                  </AnimatePresence>
                )}
              </div>

              <div className="flex flex-col gap-[5px]">
                <Label htmlFor="physical_activity_level" className="mt-4">
                  Nível de atividade
                </Label>
                <Controller
                  name="physical_activity_level"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        id="physical_activity_level"
                        className="w-full"
                      >
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {physicalActivityLevelOptions &&
                          Object.entries(physicalActivityLevelOptions).map(
                            ([valueKey, description]) => (
                              <SelectItem key={valueKey} value={valueKey}>
                                <Tooltip>
                                  <TooltipTrigger className="w-full h-full ">
                                    {formatEnumLabel(valueKey)}
                                  </TooltipTrigger>
                                  <TooltipContent className="z-[50]">
                                    {description}
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
                  <AnimatePresence mode="wait">
                    <motion.p
                      key="physical-activity-error"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.3 }}
                      className="text-red-500 text-sm"
                    >
                      {errors.physical_activity_level.message}
                    </motion.p>
                  </AnimatePresence>
                )}
              </div>

              <div className="flex flex-col gap-[5px]">
                <Label htmlFor="type_training" className="mt-4">
                  Tipo de atividade fisica
                </Label>
                <Controller
                  name="type_training"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="type_training" className="w-full">
                        <SelectValue placeholder="Nenhuma" />
                      </SelectTrigger>
                      <SelectContent>
                        {typeTrainingOptions &&
                          typeTrainingOptions.map((item) => (
                            <SelectItem key={item} value={item}>
                              {formatEnumLabel(item)}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.type_training && (
                  <AnimatePresence mode="wait">
                    <motion.p
                      key="physical-activity-error"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.3 }}
                      className="text-red-500 text-sm"
                    >
                      {errors.type_training.message}
                    </motion.p>
                  </AnimatePresence>
                )}
              </div>
            </div>

            <div className="flex flex-col justify-between gap-2 mt-4">
              <Button
                type="button"
                onClick={handleBack}
                className="w-full opacity-70"
              >
                Voltar
              </Button>
              <Button type="submit" className="w-full">
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Cadastrando...</span>
                  </div>
                ) : (
                  "Cadastrar"
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
