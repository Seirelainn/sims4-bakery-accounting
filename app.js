// --- БАЗА ДАННЫХ ---
let db = {
    transactions: [],
    purchases: [],
    warehouse: {
        products: [],
        preps: [],
        dishes: []
    },
    kitchenHistory: [],
    salesHistory: []
};

// --- НАВИГАЦИЯ ---
function switchView(viewId, navElement) {
    document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');

    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    navElement.classList.add('active');
}

// --- ПОД-ВКЛАДКИ СКЛАДА (Сегмент-панель) ---
function switchSubTab(type, element) {
    // Активный стиль кнопки
    document.querySelectorAll('.segment-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');

    // Меняем текст подсказки в зависимости от типа
    const emptyText = document.getElementById('warehouse-empty-text');
    const labels = {
        'products': 'продуктов',
        'preps': 'заготовок',
        'dishes': 'блюд'
    };
    
    emptyText.innerText = `Здесь будут показаны остатки ${labels[type]}`;
    
    // Здесь позже будет вызов отрисовки конкретной категории:
    // renderWarehouse(type);
}

// --- МОДАЛКИ ---
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Закрытие по клику на фон
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function(e) {
        if (e.target === this) closeModal(this.id);
    });
});

// --- ЛОГИКА ---
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
        amount: -Math.abs(amount)
    };

    db.transactions.push(newExpense);
    console.log('Сохранен расход:', newExpense);
    
    closeModal('modal-expense');
    
    // Скрываем empty state если есть данные (пример)
    document.querySelector('#view-dashboard .empty-state').style.display = 'none';
}

window.onload = () => {
    console.log("Bakery Ledger Ready!");
};
