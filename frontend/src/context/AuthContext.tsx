/**
 * Contexto global de autenticación para MusicStream.
 * Gestiona el estado del usuario, persistencia de tokens y peticiones protegidas.
 */
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id?: number;
  email: string;
  name: string;
  avatarUrl?: string;
  isArtist: boolean;
  isAdmin: boolean;
  createdAt?: string;
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
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateProfile: (name: string, avatarUrl: string) => Promise<void>;
}

// Configuración de instancia base de Axios
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:9000/api';   

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para adjuntar el JWT en cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

/** Normaliza la respuesta del backend (mapea campos de serialización de Jackson) */
function normalizeUser(data: any): User {
  return {
    id:        data.id,
    email:     data.email,
    name:      data.name,
    avatarUrl: data.avatarUrl,
    isAdmin:   data.isAdmin  ?? data.admin  ?? false,
    isArtist:  data.isArtist ?? data.artist ?? false,
    createdAt: data.createdAt ?? data.memberSince,
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  // Verifica si existe una sesión válida al cargar la aplicación
  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.get('/auth/me');
      setUser(normalizeUser(res.data));
    } catch (err) {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Inicia sesión y almacena el token JWT
  const login = async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
      }
      setUser(normalizeUser(res.data));
    } catch (err: any) {
      let errorMessage = 'Error al iniciar sesión';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 401) {
        errorMessage = 'Credenciales incorrectas';
      } else if (!err.response) {
        errorMessage = 'Servidor no disponible';
      }
      throw new Error(errorMessage);
    }
  };

  // Registra un nuevo usuario y auto-loguea si el registro es exitoso
  const register = async (data: RegisterData) => {
    try {
      const res = await api.post('/auth/register', data);
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
      }
      setUser(normalizeUser(res.data));
    } catch (err: any) {
      let errorMessage = 'Error al crear la cuenta';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (!err.response) {
        errorMessage = 'Servidor no disponible';
      }
      throw new Error(errorMessage);
    }
  };

  // Elimina el token y limpia el estado global
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  // Actualiza los datos de perfil del usuario autenticado
  const updateProfile = async (name: string, avatarUrl: string) => {

    try {
      const res = await api.put('/users/me', { 
        name: name.trim(), 
        avatarUrl: avatarUrl 
      });
      setUser(normalizeUser(res.data)); 
  } catch (err: any) {
    console.log("Error completo del servidor:", err.response?.data); 
    // Esto te mostrará exactamente qué campo falló (name, password, etc.)
    throw new Error(err.response?.data?.errors?.[0]?.defaultMessage || "Error de validación");
  }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user,
        isAuthenticated: !!user,
        isLoading, 
        login, 
        register, 
        logout, 
        checkAuth,
        updateProfile,
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