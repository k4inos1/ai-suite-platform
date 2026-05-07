# AI Suite Platform

Monorepo que consolida el backend FastAPI de `ai-chat-assistant-temp` y la experiencia de recetas de `recetas_ai` en una sola plataforma. Incluye chat asistido por IA, múltiples agentes y un Recipe Studio para buscar, formatear y guardar recetas.

## Características

- **AI Chat** con respuestas en streaming por SSE.
- **Recipe Studio** con búsqueda de recetas, detalle formateado y favoritos en el navegador.
- **Múltiples agentes** con personalidades configurables.
- **Modo demo gratuito** cuando no existe `OPENAI_API_KEY`.
- **Monorepo unificado** con `package.json` y `requirements.txt` en la raíz.

## Arquitectura

- **Frontend**: Next.js 16, React 19, TypeScript y Tailwind CSS en `frontend/`.
- **Backend**: FastAPI (Python 3.12+), OpenAI SDK y Pydantic en `backend/`.
- **Infra**: `vercel.json` listo para despliegue y proxy API desde el frontend.

## Requisitos

- **Node.js** 20+
- **Python** 3.12+

## Configuración local

### 1) Instalar dependencias

```bash
npm install
pip install -r requirements.txt
```

### 2) Ejecutar el backend

```bash
cd backend
fastapi run main.py
```

Endpoints principales:

- `GET /health`
- `GET /agents`
- `POST /chat` (streaming)
- `GET /suggestions`

### 3) Ejecutar el frontend

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Variables de entorno

| Variable | Descripción | Requerida |
| --- | --- | --- |
| `OPENAI_API_KEY` | API key para OpenAI (backend). | No (activa modo demo si falta) |
| `NEXT_PUBLIC_API_BASE_URL` | Base URL del backend para el frontend. | No (default: `http://localhost:8000`) |

Ejemplo:

```bash
export NEXT_PUBLIC_API_BASE_URL="http://localhost:8000"
export OPENAI_API_KEY="sk-..."
```

## Scripts útiles

```bash
npm run dev
npm run build
npm run start
npm run test:backend
python -m pytest backend/tests -q
```

## Estructura del repositorio

```text
.
├── backend/          # API FastAPI
├── frontend/         # App Next.js con AI Chat y Recipe Studio
├── package.json      # Scripts/workspace del monorepo
├── requirements.txt  # Instalación unificada del backend
├── public/           # Assets estáticos
├── styles/           # CSS global
└── vercel.json       # Configuración de despliegue
```

## Contribución

Si deseas proponer mejoras, abre un issue o un pull request con una descripción clara del cambio y pasos de verificación.
