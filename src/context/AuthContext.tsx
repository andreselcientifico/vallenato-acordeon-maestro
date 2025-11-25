/**
 * Contexto de autenticación global.
 * - Obtiene el usuario desde el backend al iniciar la app.
 * - Si ocurre un error (CORS, cookie inválida, network error), se considera user = null.
 * - Provee login/logout y estado de carga.
 */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getCurrentUser } from "@/api/auth";
import { API_URL } from "@/config/api";

type User = {
  name: string;
  email: string;
  role?: string;
  verified?: boolean;
} | null;

type AuthContextType = {
  user: User;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Al cargar la app, consulta /users/me.
   * Maneja errores para evitar crasheos si hay CORS, token inválido, etc.
   */
  useEffect(() => {
    (async () => {
      try {
        const data = await getCurrentUser();
        setUser(data); // data ya es null si falló
      } catch (err) {
        setUser(null); // ante cualquier error, no hay usuario
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async () => {
    try {
      const me = await getCurrentUser();
      setUser(me);
    } catch {
      setUser(null);
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      /* El backend puede fallar, pero igual limpiamos sesión local */
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside an AuthProvider");
  return ctx;
};
