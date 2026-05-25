# Monitoring Innovation — Frontend

Aplicación web para la gestión de vehículos de un concesionario. Construida con **React 19**, **TypeScript**, **Vite**, **framer-motion** y **Axios**.

## Stack

- **Framework:** React 19 + TypeScript
- **Build:** Vite 8
- **Routing:** react-router-dom 7
- **HTTP:** Axios
- **Animaciones:** framer-motion
- **Testing:** vitest
- **Despliegue:** Netlify

## Requisitos

- Node.js 20+
- npm

## Instalación

```bash
cd Frontend
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

## Variables de entorno

| Variable | Descripción | Default |
|---|---|---|
| `VITE_API_URL` | URL del backend | `http://localhost:8000` |

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Compila para producción |
| `npm run preview` | Previsualiza build local |
| `npm test` | Ejecuta tests (vitest) |
| `npm run lint` | ESLint |

## Páginas

- `/` — Home pública con animación de fondo
- `/login` — Inicio de sesión
- `/register` — Registro público
- `/forgot-password` — Solicitar restablecimiento de contraseña
- `/reset-password` — Restablecer contraseña con token
- `/dashboard` — CRUD de vehículos (según rol)
- `/users` — Gestión de usuarios (solo admin)

## Roles

- **Admin** — CRUD completo de vehículos y gestión de usuarios
- **Viewer** — Solo lectura en vehículos

## Prueba técnica

Proyecto académico — Monitoring Innovation.
