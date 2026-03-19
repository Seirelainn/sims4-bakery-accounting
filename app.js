// --- БАЗА ДАННЫХ И СОСТОЯНИЕ (Подготовка под Google Apps Script) ---
// В будущем эти данные мы будем подтягивать из Google Таблиц
let db = {
    transactions: [], // Главная: доходы/расходы
    purchases: [],    // Закупки (с массивом продуктов внутри)
    warehouse: {
        products: [],
        preps: [],
        dishes: []
    },
    kitchenHistory: [], // История готовки
    salesHistory: []    // История продаж
};

// --- НАВИГАЦИЯ ПО ВКЛАДКАМ ---
function switchView(viewId, navElement) {
    // Скрываем все экраны
    document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
    // Показываем нужный
    document.getElementById(viewId).classList.add('active');

    // Обновляем активную кнопку в меню
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    navElement.classList.add('active');
}

// --- УПРАВЛЕНИЕ МОДАЛЬНЫМИ ОКНАМИ ---
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Пример: Закрытие модалки при клике на темный фон
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });
});

// --- БИЗНЕС-ЛОГИКА (Пример сохранения расхода) ---
function saveExpense() {
    const day = document.getElementById('exp-day').value;
    const season = document.getElementById('exp-season').value;
    const cycle = document.getElementById('exp-cycle').value;
    const desc = document.getElementById('exp-desc').value;
    const amount = parseFloat(document.getElementById('exp-amount').value);

    if (!day || !cycle || !desc || isNaN(amount)) {
        alert('Пожалуйста, заполните все поля');
        return;
    }

    const newExpense = {
        id: Date.now(),
        date: { day, season, cycle },
        type: 'расход',
        description: desc,
        amount: -Math.abs(amount) // Расход всегда с минусом
    };

    // Добавляем в локальную базу
    db.transactions.push(newExpense);
    
    // TODO: Здесь будет вызов Google Apps Script:
    // google.script.run.withSuccessHandler(updateUI).addTransaction(newExpense);

    console.log('Сохранен расход:', newExpense);
    
    // Закрываем окно и очищаем форму
    closeModal('modal-expense');
    document.getElementById('exp-desc').value = '';
    document.getElementById('exp-amount').value = '';
    
    // Перерисовываем интерфейс (функцию напишем позже)
    // renderDashboard();
}

// Инициализация при старте
window.onload = () => {
    console.log("Приложение загружено, готово к работе с Apps Script!");
    // renderDashboard();
};
