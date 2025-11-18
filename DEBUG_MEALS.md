# 🔍 Debug: Pasti non visualizzati nel Diary

## Checklist di Verifica

### ✅ 1. Backend - Routes e Controller
- ✅ Route configurata: `GET /api/meals/analysis/stats`
- ✅ Controller: `getTodayMeals` esiste e funziona
- ✅ Middleware auth: corretto
- ✅ Response format: `{ success: true, data: [...], dailyStats: {...} }`

### ✅ 2. Frontend - API Configuration
- ✅ Endpoint: `${API_BASE_URL}/meals/analysis/stats`
- ✅ Service: `getTodayMeals(token)` configurato correttamente
- ✅ Headers: token viene passato correttamente

### ❓ 3. Possibili Problemi da Verificare

#### A. Token non valido o scaduto
**Test:**
```bash
# Controlla nella console del browser (F12):
# localStorage.getItem('auth_token')
# Dovrebbe essere un JWT valido
```

#### B. Database vuoto
**Test:**
```bash
# Nel backend, verifica MongoDB
mongo
use food-tracker
db.meals.find()  # Dovrebbe mostrare i pasti
```

#### C. Errore nella query MongoDB
**Possibile problema:**
- Il campo `userId` nel database potrebbe essere salvato in un formato diverso
- Il confronto delle date potrebbe non funzionare

#### D. CORS o problema di rete
**Test:**
```bash
# Nel browser (Network tab):
# Verifica che la richiesta GET /api/meals/analysis/stats venga fatta
# Status 200 = OK
# Status 401 = Token invalido
# Status 500 = Errore server
```

## 🧪 Test Manuale

### Test 1: Verifica API dal browser
Apri la console del browser (F12) e esegui:

```javascript
// 1. Verifica token
const token = localStorage.getItem('auth_token');
console.log('Token:', token);

// 2. Testa la chiamata API
fetch('http://localhost:3000/api/meals/analysis/stats', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => {
  console.log('✅ Response:', data);
  console.log('📊 Count:', data.count);
  console.log('🍽️ Meals:', data.data);
  console.log('📈 Stats:', data.dailyStats);
})
.catch(err => console.error('❌ Error:', err));
```

### Test 2: Verifica nel backend
Aggiungi log nel controller `getTodayMeals`:

```javascript
export const getTodayMeals = async (req, res, next) => {
  try {
    const userId = req.userId;
    console.log('🔍 getTodayMeals - userId:', userId);  // <-- AGGIUNGI QUESTO

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    console.log('📅 Query date range:', { startOfDay, endOfDay });  // <-- AGGIUNGI QUESTO

    const todayMeals = await Meal.find({
      userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    console.log('📋 Found meals:', todayMeals.length);  // <-- AGGIUNGI QUESTO
    console.log('📋 Meals data:', JSON.stringify(todayMeals, null, 2));  // <-- AGGIUNGI QUESTO

    // ... resto del codice
  }
}
```

### Test 3: Verifica il Meal Model
```javascript
// Controlla se i pasti esistono nel database
db.meals.find({ userId: ObjectId("...") })  // Usa il tuo userId
```

## 🎯 Diagnosi Probabile

### Scenario 1: Nessun pasto nel database
**Sintomo:** `data: []`, `count: 0`
**Soluzione:** Crea un pasto di test

### Scenario 2: UserId mismatch
**Sintomo:** Query non trova pasti anche se esistono
**Soluzione:** Verifica che il `userId` salvato nei Meals corrisponda al `userId` nel token

### Scenario 3: Token scaduto
**Sintomo:** Status 401, errore "UNAUTHORIZED"
**Soluzione:** Fai logout e login di nuovo

### Scenario 4: Problema rendering frontend
**Sintomo:** API restituisce dati ma non vengono visualizzati
**Soluzione:** Verifica il componente Diary.tsx

## 🔧 Quick Fix da Provare

### Fix 1: Force refresh
Nel Diary component, prova a forzare un refresh:

```typescript
// In Diary.tsx, aggiungi un button temporaneo:
<Button onClick={() => {
  console.log('Force refresh meals');
  refreshMeals();
}}>
  🔄 Force Refresh
</Button>
```

### Fix 2: Verifica lo stato
Aggiungi console.log nel Diary:

```typescript
// In Diary.tsx, dopo la linea 99
const meals = isToday(selectedDate) ? authMeals : dateMeals;
console.log('🍽️ Meals to render:', meals);
console.log('📊 Daily stats:', dailyStats);
console.log('🔄 Is loading:', isToday(selectedDate) ? authMealsLoading : isLoadingDate);
```

### Fix 3: Verifica AuthContext
Nel AuthContext.tsx, verifica che `refreshMeals` venga chiamato all'avvio:

```typescript
// Verifica che questo useEffect si attivi
useEffect(() => {
  const loadInitialData = async () => {
    // ...
    try {
      const mealsData = await mealService.getTodayMeals(storedToken);
      console.log('🍽️ Initial meals loaded:', mealsData);  // <-- AGGIUNGI
      if (mealsData.success) {
        setMeals(mealsData.data);
        setDailyStats(mealsData.dailyStats || null);
      }
    }
  }
}, []);
```

## 📝 Cosa Controllare Passo per Passo

1. **Apri la console del browser** (F12)
2. **Verifica il token**: `localStorage.getItem('auth_token')`
3. **Guarda la tab Network**: cerca `analysis/stats`
4. **Controlla la response**: dovrebbe essere `{ success: true, data: [...] }`
5. **Controlla i console.log**: cerca errori o warning
6. **Verifica lo stato React**: usa React DevTools per vedere `authMeals` e `meals`

## ⚡ Soluzione Rapida

Se non funziona nulla, prova questo test completo:

```bash
# Terminal 1 - Backend con log extra
cd backend
# Modifica mealController.js per aggiungere console.log
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev

# Browser
# Apri http://localhost:8080
# F12 per la console
# Vai su Diary
# Controlla i log
```

Poi mandami:
1. I log della console del browser
2. I log del backend quando chiami l'API
3. La response della chiamata nella Network tab
