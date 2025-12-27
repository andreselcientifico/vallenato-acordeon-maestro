# Academia Vallenato

Una plataforma educativa completa para aprender música vallenata, construida con tecnologías modernas web.

## Descripción del Proyecto

Esta aplicación es una academia en línea especializada en la enseñanza de música vallenata. Incluye:

- **Catálogo de cursos**: Navegación por cursos básicos y premium con filtros por categoría, nivel y calificación
- **Sistema de autenticación**: Registro e inicio de sesión de usuarios
- **Reproductor de cursos**: Visualización de lecciones con soporte para videos, cuestionarios y ejercicios
- **Seguimiento de progreso**: Sistema completo para marcar lecciones como completadas y visualizar el progreso
- **Perfil de usuario**: Gestión del perfil y visualización de cursos adquiridos
- **Integración de pagos**: Sistema de pago con PayPal para cursos premium

## Tecnologías Utilizadas

- **Frontend**: React 18 con TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS con shadcn/ui components
- **Icons**: Lucide React
- **HTTP Client**: Fetch API nativo
- **State Management**: React hooks (useState, useEffect)
- **Routing**: React Router
- **Package Manager**: Bun

## Inicio del Proyecto

Este proyecto se inició con la ayuda de Lovable, una plataforma de desarrollo asistido por IA, pero ha sido completamente modificado y construido por el desarrollador principal (andreselcientifico).

## Cómo Ejecutar el Proyecto

### Prerrequisitos

- **Bun**: Asegúrate de tener Bun instalado. Si no lo tienes, instálalo desde [bun.sh](https://bun.sh)

### Instalación y Ejecución

```bash
# Clona el repositorio
git clone <[URL_DEL_REPOSITORIO](https://github.com/andreselcientifico/vallenato-acordeon-maestro.git)>
cd frontend_vallenato

# Instala las dependencias con Bun
bun install

# Inicia el servidor de desarrollo
bun run dev
```

El servidor de desarrollo se iniciará en `http://localhost:5173` (o el puerto que Vite asigne).

### Comandos Disponibles

- `bun run dev` - Inicia el servidor de desarrollo
- `bun run build` - Construye la aplicación para producción
- `bun run preview` - Vista previa de la build de producción
- `bun run lint` - Ejecuta el linter

## Estructura del Proyecto

```
src/
├── api/           # Funciones para llamadas a la API
├── assets/        # Recursos estáticos
├── components/    # Componentes reutilizables
│   ├── ui/       # Componentes de shadcn/ui
│   └── ...       # Otros componentes
├── context/      # Contextos de React (AuthContext)
├── hooks/        # Hooks personalizados
├── lib/          # Utilidades
├── pages/        # Páginas principales de la aplicación
└── ...
```

## Características Principales

### Sistema de Cursos
- Visualización de cursos con imágenes y descripciones
- Filtros por categoría (básico/premium), nivel y calificación
- Sistema de búsqueda

### Autenticación
- Registro e inicio de sesión
- Protección de rutas
- Gestión de estado de autenticación

### Reproductor de Lecciones
- Soporte para videos (YouTube, archivos locales)
- Cuestionarios y ejercicios interactivos
- Seguimiento automático de progreso
- Navegación entre lecciones

### Perfil de Usuario
- Visualización de cursos adquiridos
- Progreso general de aprendizaje

## Contribución

Este proyecto es mantenido por el desarrollador principal. Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## Licencia

Este proyecto es privado y todos los derechos están reservados.
