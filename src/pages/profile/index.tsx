"use client";

import type React from "react";

import { easeOut, motion } from "framer-motion";
import { Key, Trash2, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useAuth } from "@/hooks/useAuth";

import InformationAccount from "@/components/profile/InformationAccount";
import { Sex } from "@prisma/client";
import ResumePhysical from "@/components/profile/ResumePhysical";
import AvaliationPhysical from "@/components/profile/AvaliationPhysical";

export default function ProfilePage() {
  const { me } = useAuth();

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 max-w-4xl"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-2">
            Meu Perfil
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Gerencie seus dados e acompanhe sua evolução no I Fitness.
          </p>
        </motion.div>
        <InformationAccount
          born={me?.born as Date}
          email={me?.email as string}
          name={me?.name as string}
          surname={me?.surname as string}
          profession={me?.profession as string}
          sex={me?.sex as Sex}
        />

        <ResumePhysical
          imc={me?.physicalAssessment?.bmi as number}
          height={me?.height}
          objective={me?.objective}
          physical_activity_level={me?.physical_activity_level}
          type_training={me?.type_training}
          weight={me?.weight}
        />

        <AvaliationPhysical
          bmi={me?.physicalAssessment?.bmi ?? 0}
          bmiClassification={me?.physicalAssessment?.bmiClassification ?? ""}
          bmr={me?.physicalAssessment?.bmr ?? 0}
          tdee={me?.physicalAssessment?.tdee ?? 0}
          dailyCaloricTarget={me?.physicalAssessment?.dailyCaloricTarget ?? 0}
          dailyCaloricTargetExplanation={
            me?.physicalAssessment?.dailyCaloricTargetExplanation ?? ""
          }
          proteinsGrams={me?.physicalAssessment?.proteinsGrams ?? 0}
          carbohydratesGrams={me?.physicalAssessment?.carbohydratesGrams ?? 0}
          fatsGrams={me?.physicalAssessment?.fatsGrams ?? 0}
          weightGoalRecommendation={
            me?.physicalAssessment?.weightGoalRecommendation ?? ""
          }
          generalRecommendations={
            me?.physicalAssessment?.generalRecommendations ?? ""
          }
          createdAt={me?.physicalAssessment?.createdAt ?? new Date()}
        />

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
