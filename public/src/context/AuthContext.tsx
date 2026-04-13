import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id?: number;
  email: string;
  name: string;
  avatarUrl?: string;
  isArtist: boolean;
  isAdmin: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  isArtist: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

// ==================== CONFIGURACIÓN DEL BACKEND ====================

const BACKEND_URL = 'http://localhost:9000';   // ← Puerto que estás usando en Spring Boot
const API_BASE = `${BACKEND_URL}/api`;

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,           // Necesario para sesiones con cookies
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// ================================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar si el usuario ya está logueado al cargar la app
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
    } catch (err) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      setUser(res.data);
    } catch (err: any) {
      let errorMessage = 'Error al iniciar sesión';

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 401) {
        errorMessage = 'Email o contraseña incorrectos';
      } else if (err.response?.status === 400) {
        errorMessage = err.response.data?.message || 'Datos inválidos';
      } else if (!err.response) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica que Spring Boot esté corriendo.';
      }

      throw new Error(errorMessage);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const res = await api.post('/auth/register', data);
      setUser(res.data);        // Opcional: auto-login después del registro
    } catch (err: any) {
      let errorMessage = 'Error al crear la cuenta';

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 400) {
        errorMessage = err.response.data?.message || 'Datos inválidos (¿email ya existe?)';
      } else if (!err.response) {
        errorMessage = 'No se pudo conectar con el servidor';
      }

      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        login, 
        register, 
        logout, 
        checkAuth 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};