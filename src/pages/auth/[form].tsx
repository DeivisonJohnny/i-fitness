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
