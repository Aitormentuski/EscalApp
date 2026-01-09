# Escalapp 🧗‍♂️

Escalapp es una aplicación web diseñada para escaladores que utilizan "spray walls" o muros de entrenamiento. Permite digitalizar tus muros, trazar rutas personalizadas sobre ellos y llevar un registro detallado de tus entrenamientos con una estética moderna y profesional.

## 🚀 Características Principales

### 🏠 Inicio Dinámico y Organizado
- **Últimos Desafíos**: Sección de miniaturas compactas con desplazamiento horizontal para acceder rápidamente a las rutas más recientes.
- **Colecciones de Muros**: Tus muros organizados en una cuadrícula elegante de dos columnas.
- **Acceso Rápido**: Botón flotante para subir nuevas fotos de muros directamente desde la cámara o galería.

### 🎨 Editor de Rutas Interactivo
- **Marcado de Presas**: Herramienta de dibujo intuitiva para marcar pies de inicio, manos de inicio, presas intermedias y el top.
- **Transparencia y Claridad**: Las presas se muestran con contornos de colores para no tapar la textura real de la roca o el muro.
- **Gestión de Imágenes**: Sistema que permite usar múltiples fotos para una sola ruta y editar la colección de imágenes en cualquier momento.

### 🔍 Visor de Rutas Premium
- **Zoom y Desplazamiento**: Navegación fluida por fotos de alta resolución para ver cada detalle de la presa.
- **Celebración de Encadenados**: Animación de confeti personalizada y efectos visuales al marcar una ruta como completada.
- **Diseño Ergonómico**: Interfaz optimizada para móviles, con controles de dificultad reposicionados para evitar solapamientos.

### 🛠️ Tecnología y Robustez
- **Backend Persistente**: Base de datos SQLite para asegurar que tus rutas y muros se guarden de forma segura.
- **Navegación Inteligente**: Sistema de retroceder que recuerda tu flujo de uso (vuelve a la Home si viniste de ahí).
- **Copia de Seguridad**: Funcionalidad de exportación e importación de datos en formato JSON.

## 🛠️ Stack Tecnológico

- **Frontend**: React.js, Vite, Tailwind CSS.
- **Backend**: Node.js, Express.
- **Base de Datos**: SQLite3.
- **Estilos**: CSS3 personalizado (Glassmorphism, Luces de neón, Animaciones 60fps).

## 📦 Instalación y Uso

1. **Clonar el repositorio**.
2. **Instalar dependencias**:
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```
3. **Iniciar en desarrollo**:
   - Servidor: `npm run dev` (dentro de `/server`)
   - Cliente: `npm run dev` (dentro de `/client`)

---
Desarrollado con ❤️ para la comunidad de escalada.
