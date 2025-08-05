import Layout from "@/components/Layout";
import AuthPage from "@/pages/auth/[form]";
import UserApi from "@/service/Api/UserApi";
import { TOKEN_KEY } from "@/utils/Constant";
import Storage from "@/utils/Storage";
import Token from "@/utils/Token";
import { User } from "@prisma/client";
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

function Loader() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Spin indicator={<LoadingOutlined spin />} size="large" />
    </div>
  );
}

interface AuthContextProps {
  isAuthenticated: boolean;
  user?: User | null;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = router.pathname;

  const publicPaths = ["/auth/[form]", "/public"];
  const isPublicPage = publicPaths.some((path) => pathname.startsWith(path));

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    Storage.remove(TOKEN_KEY);
    if (!isPublicPage) {
      router.replace("/auth/login");
    }
  }, [router]);

  const isRegisterComplet = useMemo(() => {
    if (user) {
      return Object.values(user).every(
        (value) => value !== null && value !== undefined
      );
    }
    return null;
  }, [user]);

  useEffect(() => {
    const isPublicPage = publicPaths.some((path) => pathname.startsWith(path));

    if (isPublicPage) {
      setLoading(false);
    }

    const checkAuth = async () => {
      try {
        if (!isPublicPage) {
          const token = Storage.get(TOKEN_KEY, null);

          if (!token && !isPublicPage) {
            logout();
            toast("Erro na autenticação", {
              description: "Token não encontrado. Por favor, faça o login.",
            });
          }

          if ((token && !user) || (token && user && !isRegisterComplet)) {
            Api.defaults.headers.Authorization = `Bearer ${token}`;

            const { email }: { email: string } = await Token.getData(token, {
              expired: new Error(
                "Sua sessão expirou. Por favor, faça login novamente."
              ),
              invalid: new Error("Token inválido."),
            });

            const me = await UserApi.me({ email, token });

            if (!me) {
              throw new Error("Falha ao obter dados do usuário.");
            }

            console.log(me);

            setUser(me);
            setIsAuthenticated(true);
          }
        }
      } catch (err: any) {
        console.error("Erro de autenticação:", err.message);
        toast("Erro na autenticação", {
          description: err.message,
        });
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router.isReady]);

  useEffect(() => {
    if (user && !isRegisterComplet && !isPublicPage) {
      router.replace("/auth/complet");
    }
  }, [user, isRegisterComplet, isPublicPage, router]);

  if (loading) {
    return <Loader />;
  }

  // if (!isAuthenticated && !isPublicPage) {
  //   return <AuthPage />;
  // }

  return (
    <AuthContext.Provider value={{ isAuthenticated, logout, user }}>
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
