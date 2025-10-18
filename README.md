# ToDo App - Aplicación de Gestión de Tareas

Una aplicación móvil desarrollada con **Ionic 8 + Angular** y **SQLite** para la gestión completa de tareas con persistencia local.

## 📱 Características

- ✅ **CRUD completo** de tareas (Crear, Leer, Actualizar, Eliminar)
- 🔍 **Filtros avanzados** por categoría, prioridad y estado
- 💾 **Persistencia local** con SQLite
- 📱 **Interfaz responsive** con componentes Ionic
- 🎨 **Diseño moderno** con tema personalizado
- 📋 **Validaciones** de formularios
- 🏷️ **Categorización** de tareas (Trabajo, Personal, Estudio, Otros)
- ⚡ **Prioridades** (Alta, Media, Baja)
- 📄 **Página de créditos** con información del desarrollador

## 🛠️ Tecnologías Utilizadas

- **Ionic 8** - Framework de desarrollo móvil
- **Angular** - Framework de frontend
- **Capacitor 7** - Runtime nativo
- **SQLite** - Base de datos local
- **TypeScript** - Lenguaje de programación
- **@capacitor-community/sqlite** - Plugin SQLite
- **jeep-sqlite** - Fallback para web

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión LTS recomendada)
- **npm** o **yarn**
- **Ionic CLI**: `npm install -g @ionic/cli`
- **Android Studio** (para desarrollo Android)
- **Java JDK 11** o superior

## 🚀 Instalación

### 1. Clonar o descargar el proyecto

```bash
# Si tienes el proyecto en un repositorio
git clone <url-del-repositorio>
cd todo-aiep

# O simplemente navega a la carpeta del proyecto
cd todo-aiep
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Sincronizar Capacitor

```bash
npx cap sync
```

## 🔧 Configuración de Desarrollo

### Ejecutar en el navegador

```bash
# Servidor de desarrollo
npm run ionic:serve
# o
ionic serve
```

La aplicación estará disponible en `http://localhost:8100`

### Ejecutar en Android

1. **Abrir Android Studio**:
```bash
npm run cap:open:android
# o
npx cap open android
```

2. **Conectar dispositivo** o usar emulador
3. **Ejecutar** desde Android Studio

## 📦 Build y Generación de APK

### 1. Build de la aplicación

```bash
# Build de producción
npm run build

# Sincronizar cambios con Capacitor
npm run cap:sync:android
```

### 2. Generar APK de Debug

```bash
# Abrir proyecto en Android Studio
npm run cap:open:android
```

En Android Studio:
1. Ve a **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. El APK se generará en: `android/app/build/outputs/apk/debug/app-debug.apk`

### 3. Generar APK de Release (Producción)

```bash
# En Android Studio, cambiar a Release mode
# Build → Generate Signed Bundle / APK
```

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── core/
│   │   ├── models/
│   │   │   └── task.model.ts          # Modelo de datos y validaciones
│   │   └── services/
│   │       └── database.service.ts    # Servicio SQLite y CRUD
│   ├── pages/
│   │   ├── tasks-list/               # Lista de tareas con filtros
│   │   ├── task-form/                # Formulario crear/editar
│   │   └── credits/                  # Página de créditos
│   └── app.routes.ts                 # Configuración de rutas
├── assets/
│   └── aiep-logo.svg                 # Logo AIEP
└── global.scss                       # Estilos globales y tema
```

## 🎯 Funcionalidades Principales

### Gestión de Tareas
- **Crear** nuevas tareas con título, descripción, categoría y prioridad
- **Editar** tareas existentes
- **Eliminar** tareas con confirmación
- **Marcar** como completadas/pendientes
- **Filtrar** por categoría, prioridad y estado

### Categorías Disponibles
- 🏢 Trabajo
- 👤 Personal  
- 📚 Estudio
- 📋 Otros

### Niveles de Prioridad
- 🔴 Alta
- 🟡 Media
- 🟢 Baja

## 🗃️ Base de Datos

La aplicación utiliza **SQLite** para persistencia local con la siguiente estructura:

```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  priority TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendiente',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🎨 Personalización

### Modificar Tema
Edita `src/global.scss` para personalizar colores y estilos:

```scss
:root {
  --ion-color-primary: #3880ff;
  --ion-color-secondary: #3dc2ff;
  // ... más variables de tema
}
```

### Agregar Nuevas Categorías
Modifica `src/app/core/models/task.model.ts`:

```typescript
export const TASK_CATEGORIES = [
  'Trabajo', 'Personal', 'Estudio', 'Otros', 'Nueva Categoría'
] as const;
```

## 🧪 Scripts Disponibles

```bash
# Desarrollo
npm run ionic:serve          # Servidor de desarrollo
npm start                    # Alias para ionic:serve

# Build
npm run build               # Build de producción

# Capacitor
npm run cap:sync            # Sincronizar todos los platforms
npm run cap:sync:android    # Sincronizar solo Android
npm run cap:open:android    # Abrir en Android Studio
npm run build:android       # Build + sync + open Android

# Testing
npm test                    # Ejecutar tests unitarios
npm run lint                # Linter de código
```

## 🐛 Solución de Problemas

### Error de SQLite en Web
Si encuentras errores de SQLite en el navegador, asegúrate de que `jeep-sqlite` esté correctamente configurado como fallback.

### Problemas de Build Android
1. Verifica que Android Studio esté actualizado
2. Asegúrate de tener el SDK de Android correcto
3. Limpia el proyecto: `npx cap clean android`

### Dependencias Faltantes
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
npx cap sync
```

## 👨‍💻 Desarrollador

**Matías Uribe**  
Institución: **AIEP**  
Año: **2025**  
Versión: **1.0.0**

---

## 📄 Licencia

Este proyecto fue desarrollado como proyecto académico para AIEP.

## 🤝 Contribuciones

Este es un proyecto académico. Para sugerencias o mejoras, contacta al desarrollador.

---

**¡Gracias por usar ToDo App!** 🚀