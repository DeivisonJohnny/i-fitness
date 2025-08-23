import { easeOut, motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Edit,
  Mail,
  User,
  Beaker as Gender,
  Cake,
  Building,
  X,
  Save,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { sexOptions } from "@/lib/enums";
import UserApi from "@/service/Api/UserApi";
import type { InformationAccount } from "@/service/Api/UserApi";
import { toast } from "sonner";

export default function InformationAccount(props: InformationAccount) {
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [loading, setLoading] = useState(false);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: easeOut },
    },
  };

  const schemaAccount = yup.object({
    name: yup
      .string()
      .required("Nome é obrigatório")
      .min(3, "O nome deve ter no mínimo 3 caracteres"),
    surname: yup
      .string()
      .required("Nome é obrigatório")
      .min(3, "O nome deve ter no mínimo 3 caracteres"),
    sex: yup.string().required("Selecione um gênero"),
    profession: yup
      .string()
      .required("Profissão é obrigatória")
      .min(2, "Profissão inválida"),
  });

  type FormData = yup.InferType<typeof schemaAccount>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormData>({
    resolver: yupResolver(schemaAccount),
    mode: "onChange",
    defaultValues: {
      name: props ? props.name : "",
      surname: props ? props.surname : "",
      sex: props.sex || "",
      profession: props.profession || "",
    },
  });

  async function handleUpdateAccount(data: FormData) {
    console.log("Updating account with data:", data);
    setLoading(true);
    try {
      const userUpdated = await UserApi.update(data as InformationAccount);
      console.log("🚀 ~ handleUpdateAccount ~ userUpdated:", userUpdated);
    } catch (error) {
      toast.error("Erro ao atualizar conta", {
        description: (error as Error).message,
      });
    } finally {
      toast.success("Conta atualizada com sucesso!");
      setLoading(false);
      setIsEditingAccount(false);
    }
  }

  return (
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
          <form onSubmit={handleSubmit(handleUpdateAccount)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="flex items-center gap-1 text-muted-foreground"
                >
                  <User className="w-4 h-4" />
                  Nome
                </Label>
                <Input
                  {...register("name")}
                  className="text-foreground"
                  id="name"
                  disabled={!isEditingAccount}
                />

                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="surname"
                  className="flex items-center gap-1 text-muted-foreground"
                >
                  <User className="w-4 h-4" />
                  Sobrenome
                </Label>
                <Input
                  {...register("surname")}
                  className="text-foreground"
                  id="surname"
                  disabled={!isEditingAccount}
                />

                {errors.surname && (
                  <p className="text-red-500 text-sm">
                    {errors.surname.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="flex items-center gap-1 text-muted-foreground"
                >
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input id="email" value={props.email} disabled />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="gender"
                  className="flex items-center gap-1 text-muted-foreground"
                >
                  <Gender className="w-4 h-4" />
                  Gênero
                </Label>

                <Controller
                  control={control}
                  name="sex"
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!isEditingAccount}
                    >
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {sexOptions.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.sex && (
                  <p className="text-red-500 text-sm">{errors.sex.message}</p>
                )}
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
                  value={
                    props.born
                      ? typeof props.born === "string"
                        ? new Date(props.born).toISOString().substring(0, 10)
                        : new Date(props.born).toISOString().split("T")[0]
                      : `${props.born}`
                  }
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="profession"
                  className="flex items-center gap-1 text-muted-foreground"
                >
                  <Building className="w-4 h-4" />
                  Profissão
                </Label>
                <Input
                  {...register("profession")}
                  id="profession"
                  disabled={!isEditingAccount}
                  placeholder="Ex: Engenheiro, Professsor, etc."
                />
                {errors.profession && (
                  <p className="text-red-500 text-sm">
                    {errors.profession.message}
                  </p>
                )}
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
                <Button>
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
        </CardContent>
      </Card>
    </motion.div>
  );
}
