import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  email: string;
  name: string;
  avatarUrl?: string;
  isArtist: boolean;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  isArtist: boolean;
  avatarUrl?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ¡Puerto 9000 como dijiste!
  const API_URL = 'http://localhost:9000/api/auth';

  // Configuración global para que SIEMPRE envíe cookies
  axios.defaults.withCredentials = true;

  // Opcional: baseURL global para no repetir
  axios.defaults.baseURL = API_URL;

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      console.log('Intentando checkAuth en:', `${API_URL}/me`);
      const res = await axios.get('/me');
      console.log('checkAuth OK → usuario:', res.data);
      setUser(res.data);
    } catch (err: any) {
      console.log('checkAuth falló:', {
        status: err.response?.status,
        message: err.message,
        data: err.response?.data,
      });
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('Intentando login con:', { email });
      const res = await axios.post('/login', { email, password });
      console.log('Login OK → respuesta:', res.data);
      setUser(res.data);
    } catch (err: any) {
      console.error('Error en login:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      throw new Error(err.response?.data?.message || 'Credenciales inválidas o error de conexión');
    }
  };

  const register = async (data: RegisterData) => {
    try {
      console.log('Intentando registro con:', data.email);
      const res = await axios.post('/register', data);
      console.log('Registro OK → respuesta:', res.data);
      setUser(res.data);
    } catch (err: any) {
      console.error('Error en registro:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      if (err.response?.status === 400) {
        throw new Error(err.response.data?.message || 'Datos inválidos (¿email ya existe?)');
      }
      throw new Error('Error al crear la cuenta');
    }
  };

  const logout = async () => {
    try {
      await axios.post('/logout');
      setUser(null);
      console.log('Logout exitoso');
    } catch (err) {
      console.error('Error en logout:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};