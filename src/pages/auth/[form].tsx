"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";

import { Eye, EyeOff, Mail, Lock, Sun, Moon } from "lucide-react";
import { useRouter } from "next/router";
import { useTheme } from "@/hooks/useTheme";

function RegistrationForm() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<"next" | "back">("next");

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmacaoSenha: "",
    idade: "",
    altura: "",
    peso: "",
    sexo: "",
    nivelAtividade: "",
    objetivo: "",
  });

  const router = useRouter();

  const handleNext = () => {
    setDirection("next");
    setStep((prev) => prev + 1);
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

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Cadastro enviado:", formData);
    router.replace("/dashboard"); // redireciona após cadastro
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

  return (
    <form
      onSubmit={handleRegister}
      className="relative min-h-[250px] overflow-hidden space-y-4"
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
          >
            <Label>Nome completo</Label>
            <Input
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />

            <Label className="mt-4">Email</Label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Button type="button" onClick={handleNext} className="w-full mt-4">
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
            <Label>Senha</Label>
            <Input
              name="senha"
              type="password"
              value={formData.senha}
              onChange={handleChange}
              required
            />

            <Label className="mt-4">Confirmar senha</Label>
            <Input
              name="confirmacaoSenha"
              type="password"
              value={formData.confirmacaoSenha}
              onChange={handleChange}
              required
            />

            <div className="flex justify-between gap-2 mt-4">
              <Button
                type="button"
                onClick={handleBack}
                className="w-full opacity-70"
              >
                Voltar
              </Button>
              <Button type="button" onClick={handleNext} className="w-full">
                Próximo
              </Button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            custom={direction}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Label>Idade</Label>
            <Input
              name="idade"
              type="number"
              value={formData.idade}
              onChange={handleChange}
              required
            />

            <Label className="mt-4">Altura (cm)</Label>
            <Input
              name="altura"
              type="number"
              value={formData.altura}
              onChange={handleChange}
              required
            />

            <Label className="mt-4">Peso (kg)</Label>
            <Input
              name="peso"
              type="number"
              value={formData.peso}
              onChange={handleChange}
              required
            />

            <div className="flex justify-between gap-2 mt-4">
              <Button
                type="button"
                onClick={handleBack}
                className="w-full opacity-70"
              >
                Voltar
              </Button>
              <Button type="button" onClick={handleNext} className="w-full">
                Próximo
              </Button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            custom={direction}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Label>Sexo</Label>
            <select
              name="sexo"
              value={formData.sexo}
              onChange={handleChange}
              className="w-full mt-1 p-2 rounded-md border text-black dark:text-white bg-white dark:bg-zinc-800"
              required
            >
              <option value="">Selecione</option>
              <option value="masculino">Masculino</option>
              <option value="feminino">Feminino</option>
              <option value="outro">Outro</option>
            </select>

            <Label className="mt-4">Nível de atividade</Label>
            <select
              name="nivelAtividade"
              value={formData.nivelAtividade}
              onChange={handleChange}
              className="w-full mt-1 p-2 rounded-md border text-black dark:text-white bg-white dark:bg-zinc-800"
              required
            >
              <option value="">Selecione</option>
              <option value="sedentario">Sedentário</option>
              <option value="moderado">Moderado</option>
              <option value="ativo">Ativo</option>
              <option value="muito_ativo">Muito ativo</option>
            </select>

            <Label className="mt-4">Objetivo</Label>
            <select
              name="objetivo"
              value={formData.objetivo}
              onChange={handleChange}
              className="w-full mt-1 p-2 rounded-md border text-black dark:text-white bg-white dark:bg-zinc-800"
              required
            >
              <option value="">Selecione</option>
              <option value="perder_peso">Perder peso</option>
              <option value="ganhar_massa">Ganhar massa</option>
              <option value="manter_peso">Manter peso</option>
            </select>

            <div className="flex justify-between gap-2 mt-4">
              <Button
                type="button"
                onClick={handleBack}
                className="w-full opacity-70"
              >
                Voltar
              </Button>
              <Button type="submit" className="w-full">
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
  const { theme, toggleTheme } = useTheme();
  const [isRegistering, setIsRegistering] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsRegistering(router.query.form == "signup");
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
    <div className="min-h-screen flex">
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

            {isRegistering ? (
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
                    onClick={() => setIsRegistering(false)}
                  >
                    Entrar
                  </button>
                </div>
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
                    onClick={() => router.push("/dashboard")}
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
                    onClick={() => setIsRegistering(true)}
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
