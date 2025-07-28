# TimeTracker - Sistema de Registro de Horas Trabajadas

Una aplicación moderna y completa para el registro y seguimiento de horas trabajadas por equipos remotos. Diseñada con una interfaz limpia estilo SaaS, completamente responsive y con funcionalidades avanzadas de monitoreo.

## 🚀 Características Principales

### ⏱️ **Sistema de Temporizador**
- Inicio y parada de temporizador en tiempo real
- Registro manual de horas con fechas y horarios específicos
- Visualización del tiempo transcurrido en vivo
- Persistencia automática en almacenamiento local

### 👥 **Gestión de Usuarios y Roles**
- Sistema de autenticación con roles diferenciados
- **Administrador**: Acceso completo al sistema
- **Empleado**: Acceso a funciones de registro de tiempo
- Perfiles de usuario personalizables

### 📋 **Proyectos y Tareas**
- Gestión completa de proyectos con códigos de color
- Asignación de tareas específicas a empleados
- Estados de tareas: Pendiente, En Progreso, Completada
- Organización jerárquica proyecto → tarea → tiempo

### 📍 **Funciones Avanzadas de Monitoreo**
- **Geolocalización**: Registro automático de ubicación al iniciar temporizador
- **Capturas de pantalla**: Toma automática de screenshots para supervisión
- **Historial detallado**: Visualización completa de entradas de tiempo
- **Indicadores visuales**: Estados y ubicaciones registradas

### 🎨 **Diseño Moderno SaaS**
- Interfaz limpia con paleta de colores neutros y azules
- Completamente responsive (móvil, tablet, desktop)
- Animaciones suaves y micro-interacciones
- Tipografía Inter para apariencia profesional
- Componentes reutilizables con Tailwind CSS

### 💾 **Almacenamiento Local**
- Funciona sin base de datos externa
- Datos persistentes en localStorage del navegador
- Ideal para demos y pruebas
- Fácil migración a base de datos cuando sea necesario

## 🧪 Cuentas de Prueba

La aplicación incluye datos mock preconfigurados para probar todas las funcionalidades:

### 👨‍💼 **Cuenta Administrador**
- **Email**: `admin@demo.com`
- **Contraseña**: `password`
- **Permisos**: Acceso completo al sistema, dashboard, reportes

### 👩‍💻 **Cuenta Empleado 1**
- **Email**: `empleado@demo.com`
- **Contraseña**: `password`
- **Nombre**: Juan Pérez
- **Permisos**: Registro de tiempo, visualización de tareas asignadas

### 👩‍💻 **Cuenta Empleado 2**
- **Email**: `maria@demo.com`
- **Contraseña**: `password`
- **Nombre**: María García
- **Permisos**: Registro de tiempo, visualización de tareas asignadas

## 📊 Datos de Prueba Incluidos

### **Proyectos Preconfigurados**
1. **Desarrollo Web** (Azul #3B82F6)
   - Diseño UI/UX → Asignado a Juan Pérez
   - Frontend Development → Asignado a Juan Pérez

2. **App Mobile** (Verde #10B981)
   - API Integration → Asignado a María García

3. **Marketing Digital** (Amarillo #F59E0B)
   - Content Creation → Asignado a María García (Completada)

### **Entradas de Tiempo de Ejemplo**
- Registros históricos con ubicaciones
- Diferentes duraciones y descripciones
- Estados variados (manual/automático)

## 🛠️ Instalación y Uso

### **Requisitos Previos**
- Node.js 18+ 
- npm o yarn

### **Instalación**
```bash
# Clonar el repositorio
git clone [url-del-repo]
cd time-tracker-app

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### **Acceso a la Aplicación**
1. Abrir navegador en `http://localhost:5173`
2. Usar cualquiera de las cuentas de prueba listadas arriba
3. Explorar las funcionalidades según el rol del usuario

## 📱 Funcionalidades por Rol

### **Administrador** (`admin@demo.com`)
- ✅ Dashboard con estadísticas generales
- ✅ Gestión de proyectos y tareas
- ✅ Visualización de todos los empleados
- ✅ Reportes completos con exportación
- ✅ Configuración del sistema

### **Empleado** (`empleado@demo.com` / `maria@demo.com`)
- ✅ Temporizador de tiempo real
- ✅ Registro manual de horas
- ✅ Visualización de tareas asignadas
- ✅ Historial personal de entradas
- ✅ Reportes personales

## 🔧 Tecnologías Utilizadas

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Hooks + Context
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Build Tool**: Vite
- **Storage**: localStorage (navegador)

## 🚀 Próximas Funcionalidades

- [ ] Dashboard administrativo completo
- [ ] Sistema de reportes con exportación PDF/Excel
- [ ] Notificaciones en tiempo real
- [ ] Integración con calendarios
- [ ] API REST para integraciones
- [ ] Aplicación móvil nativa
- [ ] Integración con sistemas de nómina

## 📝 Notas de Desarrollo

### **Estructura del Proyecto**
```
src/
├── components/     # Componentes reutilizables
├── hooks/         # Custom hooks
├── lib/           # Utilidades y configuración
├── pages/         # Páginas principales
├── types/         # Definiciones TypeScript
└── index.css      # Estilos globales
```

### **Almacenamiento de Datos**
Los datos se almacenan en `localStorage` con las siguientes claves:
- `timetracker_users` - Usuarios del sistema
- `timetracker_projects` - Proyectos
- `timetracker_tasks` - Tareas
- `timetracker_entries` - Entradas de tiempo
- `timetracker_current_user` - Usuario actual
- `timetracker_active_timer` - Temporizador activo

### **Migración a Base de Datos**
El sistema está preparado para migrar fácilmente a Supabase u otra base de datos. Los hooks y servicios están abstraídos para facilitar esta transición.

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

---

**¿Necesitas ayuda?** Abre un issue en el repositorio o contacta al equipo de desarrollo.