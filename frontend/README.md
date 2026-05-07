# 🎨 MusicStream Frontend

Interfaz de usuario moderna y reactiva para la plataforma MusicStream, construida con React y diseñada para ofrecer una experiencia premium.

## 🛠️ Tecnologías
- **React 18** + **TypeScript**
- **Vite** (Build tool ultra-rápida)
- **Tailwind CSS** (Estilos utilitarios)
- **Lucide React** (Iconografía)
- **Axios** (Cliente HTTP con interceptores JWT)
- **React Router 6** (Navegación)
- **shadcn/ui** (Base de componentes accesibles)

## 📂 Estructura de Carpetas
```
src/
├── components/   # Componentes de la interfaz (Auth, Player, Navigation, etc.)
│   └── ui/       # Componentes base reutilizables (Botones, Inputs, Modales)
├── context/      # Contextos globales (Autenticación y Temas)
├── utils/        # Funciones auxiliares y tokens de diseño
├── App.tsx       # Enrutamiento y layout principal
└── main.tsx      # Punto de entrada de la aplicación
```

## ✨ Características UI
- **Glassmorphism:** Efectos de desenfoque y transparencias para un look moderno.
- **Modo Oscuro/Claro:** Sistema de temas dinámico que persiste en el navegador.
- **Responsive Design:** Adaptado para tablets y escritorio (panel de auth adaptable).
- **Floating Labels:** Inputs interactivos con animaciones fluidas.

## 🔗 Conexión con la API
La URL base del backend se configura en `src/context/AuthContext.tsx`. Por defecto es `http://localhost:9000/api`.

El sistema utiliza un **Interceptor de Axios** que:
1. Recupera el token JWT del `localStorage`.
2. Lo inyecta automáticamente en el header de cada petición.
3. Maneja errores 401 si el token expira.

## 🚀 Ejecución
Para instalar dependencias e iniciar el servidor de desarrollo:
```bash
npm install
npm run dev
```
La aplicación se abrirá en `http://localhost:3000`.
