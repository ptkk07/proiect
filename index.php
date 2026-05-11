<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NutriFit Tracker</title>
    <link rel="stylesheet" href="assets/style.css">
</head>
<body>
    <div class="page-bg page-bg-left"></div>
    <div class="page-bg page-bg-right"></div>
    <div class="container">
        <header>
            <div class="brand-row">
                <span class="brand-mark"></span>
                <div>
                    <p class="eyebrow">Personal fitness tracker</p>
                    <h1>NutriFit Tracker</h1>
                </div>
                <button class="theme-toggle" title="Schimbă tema (negru/alb)" aria-label="Toggle dark mode">
                    <svg class="theme-icon theme-icon-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="5"></circle>
                        <line x1="12" y1="1" x2="12" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="23"></line>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                        <line x1="1" y1="12" x2="3" y2="12"></line>
                        <line x1="21" y1="12" x2="23" y2="12"></line>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                    <svg class="theme-icon theme-icon-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                </button>
            </div>
            <p class="hero-copy">Urmărește antrenamentele și mesele într-o interfață simplă, clară și ușor de folosit.</p>
        </header>

        <div class="summary-grid">
            <div class="summary-card">
                <span class="summary-label">Antrenamente</span>
                <strong>Adaugă și gestionează exercițiile</strong>
            </div>
            <div class="summary-card">
                <span class="summary-label">Mese</span>
                <strong>Ține evidența caloriilor și proteinei</strong>
            </div>
            <div class="summary-card">
                <span class="summary-label">Progres</span>
                <strong>Urmărește zilnic și săptămânal rezultatele</strong>
            </div>
        </div>

        <!-- Tab-uri de navigare -->
        <div class="tabs">
            <button class="tab-btn active" data-tab="workouts">Antrenamente</button>
            <button class="tab-btn" data-tab="meals">Mese</button>
        </div>

        <!-- TAB 1: ANTRENAMENTE -->
        <div id="workouts" class="tab-content active">
            <!-- Form pentru adaugă antrenament -->
            <div class="form-section">
                <h2>Adaugă Antrenament Nou</h2>
                <form id="workoutForm" novalidate>
                    <div class="form-group">
                        <label for="exercise">Exercițiu</label>
                        <input 
                            type="text" 
                            id="exercise" 
                            placeholder="ex: Push-ups, Alergare, Yoga"
                            required
                        >
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="sets">Seturi</label>
                            <input 
                                type="number" 
                                id="sets" 
                                min="1" 
                                value="3"
                                required
                            >
                        </div>
                        <div class="form-group">
                            <label for="reps">Repetări</label>
                            <input 
                                type="number" 
                                id="reps" 
                                min="1" 
                                value="10"
                                required
                            >
                        </div>
                    </div>

                    <input type="hidden" id="workoutDate" required>
                    <button type="submit" class="btn btn-primary">Adaugă Antrenament</button>
                </form>
            </div>

            <!-- Lista cu antrenamente -->
            <div class="list-section">
                <h2>Antrenamentele Tale</h2>
                <div class="week-nav" id="workoutWeekNav">
                    <button type="button" class="week-nav-btn" id="workoutWeekPrev">← Săptămâna anterioară</button>
                    <div class="week-nav-label" id="workoutWeekLabel"></div>
                    <button type="button" class="week-nav-btn" id="workoutWeekNext">Săptămâna următoare →</button>
                    <button type="button" class="week-nav-btn week-nav-btn-current" id="workoutWeekCurrent">⊙ Săptămâna curentă</button>
                </div>
                <div id="workoutDaySelector" class="day-selector">
                    <button type="button" class="day-btn" data-day="0">Luni</button>
                    <button type="button" class="day-btn" data-day="1">Marţi</button>
                    <button type="button" class="day-btn" data-day="2">Miercuri</button>
                    <button type="button" class="day-btn" data-day="3">Joi</button>
                    <button type="button" class="day-btn" data-day="4">Vineri</button>
                    <button type="button" class="day-btn" data-day="5">Sâmbătă</button>
                    <button type="button" class="day-btn" data-day="6">Duminică</button>
                </div>
                <div id="workoutsList" class="loading">Se încarcă...</div>
            </div>

            <!-- Obiective antrenamente + progres săptămânal -->
            <div class="form-section">
                <h2>Obiective Antrenamente (săptămânal)</h2>
                <form id="workoutGoalsForm" novalidate>
                    <div class="form-group">
                        <label for="gymDaysGoal">Zile de sală pe săptămână</label>
                        <input 
                            type="number" 
                            id="gymDaysGoal" 
                            min="0" 
                            max="7"
                            value="4"
                            required
                        >
                    </div>

                    <button type="submit" class="btn btn-primary">Salvează Obiective Antrenamente</button>
                </form>
            </div>

            <div class="list-section">
                <h2>Progres Antrenamente</h2>
                <div id="workoutProgressContainer" class="progress-container"></div>
            </div>
        </div>

        <!-- TAB 2: MESE -->
        <div id="meals" class="tab-content">
            <!-- Form pentru adaugă masă -->
            <div class="form-section">
                <h2>Adaugă Masă Nouă</h2>
                <form id="mealForm" novalidate>
                    <div class="form-group">
                        <label>Tip de Masă</label>
                        <div class="meal-category-grid">
                            <button type="button" class="meal-category-btn" data-category="Mic de Jun">
                                Mic de Jun
                            </button>
                            <button type="button" class="meal-category-btn" data-category="Prânz">
                                Prânz
                            </button>
                            <button type="button" class="meal-category-btn" data-category="Cină">
                                Cină
                            </button>
                            <button type="button" class="meal-category-btn" data-category="Snack">
                                Snack
                            </button>
                        </div>
                        <input type="hidden" id="mealCategory" required>
                    </div>

                    <div class="form-group">
                        <label for="meal">Descriere</label>
                        <input 
                            type="text" 
                            id="meal" 
                            placeholder="ex: Omletă cu brânză, Salată, Fructe"
                            required
                        >
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="calories">Calorii</label>
                            <input 
                                type="number" 
                                id="calories" 
                                min="0" 
                                value="500"
                                required
                            >
                        </div>
                        <div class="form-group">
                            <label for="protein">Proteină (g)</label>
                            <input 
                                type="number" 
                                id="protein" 
                                min="0" 
                                step="0.1"
                                value="25"
                                required
                            >
                        </div>
                    </div>

                    <input type="hidden" id="mealDate" required>
                    <button type="submit" class="btn btn-primary">Adaugă Masă</button>
                </form>
            </div>

            <!-- Lista cu mese -->
            <div class="list-section">
                <h2>Mese Tale</h2>
                <div class="week-nav" id="mealWeekNav">
                    <button type="button" class="week-nav-btn" id="mealWeekPrev">← Săptămâna anterioară</button>
                    <div class="week-nav-label" id="mealWeekLabel"></div>
                    <button type="button" class="week-nav-btn" id="mealWeekNext">Săptămâna următoare →</button>
                    <button type="button" class="week-nav-btn week-nav-btn-current" id="mealWeekCurrent">⊙ Săptămâna curentă</button>
                </div>
                <div id="mealDaySelector" class="day-selector">
                    <button type="button" class="day-btn" data-day="0">Luni</button>
                    <button type="button" class="day-btn" data-day="1">Marţi</button>
                    <button type="button" class="day-btn" data-day="2">Miercuri</button>
                    <button type="button" class="day-btn" data-day="3">Joi</button>
                    <button type="button" class="day-btn" data-day="4">Vineri</button>
                    <button type="button" class="day-btn" data-day="5">Sâmbătă</button>
                    <button type="button" class="day-btn" data-day="6">Duminică</button>
                </div>
                <div id="mealsList" class="loading">Se încarcă...</div>
            </div>

            <!-- Obiective nutriție + progres zilnic -->
            <div class="form-section">
                <h2>Obiective Nutriție (zilnic)</h2>
                <form id="nutritionGoalsForm" novalidate>
                    <div class="form-group">
                        <label for="proteinGoal">Obiectiv zilnic - Proteina (g)</label>
                        <input 
                            type="number" 
                            id="proteinGoal" 
                            min="0" 
                            step="5"
                            value="120"
                            placeholder="grame pe zi"
                            required
                        >
                    </div>

                    <div class="form-group">
                        <label for="caloriesGoal">Obiectiv zilnic - Calorii (kcal)</label>
                        <input 
                            type="number" 
                            id="caloriesGoal" 
                            min="0" 
                            step="20"
                            value="2000"
                            placeholder="calorii pe zi"
                            required
                        >
                    </div>

                    <button type="submit" class="btn btn-primary">Salvează Obiective Nutriție</button>
                </form>
            </div>

            <div class="list-section">
                <h2>Progres Nutriție</h2>
                <div id="nutritionProgressContainer" class="progress-container"></div>
            </div>
        </div>
    </div>

    <script src="assets/app.js"></script>
</body>
</html>
