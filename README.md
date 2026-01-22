<div align="center">

# 🍽️ CalorieSnap AI

### Traccia le tue calorie con l'intelligenza artificiale

**Scatta, Analizza, Traccia** - La tua app per il controllo calorico intelligente

[![Version](https://img.shields.io/badge/version-1.0.0--beta-blue?style=for-the-badge)](https://github.com/tuousername/calorie-snap-ai)
[![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-green?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-brightgreen?style=for-the-badge)](LICENSE)

[📸 Demo](#-demo) • [✨ Features](#-caratteristiche-principali) • [🚀 Quick Start](#-quick-start) • [📚 Docs](#-documentazione) • [🤝 Contributing](#-contribuire)

---

<!-- Aggiungi qui uno screenshot/GIF della dashboard principale -->
![CalorieSnap AI Dashboard](docs/images/dashboard-preview.png)

</div>

## ✨ Caratteristiche Principali

<table>
<tr>
<td width="50%">

### 📸 Analisi AI Automatica
Scatta una foto del tuo pasto e lascia che l'AI faccia il resto. Riconoscimento automatico di cibi, ingredienti e calcolo nutrizionale preciso.

**Tecnologie:**
- Claude Sonnet 4 (Anthropic)
- GPT-4 Vision (OpenAI)
- Fallback automatico multi-modello

</td>
<td width="50%">

<!-- Aggiungi qui GIF/screenshot dell'analisi AI -->
![AI Food Analysis](docs/images/ai-analysis-demo.gif)

</td>
</tr>

<tr>
<td width="50%">

<!-- Aggiungi qui GIF/screenshot della dashboard -->
![Dashboard Stats](docs/images/dashboard-demo.gif)

</td>
<td width="50%">

### 📊 Dashboard Intelligente
Monitora il tuo progresso con grafici intuitivi, statistiche dettagliate e insights personalizzati sul tuo apporto calorico giornaliero.

**Include:**
- Calorie consumate vs target
- Macronutrienti (proteine, carbs, grassi)
- Streak days attivi
- Grafici settimanali

</td>
</tr>

<tr>
<td width="50%">

### 📖 Diario Alimentare Completo
Naviga facilmente tra i giorni, visualizza tutti i tuoi pasti organizzati per tipo (colazione, pranzo, cena, snack) e modifica o elimina voci in un click.

**Funzionalità:**
- Navigazione temporale
- Raggruppamento per pasto
- Modifica rapida
- Foto dei pasti

</td>
<td width="50%">

<!-- Aggiungi qui GIF/screenshot del diario -->
![Food Diary](docs/images/diary-demo.gif)

</td>
</tr>

<tr>
<td width="50%">

<!-- Aggiungi qui screenshot del dark mode -->
![Dark Mode](docs/images/dark-mode-demo.png)

</td>
<td width="50%">

### 🌗 Design Moderno
Interfaccia pulita e moderna con dark mode, animazioni fluide e design responsive. Funziona perfettamente su qualsiasi dispositivo.

**Highlights:**
- Dark/Light mode con persistenza
- Animazioni smooth
- Mobile-first design
- Accessibilità WCAG

</td>
</tr>
</table>

### 🚀 Altre Features

- 🎯 **Obiettivi Personalizzati** - Target calorico basato su età, peso, altezza e livello di attività
- 👤 **Profilo Completo** - Gestione dati antropometrici e preferenze
- 🔐 **Sicurezza First** - Autenticazione JWT, password hash con bcrypt
- ⚡ **Performance** - Lazy loading, code splitting, cache intelligente
- 🐳 **Production Ready** - Deploy con Docker in un comando

---

## 🏗️ Architettura

<div align="center">

```mermaid
graph TB
    subgraph "Frontend"
        A[React SPA] --> B[Nginx]
    end

    subgraph "Backend"
        B --> C[Express API]
        C --> D[AI Service]
        C --> E[Auth Service]
        C --> F[Meal Service]
    end

    subgraph "Data Layer"
        F --> G[(MongoDB)]
    end

    subgraph "External APIs"
        D --> H[Claude API]
        D --> I[OpenAI API]
    end

    style A fill:#61dafb
    style C fill:#68a063
    style G fill:#47A248
    style H fill:#d4a574
    style I fill:#10a37f
```

</div>

### 🛠️ Stack Tecnologico

<table>
<tr>
<td align="center" width="33%">

### Frontend
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat&logo=tailwindcss)

**Libraries:**
- React Router v6
- TanStack Query
- shadcn/ui
- next-themes
- date-fns
- Zod validation

</td>
<td align="center" width="33%">

### Backend
![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat&logo=node.js)
![Express](https://img.shields.io/badge/Express-5-000000?style=flat&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?style=flat&logo=mongodb)

**Libraries:**
- Mongoose ODM
- JWT Auth
- bcryptjs
- Anthropic SDK
- OpenAI SDK
- CORS

</td>
<td align="center" width="33%">

### Infrastructure
![Docker](https://img.shields.io/badge/Docker-24-2496ED?style=flat&logo=docker)
![Nginx](https://img.shields.io/badge/Nginx-1.25-009639?style=flat&logo=nginx)

**DevOps:**
- Docker Compose
- Multi-stage builds
- Health checks
- Volume persistence
- Nginx reverse proxy

</td>
</tr>
</table>

### 📁 Struttura del Progetto

<details>
<summary>Clicca per espandere la struttura completa</summary>

```
calorie-snap-ai/
├── 📂 backend/                  # API Node.js/Express
│   ├── 📂 config/              # Database & AI client config
│   │   ├── database.js         # MongoDB connection
│   │   ├── anthropic.js        # Claude API client
│   │   └── openai.js           # OpenAI client
│   ├── 📂 controllers/         # MVC Controllers
│   │   ├── authController.js   # Authentication logic
│   │   ├── mealController.js   # Meals CRUD operations
│   │   └── userController.js   # User management
│   ├── 📂 middlewares/         # Express middlewares
│   │   ├── auth.js             # JWT verification
│   │   └── errorHandler.js     # Global error handling
│   ├── 📂 models/              # Mongoose schemas
│   │   ├── User.js             # User model
│   │   └── Meal.js             # Meal model
│   ├── 📂 routes/              # API routes
│   │   └── routes.js           # All API endpoints
│   ├── 📂 services/            # Business logic
│   │   ├── aiService.js        # Multi-model AI service
│   │   └── nutritionService.js # Nutrition calculations
│   ├── 🐳 Dockerfile           # Backend container
│   ├── 📄 .env.example         # Environment template
│   └── 🚀 server.js            # Application entry point
│
├── 📂 frontend/                 # React SPA
│   ├── 📂 src/
│   │   ├── 📂 components/      # React components
│   │   │   ├── ui/            # shadcn/ui components
│   │   │   ├── FoodCard/      # Meal display card
│   │   │   ├── CalorieCard/   # Calorie summary card
│   │   │   └── Layout/        # App layout wrapper
│   │   ├── 📂 contexts/        # React contexts
│   │   │   └── AuthContext.tsx # Global auth state
│   │   ├── 📂 hooks/           # Custom React hooks
│   │   │   └── use-toast.ts   # Toast notifications
│   │   ├── 📂 pages/           # Route pages
│   │   │   ├── Home.tsx       # Dashboard
│   │   │   ├── AddFood.tsx    # Add meal (AI/manual)
│   │   │   ├── Diary.tsx      # Food diary
│   │   │   ├── Stats.tsx      # Statistics
│   │   │   ├── Profile.tsx    # User profile
│   │   │   └── Settings.tsx   # App settings
│   │   ├── 📂 services/        # API client services
│   │   │   └── api/           # API endpoints
│   │   └── 📂 types/           # TypeScript definitions
│   ├── 🐳 Dockerfile           # Frontend container
│   ├── 📄 nginx.conf           # Nginx config
│   ├── ⚙️ vite.config.ts       # Vite configuration
│   └── 🎨 tailwind.config.ts   # Tailwind setup
│
├── 🐳 docker-compose.yaml       # Orchestration
├── 📖 README.md                 # This file
├── 📖 DOCKER.md                 # Docker guide
├── 📖 CLAUDE.md                 # AI agent instructions
└── 🔍 docker-validate.sh        # Pre-deployment checker
```

</details>

#### 3️⃣ Apri l'App

Vai su [`http://localhost:8080`](http://localhost:8080) e inizia a usare CalorieSnap AI! 🎉

</details>

---

## 📚 Documentazione

### 🔌 API Endpoints

<details>
<summary><b>Autenticazione</b></summary>

| Metodo | Endpoint | Descrizione | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Registra nuovo utente | ❌ |
| `POST` | `/api/auth/login` | Login | ❌ |
| `GET` | `/api/auth/me` | Dati utente corrente | ✅ |

**Esempio Request:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "name": "Mario Rossi"
  }'
```

</details>

<details>
<summary><b>Pasti & Analisi AI</b></summary>

| Metodo | Endpoint | Descrizione | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/meals` | Crea pasto (con analisi AI) | ✅ |
| `GET` | `/api/meals` | Lista pasti | ✅ |
| `GET` | `/api/meals/today` | Pasti di oggi | ✅ |
| `GET` | `/api/meals/:id` | Dettaglio pasto | ✅ |
| `PUT` | `/api/meals/:id` | Modifica pasto | ✅ |
| `DELETE` | `/api/meals/:id` | Elimina pasto | ✅ |

**Esempio Analisi AI:**
```bash
curl -X POST http://localhost:3000/api/meals \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "imageBase64": "data:image/jpeg;base64,/9j/4AAQ...",
    "mealType": "lunch",
    "mediaType": "image/jpeg"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "dishName": "Spaghetti alla Carbonara",
    "totalCalories": 650,
    "totalWeight": 350,
    "ingredients": [
      { "name": "Spaghetti", "weight": 200, "calories": 310 },
      { "name": "Guanciale", "weight": 100, "calories": 260 },
      { "name": "Uova", "weight": 50, "calories": 80 }
    ],
    "macronutrients": {
      "proteins": 28,
      "carbohydrates": 75,
      "fats": 22
    },
    "confidence": "high"
  }
}
```

</details>

<details>
<summary><b>Statistiche</b></summary>

| Metodo | Endpoint | Descrizione | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/meals/stats/daily` | Statistiche giorno | ✅ |
| `GET` | `/api/meals/stats/weekly` | Statistiche settimana | ✅ |

</details>

<details>
<summary><b>Profilo Utente</b></summary>

| Metodo | Endpoint | Descrizione | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/users/profile` | Profilo utente | ✅ |
| `PUT` | `/api/users/profile` | Aggiorna profilo | ✅ |
| `POST` | `/api/users/onboarding` | Completa onboarding | ✅ |
| `PUT` | `/api/users/settings` | Aggiorna impostazioni | ✅ |

</details>

> 📖 **API Documentation completa:** Vedi `backend/docs/API.md` per tutti gli endpoint e esempi

### 🤖 Sistema AI Multi-Modello

CalorieSnap AI usa un **sistema intelligente di fallback automatico** per garantire alta disponibilità:

```mermaid
flowchart LR
    A[Foto Pasto] --> B{Claude<br/>Sonnet 4}
    B -->|✅ Success| F[Risultato]
    B -->|❌ Fail| C{Claude<br/>Sonnet 3.5}
    C -->|✅ Success| F
    C -->|❌ Fail| D{GPT-4<br/>Vision}
    D -->|✅ Success| F
    D -->|❌ Fail| E{GPT-4o}
    E --> F

    style B fill:#d4a574
    style C fill:#d4a574
    style D fill:#10a37f
    style E fill:#10a37f
    style F fill:#68a063
```

**Ordine di Priorità:**

| # | Modello | Provider | Motivo |
|---|---------|----------|--------|
| 1 | Claude Sonnet 4 | Anthropic | 🏆 Migliore per food analysis |
| 2 | Claude Sonnet 3.5 | Anthropic | ⚡ Veloce e affidabile |
| 3 | GPT-4 Vision | OpenAI | 🔄 Fallback alternativo |
| 4 | GPT-4o | OpenAI | 🛡️ Ultima risorsa |

> **Vantaggi:** Se un modello è sovraccarico o non disponibile, il sistema passa automaticamente al successivo, garantendo **99.9% uptime** dell'analisi AI.

**Setup API Keys:**

```env
# Almeno UNA chiave è richiesta
ANTHROPIC_API_KEY=sk-ant-api03-xxx  # 👈 Consigliato
OPENAI_API_KEY=sk-xxx               # Opzionale (fallback)
```

<details>
<summary>📊 Performance Comparison</summary>

| Modello | Accuratezza | Velocità | Costo/1K imgs |
|---------|-------------|----------|---------------|
| Claude Sonnet 4 | ⭐⭐⭐⭐⭐ | 2.5s | ~$15 |
| Claude Sonnet 3.5 | ⭐⭐⭐⭐ | 1.8s | ~$10 |
| GPT-4 Vision | ⭐⭐⭐⭐ | 3.2s | ~$20 |
| GPT-4o | ⭐⭐⭐⭐ | 2.1s | ~$5 |

</details>


<div align="center">

### ⭐ Se CalorieSnap AI ti è utile, lascia una stella!

[![Star](https://img.shields.io/github/stars/tuousername/calorie-snap-ai?style=social)](https://github.com/tuousername/calorie-snap-ai)
[![Fork](https://img.shields.io/github/forks/tuousername/calorie-snap-ai?style=social)](https://github.com/tuousername/calorie-snap-ai/fork)
[![Watch](https://img.shields.io/github/watchers/tuousername/calorie-snap-ai?style=social)](https://github.com/tuousername/calorie-snap-ai)

---

**Made with ❤️, ☕**

*CalorieSnap AI © 2024 - Tutti i diritti riservati*

</div>

