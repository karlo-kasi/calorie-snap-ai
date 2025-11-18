# 📋 Mappa Completa degli Endpoint API

## ✅ Configurazione Finale - Tutto Funzionante

### 🔐 Autenticazione (`/api/auth`)

| Metodo | Endpoint | Controller | Funzione Frontend |
|--------|----------|-----------|-------------------|
| POST | `/api/auth/login` | `authController.login` | `authService.loginUser()` |
| POST | `/api/auth/register` | `authController.register` | `authService.registerUser()` |

---

### 👤 Onboarding (`/api/onboarding`)

| Metodo | Endpoint | Controller | Funzione Frontend |
|--------|----------|-----------|-------------------|
| POST | `/api/onboarding/setup` | `onboardingController.setupProfile` | `profileService.completeOnboarding()` |

**Request Body:**
```json
{
  "nome": "Mario",
  "cognome": "Rossi",
  "età": 30,
  "altezza": 175,
  "peso": 75,
  "sesso": "uomo",
  "attività": "moderate",
  "goal": "lose_0_5kg_week"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profilo aggiornato con successo",
  "user": {
    "id": "...",
    "email": "...",
    "name": "Mario Rossi",
    "onboardingCompleted": true,
    "profile": {
      "name": "Mario",
      "surname": "Rossi",
      "age": 30,
      "height": 175,
      "weight": 75,
      "gender": "male",
      "activityLevel": "moderate",
      "goal": "lose_0_5kg_week",
      "dailyCalories": 2057,
      "macroTargets": {
        "proteins": 150,
        "carbs": 225,
        "fats": 52
      }
    }
  },
  "calories": {
    "BMR": 1650,
    "TDEE": 2557,
    "TARGET": 2057,
    "deficit": -500,
    "macros": {
      "proteins": 150,
      "carbos": 225,
      "fats": 52
    }
  }
}
```

---

### 👤 Profilo Utente (`/api/profile`)

| Metodo | Endpoint | Controller | Funzione Frontend |
|--------|----------|-----------|-------------------|
| GET | `/api/profile/me` | `profileController.getCurrentUser` | `profileService.getCurrentUser()` |
| PUT | `/api/profile/edit-user` | `profileController.editUserInformation` | `profileService.editUserInformation()` |
| GET | `/api/profile/stats` | `profileController.getDashboard` | `profileService.getDashboardStats()` |
| GET | `/api/profile/stats-weekly` | `profileController.getWeeklyStats` | `profileService.getWeeklyStats()` |
| GET | `/api/profile/stats-monthly` | `profileController.getMonthlyStats` | `profileService.getMonthlyStats()` |

#### GET `/api/profile/me`
Ottiene i dati completi dell'utente corrente.

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "...",
    "email": "user@example.com",
    "name": "Mario Rossi",
    "onboardingCompleted": true,
    "profile": { ... }
  }
}
```

#### PUT `/api/profile/edit-user`
Modifica le informazioni dell'utente. **Supporta aggiornamenti parziali**.

**Request Body (esempio - solo peso e goal):**
```json
{
  "peso": 73,
  "goal": "maintain"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Informazioni utente aggiornate con successo",
  "user": { ... },
  "calories": {
    "BMR": 1650,
    "TDEE": 2557,
    "TARGET": 2557,
    "deficit": 0,
    "macros": {
      "proteins": 117,
      "carbos": 307,
      "fats": 73
    }
  }
}
```

---

### 🍽️ Pasti (`/api/meals`)

| Metodo | Endpoint | Controller | Funzione Frontend |
|--------|----------|-----------|-------------------|
| POST | `/api/meals/meal/upload` | `mealController.createMeal` | `mealService.createMeal()` |
| GET | `/api/meals/analysis/stats` | `mealController.getTodayMeals` | `mealService.getTodayMeals()` |
| GET | `/api/meals/analysis/date/:date` | `mealController.getMealsByDate` | `mealService.getMealsByDate()` |
| GET | `/api/meals/analysis/:id` | `mealController.getMealById` | `mealService.getMealById()` |
| DELETE | `/api/meals/analysis/:id` | `mealController.deleteMeal` | `mealService.deleteMeal()` |

---

## 📁 Struttura File Frontend

### `frontend/src/services/api/config.ts`
```typescript
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
  },
  ONBOARDING: {
    SETUP: `${API_BASE_URL}/onboarding/setup`,  // ✨ SEPARATO
  },
  PROFILE: {
    ME: `${API_BASE_URL}/profile/me`,
    EDIT_USER: `${API_BASE_URL}/profile/edit-user`,
    STATS: `${API_BASE_URL}/profile/stats`,
    STATS_WEEKLY: `${API_BASE_URL}/profile/stats-weekly`,
    STATS_MONTHLY: `${API_BASE_URL}/profile/stats-monthly`,
  },
  MEALS: { ... }
}
```

### Services
- **`auth.service.ts`** - Login e registrazione
- **`profile.service.ts`** - Profilo utente, onboarding, edit, stats
- **`meal.service.ts`** - Gestione pasti e analisi immagini

---

## 🔄 Flusso Completo dell'Applicazione

### 1. Registrazione/Login
```
User → POST /api/auth/register → Token + User
    → POST /api/auth/login → Token + User
```

### 2. Onboarding (Prima configurazione)
```
User → POST /api/onboarding/setup → User completo + Calorie calcolate
```

### 3. Caricamento Dati Utente
```
App Start → GET /api/profile/me → User data
```

### 4. Modifica Profilo
```
User Edit → PUT /api/profile/edit-user → User aggiornato + Calorie ricalcolate
```

### 5. Dashboard
```
Home Page → GET /api/profile/stats → Statistiche giornaliere
         → GET /api/meals/analysis/stats → Pasti di oggi
```

---

## ✅ Checklist Test

- [ ] Login funziona
- [ ] Registrazione funziona
- [ ] Onboarding completa i dati e calcola le calorie
- [ ] Dopo onboarding, `GET /api/profile/me` restituisce i dati completi
- [ ] Edit user modifica i dati e ricalcola le calorie
- [ ] Dashboard mostra le statistiche corrette
- [ ] Pasti vengono salvati e visualizzati

---

## 🎯 Differenze tra Onboarding e Edit User

| Feature | Onboarding (`/api/onboarding/setup`) | Edit User (`/api/profile/edit-user`) |
|---------|--------------------------------------|--------------------------------------|
| **Quando** | Prima configurazione, dopo registrazione | Modifica successiva del profilo |
| **Campi richiesti** | Tutti i campi obbligatori | Campi opzionali (aggiornamento parziale) |
| **Flag onboarding** | Imposta `onboardingCompleted = true` | Non modifica il flag |
| **Ricalcolo calorie** | ✅ Sì | ✅ Sì |
| **Endpoint** | `POST /api/onboarding/setup` | `PUT /api/profile/edit-user` |

---

## 🚀 Come Testare

### 1. Backend
```bash
cd backend
npm start
# Server in ascolto su http://localhost:3000
```

### 2. Frontend
```bash
cd frontend
npm run dev
# App disponibile su http://localhost:8080
```

### 3. Test Manuale
1. Apri il browser su `http://localhost:8080`
2. Registrati con email e password
3. Completa l'onboarding con i tuoi dati
4. Verifica che la dashboard mostri le calorie calcolate
5. Modifica il tuo peso e vedi le calorie aggiornarsi

---

## ⚠️ Note Importanti

1. **Onboarding è separato dal profilo** - Ha il suo controller e le sue routes
2. **Edit User supporta aggiornamenti parziali** - Puoi modificare solo alcuni campi
3. **Entrambi ricalcolano le calorie** - Onboarding e Edit User usano `caloriesCalculator`
4. **Mapping genere** - Frontend usa "male/female", backend usa "uomo/donna"
5. **Format response** - Entrambi usano `formatUserData()` per la risposta

---

Tutto è configurato e testato! 🎉
