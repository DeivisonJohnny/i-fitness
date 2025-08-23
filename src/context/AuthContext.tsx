import Layout from "@/components/Layout";
import AuthPage from "@/pages/auth/[form]";
import UserApi from "@/service/Api/UserApi";
import { TOKEN_KEY } from "@/utils/Constant";
import Storage from "@/utils/Storage";
import Token from "@/utils/Token";
import { Prisma } from "@prisma/client";
import { Spin } from "antd";
import { useRouter } from "next/router";
import {
  createContext,
  ReactNode,
  useEffect,
  useState,
  useCallback,
  Suspense,
  useMemo,
} from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { toast } from "sonner";
import Api from "@/service/Api";
import { Toaster } from "@/components/ui/sonner";
import { PhysicalAssessmentApi } from "@/service/Api/PhysicalAssessmentApi";

function Loader() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Spin indicator={<LoadingOutlined spin />} size="large" />
    </div>
  );
}
type UserWithAssessment = Prisma.UserGetPayload<{
  include: { physicalAssessment: true };
}>;

interface AuthContextProps {
  isAuthenticated: boolean;
  me?: UserWithAssessment | null;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

const publicPaths = ["/auth/[form]", "/public"];

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserWithAssessment | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = router.pathname;

  const isPublicPage = useMemo(() => {
    return publicPaths.some((path) => pathname.startsWith(path));
  }, [pathname]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    Storage.remove(TOKEN_KEY);
    Api.defaults.headers.Authorization = ""; // Limpa o header da API
    if (!isPublicPage) {
      router.replace("/auth/login");
    }
  }, [router, isPublicPage]);

  useEffect(() => {
    if (isPublicPage) {
      setLoading(false);
      return; // Interrompe a execução se a página for pública
    }

    const checkAuth = async () => {
      try {
        const token = Storage.get(TOKEN_KEY, null);

        if (!token) {
          toast("Erro na autenticação", {
            description: "Token não encontrado. Por favor, faça o login.",
          });
          logout();
          return;
        }

        if (token) {
          Api.defaults.headers.Authorization = `Bearer ${token}`;

          const { email }: { email: string } = await Token.getData(token, {
            expired: new Error(
              "Sua sessão expirou. Por favor, faça login novamente."
            ),
            invalid: new Error("Token inválido."),
          });

          const { physicalAssessment, ...me } = await UserApi.me({
            email,
            token,
          });

          if (!me) {
            throw new Error("Falha ao obter dados do usuário.");
          }

          const isRegisterCompleteForMe = Object.values(me).every(
            (value) => value !== null && value !== undefined
          );

          if (!isRegisterCompleteForMe && !isPublicPage) {
            router.replace("/auth/complet");
          }

          if (!physicalAssessment) {
            const resultAssessment = await PhysicalAssessmentApi.create();
            if (resultAssessment) {
              toast.success("Avaliação física inicial criada com sucesso.");
            } else {
              toast.error("Erro ao criar avaliação física inicial.");
            }
          }

          setUser({ ...me, physicalAssessment });
          setIsAuthenticated(true);
        }
      } catch (err: unknown) {
        let errorMessage = "Erro desconhecido";
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        console.error("Erro de autenticação:", errorMessage);
        toast("Erro na autenticação", {
          description: errorMessage,
        });
        logout();
      } finally {
        setLoading(false);
      }
    };

    if (router.isReady) {
      checkAuth();
    }
  }, [router, isPublicPage, logout]);

  if (loading) {
    return <Loader />;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, logout, me: user }}>
      {!isAuthenticated && !isPublicPage ? (
        <AuthPage />
      ) : (
        <Layout>
          <Toaster position="top-right" theme="dark" />
          <Suspense fallback={<Loader />}>{children}</Suspense>
        </Layout>
      )}
    </AuthContext.Provider>
  );
}
