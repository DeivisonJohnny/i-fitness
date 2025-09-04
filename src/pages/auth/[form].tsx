"use client";

import type React from "react";

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";

import { Eye, EyeOff, Mail, Lock, Sun, Moon } from "lucide-react";
import { useRouter } from "next/router";
import { useTheme } from "@/hooks/useTheme";

import UserApi from "@/service/Api/UserApi";
import Storage from "@/utils/Storage";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { TOKEN_KEY } from "@/utils/Constant";
import RegisterForm from "@/components/RegisterForm";
import CompletRegister from "@/components/RegisterCompletForm";
import { InstallButton } from "@/components/InstallPwa";
import { ButtonGoogle } from "@/components/ButtonGoogle";

type Login = {
  email: string;
  password: string;
};

export default function AuthPage() {
  const [showPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toggleTheme } = useTheme();
  const [typeForm, setTypeForm] = useState<
    "signup" | "login" | "complet" | string
  >("login");

  const { me } = useAuth();

  const router = useRouter();

  const validationLoginSchema = yup.object().shape({
    email: yup
      .string()
      .email("Email inválido")
      .required("O campo deve ser preenchido"),
    password: yup.string().min(8, "Deve ter no minimo 8 caracteres").required(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Login>({
    resolver: yupResolver(validationLoginSchema),
    mode: "onChange",
  });

  useEffect(() => {
    setTypeForm(router.query.form as string);
  }, [router.query.form]);

  const handleLogin = async (data: Login) => {
    setIsLoading(true);
    try {
      const { token } = await UserApi.auth(data);

      if (token) {
        Storage.set(TOKEN_KEY, token);
        router.replace("/dashboard");
      }
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        toast("Erro na autenticação", {
          description: error.message,
        });
      }
    } finally {
      setIsLoading(false);
    }
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
      <InstallButton />

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

            <ButtonGoogle />

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
                <RegisterForm />
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
            ) : typeForm == "complet" && me ? (
              <>
                <h2 className="text-2xl font-bold text-black dark:text-white mb-4">
                  Complete seu cadastro
                </h2>
                <CompletRegister />
              </>
            ) : (
              <>
                <form
                  onSubmit={handleSubmit(handleLogin)}
                  className="space-y-4"
                >
                  <div className="flex flex-col gap-[5px]">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-black dark:text-white "
                    >
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...register("email")}
                        id="email"
                        placeholder="seu@email.com"
                        className="pl-10 h-12 text-gray-900 dark:text-gray-300 "
                      />
                    </div>
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

                  <div className="flex flex-col gap-[5px]">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-black dark:text-white "
                    >
                      Senha
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...register("password")}
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 h-12 text-gray-900 dark:text-gray-300 "
                      />
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
                      <Button
                        type="submit"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
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
