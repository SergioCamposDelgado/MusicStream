# 🎵 MusicStream - Plataforma de Streaming de Música

MusicStream es una aplicación completa de streaming de música construida con una arquitectura moderna. La plataforma incluye gestión de usuarios, roles de artista/administrador, reproducción de audio en tiempo real y un diseño premium con estética *glassmorphism*.

## 🏗️ Arquitectura del Proyecto

El proyecto está diseñado para ser desplegado de forma profesional y segura mediante contenedores:

- **Backend**: API REST con Spring Boot 4.0.6, Spring Security (JWT) y persistencia en PostgreSQL 15.
- **Frontend**: Aplicación SPA con React 18.3, Vite 6.4 y componentes de alta calidad.
- **Infraestructura**: Despliegue orquestado con Docker Compose.
- **Seguridad**: Proxy Inverso con Nginx Proxy Manager y certificados SSL automáticos (Let's Encrypt).

---

## 🚀 Despliegue Rápido (Docker)

La forma recomendada de ejecutar MusicStream es mediante Docker Compose.

### 1. Preparación
Copia el archivo de ejemplo de variables de entorno y edítalo con tus credenciales:
```bash
cp .env.example .env
nano .env
```

### 2. Lanzar la aplicación
```bash
docker compose up -d --build
```

Esto levantará 4 servicios:
- `musicstream-db`: Base de datos PostgreSQL.
- `musicstream-api`: Servidor backend en el puerto 9000 (interno).
- `musicstream-web`: Servidor frontend en el puerto 80 (interno).
- `musicstream-proxy`: Panel de gestión Nginx Proxy Manager (Puertos 80, 443 y 81).

---

## 🛠️ Configuración de Producción (HTTPS)

Una vez levantados los contenedores:
1. Accede al panel de gestión en `http://tu-ip:81` (Admin: `admin@example.com` / Pass: `changeme`).
2. Configura un **Proxy Host** para tu dominio apuntando al hostname `frontend` en el puerto `80`.
3. Añade una **Custom Location** `/api` apuntando al hostname `backend` en el puerto `9000`.
4. Solicita tu certificado SSL gratuito de Let's Encrypt desde la pestaña **SSL**.

---

## 🛡️ Cuentas de Prueba

El sistema inicializa automáticamente las siguientes cuentas si la base de datos está vacía:

| Rol | Email | Password |
| :--- | :--- | :--- |
| **Administrador** | `admin@musicstream.com` | `1234` |
| **Artista** | `artista@demo.com` | `1234` |
| **Usuario** | `usuario@prueba.com` | `1234` |

---

## 📄 Créditos y Licencia

Desarrollado por **Sergio Campos Delgado** como proyecto final de Ciclo Formativo de Grado Superior.
- Backend: Java / Spring Boot.
- Frontend: React / Vite / Tailwind CSS.
- DevOps: Docker / Nginx Proxy Manager.
