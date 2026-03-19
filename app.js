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

// --- ФУНКЦИИ ИНТЕРФЕЙСА МОДАЛОК ---

// Создает поле с маской ($ или шт) внутри
function createUnitInput(placeholder, unit, flex = 1) {
    return `
        <div class="input-unit-wrapper" style="flex: ${flex};" data-unit="${unit}">
            <input type="number" class="input w-full" placeholder="${placeholder}">
        </div>
    `;
}

// --- ФУНКЦИИ ДОБАВЛЕНИЯ СТРОК (ДЛЯ КНОПОК "+") ---

function addPurchaseRow() {
    const container = document.getElementById('purchase-items-container');
    const row = document.createElement('div');
    row.className = 'dynamic-row';
    row.innerHTML = `
        <select class="input" style="flex: 2;">
            <option value="">Продукт</option>
            <option value="Мука">Мука</option>
            <option value="Яйца">Яйца</option>
            <option value="Сахар">Сахар</option>
            <option value="Молоко">Молоко</option>
        </select>
        ${createUnitInput('Кол-во', 'шт')}
        ${createUnitInput('Цена', '$')}
        <button class="icon-btn text-red" style="width: 36px;" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
    `;
    container.appendChild(row);
}

function addIngredientRow(containerId) {
    const container = document.getElementById(containerId);
    const row = document.createElement('div');
    row.className = 'dynamic-row';
    row.innerHTML = `
        <select class="input" style="flex: 2;"><option value="">Ингредиент</option><option value="Мука">Мука</option></select>
        ${createUnitInput('Ед.', 'шт')}
        <button class="icon-btn text-red" style="width: 36px;" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
    `;
    container.appendChild(row);
}

function addSaleRow() {
    const container = document.getElementById('sale-items-container');
    const row = document.createElement('div');
    row.className = 'dynamic-row';
    row.innerHTML = `
        <select class="input" style="flex: 2;"><option value="">Блюдо</option></select>
        ${createUnitInput('Порц.', 'шт')}
        ${createUnitInput('Сумма', '$')}
        <button class="icon-btn text-red" style="width: 36px;" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
    `;
    container.appendChild(row);
}

function handleDishSelection() {
    const select = document.getElementById('cook-dish-select');
    const editBtn = document.getElementById('btn-edit-dish');
    const detailsBlock = document.getElementById('cook-details');

    if (select.value === 'empty') {
        editBtn.classList.add('hidden');
        detailsBlock.classList.add('hidden');
    } else if (select.value === 'new') {
        select.value = 'empty';
        openModal('modal-dish-edit');
    } else {
        editBtn.classList.remove('hidden');
        detailsBlock.classList.remove('hidden');
    }
}

let recipeCounter = 0;
function addRecipeCard() {
    recipeCounter++;
    const container = document.getElementById('recipes-container');
    const card = document.createElement('div');
    card.className = 'recipe-card';
    const listId = `recipe-${recipeCounter}-ingredients`;
    card.innerHTML = `
        <div class="flex-between mb-2">
            <input type="text" class="input w-full" placeholder="Название рецепта">
            <button class="icon-btn text-red ml-2" onclick="this.parentElement.parentElement.remove()"><i class="fas fa-trash"></i></button>
        </div>
        <div id="${listId}"></div>
        <button class="text-btn mt-2" onclick="addIngredientRow('${listId}')">+ Добавить ингредиент</button>
    `;
    container.appendChild(card);
}

function saveDishEdit() {
    // Временная заглушка
    alert('Блюдо сохранено в список!');
    closeModal('modal-dish-edit');
}

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
    updateUI();
    closeModal('modal-expense');
    
    // Скрываем empty state если есть данные (пример)
    document.querySelector('#view-dashboard .empty-state').style.display = 'none';
}

// 2. Сохранение закупки
function savePurchase() {
    const rows = document.querySelectorAll('#purchase-items-container .dynamic-row');
    let total = 0;
    let itemsNames = [];

    rows.forEach(row => {
        const qty = parseFloat(row.querySelectorAll('input')[0].value);
        const price = parseFloat(row.querySelectorAll('input')[1].value);
        const name = row.querySelector('select').value;
        if (name && qty && price) {
            total += (qty * price);
            itemsNames.push(name);
        }
    });

    if (document.getElementById('purchase-delivery').checked) total += 20;

    const entry = {
        id: Date.now(),
        type: 'расход',
        description: `Закупка: ${itemsNames.join(', ')}`,
        amount: -total,
        date: `${document.getElementById('pur-day').value} ${document.getElementById('pur-season').value}`
    };

    db.transactions.push(entry);
    updateUI();
    closeModal('modal-purchase');
}

// --- ОБНОВЛЕНИЕ ИНТЕРФЕЙСА (РЕНДЕР) ---

function updateUI() {
    const historyContainer = document.getElementById('dashboard-history');
    const totalProfitEl = document.getElementById('total-profit');
    
    let html = '';
    let balance = 0;

    // Идем по транзакциям с конца, чтобы новые были сверху
    [...db.transactions].reverse().forEach(t => {
        balance += t.amount;
        const colorClass = t.amount >= 0 ? 'text-green' : 'text-red';
        html += `
            <div class="history-item">
                <div>
                    <div style="font-weight: 600;">${t.description}</div>
                    <div style="font-size: 11px; color: #808080;">${t.date}</div>
                </div>
                <div class="${colorClass}">${t.amount} $</div>
            </div>
        `;
    });

    historyContainer.innerHTML = html;
    totalProfitEl.innerText = `${balance} $`;
}

// Инициализация
window.onload = updateUI;
