"use client";

import type React from "react";

import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";

import { Eye, EyeOff, Mail, Lock, Sun, Moon } from "lucide-react";
import { useRouter } from "next/router";
import { useTheme } from "@/hooks/useTheme";
import {
  objectiveOptions,
  physicalActivityLevelOptions,
  sexOptions,
  typeTrainingOptions,
} from "@/lib/enums";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import UserApi from "@/service/Api/UserApi";
import Storage from "@/utils/Storage";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

type FormRegisterUser = {
  name: string;
  surname: string;
  email: string;
  password: string;
  confirmPassword: string;
};

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

function RegistrationForm() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<"next" | "back">("next");

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .min(3, "Este campo deve ter pelo menos 3 caracteres")
      .max(80, "Máximo de 80 caracteres")
      .required("Campo obrigatório"),
    surname: yup
      .string()
      .min(3, "Este campo deve ter pelo menos 3 caracteres")
      .max(80, "Máximo de 80 caracteres")
      .required("Campo obrigatório"),
    email: yup.string().email("E-mail inválido").required("Campo obrigatório"),
    password: yup
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres")
      .required("Senha obrigatória"),

    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), undefined], "As senhas não coincidem")
      .required("Confirmação de senha obrigatória"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<FormRegisterUser>({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const handleNext = async (fields: (keyof FormRegisterUser)[] = []) => {
    const isStepValid = await trigger(fields);
    if (isStepValid) {
      setDirection("next");
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setDirection("back");
    setStep((prev) => prev - 1);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

  const handleRegisterUser = async (data: FormRegisterUser) => {
    try {
      const { token } = await UserApi.create(data);

      if (token) {
        Storage.set("token_auth", token);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(handleRegisterUser)}
        className="relative min-h-[250px] overflow-hidden space-y-4  "
      >
        <AnimatePresence mode="wait" custom={direction}>
          {step === 1 && (
            <motion.div
              key="step1"
              custom={direction}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className=" flex flex-col gap-[10px]"
            >
              <div className="flex flex-col gap-[5px]">
                <Label>Nome</Label>
                <Input {...register("name")} onChange={handleChange} />
                {errors.name && (
                  <AnimatePresence mode="wait">
                    <motion.p
                      key="name-error"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.3 }}
                      className="text-red-500 text-sm"
                    >
                      {errors.name.message}
                    </motion.p>
                  </AnimatePresence>
                )}
              </div>
              <div className="flex flex-col gap-[5px]">
                <Label>Sobrenome</Label>
                <Input {...register("surname")} />
                {errors.surname && (
                  <AnimatePresence mode="wait">
                    <motion.p
                      key="surname-error"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.3 }}
                      className="text-red-500 text-sm"
                    >
                      {errors.surname.message}
                    </motion.p>
                  </AnimatePresence>
                )}
              </div>

              <div className="flex flex-col gap-[5px]">
                <Label>Email</Label>
                <Input {...register("email")} type="email" />
                {errors.email && (
                  <AnimatePresence mode="wait">
                    <motion.p
                      key="email-error"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.3 }}
                      className="text-red-500 text-sm"
                    >
                      {errors.email.message}
                    </motion.p>
                  </AnimatePresence>
                )}
              </div>

              <Button
                type="button"
                onClick={() => handleNext(["name", "surname", "email"])}
                className="w-full mt-4"
              >
                Próximo
              </Button>
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
                <Label>Senha</Label>
                <Input {...register("password")} type="password" />
                {errors.password && (
                  <AnimatePresence mode="wait">
                    <motion.p
                      key="password-error"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.3 }}
                      className="text-red-500 text-sm"
                    >
                      {errors.password.message}
                    </motion.p>
                  </AnimatePresence>
                )}
              </div>
              <div className="flex flex-col gap-[5px]">
                <Label className="mt-4">Confirmar senha</Label>
                <Input {...register("confirmPassword")} type="password" />
                {errors.confirmPassword && (
                  <AnimatePresence mode="wait">
                    <motion.p
                      key="confirmPassword-error"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.3 }}
                      className="text-red-500 text-sm"
                    >
                      {errors.confirmPassword.message}
                    </motion.p>
                  </AnimatePresence>
                )}
              </div>
              <div
                className="flex
            flex-col justify-between gap-2 mt-4"
              >
                <Button
                  className="w-full"
                  variant={"secondary"}
                  onClick={handleBack}
                >
                  Voltar
                </Button>
                <Button type="submit" className="w-full">
                  Cadastrar-se
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </>
  );
}

interface CompletRegisterProps {
  idUser: string;
}

function CompletRegister({ idUser }: CompletRegisterProps) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<"next" | "back">("next");
  const router = useRouter();

  const validationSchemaComplement = yup.object().shape({
    sex: yup.string().required("Campo obrigatório"),
    born: yup
      .date()
      .required("Data de nascimento é obrigatória")
      .typeError("Data inválida"),
    height: yup
      .number()
      .min(30, "Altura mínima: 30cm")
      .max(300, "Altura máxima: 300cm")
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
    console.log("🚀 ~ handleCompletRegister ~ data:", data);

    try {
      const userUpdated = await UserApi.update(data);
      console.log("🚀 ~ handleCompletRegister ~ userUpdated:", userUpdated);
      if (userUpdated) {
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.log("🚀 ~ handleCompletRegister ~ error:", error);
      toast("Erro ao atualizar o cadastro", {
        description: error.message,
      });
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
                Altura (cm)
              </Label>
              <Input id="height" {...register("height")} type="number" />
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
              <Input id="weight" {...register("weight")} type="number" />
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
              <Button
                type="submit"
                className="w-full"
                onClick={() => console.log(errors)}
              >
                Cadastrar
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toggleTheme } = useTheme();
  const [typeForm, setTypeForm] = useState<
    "signup" | "login" | "complet" | string
  >("login");

  const { user } = useAuth();

  const router = useRouter();

  useEffect(() => {
    setTypeForm(router.query.form as string);
  }, [router.query.form]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Login:", { email, password });
    setIsLoading(false);
  };

  const handleGoogleLogin = () => {
    console.log("Google login");
  };

  return (
    <div className="min-h-screen flex w-full">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => toggleTheme()}
        className="fixed top-6 right-6 z-50 bg-[#fefefe] dark:bg-background/80 backdrop-blur-sm border"
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-black " />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>

      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center relative overflow-hidden bg-[#fefefe] dark:bg-background ">
        <div className="relative z-10 flex flex-col justify-center items-center text-black dark:text-white p-12">
          <h1 className="text-4xl font-bold mb-4 text-center">
            Bem-vindo de volta
          </h1>
          <p className="text-xl text-center max-w-md  text-black dark:text-white ">
            Acesse sua conta e continue sua jornada conosco
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-black/10 dark:bg-white/5 rounded-full blur-xl" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-black/10 dark:bg-white/5 rounded-full blur-xl" />
        <div className="absolute top-[20px] left-[50px] w-24 h-24 bg-black/10 dark:bg-white/5 rounded-full blur-xl" />

        <div className="absolute top-1/2 left-1/5 w-24 h-24 bg-black/10 dark:bg-white/5 rounded-full blur-xl" />
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8  bg-[#fefefe] dark:bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-[#fefefe] rounded-full" />
            </div>
            <h1 className="text-2xl font-bold text-black dark:text-white ">
              Bem-vindo de volta
            </h1>
            <p className="text-muted-foreground">Entre na sua conta</p>
          </div>

          <div className="space-y-6">
            <div className="hidden lg:block">
              <h2 className="text-3xl font-bold text-black dark:text-white ">
                Entrar
              </h2>
              <p className="text-muted-foreground mt-2">
                Entre com suas credenciais
              </p>
            </div>

            <Button
              variant="outline"
              className="w-full h-12 text-base bg-white dark:bg-black dark:text-white text-black "
              onClick={handleGoogleLogin}
            >
              <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continuar com Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className=" bg-white dark:bg-background px-4 text-muted-foreground">
                  ou
                </span>
              </div>
            </div>

            {typeForm == "signup" ? (
              <>
                <h2 className="text-2xl font-bold text-black dark:text-white mb-4">
                  Criar conta
                </h2>
                <RegistrationForm />
                <div className="text-center text-sm text-muted-foreground mt-4">
                  Já tem uma conta?{" "}
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-500 font-medium"
                    onClick={() => setTypeForm("login")}
                  >
                    Entrar
                  </button>
                </div>
              </>
            ) : typeForm == "complet" && user ? (
              <>
                <h2 className="text-2xl font-bold text-black dark:text-white mb-4">
                  Complete seu cadastro
                </h2>
                <CompletRegister idUser={user.id} />
              </>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-black dark:text-white "
                    >
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-12 text-gray-900 dark:text-gray-300 "
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-black dark:text-white "
                    >
                      Senha
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 h-12 text-gray-900 dark:text-gray-300 "
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-muted" />
                      <span className="text-muted-foreground">
                        Lembrar de mim
                      </span>
                    </label>
                    <a
                      href="#"
                      className="text-blue-600 hover:text-blue-500 font-medium"
                    >
                      Esqueceu a senha?
                    </a>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Entrando...</span>
                      </div>
                    ) : (
                      "Entrar"
                    )}
                  </Button>
                </form>
                <div className="text-center text-sm text-muted-foreground">
                  Não tem uma conta?{" "}
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-500 font-medium"
                    onClick={() => router.replace("/auth/signup")}
                  >
                    Criar conta
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
