# Taller dels Sentits - Website V2 🎨

Página web moderna del **Taller dels Sentits**, centro de arteterapia en **Vilanova i la Geltrú**. Proyecto real en producción desarrollado con las últimas tecnologías web.

## 🚀 Tech Stack

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

### Stack Detallado

- **Framework**: Next.js 16 con App Router
- **Frontend**: React 19.2 con React Compiler habilitado
- **Lenguaje**: TypeScript 5 (modo estricto)
- **Estilos**: Tailwind CSS v4 (PostCSS-based)
- **Animaciones**: motion/react (no framer-motion)
- **Formularios**: EmailJS con validación server-side
- **Package Manager**: pnpm
- **Deployment**: Vercel

## ✨ Características Técnicas

### Arquitectura

- **Server Components by default**: Aprovecha SSR de Next.js 16
- **Client Components estratégicos**: Solo para interactividad (formularios, animaciones)
- **Server Actions**: Validación y sanitización server-side para seguridad
- **Route Groups**: Organización limpia sin afectar URLs
- **Barrel Exports**: Imports optimizados

### Seguridad

- **Server-side validation**: Nunca confiar en datos del cliente
- **Sanitización de inputs**: Prevención de XSS y SQL injection
- **Honeypot anti-bot**: Campo invisible para detectar bots
- **Rate limiting**: Configurado en EmailJS
- **Domain whitelist**: Restricciones de origen en EmailJS
- **TypeScript strict**: Type safety en toda la aplicación

### Performance

- **React Compiler**: Optimización automática de re-renders
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic bundle optimization
- **Font Optimization**: Custom font "The Seasons" con preload

### UX/UI

- **Animaciones fluidas**: motion/react con scroll triggers
- **Header inteligente**: Auto-hide/show según scroll
- **Responsive design**: Mobile-first approach
- **Notificaciones toast**: react-hot-toast para feedback
- **Custom dropdowns**: Componentes accesibles

## 📂 Estructura del Proyecto

```
app/
├── _components/         # Componentes globales compartidos
├── _hooks/             # Custom hooks reutilizables
├── _lib/               # Utilidades y data
├── _types/             # TypeScript types globales
├── _assets/            # Iconos e imágenes globales
├── (home)/             # Ruta home (route group)
├── (serveis)/          # Rutas de servicios
│   ├── artterapia/
│   ├── artperdins/
│   └── centres/
├── contacte/           # Formulario de contacto
│   ├── components/     # Componentes del formulario
│   ├── actions/        # Server Actions
│   ├── hooks/          # Hook del formulario
│   ├── lib/            # Validaciones
│   └── types/          # Form types
└── qui-som/            # Página "Quiénes somos"
```

## 🛠️ Instalación y Desarrollo

### Prerequisitos

- Node.js 18+
- pnpm 8+

### Setup

```bash
# Clonar repositorio
git clone https://github.com/m-s-torne/taller-dels-sentits.git
cd taller-dels-sentits

# Instalar dependencias
pnpm install

# Crear archivo .env.local con las siguientes variables:
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
NEXT_PUBLIC_EMAILJS_SERVICE_ID_SCHOOL=your_school_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_SCHOOL=your_school_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY_SCHOOL=your_school_public_key

# Iniciar servidor de desarrollo
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`

### Scripts Disponibles

```bash
pnpm dev          # Servidor de desarrollo
pnpm build        # Build de producción
pnpm start        # Servidor de producción
pnpm lint         # Verificar código con ESLint
```

## 🎯 Funcionalidades Implementadas

### Formulario de Contacto Inteligente

- **Campos condicionales**: Se adaptan según el tipo de servicio seleccionado
- **Validación dual**: Client-side (UX) + Server-side (Security)
- **Dos servicios EmailJS**: Uno para servicios generales, otro para centros educativos
- **Honeypot**: Detección silenciosa de bots
- **Feedback visual**: Toast notifications y estados de carga

### Carruseles de Imágenes

- **Navegación fluida**: Botones prev/next con animaciones
- **Autoplay opcional**: Con pause on hover
- **Touch gestures**: Swipe en dispositivos móviles

### Secciones de Contenido Dinámico

- **Navegación por pasos**: ContentSection con steps interactivos
- **Animaciones scroll-triggered**: Aparecen al entrar en viewport
- **Typography custom**: Fuente "The Seasons" cargada localmente

## 🔐 Notas de Seguridad

Este es un proyecto público porque:
- ✅ Archivo `.env.local` excluido del repositorio
- ✅ Credenciales EmailJS protegidas por domain whitelist
- ✅ Validación server-side para prevenir ataques
- ✅ Sin bases de datos expuestas
- ✅ Sin API keys sensibles en el código

## ℹ️ Información del Proyecto

Sitio web desarrollado para **Taller dels Sentits**, centro de arteterapia en Vilanova i la Geltrú.

Este proyecto forma parte de mi portfolio profesional como desarrollador web.

## 📄 Licencia y Uso

**Desarrollo:** © 2026 Marc Serra i Torné  
**Contenido y marca:** © 2026 Taller dels Sentits

Este repositorio es público como parte de mi portfolio profesional.

### ✅ Puedes libremente:
- Estudiar y aprender del código
- Usar componentes, hooks y patrones en tus proyectos
- Adaptar soluciones para tus clientes
- Copiar fragmentos sin atribución (es código open source)

### ❌ No puedes:
- **Vender** el sitio completo como template/producto comercial
- **Clonar** la identidad visual completa y decir que es tuyo
- **Redistribuir** el proyecto completo sin mencionar el origen

Sitio desarrollado exclusivamente para **Taller dels Sentits**.

> 💡 **Filosofía:** Comparte código, aprende, mejora. Solo pido que no vendas mi trabajo como tuyo.

### 🙏 Atribución (Opcional pero Apreciada)

Si encuentras útil este código, una mención es bienvenida:

```typescript
// Inspirado en el trabajo de Marc Serra i Torné
// https://github.com/m-s-torne/taller-dels-sentits
```

O en tu README:
```markdown
Basado en componentes de [Taller dels Sentits](https://github.com/m-s-torne/taller-dels-sentits) por Marc Serra i Torné
```

## 👤 Desarrollador

**Marc Serra i Torné**  
Full-Stack Developer

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/marcserraitorne)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:mserraitorne@gmail.com)