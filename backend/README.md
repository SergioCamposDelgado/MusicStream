# ⚙️ MusicStream Backend

Esta es la API REST central de MusicStream, encargada de la lógica de negocio, persistencia de datos y seguridad.

## 🛠️ Tecnologías
- **Java 21**
- **Spring Boot 4.0.6**
- **Spring Data JPA** (Hibernate)
- **Spring Security + JWT** (Autenticación Stateless)
- **PostgreSQL 15**
- **Lombok**
- **Jakarta Validation**

## 📂 Estructura de Carpetas
```
src/main/java/com/musicstream/
├── config/       # Configuración de Seguridad, CORS y Datos iniciales.
├── controller/   # Endpoints de la API (Auth, User, Admin, Files).
├── dto/          # Objetos de Transferencia de Datos.
├── entity/       # Entidades de Base de Datos (User).
├── exception/    # Manejo global de errores.
├── repository/   # Interfaces de acceso a datos (Spring Data).
├── security/     # Lógica de JWT y Filtros de Autenticación.
└── service/      # Lógica de negocio y almacenamiento de archivos.
```

## ⚙️ Configuración
El archivo principal de configuración es `src/main/resources/application.properties`.

**Propiedades clave:**
- `server.port=9000`: Puerto donde corre la API.
- `spring.datasource.url`: URL de conexión a PostgreSQL.
- `file.upload-dir=./uploads`: Directorio local para guardar audios e imágenes.
- `app.files.base-url`: URL base pública para servir archivos (Configurable vía `FILES_BASE_URL`).

## 🔐 Seguridad (JWT)
El backend utiliza un flujo **stateless**. Tras un login exitoso, se devuelve un token JWT que el cliente debe enviar en el encabezado `Authorization: Bearer <token>` para las rutas protegidas.

**Roles disponibles:**
- `ROLE_USER`: Usuario estándar.
- `ROLE_ADMIN`: Acceso total al panel de administración.
- `isArtist: true`: Permiso para subir canciones y acceder al dashboard de artista.

## 🚀 Ejecución
Para compilar y ejecutar el servidor:
```bash
mvn clean compile
mvn spring-boot:run
```
