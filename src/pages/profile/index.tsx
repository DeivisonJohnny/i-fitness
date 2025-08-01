"use client";

import type React from "react";

import { useState } from "react";
import { easeOut, motion } from "framer-motion";
import {
  Mail,
  Phone,
  Calendar,
  MapPin,
  CreditCard,
  Clock,
  Ruler,
  Scale,
  Target,
  Activity,
  LineChart,
  Edit,
  Save,
  X,
  Key,
  Trash2,
  Camera,
  ChevronDown,
  User,
  Cake,
  GroupIcon as Gender,
  Building,
  Globe,
  Sparkles,
  Dumbbell,
  Zap,
  Weight,
  Plus,
  Settings,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from "sonner"; // Assuming use-toast is available

// Dados mockados
const mockUserProfile = {
  avatar: "/placeholder.svg?height=128&width=128&text=User",
  email: "joao.silva@example.com",
  fullName: "João Silva",
  phone: "(11) 98765-4321",
  gender: "Masculino",
  dob: "1990-05-15",
  address: {
    city: "São Paulo",
    state: "SP",
    country: "Brasil",
  },
  cpf: "123.XXX.XXX-XX",
  accountCreated: "2023-01-20",
  lastAccess: "2025-07-31 10:30",
  physical: {
    height: 1.75, // meters
    currentWeight: 72, // kg
    targetWeight: 68, // kg
    bodyType: "Mesomorfo",
    activityLevel: "Moderado",
  },
  plan: "Premium",
};

const mockWeightHistory = [
  { date: "2025-01-01", weight: 75 },
  { date: "2025-02-01", weight: 74.5 },
  { date: "2025-03-01", weight: 73.8 },
  { date: "2025-04-01", weight: 73 },
  { date: "2025-05-01", weight: 72.5 },
  { date: "2025-06-01", weight: 72.2 },
  { date: "2025-07-01", weight: 72 },
];

export default function ProfilePage() {
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [isEditingPhysical, setIsEditingPhysical] = useState(false);
  const [accountData, setAccountData] = useState(mockUserProfile);
  const [physicalData, setPhysicalData] = useState(mockUserProfile.physical);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState(
    mockUserProfile.avatar
  );
  console.log("🚀 ~ ProfilePage ~ avatarFile:", avatarFile);

  const calculateIMC = (weight: number, height: number) => {
    if (!weight || !height) return "N/A";
    const imc = weight / (height * height);
    return imc.toFixed(2);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreviewUrl(URL.createObjectURL(file));
      toast("Foto de perfil atualizada!", {
        description: "Sua nova foto foi carregada.",
      });
    }
  };

  const handleSaveAccount = () => {
    // Simulate API call
    console.log("Saving account data:", accountData);
    setIsEditingAccount(false);
    toast(
      "Dados da Conta Salvos!",

      {
        description: "Suas informações foram atualizadas.",
      }
    );
  };

  const handleSavePhysical = () => {
    console.log("Saving physical data:", physicalData);
    setIsEditingPhysical(false);
    toast("Dados Físicos Salvos!", {
      description: "Seu perfil físico foi atualizado.",
    });
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

  const imcValue = calculateIMC(
    physicalData.currentWeight,
    physicalData.height
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 max-w-4xl"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-2">
            Meu Perfil
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Gerencie seus dados e acompanhe sua evolução no I Fitness.
          </p>
        </motion.div>

        {/* Avatar e Plano Atual */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center mb-8"
        >
          <div className="relative group mb-4">
            <Avatar className="w-28 h-28 border-4 border-primary/20 shadow-lg">
              <AvatarImage
                src={avatarPreviewUrl || "/placeholder.svg"}
                alt={accountData.fullName}
              />
              <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-primary-foreground text-3xl font-semibold">
                {accountData.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <Label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 bg-primary p-2 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md"
            >
              <Camera className="w-5 h-5 text-primary-foreground" />
            </Label>
          </div>
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm px-4 py-1.5 rounded-full shadow-md">
            Plano: {mockUserProfile.plan}
          </Badge>
        </motion.div>

        {/* Seção 1 - Informações da Conta */}
        <motion.div variants={itemVariants} className="mb-8">
          <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 shadow-lg rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <User className="w-5 h-5 text-primary" />
                Informações da Conta
              </CardTitle>
              {!isEditingAccount && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingAccount(true)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="flex items-center gap-1 text-muted-foreground"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input id="email" value={accountData.email} disabled />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="fullName"
                    className="flex items-center gap-1 text-muted-foreground"
                  >
                    <User className="w-4 h-4" />
                    Nome Completo
                  </Label>
                  <Input
                    id="fullName"
                    value={accountData.fullName}
                    onChange={(e) =>
                      setAccountData({
                        ...accountData,
                        fullName: e.target.value,
                      })
                    }
                    disabled={!isEditingAccount}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="flex items-center gap-1 text-muted-foreground"
                  >
                    <Phone className="w-4 h-4" />
                    Telefone
                  </Label>
                  <Input
                    id="phone"
                    value={accountData.phone}
                    onChange={(e) =>
                      setAccountData({ ...accountData, phone: e.target.value })
                    }
                    disabled={!isEditingAccount}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="gender"
                    className="flex items-center gap-1 text-muted-foreground"
                  >
                    <Gender className="w-4 h-4" />
                    Gênero
                  </Label>
                  <Select
                    value={accountData.gender}
                    onValueChange={(value) =>
                      setAccountData({ ...accountData, gender: value })
                    }
                    disabled={!isEditingAccount}
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Masculino">Masculino</SelectItem>
                      <SelectItem value="Feminino">Feminino</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="dob"
                    className="flex items-center gap-1 text-muted-foreground"
                  >
                    <Cake className="w-4 h-4" />
                    Data de Nascimento
                  </Label>
                  <Input
                    id="dob"
                    type="date"
                    value={accountData.dob}
                    onChange={(e) =>
                      setAccountData({ ...accountData, dob: e.target.value })
                    }
                    disabled={!isEditingAccount}
                  />
                </div>
              </div>
              {isEditingAccount && (
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditingAccount(false)}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveAccount}>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Seção 2 - Dados Cadastrais (Colapsável) */}
        <motion.div variants={itemVariants} className="mb-8">
          <Collapsible className="rounded-2xl overflow-hidden">
            <CollapsibleTrigger asChild>
              <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 shadow-lg rounded-2xl cursor-pointer hover:bg-card/80 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Building className="w-5 h-5 text-primary" />
                    Dados Cadastrais
                  </CardTitle>
                  <ChevronDown className="w-5 h-5 text-muted-foreground data-[state=open]:rotate-180 transition-transform" />
                </CardHeader>
              </Card>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card className="border-t-0 border-border/50 bg-gradient-to-br from-card to-card/50 shadow-lg rounded-b-2xl">
                <CardContent className="pt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        Cidade
                      </Label>
                      <Input value={accountData.address.city} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        Estado
                      </Label>
                      <Input value={accountData.address.state} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1 text-muted-foreground">
                        <Globe className="w-4 h-4" />
                        País
                      </Label>
                      <Input value={accountData.address.country} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1 text-muted-foreground">
                        <CreditCard className="w-4 h-4" />
                        CPF
                      </Label>
                      <Input value={accountData.cpf} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        Conta Criada Em
                      </Label>
                      <Input
                        value={format(
                          parseISO(accountData.accountCreated),
                          "dd/MM/yyyy",
                          { locale: ptBR }
                        )}
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        Último Acesso
                      </Label>
                      <Input
                        value={format(
                          parseISO(accountData.lastAccess),
                          "dd/MM/yyyy 'às' HH:mm",
                          { locale: ptBR }
                        )}
                        disabled
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        </motion.div>

        {/* Seção 3 - Resumo Físico */}
        <motion.div variants={itemVariants} className="mb-8">
          <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 shadow-lg rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Dumbbell className="w-5 h-5 text-primary" />
                Resumo Físico
              </CardTitle>
              {!isEditingPhysical && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingPhysical(true)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {physicalData.height && physicalData.currentWeight ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1 text-muted-foreground">
                        <Ruler className="w-4 h-4" />
                        Altura (m)
                      </Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={physicalData.height}
                        onChange={(e) =>
                          setPhysicalData({
                            ...physicalData,
                            height: Number(e.target.value),
                          })
                        }
                        disabled={!isEditingPhysical}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1 text-muted-foreground">
                        <Scale className="w-4 h-4" />
                        Peso Atual (kg)
                      </Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={physicalData.currentWeight}
                        onChange={(e) =>
                          setPhysicalData({
                            ...physicalData,
                            currentWeight: Number(e.target.value),
                          })
                        }
                        disabled={!isEditingPhysical}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1 text-muted-foreground">
                        <Zap className="w-4 h-4" />
                        IMC
                      </Label>
                      <Input value={imcValue} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1 text-muted-foreground">
                        <Target className="w-4 h-4" />
                        Meta de Peso (kg)
                      </Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={physicalData.targetWeight}
                        onChange={(e) =>
                          setPhysicalData({
                            ...physicalData,
                            targetWeight: Number(e.target.value),
                          })
                        }
                        disabled={!isEditingPhysical}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1 text-muted-foreground">
                        <User className="w-4 h-4" />
                        Tipo de Corpo
                      </Label>
                      <Select
                        value={physicalData.bodyType}
                        onValueChange={(value) =>
                          setPhysicalData({ ...physicalData, bodyType: value })
                        }
                        disabled={!isEditingPhysical}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Ectomorfo">Ectomorfo</SelectItem>
                          <SelectItem value="Mesomorfo">Mesomorfo</SelectItem>
                          <SelectItem value="Endomorfo">Endomorfo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1 text-muted-foreground">
                        <Activity className="w-4 h-4" />
                        Nível de Atividade
                      </Label>
                      <Select
                        value={physicalData.activityLevel}
                        onValueChange={(value) =>
                          setPhysicalData({
                            ...physicalData,
                            activityLevel: value,
                          })
                        }
                        disabled={!isEditingPhysical}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Sedentário">Sedentário</SelectItem>
                          <SelectItem value="Moderado">Moderado</SelectItem>
                          <SelectItem value="Intenso">Intenso</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {isEditingPhysical && (
                    <div className="flex justify-end gap-2 mt-4">
                      <Button
                        variant="outline"
                        onClick={() => setIsEditingPhysical(false)}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancelar
                      </Button>
                      <Button onClick={handleSavePhysical}>
                        <Save className="w-4 h-4 mr-2" />
                        Salvar
                      </Button>
                    </div>
                  )}
                </>
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
                  <Button onClick={() => setIsEditingPhysical(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Informações Físicas
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Seção 4 - Evolução (Gráfico de Peso) */}
        <motion.div variants={itemVariants} className="mb-8">
          <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <LineChart className="w-5 h-5 text-primary" />
                Evolução do Peso
              </CardTitle>
              <CardDescription>
                Acompanhe seu peso ao longo do tempo.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] pt-4">
              {mockWeightHistory.length > 1 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart
                    data={mockWeightHistory.map((d) => ({
                      ...d,
                      date: format(parseISO(d.date), "dd/MM", { locale: ptBR }),
                    }))}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
                    <YAxis
                      stroke="#9CA3AF"
                      fontSize={12}
                      domain={["dataMin - 2", "dataMax + 2"]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#F9FAFB",
                      }}
                      formatter={(value: number) => [`${value} kg`, "Peso"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="url(#lineGradient)"
                      strokeWidth={3}
                      dot={{ stroke: "#6366F1", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: "#8B5CF6", strokeWidth: 2 }}
                    />
                    <defs>
                      <linearGradient
                        id="lineGradient"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                      >
                        <stop offset="0%" stopColor="#6366F1" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                    </defs>
                  </RechartsLineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <Weight className="w-12 h-12 mb-4" />
                  <p>Registre mais pesos para ver sua evolução aqui!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Ações / Configurações */}
        <motion.div variants={itemVariants} className="mb-8">
          <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Settings className="w-5 h-5 text-primary" />
                Configurações da Conta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start border-border/50 bg-transparent"
              >
                <Key className="w-4 h-4 mr-2" />
                Alterar Senha
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="w-full justify-start bg-destructive/20 text-destructive hover:bg-destructive/30"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir Conta
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Tem certeza que deseja excluir sua conta?
                    </DialogTitle>
                    <DialogDescription>
                      Esta ação é irreversível. Todos os seus dados serão
                      permanentemente removidos.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline">Cancelar</Button>
                    <Button variant="destructive">
                      Excluir Permanentemente
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
