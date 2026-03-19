// Инициализация иконок и навигации
window.onload = () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
};

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

// Функция переключения основных вкладок
function switchView(viewId, navElement) {
    // Скрываем все вклады
    document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
    // Показываем выбранную
    document.getElementById(viewId).classList.add('active');

    // Меняем активную кнопку в меню
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    navElement.classList.add('active');
    
    // Перерисовываем иконки (на случай, если они внутри новых элементов)
    lucide.createIcons();
}

// Функция переключения сегментов на Складе (Продукты/Заготовки/Блюда)
function switchSubTab(targetId, btnElement) {
    document.querySelectorAll('.subview').forEach(el => el.classList.remove('active'));
    document.getElementById('subview-' + targetId).classList.add('active');

    document.querySelectorAll('.seg-btn').forEach(el => el.classList.remove('active'));
    btnElement.classList.add('active');
}

// --- УПРАВЛЕНИЕ МОДАЛЬНЫМИ ОКНАМИ ---
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    } else {
        console.error('Модальное окно не найдено:', modalId);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Закрытие при клике на темный фон
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('active');
    }
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
