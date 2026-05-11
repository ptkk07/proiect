# NutriFit Tracker

Aplicație web simplă pentru urmărirea antrenamentelor și mese. Construită cu HTML, CSS, JavaScript vanilla, PHP și MongoDB.

## 🚀 Instalare Rapidă

### 1. Instalează Composer

Descarcă Composer de la: https://getcomposer.org/download/

Sau, dacă ai Chocolatey pe Windows:
```bash
choco install composer
```

### 2. Instalează Dependențele

În directorul proiectului:
```bash
composer install
```

### 3. Configurează MongoDB

Asigură-te că MongoDB este instalat și rulează pe `localhost:27017`

Sau modifică `MONGODB_URI` din `.env` cu adresa ta de MongoDB.

### 4. Pornește serverul

```bash
php -S localhost:8000
```

Apoi deschide în browser:
```
http://localhost:8000
```

## 📁 Structura Proiectului

```
/project
  /assets
    style.css       - Stiluri CSS
    app.js          - JavaScript client
  /config
    db.php          - Conexiune la MongoDB
  /api
    add_workout.php      - POST: adaugă antrenament
    get_workouts.php     - GET: obține antrenamente
    delete_workout.php   - POST: șterge antrenament
    add_meal.php         - POST: adaugă masă
    get_meals.php        - GET: obține mese
    delete_meal.php      - POST: șterge masă
  index.php         - Pagina principală
  .env              - Variabile de mediu
  composer.json     - Dependențe
```

## 🔧 Configurare MongoDB

### Fișierul `.env`:
```
MONGODB_URI=mongodb://localhost:27017
DB_NAME=nutrifit
```

### Colecții în MongoDB:
- `workouts` - antrenamente
- `meals` - mese

## ✨ Funcționalități

### Antrenamente
- Adaugă exercițiu cu seturi și repetări
- Vezi toate antrenamentele salvate
- Șterge antrenamente

### Mese
- Adaugă masă cu calorii și proteină
- Vezi toate mese salvate
- Șterge mese

## 🎨 Design

- Minimalist și curat
- Responsive pe desktop și mobil
- Culori moderne: albastru, gri și alb
- Interfață intuitivă

## 🔌 API Endpoints

### Antrenamente
- `POST /api/add_workout.php` - Adaugă antrenament
- `GET /api/get_workouts.php` - Obține antrenamente
- `POST /api/delete_workout.php` - Șterge antrenament

### Mese
- `POST /api/add_meal.php` - Adaugă masă
- `GET /api/get_meals.php` - Obține mese
- `POST /api/delete_meal.php` - Șterge masă

## 💡 Exemple

### Adaugă antrenament (curl):
```bash
curl -X POST http://localhost:8000/api/add_workout.php \
  -H "Content-Type: application/json" \
  -d '{
    "exercise": "Push-ups",
    "sets": 3,
    "reps": 15,
    "date": "2025-05-10"
  }'
```

### Adaugă masă (curl):
```bash
curl -X POST http://localhost:8000/api/add_meal.php \
  -H "Content-Type: application/json" \
  -d '{
    "meal": "Mic dejun",
    "calories": 500,
    "protein": 25,
    "date": "2025-05-10"
  }'
```

## 📚 Tehnologii Folosite

- **Frontend**: HTML5, CSS3, JavaScript (vanilla)
- **Backend**: PHP
- **Bază de date**: MongoDB
- **Package manager**: Composer

## ⚡ Pentru Începători

Codul este scris simplu și ușor de înțeles:
- Fără framework-uri complexe
- Fără dependențe avansate
- Comentarii clare în cod
- Structură logică și organizată

## 🛠️ Cerințe de Sistem

- PHP 7.4+
- MongoDB 4.0+
- Composer

## 📝 Notă

Aceasta este o aplicație educațională și de proiect. Pentru producție, adaugă:
- Validare de date avansată
- Autentificare
- Criptare
- Error handling avansat

## 🎓 Autor

Creat pentru ingineri software care doresc să înțeleagă aplicații web simple.

---

Distrează-te urmărind antrenamentele!
