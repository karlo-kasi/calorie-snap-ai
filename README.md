# 🍽️ CalorieSnap AI

**Applicazione intelligente per il tracking delle calorie con analisi AI delle immagini dei pasti**

CalorieSnap AI è un'applicazione web moderna che permette di tracciare facilmente l'apporto calorico giornaliero attraverso l'analisi automatica delle foto dei pasti usando l'intelligenza artificiale.

![Version](https://img.shields.io/badge/version-1.0.0--beta-blue)
![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-green)
![License](https://img.shields.io/badge/license-MIT-brightgreen)

## ✨ Caratteristiche Principali

- 📸 **Analisi AI delle Immagini** - Scatta una foto del tuo pasto e l'AI lo riconosce automaticamente
- 🤖 **Multi-Model AI** - Supporto per Claude (Anthropic) e GPT-4 Vision (OpenAI) con fallback automatico
- 📊 **Dashboard Completa** - Visualizza statistiche dettagliate sul tuo apporto calorico
- 📖 **Diario Alimentare** - Tieni traccia dei pasti per ogni giorno con navigazione temporale
- 🎯 **Obiettivi Personalizzati** - Imposta il tuo target calorico giornaliero
- 👤 **Profilo Utente** - Gestisci il tuo profilo con dati antropometrici (età, peso, altezza)
- 🌗 **Dark Mode** - Tema scuro/chiaro con persistenza delle preferenze
- 📱 **Responsive Design** - Perfettamente utilizzabile su mobile, tablet e desktop
- 🔐 **Autenticazione Sicura** - Sistema di autenticazione con JWT
- 🐳 **Docker Ready** - Deploy semplificato con Docker Compose

## 🏗️ Architettura

### Stack Tecnologico

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- TailwindCSS
- shadcn/ui components
- React Router v6
- TanStack Query (React Query)
- next-themes (dark mode)
- date-fns

**Backend:**
- Node.js 20
- Express.js v5
- MongoDB + Mongoose
- JWT Authentication
- Anthropic Claude API
- OpenAI API
- bcryptjs

**Infrastructure:**
- Docker & Docker Compose
- Nginx (reverse proxy e static serving)
- MongoDB 7

### Struttura del Progetto

```
calorie-snap-ai/
├── backend/                 # API Node.js/Express
│   ├── config/             # Configurazioni (DB, AI clients)
│   ├── controllers/        # Controllers MVC
│   ├── middlewares/        # Express middlewares
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API routes
│   ├── services/          # Business logic & AI services
│   ├── Dockerfile         # Backend Docker image
│   └── server.js          # Entry point
├── frontend/               # React SPA
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── types/         # TypeScript types
│   ├── Dockerfile         # Frontend Docker image
│   ├── nginx.conf         # Nginx configuration
│   └── vite.config.ts     # Vite config
├── docker-compose.yaml     # Docker Compose orchestration
├── DOCKER.md              # Docker deployment guide
└── README.md              # Questo file
```

## 🚀 Quick Start

### Prerequisiti

- Node.js 20+ e npm
- MongoDB (locale o Atlas) oppure Docker
- API Key di Anthropic Claude o OpenAI

### Opzione 1: Sviluppo Locale (senza Docker)

#### 1. Clona il repository

```bash
git clone https://github.com/tuousername/calorie-snap-ai.git
cd calorie-snap-ai
```

#### 2. Configura il Backend

```bash
cd backend
npm install

# Crea il file .env
cp .env.example .env

# Modifica .env e inserisci:
# - MONGODB_URI (MongoDB locale o Atlas)
# - ANTHROPIC_API_KEY e/o OPENAI_API_KEY
# - JWT_SECRET (una stringa casuale sicura)
nano .env
```

Esempio `.env` per sviluppo locale:

```env
MONGODB_URI=mongodb://localhost:27017/calorie_snap
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PORT=3000
NODE_ENV=development
JWT_SECRET=mia_chiave_segreta_per_jwt_molto_lunga_e_sicura
CORS_ORIGINS=http://localhost:8080,http://localhost:5173
```

#### 3. Avvia il Backend

```bash
npm start
# oppure con auto-reload:
npm run watch
```

Il backend sarà disponibile su `http://localhost:3000`

#### 4. Configura il Frontend

```bash
cd ../frontend
npm install

# Crea il file .env (opzionale, ha già valori di default)
cp .env.example .env
```

Il file `frontend/.env` dovrebbe contenere:

```env
VITE_API_URL=http://localhost:3000/api
```

#### 5. Avvia il Frontend

```bash
npm run dev
```

Il frontend sarà disponibile su `http://localhost:8080`

### Opzione 2: Deploy con Docker (Consigliato)

Per istruzioni complete sul deployment Docker, consulta **[DOCKER.md](DOCKER.md)**.

Quick start:

```bash
# 1. Configura le variabili d'ambiente
cp backend/.env.example backend/.env
# Modifica backend/.env e aggiungi le tue API keys

# 2. Valida la configurazione (opzionale)
./docker-validate.sh

# 3. Avvia tutto con Docker Compose
docker-compose up --build

# Oppure in background:
docker-compose up -d --build
```

L'applicazione sarà disponibile su `http://localhost`

## 📚 Documentazione

### API Endpoints

**Autenticazione:**
- `POST /api/auth/register` - Registrazione utente
- `POST /api/auth/login` - Login utente
- `GET /api/auth/me` - Ottieni dati utente corrente

**Utenti:**
- `GET /api/users/profile` - Profilo utente
- `PUT /api/users/profile` - Aggiorna profilo
- `POST /api/users/onboarding` - Completa onboarding
- `PUT /api/users/settings` - Aggiorna impostazioni

**Pasti:**
- `POST /api/meals` - Crea pasto (con analisi AI se contiene immagine)
- `GET /api/meals` - Lista pasti (con filtro per data)
- `GET /api/meals/today` - Pasti di oggi
- `GET /api/meals/:id` - Dettaglio pasto
- `PUT /api/meals/:id` - Modifica pasto
- `DELETE /api/meals/:id` - Elimina pasto
- `GET /api/meals/stats/daily` - Statistiche giornaliere
- `GET /api/meals/stats/weekly` - Statistiche settimanali

**Health Check:**
- `GET /health` - Status dell'API

### Sistema AI Multi-Modello

L'applicazione supporta **fallback automatico** tra diversi modelli AI:

1. **Claude Sonnet 4** (Anthropic) - Priorità 1, migliore per analisi food
2. **Claude Sonnet 3.5** (Anthropic) - Priorità 2, alternativa Claude
3. **GPT-4 Vision** (OpenAI) - Priorità 3, fallback OpenAI
4. **GPT-4o** (OpenAI) - Priorità 4, ultima alternativa

Se un modello fallisce o è sovraccarico, il sistema prova automaticamente il successivo.

**Configurazione API Keys:**

Puoi configurare una o entrambe le API keys nel file `.env`:

```env
# Almeno una delle due è richiesta
ANTHROPIC_API_KEY=sk-ant-api03-...  # Consigliato
OPENAI_API_KEY=sk-...               # Opzionale (fallback)
```

### Funzionalità Utente

**Onboarding:**
Al primo accesso, l'utente completa un onboarding che richiede:
- Nome
- Età
- Sesso (maschio/femmina/altro)
- Peso (kg)
- Altezza (cm)
- Livello di attività fisica
- Obiettivo calorico giornaliero (calcolato automaticamente)

**Dashboard:**
- Riepilogo calorie giornaliere (consumate vs target)
- Ultimi pasti registrati
- Quick actions (scatta foto, aggiungi manualmente, ecc.)
- Statistiche settimanali

**Diario:**
- Visualizza pasti raggruppati per tipo (colazione, pranzo, cena, snack)
- Navigazione tra i giorni (ieri, oggi, giorni passati)
- Modifica ed elimina pasti
- Visualizza dettagli completi di ogni pasto

**Statistiche:**
- Grafici calorie settimanali
- Trend macronutrienti
- Storico peso corporeo
- Giorni di streak

**Profilo:**
- Modifica dati personali
- Aggiorna obiettivi calorici
- Visualizza progressi

**Impostazioni:**
- Tema chiaro/scuro
- Notifiche (promemoria pasti, report settimanali)
- Lingua e regione
- Esporta dati
- Elimina account

## 🔧 Configurazione Avanzata

### Variabili d'Ambiente Backend

| Variabile | Descrizione | Default | Obbligatoria |
|-----------|-------------|---------|--------------|
| `MONGODB_URI` | URI di connessione MongoDB | - | ✅ |
| `ANTHROPIC_API_KEY` | API key Anthropic Claude | - | ⚠️ Almeno una |
| `OPENAI_API_KEY` | API key OpenAI | - | ⚠️ Almeno una |
| `PORT` | Porta server | `3000` | ❌ |
| `NODE_ENV` | Environment | `development` | ❌ |
| `JWT_SECRET` | Secret per JWT | - | ✅ |
| `CORS_ORIGINS` | CORS allowed origins | - | ❌ |

### Variabili d'Ambiente Frontend

| Variabile | Descrizione | Default | Obbligatoria |
|-----------|-------------|---------|--------------|
| `VITE_API_URL` | URL backend API | `http://localhost:3000/api` | ❌ |

## 🧪 Testing

### Test Backend

```bash
cd backend
npm test
```

### Test Frontend

```bash
cd frontend
npm test
```

### Test End-to-End

```bash
# TODO: Implementare Playwright/Cypress
```

## 🐛 Troubleshooting

### Problema: L'analisi AI fallisce

**Soluzione:**
1. Verifica che almeno una API key sia configurata correttamente
2. Controlla i log del backend: `docker-compose logs backend`
3. Verifica che l'immagine sia in formato supportato (JPEG, PNG, WebP)
4. Assicurati che l'immagine non superi 5MB

### Problema: Frontend non si connette al backend

**Soluzione:**
1. Verifica che il backend sia in esecuzione
2. Controlla `VITE_API_URL` nel file `.env` del frontend
3. Verifica le impostazioni CORS nel backend

### Problema: MongoDB connection failed

**Soluzione:**
1. Verifica che MongoDB sia in esecuzione
2. Controlla `MONGODB_URI` nel `.env`
3. Se usi Docker: `docker-compose logs mongodb`
4. Se locale: `brew services start mongodb-community` (macOS)

Per altri problemi, consulta [DOCKER.md](DOCKER.md) o apri una issue.

## 📈 Roadmap

### v1.0.0 (Attuale - Beta)
- ✅ Autenticazione utenti
- ✅ Analisi AI foto pasti
- ✅ Tracking calorie giornaliere
- ✅ Dashboard e statistiche
- ✅ Dark mode
- ✅ Docker deployment

### v1.1.0 (Prossima)
- [ ] Ricette personalizzate
- [ ] Condivisione pasti
- [ ] Export PDF report
- [ ] Notifiche push
- [ ] App mobile (React Native)

### v2.0.0 (Futuro)
- [ ] Social features
- [ ] Integrazioni fitness trackers
- [ ] Suggerimenti AI personalizzati
- [ ] Multi-lingua completo
- [ ] Modalità offline

## 🤝 Contribuire

Contributi, issue e feature request sono benvenuti!

1. Fork il progetto
2. Crea un branch per la feature (`git checkout -b feature/AmazingFeature`)
3. Commit le modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📄 Licenza

Questo progetto è distribuito sotto licenza MIT. Vedi il file `LICENSE` per maggiori dettagli.

## 👨‍💨 Autore

**Il tuo nome**
- GitHub: [@tuousername](https://github.com/tuousername)
- Email: tuaemail@example.com

## 🙏 Ringraziamenti

- [Anthropic Claude](https://www.anthropic.com/) per l'eccellente API di analisi immagini
- [OpenAI](https://openai.com/) per GPT-4 Vision
- [shadcn/ui](https://ui.shadcn.com/) per i bellissimi componenti UI
- [Lovable.dev](https://lovable.dev/) per l'ispirazione iniziale del progetto

## 📞 Supporto

Per supporto, apri una issue su GitHub o contattaci via email.

---

**Made with ❤️ and 🤖 AI**
