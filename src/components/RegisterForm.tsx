import UserApi from "@/service/Api/UserApi";
import Storage from "@/utils/Storage";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";

import * as yup from "yup";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useRouter } from "next/router";
import { Eye, EyeOff } from "lucide-react";

type FormRegisterUser = {
  name: string;
  surname: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterForm() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<"next" | "back">("next");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const router = useRouter();

  const handleRegisterUser = async (data: FormRegisterUser) => {
    try {
      const { token } = await UserApi.create(data);

      if (token) {
        Storage.set("token_auth", token);

        toast.success("Cadastro realizado com sucesso!");
        router.push("/dashboard");
      }
    } catch (error) {
      console.log(error);
      toast.error("Erro ao cadastrar usuário. Tente novamente.", {
        description: (error as Error).message,
      });
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
              {/* Senha */}
              <div className="flex flex-col gap-[5px] relative">
                <Label>Senha</Label>
                <div className="relative">
                  <Input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    className="pr-10" // espaço pro ícone
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
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

              {/* Confirmar Senha */}
              <div className="flex flex-col gap-[5px] relative">
                <Label className="mt-4">Confirmar senha</Label>
                <div className="relative">
                  <Input
                    {...register("confirmPassword")}
                    type={showConfirmPassword ? "text" : "password"}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
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

              {/* Botões */}
              <div className="flex flex-col justify-between gap-2 mt-4">
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
