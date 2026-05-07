/**
 * @file AuthContext.tsx
 * @description Contexto global de autenticación para MusicStream.
 *
 * Proporciona a toda la aplicación el estado del usuario autenticado y las
 * funciones para iniciar sesión, registrarse, cerrar sesión y actualizar el perfil.
 *
 * La autenticación se basa en tokens JWT almacenados en localStorage.
 * El interceptor de Axios adjunta automáticamente el token en cada petición.
 *
 * Notas de implementación:
 * - Jackson serializa `boolean isAdmin` → `admin` (sin prefijo "is").
 *   La función `normalizeUser` normaliza este comportamiento.
 * - `isAuthenticated` se deriva de `!!user` para simplificar las comprobaciones
 *   en componentes hijos como Navigation.
 *
 * @exports AuthProvider  - Componente proveedor que envuelve la aplicación.
 * @exports useAuth       - Hook personalizado para consumir el contexto.
 * @exports api           - Instancia de Axios preconfigurada con JWT interceptor.
 */
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// ==================== INTERFACES ====================

interface User {
  id?: number;
  email: string;
  name: string;
  avatarUrl?: string;
  isArtist: boolean;
  isAdmin: boolean;
  createdAt?: string; // Añadido para mostrar "Miembro desde..."
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

// ==================== CONFIGURACIÓN DE AXIOS ====================

const BACKEND_URL = 'http://localhost:9000';   
const API_BASE = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// ==================== CONTEXTO ====================

// Jackson serializes boolean fields starting with 'is' without the prefix:
// isAdmin → admin, isArtist → artist. This helper normalizes the response.
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

  // Verificar sesión actual
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

  // Iniciar sesión
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
        errorMessage = 'Email o contraseña incorrectos';
      } else if (!err.response) {
        errorMessage = 'No se pudo conectar con el servidor.';
      }
      throw new Error(errorMessage);
    }
  };

  // Registrar usuario
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
        errorMessage = 'No se pudo conectar con el servidor';
      }
      throw new Error(errorMessage);
    }
  };

  // Cierre de sesión
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

  /**
   * ACTUALIZAR PERFIL (PUT /api/users/me)
   * Envía los datos al backend y actualiza el estado global del usuario
   */
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