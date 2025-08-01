"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence, easeOut } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Clock,
  Utensils,
  Search,
  Plus,
  Flame,
  Beef,
  Wheat,
  Droplets,
  Eye,
  Download,
  BarChart2,
  List,
  CalendarIcon,
} from "lucide-react";
import { format, isWithinInterval, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Dados mockados para o histórico de refeições
const mockMealHistory = [
  {
    id: 1,
    date: "2025-07-30",
    time: "08:30",
    type: "Café da manhã",
    image: "/placeholder.svg?height=60&width=60&text=Café",
    description: "Ovos mexidos com abacate e torrada integral",
    calories: 450,
    protein: 25,
    carbs: 30,
    fat: 28,
  },
  {
    id: 2,
    date: "2025-07-30",
    time: "13:00",
    type: "Almoço",
    image: "/placeholder.svg?height=60&width=60&text=Almoço",
    description: "Frango grelhado, batata doce e brócolis",
    calories: 620,
    protein: 40,
    carbs: 60,
    fat: 20,
  },
  {
    id: 3,
    date: "2025-07-29",
    time: "10:00",
    type: "Lanche",
    image: "/placeholder.svg?height=60&width=60&text=Lanche",
    description: "Iogurte grego com frutas vermelhas",
    calories: 280,
    protein: 18,
    carbs: 35,
    fat: 10,
  },
  {
    id: 4,
    date: "2025-07-28",
    time: "19:30",
    type: "Jantar",
    image: "/placeholder.svg?height=60&width=60&text=Jantar",
    description: "Salmão assado com aspargos",
    calories: 580,
    protein: 35,
    carbs: 15,
    fat: 40,
  },
  {
    id: 5,
    date: "2025-07-28",
    time: "07:45",
    type: "Café da manhã",
    image: "/placeholder.svg?height=60&width=60&text=Café",
    description: "Smoothie de banana e proteína",
    calories: 380,
    protein: 28,
    carbs: 40,
    fat: 12,
  },
  {
    id: 6,
    date: "2025-07-27",
    time: "12:15",
    type: "Almoço",
    image: "/placeholder.svg?height=60&width=60&text=Almoço",
    description: "Salada de grão de bico com atum",
    calories: 490,
    protein: 30,
    carbs: 50,
    fat: 20,
  },
];

const mealTypesOptions = [
  "Todos",
  "Café da manhã",
  "Almoço",
  "Jantar",
  "Lanche",
  "Pré-treino",
  "Pós-treino",
  "Ceia",
  "Outro",
];

export default function HistoryPage() {
  const router = useRouter();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)), // Last 7 days
    to: new Date(),
  });
  const [selectedMealType, setSelectedMealType] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [showChart, setShowChart] = useState(false);

  const filteredMeals = useMemo(() => {
    let meals = [...mockMealHistory].sort((a, b) => {
      const dateA = parseISO(`${a.date}T${a.time}`);
      const dateB = parseISO(`${b.date}T${b.time}`);
      return dateB.getTime() - dateA.getTime(); // Sort descending by date and time
    });

    // Filter by date range
    if (dateRange?.from && dateRange?.to) {
      meals = meals.filter((meal) => {
        const mealDate = parseISO(meal.date);
        return isWithinInterval(mealDate, {
          start: dateRange.from!,
          end: dateRange.to!,
        });
      });
    }

    // Filter by meal type
    if (selectedMealType !== "Todos") {
      meals = meals.filter((meal) => meal.type === selectedMealType);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      meals = meals.filter(
        (meal) =>
          meal.description.toLowerCase().includes(lowerCaseSearchTerm) ||
          meal.type.toLowerCase().includes(lowerCaseSearchTerm) ||
          meal.calories.toString().includes(lowerCaseSearchTerm)
      );
    }

    return meals;
  }, [dateRange, selectedMealType, searchTerm]);

  const dailyCaloriesData = useMemo(() => {
    const dailyTotals: { [key: string]: number } = {};
    filteredMeals.forEach((meal) => {
      if (meal.date) {
        dailyTotals[meal.date] = (dailyTotals[meal.date] || 0) + meal.calories;
      }
    });

    // Convert to array of objects for Recharts, sorted by date
    return Object.keys(dailyTotals)
      .map((date) => ({
        date: format(parseISO(date), "dd/MM", { locale: ptBR }),
        calories: dailyTotals[date],
      }))
      .sort(
        (a, b) =>
          parseISO(a.date.split("/").reverse().join("-")).getTime() -
          parseISO(b.date.split("/").reverse().join("-")).getTime()
      ); // Sort by actual date
  }, [filteredMeals]);

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

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "Café da manhã":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
      case "Almoço":
        return "bg-green-500/20 text-green-500 border-green-500/30";
      case "Jantar":
        return "bg-blue-500/20 text-blue-500 border-blue-500/30";
      case "Lanche":
        return "bg-purple-500/20 text-purple-500 border-purple-500/30";
      case "Pré-treino":
        return "bg-orange-500/20 text-orange-500 border-orange-500/30";
      case "Pós-treino":
        return "bg-indigo-500/20 text-indigo-500 border-indigo-500/30";
      default:
        return "bg-gray-500/20 text-gray-500 border-gray-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 max-w-6xl"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-2">
            Histórico de Refeições
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Consulte todas as refeições registradas por você.
          </p>
        </motion.div>

        {/* Filtros */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          {/* Filtro de Data */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={`w-full justify-start text-left font-normal ${
                  !dateRange?.from && "text-muted-foreground"
                }`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                      {format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}
                    </>
                  ) : (
                    format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                  )
                ) : (
                  <span>Selecione um intervalo de datas</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>

          {/* Filtro por Tipo de Refeição */}
          <Select value={selectedMealType} onValueChange={setSelectedMealType}>
            <SelectTrigger className="w-full">
              <Utensils className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              {mealTypesOptions.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Campo de Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por descrição ou alimento..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Visualização Gráfica (Opcional) */}
        <motion.div variants={itemVariants} className="mb-8">
          <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-xl">
                <BarChart2 className="w-5 h-5 text-primary" />
                Calorias Consumidas por Dia
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowChart(!showChart)}
              >
                {showChart ? (
                  <List className="w-5 h-5" />
                ) : (
                  <BarChart2 className="w-5 h-5" />
                )}
              </Button>
            </CardHeader>
            <AnimatePresence>
              {showChart && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <CardContent className="h-[300px] pt-4">
                    {dailyCaloriesData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dailyCaloriesData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#374151"
                          />
                          <XAxis
                            dataKey="date"
                            stroke="#9CA3AF"
                            fontSize={12}
                          />
                          <YAxis stroke="#9CA3AF" fontSize={12} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1F2937",
                              border: "1px solid #374151",
                              borderRadius: "8px",
                              color: "#F9FAFB",
                            }}
                          />
                          <Bar
                            dataKey="calories"
                            fill="url(#gradient)"
                            radius={[4, 4, 0, 0]}
                          />
                          <defs>
                            <linearGradient
                              id="gradient"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop offset="0%" stopColor="#6366F1" />
                              <stop offset="100%" stopColor="#8B5CF6" />
                            </linearGradient>
                          </defs>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <BarChart2 className="w-12 h-12 mb-4" />
                        <p>Nenhum dado para o gráfico neste período.</p>
                      </div>
                    )}
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>

        {/* Lista de Refeições */}
        <motion.div variants={itemVariants}>
          {filteredMeals.length === 0 ? (
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="w-32 h-32 mb-6 rounded-full bg-gradient-to-br from-muted/20 to-muted/40 flex items-center justify-center">
                <Utensils className="w-16 h-16 text-muted-foreground/50" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Nenhuma refeição encontrada
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Ajuste seus filtros ou adicione uma nova refeição para começar a
                acompanhar.
              </p>
              <Button
                onClick={() => router.push("/add-meal-ai")}
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Refeição
              </Button>
            </motion.div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredMeals.map((meal, index) => (
                <motion.div
                  key={meal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 bg-gradient-to-br from-card to-card/50 overflow-hidden">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {format(
                            parseISO(`${meal.date}T${meal.time}`),
                            "dd/MM/yyyy 'às' HH:mm",
                            { locale: ptBR }
                          )}
                        </div>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${getBadgeColor(meal.type)}`}
                        >
                          {meal.type}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4">
                        <img
                          src={meal.image || "/placeholder.svg"}
                          alt={meal.type}
                          className="w-16 h-16 rounded-lg object-cover ring-1 ring-primary/10"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-1">
                            {meal.description}
                          </h4>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Flame className="w-3 h-3 text-orange-500" />
                              <span>{meal.calories} kcal</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Beef className="w-3 h-3 text-red-500" />
                              <span>{meal.protein}g Prot.</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Wheat className="w-3 h-3 text-yellow-500" />
                              <span>{meal.carbs}g Carb.</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Droplets className="w-3 h-3 text-blue-500" />
                              <span>{meal.fat}g Gord.</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator className="my-3" />

                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:text-primary/80"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Detalhes
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Botão Flutuante Adicionar Refeição */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Button
            size="lg"
            className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg"
            onClick={() => router.push("/add-meal-ai")}
          >
            <Plus className="w-6 h-6" />
          </Button>
        </motion.div>

        {/* Botão de Exportar (Opcional) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="fixed bottom-6 left-6 z-50 hidden md:block"
        >
          <Button
            variant="outline"
            className="border-border/50 bg-transparent shadow-lg"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar Histórico
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
