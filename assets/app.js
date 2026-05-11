// Inițializare temă
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme === 'dark' || (savedTheme === 'system' && prefersDark) ? 'dark' : 'light';
    
    applyTheme(theme);
}

function applyTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
}

// Inițializare spinbutton-uri custom pentru number inputs
function initCustomSpinbuttons() {
    const numberInputs = document.querySelectorAll('input[type="number"]');
    
    numberInputs.forEach(input => {
        if (input.parentElement.classList.contains('number-input-group')) return; // Deja inițializat
        
        const wrapper = document.createElement('div');
        wrapper.className = 'number-input-group';
        
        const btnMinus = document.createElement('button');
        btnMinus.type = 'button';
        btnMinus.className = 'spinbutton spinbutton-minus';
        btnMinus.textContent = '−';
        btnMinus.title = 'Scade';
        
        const btnPlus = document.createElement('button');
        btnPlus.type = 'button';
        btnPlus.className = 'spinbutton spinbutton-plus';
        btnPlus.textContent = '+';
        btnPlus.title = 'Mărește';
        
        input.parentElement.insertBefore(wrapper, input);
        wrapper.appendChild(btnMinus);
        wrapper.appendChild(input);
        wrapper.appendChild(btnPlus);
        
        // Event listeners
        btnMinus.addEventListener('click', (e) => {
            e.preventDefault();
            const step = parseFloat(input.step) || 1;
            const min = parseFloat(input.min) || 0;
            const current = parseFloat(input.value) || 0;
            const newValue = Math.max(min, current - step);
            input.value = newValue;
            input.dispatchEvent(new Event('change', { bubbles: true }));
        });
        
        btnPlus.addEventListener('click', (e) => {
            e.preventDefault();
            const step = parseFloat(input.step) || 1;
            const max = input.max ? parseFloat(input.max) : Infinity;
            const current = parseFloat(input.value) || 0;
            const newValue = Math.min(max, current + step);
            input.value = newValue;
            input.dispatchEvent(new Event('change', { bubbles: true }));
        });
    });
}

// Inițializare butoane categoria masă
function initMealCategoryButtons() {
    const categoryBtns = document.querySelectorAll('.meal-category-btn');
    const hiddenInput = document.getElementById('mealCategory');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Șterge clasa active de la toate butoanele
            categoryBtns.forEach(b => b.classList.remove('active'));
            
            // Adaugă clasa active la butonul clicat
            btn.classList.add('active');
            
            // Setează valoarea în hidden input
            hiddenInput.value = btn.dataset.category;
        });
    });
}

// Event listener pentru butonul de toggle
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initCustomSpinbuttons();
    initMealCategoryButtons();

    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
});

// Elemente DOM
const workoutForm = document.getElementById('workoutForm');
const mealForm = document.getElementById('mealForm');
const nutritionGoalsForm = document.getElementById('nutritionGoalsForm');
const workoutGoalsForm = document.getElementById('workoutGoalsForm');
const workoutsList = document.getElementById('workoutsList');
const mealsList = document.getElementById('mealsList');
const nutritionProgressContainer = document.getElementById('nutritionProgressContainer');
const workoutProgressContainer = document.getElementById('workoutProgressContainer');
const workoutWeekLabel = document.getElementById('workoutWeekLabel');
const workoutWeekPrev = document.getElementById('workoutWeekPrev');
const workoutWeekNext = document.getElementById('workoutWeekNext');
const workoutWeekCurrent = document.getElementById('workoutWeekCurrent');
const workoutDayBtns = document.querySelectorAll('#workoutDaySelector .day-btn');
const mealWeekLabel = document.getElementById('mealWeekLabel');
const mealWeekPrev = document.getElementById('mealWeekPrev');
const mealWeekNext = document.getElementById('mealWeekNext');
const mealWeekCurrent = document.getElementById('mealWeekCurrent');
const dayBtns = document.querySelectorAll('#mealDaySelector .day-btn');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

let currentGoals = {
    proteinGoal: 120,
    caloriesGoal: 2000,
    gymDaysGoal: 4
};

let selectedMealDate = null;
let selectedWorkoutWeekAnchor = null;
let selectedMealWeekAnchor = null;
let selectedWorkoutDate = null;

async function fetchJson(url, options) {
    const response = await fetch(url, options);
    const text = await response.text();

    try {
        return JSON.parse(text);
    } catch (error) {
        return {
            success: false,
            message: text.trim() || 'Răspuns invalid de la server'
        };
    }
}

// Confirm dialog custom (replaces native browser confirm for better design)
function showConfirmDialog(message = 'Ești sigur?') {
    return new Promise((resolve) => {
        const existing = document.querySelector('.confirm-overlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.className = 'confirm-overlay';

        const dialog = document.createElement('div');
        dialog.className = 'confirm-dialog';
        dialog.setAttribute('role', 'dialog');
        dialog.setAttribute('aria-modal', 'true');
        dialog.setAttribute('aria-label', 'Confirmare');

        const title = document.createElement('h3');
        title.className = 'confirm-title';
        title.textContent = 'Confirmare';

        const text = document.createElement('p');
        text.className = 'confirm-text';
        text.textContent = message;

        const actions = document.createElement('div');
        actions.className = 'confirm-actions';

        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.className = 'confirm-btn confirm-btn-cancel';
        cancelBtn.textContent = 'Anulează';

        const okBtn = document.createElement('button');
        okBtn.type = 'button';
        okBtn.className = 'confirm-btn confirm-btn-ok';
        okBtn.textContent = 'Da, șterge';

        actions.appendChild(cancelBtn);
        actions.appendChild(okBtn);
        dialog.appendChild(title);
        dialog.appendChild(text);
        dialog.appendChild(actions);
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        const close = (value) => {
            overlay.remove();
            document.removeEventListener('keydown', onKeyDown);
            resolve(value);
        };

        const onKeyDown = (e) => {
            if (e.key === 'Escape') close(false);
            if (e.key === 'Enter') close(true);
        };

        cancelBtn.addEventListener('click', () => close(false));
        okBtn.addEventListener('click', () => close(true));
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close(false);
        });
        document.addEventListener('keydown', onKeyDown);

        okBtn.focus();
    });
}

// Return number of workouts today
async function getTodayWorkouts() {
    const today = new Date().toISOString().split('T')[0];
    try {
        const res = await fetchJson('api/get_workouts.php');
        const workouts = res.success ? res.data : [];
        const todayWorkouts = workouts.filter(w => w.date === today);
        return { totalWorkouts: todayWorkouts.length };
    } catch (err) {
        return { totalWorkouts: 0 };
    }
}

function parseIsoLocal(dateIso) {
    const [year, month, day] = String(dateIso).split('-').map(Number);
    return new Date(year, month - 1, day);
}

function formatIsoLocal(dateObj) {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function getWeekRange(dateIso) {
    const base = parseIsoLocal(dateIso);
    const dayIdx = (base.getDay() + 6) % 7; // 0 = Monday
    const start = new Date(base);
    start.setDate(start.getDate() - dayIdx);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    end.setHours(0, 0, 0, 0);

    return {
        start,
        end,
        startIso: formatIsoLocal(start),
        endIso: formatIsoLocal(end)
    };
}

function formatWeekRangeLabel(dateIso) {
    const { start, end } = getWeekRange(dateIso);
    const startText = start.toLocaleDateString('ro-RO', { day: '2-digit', month: 'short' });
    const endText = end.toLocaleDateString('ro-RO', { day: '2-digit', month: 'short', year: 'numeric' });
    return `Săptămâna: ${startText} - ${endText}`;
}

async function getWeekMealTotals(dateIso) {
    try {
        const result = await fetchJson('api/get_meals.php');
        const meals = result.success ? result.data : [];
        const { startIso, endIso } = getWeekRange(dateIso);
        const weekMeals = meals.filter(m => m.date >= startIso && m.date <= endIso);
        const totalCalories = weekMeals.reduce((sum, m) => sum + (m.calories || 0), 0);
        const totalProtein = weekMeals.reduce((sum, m) => sum + (m.protein || 0), 0);
        return { totalCalories, totalProtein };
    } catch (error) {
        return { totalCalories: 0, totalProtein: 0 };
    }
}

function updateWorkoutWeekLabel() {
    if (!workoutWeekLabel || !selectedWorkoutWeekAnchor) return;
    workoutWeekLabel.textContent = formatWeekRangeLabel(selectedWorkoutWeekAnchor);
}

function setWorkoutWeekAnchor(dateIso) {
    selectedWorkoutWeekAnchor = dateIso;
    localStorage.setItem('selectedWorkoutWeekAnchor', dateIso);
    updateWorkoutWeekLabel();
}

function updateMealWeekLabel() {
    if (!mealWeekLabel || !selectedMealWeekAnchor) return;
    mealWeekLabel.textContent = formatWeekRangeLabel(selectedMealWeekAnchor);
}

function setMealWeekAnchor(dateIso) {
    selectedMealWeekAnchor = dateIso;
    localStorage.setItem('selectedMealWeekAnchor', dateIso);
    updateMealWeekLabel();
}

function updateDaySelector(dayIndex) {
    dayBtns.forEach(btn => {
        const btnDay = parseInt(btn.getAttribute('data-day'), 10);
        // Convert JS getDay() (0=Sunday) to our week index (0=Monday, 6=Sunday)
        const adjustedIndex = (dayIndex + 6) % 7;
        if (btnDay === adjustedIndex) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function clearDaySelector() {
    dayBtns.forEach(btn => btn.classList.remove('active'));
}

function updateWorkoutDaySelector(dayIndex) {
    workoutDayBtns.forEach(btn => {
        const btnDay = parseInt(btn.getAttribute('data-day'), 10);
        const adjustedIndex = (dayIndex + 6) % 7;
        if (btnDay === adjustedIndex) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function clearWorkoutDaySelector() {
    workoutDayBtns.forEach(btn => btn.classList.remove('active'));
}

// Return number of workout entries in week of provided date
async function getWorkoutEntriesThisWeek(dateIso) {
    try {
        const res = await fetchJson('api/get_workouts.php');
        const workouts = res.success ? res.data : [];
        const { startIso, endIso } = getWeekRange(dateIso);

        const weekWorkouts = workouts.filter(w => w.date >= startIso && w.date <= endIso);
        return { totalWorkoutEntriesThisWeek: weekWorkouts.length };
    } catch (err) {
        return { totalWorkoutEntriesThisWeek: 0 };
    }
}

// Show toast for workout update (bottom-right)
function showWorkoutUpdateToast(deltaWorkouts, totals) {
    let container = document.querySelector('.goal-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'goal-toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'goal-toast';

    const content = document.createElement('div');
    content.className = 'content';

    const title = document.createElement('div');
    title.className = 'title';
    title.textContent = `+${deltaWorkouts} antrenament${deltaWorkouts > 1 ? 'e' : ''}`;

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = `Sala: ${totals.totalWorkouts} / ${currentGoals.gymDaysGoal} zile`;

    content.appendChild(title);
    content.appendChild(meta);

    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-btn';
    closeBtn.innerHTML = '&times;';
    closeBtn.title = 'Închide';
    closeBtn.addEventListener('click', () => {
        toast.remove();
    });

    toast.appendChild(content);
    toast.appendChild(closeBtn);
    container.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 4200);
}

function getFieldLabel(field) {
    if (!field || !field.id) return 'acest câmp';
    const label = document.querySelector(`label[for="${field.id}"]`);
    return label ? label.textContent.trim() : 'acest câmp';
}

function validateRequiredFields(form, customMessages = {}) {
    const requiredFields = form.querySelectorAll('[required]');

    for (const field of requiredFields) {
        const value = (field.value || '').toString().trim();
        if (value !== '') continue;

        const message = customMessages[field.id] || `Completează câmpul „${getFieldLabel(field)}”.`;
        showAlert(message, 'error');

        if (field.type !== 'hidden') {
            field.focus();
        }
        return false;
    }

    return true;
}

// Event listeners pentru tab-uri
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;
        
        // Șterge clasa active de la toate
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Adaugă clasa active la tab selectat
        btn.classList.add('active');
        document.getElementById(tabName).classList.add('active');
    });
});

// Event listener pentru form antrenament
workoutForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateRequiredFields(workoutForm, {
        exercise: 'Completează numele exercițiului.',
        sets: 'Completează numărul de seturi.',
        reps: 'Completează numărul de repetări.'
    })) return;
    
    const exercise = document.getElementById('exercise').value;
    const sets = document.getElementById('sets').value;
    const reps = document.getElementById('reps').value;
    
    // Use the selected workout day (or today if none was chosen yet)
    const date = selectedWorkoutDate || formatIsoLocal(new Date());
    
    try {
        const result = await fetchJson('api/add_workout.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ exercise, sets, reps, date })
        });
        
        if (result.success) {
            const added = 1;
            const totalsWeek = await getWorkoutEntriesThisWeek(date);
            const totalsForToast = { totalWorkouts: totalsWeek.totalWorkoutEntriesThisWeek };

            showWorkoutUpdateToast(added, totalsForToast);
            workoutForm.reset();
            selectedWorkoutDate = date;
            setWorkoutWeekAnchor(date);
            localStorage.setItem('selectedWorkoutDate', date);
            loadWorkouts(date, date);
            updateProgress(selectedMealDate, date);
        } else {
            showAlert('Eroare: ' + result.message, 'error');
        }
    } catch (error) {
        showAlert('Eroare de conexiune', 'error');
        console.error(error);
    }
});

// Event listener pentru form masă
mealForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateRequiredFields(mealForm, {
        mealCategory: 'Alege categoria mesei (Mic de jun, Prânz, Cină etc.).',
        meal: 'Completează descrierea mesei.',
        calories: 'Completează numărul de calorii.',
        protein: 'Completează cantitatea de proteină.'
    })) return;

    if (!selectedMealDate) {
        showAlert('Alege mai întâi ziua în care ai luat masa.', 'error');
        return;
    }
    
    const category = document.getElementById('mealCategory').value;
    const meal = document.getElementById('meal').value;
    const calories = document.getElementById('calories').value;
    const protein = document.getElementById('protein').value;
    
    const date = selectedMealDate;

    try {
        const result = await fetchJson('api/add_meal.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ category, meal, calories, protein, date })
        });
        
        if (result.success) {
            const addedCalories = Number(calories) || 0;
            const addedProtein = Number(protein) || 0;

            // Get updated totals for the selected date (includes the newly added meal)
            const totals = await getTotalsForDate(date);

            showGoalUpdateToast(addedCalories, addedProtein, totals);
            mealForm.reset();
            selectedMealDate = date;
            localStorage.setItem('selectedMealDate', date);
            const jsDay = new Date(date.split('-')[0], date.split('-')[1] - 1, date.split('-')[2]).getDay();
            updateDaySelector(jsDay);
            loadMeals(date);
            updateProgress(date, selectedWorkoutWeekAnchor);
        } else {
            showAlert('Eroare: ' + result.message, 'error');
        }
    } catch (error) {
        showAlert('Eroare de conexiune', 'error');
        console.error(error);
    }
});

// Event listeners pentru formulare obiective separate
if (nutritionGoalsForm) {
    nutritionGoalsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validateRequiredFields(nutritionGoalsForm, {
            proteinGoal: 'Completează obiectivul zilnic de proteină.',
            caloriesGoal: 'Completează obiectivul zilnic de calorii.'
        })) return;
        const proteinGoal = document.getElementById('proteinGoal').value;
        const caloriesGoal = document.getElementById('caloriesGoal').value;
        const gymDaysGoal = currentGoals.gymDaysGoal; // keep existing weekly goal

        try {
            const result = await fetchJson('api/set_goals.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ proteinGoal, caloriesGoal, gymDaysGoal })
            });

            if (result.success) {
                currentGoals = { proteinGoal: parseInt(proteinGoal), caloriesGoal: parseInt(caloriesGoal), gymDaysGoal: parseInt(gymDaysGoal) };
                showAlert('Obiective nutriție salvate!', 'info');
                updateProgress();
            } else {
                showAlert('Eroare: ' + result.message, 'error');
            }
        } catch (error) {
            showAlert('Eroare de conexiune', 'error');
            console.error(error);
        }
    });
}

if (workoutGoalsForm) {
    workoutGoalsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validateRequiredFields(workoutGoalsForm, {
            gymDaysGoal: 'Completează câte zile de sală vrei pe săptămână.'
        })) return;
        const gymDaysGoal = document.getElementById('gymDaysGoal').value;
        const proteinGoal = currentGoals.proteinGoal;
        const caloriesGoal = currentGoals.caloriesGoal;

        try {
            const result = await fetchJson('api/set_goals.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ proteinGoal, caloriesGoal, gymDaysGoal })
            });

            if (result.success) {
                currentGoals = { proteinGoal: parseInt(proteinGoal), caloriesGoal: parseInt(caloriesGoal), gymDaysGoal: parseInt(gymDaysGoal) };
                showAlert('Obiective antrenamente salvate!', 'info');
                updateProgress();
            } else {
                showAlert('Eroare: ' + result.message, 'error');
            }
        } catch (error) {
            showAlert('Eroare de conexiune', 'error');
            console.error(error);
        }
    });
}

// Încarcă antrenamentele pentru săptămâna selectată și ziua aleasă
async function loadWorkouts(anchorDate = null, dayDate = null) {
    const today = formatIsoLocal(new Date());
    const activeAnchor = anchorDate || selectedWorkoutWeekAnchor || document.getElementById('workoutDate')?.value || today;
    setWorkoutWeekAnchor(activeAnchor);
    const activeDay = dayDate || selectedWorkoutDate || today;

    try {
        const result = await fetchJson('api/get_workouts.php');
        if (result.success) {
            const data = result.data || [];
            const { startIso, endIso } = getWeekRange(activeAnchor);
            const dayData = data.filter(w => w.date >= startIso && w.date <= endIso && w.date === activeDay);
            displayWorkouts(dayData);
        } else {
            workoutsList.innerHTML = `<div class="empty-message">${result.message || 'Eroare la încărcarea antrenamentelor'}</div>`;
        }
    } catch (error) {
        showAlert('Eroare de conexiune', 'error');
        console.error(error);
    }
}

// Afișează antrenamentele
function displayWorkouts(workouts) {
    if (workouts.length === 0) {
        workoutsList.innerHTML = '<div class="empty-message">Niciun antrenament salvat</div>';
        return;
    }
    
    workoutsList.innerHTML = workouts.map(w => `
        <div class="card">
            <div class="card-content">
                <div class="card-title">${w.exercise}</div>
                <div class="card-info">
                    <span>${w.sets} seturi × ${w.reps} repetări</span>
                    <span class="card-date">${w.date}</span>
                </div>
            </div>
            <button class="btn btn-danger" onclick="deleteWorkout('${w._id}')">Șterge</button>
        </div>
    `).join('');
}

// Șterge antrenament
async function deleteWorkout(id) {
    const confirmed = await showConfirmDialog('Ștergi acest antrenament?');
    if (!confirmed) return;
    
    try {
        const result = await fetchJson('api/delete_workout.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        });
        
        if (result.success) {
            showAlert('Antrenament șters', 'success');
            const today = formatIsoLocal(new Date());
            const anchor = selectedWorkoutWeekAnchor || localStorage.getItem('selectedWorkoutWeekAnchor') || today;
            loadWorkouts(anchor, selectedWorkoutDate || today);
            updateProgress(selectedMealDate, anchor);
        } else {
            showAlert('Eroare: ' + result.message, 'error');
        }
    } catch (error) {
        showAlert('Eroare de conexiune', 'error');
        console.error(error);
    }
}

// Încarcă mese (opțional filtrează după dată YYYY-MM-DD)
async function loadMeals(filterDate = null, endDate = null) {
    try {
        const result = await fetchJson('api/get_meals.php');
        if (result.success) {
            let data = result.data || [];
            if (filterDate) {
                if (endDate) {
                    // Range filter (for week view)
                    data = data.filter(m => m.date >= filterDate && m.date <= endDate);
                } else {
                    // Single date filter
                    data = data.filter(m => m.date === filterDate);
                }
            }
            displayMeals(data);
        } else {
            mealsList.innerHTML = `<div class="empty-message">${result.message || 'Eroare la încărcarea mesei'}</div>`;
        }
    } catch (error) {
        showAlert('Eroare de conexiune', 'error');
        console.error(error);
    }
}

function showMealDayPlaceholder() {
    if (mealsList) {
        mealsList.innerHTML = '<div class="empty-message">Alege o zi ca să vezi mesele din acea zi</div>';
    }
}

// Afișează mese
function displayMeals(meals) {
    if (meals.length === 0) {
        mealsList.innerHTML = '<div class="empty-message">Nicio masă salvată</div>';
        return;
    }
    
    mealsList.innerHTML = meals.map(m => `
        <div class="card">
            <div class="card-content">
                <div class="card-title-with-badge">
                    <div>${m.meal}</div>
                    <span class="meal-category-badge">${m.category || 'Altele'}</span>
                </div>
                <div class="card-info">
                    <span>${m.calories} kcal</span>
                    <span>${m.protein}g proteină</span>
                    <span class="card-date">${m.date}</span>
                </div>
            </div>
            <button class="btn btn-danger" onclick="deleteMeal('${m._id}')">Șterge</button>
        </div>
    `).join('');
}

// Șterge masă
async function deleteMeal(id) {
    const confirmed = await showConfirmDialog('Ștergi această masă?');
    if (!confirmed) return;
    
    try {
        const result = await fetchJson('api/delete_meal.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        });
        
        if (result.success) {
            showAlert('Masă ștearsă', 'success');
            const today = formatIsoLocal(new Date());
            const activeMealDate = selectedMealDate || localStorage.getItem('selectedMealDate') || today;
            loadMeals(activeMealDate);
            updateProgress(activeMealDate, selectedWorkoutWeekAnchor);
        } else {
            showAlert('Eroare: ' + result.message, 'error');
        }
    } catch (error) {
        showAlert('Eroare de conexiune', 'error');
        console.error(error);
    }
}

// Afișează alert
function showAlert(message, type) {
    let container = document.querySelector('.alert-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'alert-toast-container';
        document.body.appendChild(container);
    }

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-toast`;
    alertDiv.textContent = message;
    container.appendChild(alertDiv);

    requestAnimationFrame(() => alertDiv.classList.add('show'));

    setTimeout(() => {
        alertDiv.classList.remove('show');
        setTimeout(() => alertDiv.remove(), 280);
    }, 3000);
}

// Create a calendar for a month and attach selection handler
function buildCalendar(year, month, selectedDate, onSelect, counts = {}) {
    const first = new Date(year, month, 1);
    // Start week on Monday: convert JS Sunday=0 to Monday-first offset
    const startDay = (first.getDay() + 6) % 7; // 0..6 where 0 = Monday
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const grid = document.createElement('div');
    grid.className = 'calendar-grid';

    const names = ['Mo','Tu','We','Th','Fr','Sa','Su'];
    names.forEach(n => {
        const el = document.createElement('div');
        el.className = 'day-name';
        el.textContent = n;
        grid.appendChild(el);
    });

    // pad empty cells until startDay (week starts Monday)
    for (let i = 0; i < startDay; i++) {
        const empty = document.createElement('div');
        grid.appendChild(empty);
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const btn = document.createElement('button');
        btn.className = 'day';
        btn.textContent = String(d);
        const iso = formatIsoLocal(new Date(year, month, d));
        if (selectedDate === iso) btn.classList.add('selected');

        // badges if counts provided
        const cnt = counts[iso];
        if (cnt) {
            if (cnt.meals && cnt.meals > 0) {
                const b = document.createElement('span');
                b.className = 'calendar-day-badge meals';
                b.textContent = String(cnt.meals);
                btn.appendChild(b);
            }
            if (cnt.workouts && cnt.workouts > 0) {
                const b2 = document.createElement('span');
                b2.className = 'calendar-day-badge workouts';
                b2.textContent = String(cnt.workouts);
                btn.appendChild(b2);
            }
        }

        btn.addEventListener('click', () => onSelect(iso));
        grid.appendChild(btn);
    }

    return grid;
}

// Show a custom calendar popover anchored to an input element
function showCalendarPopover(input) {
    // remove existing
    const existing = document.querySelector('.calendar-popover');
    if (existing) existing.remove();

    const rect = input.getBoundingClientRect();
    const pop = document.createElement('div');
    pop.className = 'calendar-popover';

    const header = document.createElement('div');
    header.className = 'cal-header';

    const title = document.createElement('div');
    title.className = 'cal-title';

    const nav = document.createElement('div');
    nav.className = 'cal-nav';

    const prev = document.createElement('button');
    prev.textContent = '<';
    const next = document.createElement('button');
    next.textContent = '>';

    nav.appendChild(prev);
    nav.appendChild(next);
    header.appendChild(title);
    header.appendChild(nav);
    pop.appendChild(header);

    // position
    pop.style.top = (rect.bottom + window.scrollY + 8) + 'px';
    pop.style.left = (rect.left + window.scrollX) + 'px';

    // parse current month
    const todayVal = input.value || new Date().toISOString().split('T')[0];
    let [y,m,day] = todayVal.split('-').map(Number);
    let currentYear = y;
    let currentMonth = m - 1;

    // fetch counts (meals/workouts) for the month
    async function fetchCountsForMonth(year, month) {
        try {
            const mealsRes = await fetchJson('api/get_meals.php');
            const workoutsRes = await fetchJson('api/get_workouts.php');
            const meals = mealsRes.success ? mealsRes.data : [];
            const workouts = workoutsRes.success ? workoutsRes.data : [];

            const map = {};
            const monthStr = String(month + 1).padStart(2, '0');
            const prefix = `${year}-${monthStr}-`;

            meals.forEach(mr => {
                if (!mr.date || !mr.date.startsWith(prefix)) return;
                map[mr.date] = map[mr.date] || { meals: 0, workouts: 0 };
                map[mr.date].meals += 1;
            });

            workouts.forEach(wr => {
                if (!wr.date || !wr.date.startsWith(prefix)) return;
                map[wr.date] = map[wr.date] || { meals: 0, workouts: 0 };
                map[wr.date].workouts += 1;
            });

            return map;
        } catch (e) {
            return {};
        }
    }

    async function render() {
        title.textContent = new Date(currentYear, currentMonth, 1).toLocaleString(undefined, { month: 'long', year: 'numeric' });
        // remove old grid
        const old = pop.querySelector('.calendar-grid');
        if (old) old.remove();
        const selIso = input.value || null;
        const counts = await fetchCountsForMonth(currentYear, currentMonth);
        const grid = buildCalendar(currentYear, currentMonth, selIso, (iso) => {
            input.value = iso;
            // persist selected meal/workout date
            if (input.id === 'mealDate') localStorage.setItem('selectedMealDate', iso);
            if (input.id === 'workoutDate') localStorage.setItem('selectedWorkoutDate', iso);
            if (input.id === 'mealDate') {
                loadMeals(iso);
                updateProgress(iso, null);
            }
            if (input.id === 'workoutDate') {
                loadWorkouts(iso);
                updateProgress(null, iso);
            }
            pop.remove();
        }, counts);
        pop.appendChild(grid);
        // show animation
        requestAnimationFrame(() => pop.classList.add('show'));
    }

    prev.addEventListener('click', async () => { currentMonth--; if (currentMonth < 0) { currentMonth = 11; currentYear--; } await render(); });
    next.addEventListener('click', async () => { currentMonth++; if (currentMonth > 11) { currentMonth = 0; currentYear++; } await render(); });

    document.body.appendChild(pop);
    render();

    // click outside closes
    const onDocClick = (e) => {
        if (!pop.contains(e.target) && e.target !== input) { pop.remove(); document.removeEventListener('click', onDocClick); }
    };
    setTimeout(() => document.addEventListener('click', onDocClick), 20);
}

// Obține totalurile pentru ziua curentă (calorii și proteină)
async function getTodayTotals() {
    const today = new Date().toISOString().split('T')[0];
    try {
        const result = await fetchJson('api/get_meals.php');
        const meals = result.success ? result.data : [];
        const todayMeals = meals.filter(m => m.date === today);
        const totalCalories = todayMeals.reduce((s, m) => s + (m.calories || 0), 0);
        const totalProtein = todayMeals.reduce((s, m) => s + (m.protein || 0), 0);
        return { totalCalories, totalProtein };
    } catch (err) {
        return { totalCalories: 0, totalProtein: 0 };
    }
}

// Obține totalurile pentru o anumită dată (calorii și proteină)
async function getTotalsForDate(dateIso) {
    try {
        const result = await fetchJson('api/get_meals.php');
        const meals = result.success ? result.data : [];
        const mealsForDate = meals.filter(m => m.date === dateIso);
        const totalCalories = mealsForDate.reduce((s, m) => s + (m.calories || 0), 0);
        const totalProtein = mealsForDate.reduce((s, m) => s + (m.protein || 0), 0);
        return { totalCalories, totalProtein };
    } catch (err) {
        return { totalCalories: 0, totalProtein: 0 };
    }
}

// Afișează un toast în dreapta-jos cu update-ul pentru obiective
function showGoalUpdateToast(deltaCalories, deltaProtein, totals) {
    let container = document.querySelector('.goal-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'goal-toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'goal-toast';

    const content = document.createElement('div');
    content.className = 'content';

    const title = document.createElement('div');
    title.className = 'title';
    title.textContent = `+${deltaCalories} kcal • +${deltaProtein} g proteină`;

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = `Progres: ${totals.totalCalories} / ${currentGoals.caloriesGoal} kcal • ${totals.totalProtein.toFixed(1)} / ${currentGoals.proteinGoal} g`;

    content.appendChild(title);
    content.appendChild(meta);

    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-btn';
    closeBtn.innerHTML = '&times;';
    closeBtn.title = 'Închide';
    closeBtn.addEventListener('click', () => {
        toast.remove();
    });

    toast.appendChild(content);
    toast.appendChild(closeBtn);
    container.appendChild(toast);

    // Force show animation
    requestAnimationFrame(() => toast.classList.add('show'));

    // Auto remove after 4s
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Încarcă goals
async function loadGoals() {
    try {
        const result = await fetchJson('api/get_goals.php');
        
        if (result.success && result.data) {
            currentGoals = result.data;
            document.getElementById('proteinGoal').value = currentGoals.proteinGoal;
            document.getElementById('caloriesGoal').value = currentGoals.caloriesGoal;
            document.getElementById('gymDaysGoal').value = currentGoals.gymDaysGoal;
            updateProgress();
        }
    } catch (error) {
        console.error('Eroare la încărcarea obiectivelor:', error);
    }
}

// Actualizează progresul pe zi (mese) + săptămână (antrenamente)
async function updateProgress(mealDate = null, workoutDate = null) {
    const today = formatIsoLocal(new Date());
    const mealIso = mealDate || selectedMealDate || null;
    const workoutIso = workoutDate || selectedWorkoutWeekAnchor || today;

    if (mealDate) {
        selectedMealDate = mealDate;
    }
    if (workoutDate) {
        selectedWorkoutWeekAnchor = workoutDate;
    }
    updateWorkoutWeekLabel();

    try {
        const nutritionTotals = mealIso ? await getTotalsForDate(mealIso) : { totalCalories: 0, totalProtein: 0 };
        const weekTotals = await getWorkoutEntriesThisWeek(workoutIso);

        const totalCalories = nutritionTotals.totalCalories || 0;
        const totalProtein = nutritionTotals.totalProtein || 0;
        const totalWorkoutEntriesThisWeek = weekTotals.totalWorkoutEntriesThisWeek || 0;

        const caloriesPercent = Math.min(100, Math.round((totalCalories / currentGoals.caloriesGoal) * 100));
        const proteinPercent = Math.min(100, Math.round((totalProtein / currentGoals.proteinGoal) * 100));
        const workoutPercent = Math.min(100, Math.round((totalWorkoutEntriesThisWeek / currentGoals.gymDaysGoal) * 100));

        if (nutritionProgressContainer) {
            nutritionProgressContainer.innerHTML = `
                <div class="progress-item">
                    <div class="progress-header">
                        <span class="progress-label">Calorii</span>
                        <span class="progress-value">${totalCalories} / ${currentGoals.caloriesGoal} kcal</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${caloriesPercent}%"></div>
                    </div>
                </div>

                <div class="progress-item">
                    <div class="progress-header">
                        <span class="progress-label">Proteine</span>
                        <span class="progress-value">${totalProtein.toFixed(1)} / ${currentGoals.proteinGoal} g</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${proteinPercent}%"></div>
                    </div>
                </div>
            `;
        }

        if (workoutProgressContainer) {
            workoutProgressContainer.innerHTML = `
                <div class="progress-item">
                    <div class="progress-header">
                        <span class="progress-label">Sala (săptămânal)</span>
                        <span class="progress-value">${totalWorkoutEntriesThisWeek} / ${currentGoals.gymDaysGoal} zile</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${workoutPercent}%"></div>
                    </div>
                    <div class="progress-week-range">${formatWeekRangeLabel(workoutIso)}</div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Eroare la actualizarea progresului:', error);
    }
}

// Inițializare la încărcarea paginii
document.addEventListener('DOMContentLoaded', () => {
    const today = formatIsoLocal(new Date());
    const mealInput = document.getElementById('mealDate');
    const workoutInput = document.getElementById('workoutDate');

    selectedMealDate = localStorage.getItem('selectedMealDate') || today;
    const savedWorkoutDate = localStorage.getItem('selectedWorkoutDate') || today;
    selectedWorkoutWeekAnchor = localStorage.getItem('selectedWorkoutWeekAnchor') || savedWorkoutDate;
    selectedMealWeekAnchor = localStorage.getItem('selectedMealWeekAnchor') || today;
    selectedWorkoutDate = localStorage.getItem('selectedWorkoutDate') || savedWorkoutDate;

    if (mealInput) {
        mealInput.value = selectedMealDate;
        mealInput.addEventListener('change', () => {
            selectedMealDate = mealInput.value || today;
            localStorage.setItem('selectedMealDate', selectedMealDate);
            loadMeals(selectedMealDate);
            updateProgress(selectedMealDate, selectedWorkoutWeekAnchor);
        });
    }

    if (workoutInput) {
        workoutInput.value = savedWorkoutDate;
        workoutInput.addEventListener('change', () => {
            const picked = workoutInput.value || today;
            localStorage.setItem('selectedWorkoutDate', picked);
            selectedWorkoutDate = picked;
            setWorkoutWeekAnchor(picked);
            updateWorkoutDaySelector(new Date(picked.split('-')[0], picked.split('-')[1] - 1, picked.split('-')[2]).getDay());
            loadWorkouts(picked, picked);
            updateProgress(selectedMealDate, picked);
        });
    }

    if (workoutWeekPrev) {
        workoutWeekPrev.addEventListener('click', () => {
            const { start } = getWeekRange(selectedWorkoutWeekAnchor || today);
            start.setDate(start.getDate() - 7);
            const prevWeek = formatIsoLocal(start);
            setWorkoutWeekAnchor(prevWeek);
            if (workoutInput) workoutInput.value = prevWeek;
            if (selectedWorkoutDate) {
                const weekday = new Date(selectedWorkoutDate.split('-')[0], selectedWorkoutDate.split('-')[1] - 1, selectedWorkoutDate.split('-')[2]).getDay();
                const prevSelected = new Date(start);
                prevSelected.setDate(prevSelected.getDate() + (weekday === 0 ? 6 : weekday - 1));
                selectedWorkoutDate = formatIsoLocal(prevSelected);
                updateWorkoutDaySelector(weekday);
            }
            loadWorkouts(prevWeek, selectedWorkoutDate || prevWeek);
            updateProgress(selectedMealDate, prevWeek);
        });
    }

    if (workoutWeekNext) {
        workoutWeekNext.addEventListener('click', () => {
            const { start } = getWeekRange(selectedWorkoutWeekAnchor || today);
            start.setDate(start.getDate() + 7);
            const nextWeek = formatIsoLocal(start);
            setWorkoutWeekAnchor(nextWeek);
            if (workoutInput) workoutInput.value = nextWeek;
            if (selectedWorkoutDate) {
                const weekday = new Date(selectedWorkoutDate.split('-')[0], selectedWorkoutDate.split('-')[1] - 1, selectedWorkoutDate.split('-')[2]).getDay();
                const nextSelected = new Date(start);
                nextSelected.setDate(nextSelected.getDate() + (weekday === 0 ? 6 : weekday - 1));
                selectedWorkoutDate = formatIsoLocal(nextSelected);
                updateWorkoutDaySelector(weekday);
            }
            loadWorkouts(nextWeek, selectedWorkoutDate || nextWeek);
            updateProgress(selectedMealDate, nextWeek);
        });
    }

    if (workoutWeekCurrent) {
        workoutWeekCurrent.addEventListener('click', () => {
            setWorkoutWeekAnchor(today);
            if (workoutInput) workoutInput.value = today;
            localStorage.setItem('selectedWorkoutDate', today);
            selectedWorkoutDate = today;
            updateWorkoutDaySelector(new Date(today.split('-')[0], today.split('-')[1] - 1, today.split('-')[2]).getDay());
            loadWorkouts(today, today);
            updateProgress(selectedMealDate, today);
        });
    }

    if (workoutDayBtns) {
        workoutDayBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const dayOffset = parseInt(btn.getAttribute('data-day'), 10);
                const { start } = getWeekRange(selectedWorkoutWeekAnchor || today);
                const selectedDay = new Date(start);
                selectedDay.setDate(selectedDay.getDate() + dayOffset);
                const selectedDayIso = formatIsoLocal(selectedDay);
                selectedWorkoutDate = selectedDayIso;
                localStorage.setItem('selectedWorkoutDate', selectedDayIso);
                if (workoutInput) workoutInput.value = selectedDayIso;
                updateWorkoutDaySelector(selectedDay.getDay());
                loadWorkouts(selectedWorkoutWeekAnchor || today, selectedDayIso);
                updateProgress(selectedMealDate, selectedWorkoutWeekAnchor);
            });
        });
    }

    // Meal week navigation
    if (mealWeekPrev) {
        mealWeekPrev.addEventListener('click', () => {
            const { start } = getWeekRange(selectedMealWeekAnchor || today);
            start.setDate(start.getDate() - 7);
            const prevWeek = formatIsoLocal(start);
            setMealWeekAnchor(prevWeek);
            clearDaySelector();
            selectedMealDate = null;
            if (mealInput) mealInput.value = '';
            showMealDayPlaceholder();
            updateProgress(null, selectedWorkoutWeekAnchor);
        });
    }

    if (mealWeekNext) {
        mealWeekNext.addEventListener('click', () => {
            const { start } = getWeekRange(selectedMealWeekAnchor || today);
            start.setDate(start.getDate() + 7);
            const nextWeek = formatIsoLocal(start);
            setMealWeekAnchor(nextWeek);
            clearDaySelector();
            selectedMealDate = null;
            if (mealInput) mealInput.value = '';
            showMealDayPlaceholder();
            updateProgress(null, selectedWorkoutWeekAnchor);
        });
    }

    if (mealWeekCurrent) {
        mealWeekCurrent.addEventListener('click', () => {
            setMealWeekAnchor(today);
            clearDaySelector();
            selectedMealDate = null;
            if (mealInput) mealInput.value = '';
            showMealDayPlaceholder();
            updateProgress(null, selectedWorkoutWeekAnchor);
        });
    }

    // Day selector buttons
    dayBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const dayOffset = parseInt(btn.getAttribute('data-day'), 10);
            const { start } = getWeekRange(selectedMealWeekAnchor || today);
            const selectedDay = new Date(start);
            selectedDay.setDate(selectedDay.getDate() + dayOffset);
            const selectedDayIso = formatIsoLocal(selectedDay);
            selectedMealDate = selectedDayIso;
            localStorage.setItem('selectedMealDate', selectedDayIso);
            if (mealInput) mealInput.value = selectedDayIso;
            const jsDay = selectedDay.getDay();
            updateDaySelector(jsDay);
            loadMeals(selectedDayIso);
            updateProgress(selectedDayIso, selectedWorkoutWeekAnchor);
        });
    });
    updateWorkoutWeekLabel();
    updateMealWeekLabel();
    
    updateWorkoutDaySelector(new Date(selectedWorkoutDate.split('-')[0], selectedWorkoutDate.split('-')[1] - 1, selectedWorkoutDate.split('-')[2]).getDay());
    loadWorkouts(selectedWorkoutWeekAnchor, selectedWorkoutDate);
    loadGoals();
    selectedMealDate = null;
    clearDaySelector();
    showMealDayPlaceholder();
    updateProgress(null, selectedWorkoutWeekAnchor);
});
