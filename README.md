# 🎵 MusicStream - Plataforma de Streaming de Música

MusicStream es una aplicación completa de streaming de música construida con una arquitectura moderna de **Spring Boot** para el backend y **React** para el frontend. La plataforma incluye gestión de usuarios, roles de artista/administrador, reproducción de audio en tiempo real y un diseño premium con estética *glassmorphism*.

## 🏗️ Estructura del Proyecto

El repositorio está dividido en dos grandes bloques:

- **/backend**: API REST desarrollada en Java con Spring Boot, Spring Security (JWT) y PostgreSQL.
- **/frontend**: Aplicación SPA desarrollada en React 18, Vite, Tailwind CSS y componentes de shadcn/ui.

## 🚀 Requisitos Previos

Antes de empezar, asegúrate de tener instalado:

- **Java 17** o superior.
- **Maven 3.8+**.
- **Node.js 18+** y npm.
- **PostgreSQL 14+** (corriendo en el puerto 5432).

## 🛠️ Instalación Rápida

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/MusicStream.git
cd MusicStream
```

### 2. Configurar la Base de Datos
Crea una base de datos en PostgreSQL llamada `musicstream`:
```sql
CREATE DATABASE musicstream;
```
*Nota: Puedes ajustar las credenciales en `backend/src/main/resources/application.properties`.*

### 3. Ejecutar el Backend
```bash
cd backend
mvn spring-boot:run
```
La API estará disponible en `http://localhost:9000`.

### 4. Ejecutar el Frontend
```bash
cd frontend
npm install
npm run dev
```
La aplicación web estará disponible en `http://localhost:3000`.

## 🛡️ Cuentas de Prueba (Seed Data)

Al arrancar el backend por primera vez, se creará automáticamente un usuario administrador:

- **Email:** `admin@musicstream.com`
- **Password:** `1234`

## 📄 Licencia

Este proyecto es para uso educativo y personal. Desarrollado por Sergio Campos Delgado.
