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

function addPurchaseRow() {
    const container = document.getElementById('purchase-items-container');
    const row = document.createElement('div');
    row.className = 'dynamic-row';
    row.innerHTML = `
        <select class="input" style="flex: 2;"><option>Выберите продукт</option></select>
        <input type="number" class="input" style="flex: 1;" placeholder="Кол-во">
        <input type="number" class="input" style="flex: 1;" placeholder="Цена $">
        <button class="icon-btn text-red" style="width: 36px;" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
    `;
    container.appendChild(row);
}

function addIngredientRow(containerId) {
    const container = document.getElementById(containerId);
    const row = document.createElement('div');
    row.className = 'dynamic-row';
    row.innerHTML = `
        <select class="input" style="flex: 2;"><option>Продукт/Заготовка</option></select>
        <input type="number" class="input" style="flex: 1;" placeholder="Ед.">
        <button class="icon-btn text-red" style="width: 36px;" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
    `;
    container.appendChild(row);
}

function addSaleRow() {
    const container = document.getElementById('sale-items-container');
    const row = document.createElement('div');
    row.className = 'dynamic-row';
    row.innerHTML = `
        <select class="input" style="flex: 2;"><option>Выберите блюдо</option></select>
        <input type="number" class="input" style="flex: 1;" placeholder="Порц.">
        <input type="number" class="input" style="flex: 1;" placeholder="Сумма $">
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
        <button class="text-btn mt-2" onclick="addIngredientRow('${listId}')">+ Ингредиент</button>
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
    
    closeModal('modal-expense');
    
    // Скрываем empty state если есть данные (пример)
    document.querySelector('#view-dashboard .empty-state').style.display = 'none';
}

window.onload = () => {
    console.log("Bakery Ledger Ready!");
};
