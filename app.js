// ============================
// TELEGRAM MINI APP - NAIL SAKURA
// ============================

// Глобальные переменные
let tg = null;
let currentScreen = 'main';
let selectedService = null;
let bookingData = {
    service: null,
    date: null,
    time: null
};

// Услуги
const services = [
    {
        id: 1,
        name: '💅 Классический маникюр',
        description: 'Обработка + покрытие',
        price: 1500,
        duration: 90,
        color: '#FFB6C1'
    },
    {
        id: 2,
        name: '✨ Покрытие гель-лаком',
        description: 'Долговременное покрытие',
        price: 2000,
        duration: 120,
        color: '#FF8FA3'
    },
    {
        id: 3,
        name: '🎨 Дизайн ногтей',
        description: 'Рисунки, стразы, градиент',
        price: 1000,
        duration: 60,
        color: '#D81B60'
    },
    {
        id: 4,
        name: '💎 SPA-уход',
        description: 'Увлажнение и питание',
        price: 1800,
        duration: 75,
        color: '#8B475D'
    }
];

// ======================
// ИНИЦИАЛИЗАЦИЯ
// ======================
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, запущено ли в Telegram
    if (window.Telegram && Telegram.WebApp) {
        tg = Telegram.WebApp;
        initTelegramApp();
    } else {
        // Режим разработки (браузер)
        initDevMode();
    }
    
    // Создаем лепестки сакуры
    createSakuraPetals();
    
    // Настройка переключателя темы
    setupThemeToggle();
    
    // Заполняем карточки услуг
    renderServiceCards();
});

// ======================
// ИНИЦИАЛИЗАЦИЯ TELEGRAM APP
// ======================
function initTelegramApp() {
    console.log('🌐 Запущено в Telegram Web App');
    
    // Раскрываем на весь экран
    tg.expand();
    
    // Устанавливаем цвета
    tg.setHeaderColor('#FFB6C1');
    tg.setBackgroundColor('#FFE4E9');
    
    // Получаем данные пользователя
    const user = tg.initDataUnsafe?.user;
    
    if (user) {
        // Отображаем имя пользователя
        document.getElementById('userName').textContent = 
            `Привет, ${user.first_name || 'дорогой гость'}!`;
        
        // Отображаем аватар, если есть
        if (user.photo_url) {
            document.getElementById('userAvatar').innerHTML = 
                `<img src="${user.photo_url}" alt="Avatar" style="width:100%;height:100%;border-radius:50%;">`;
        } else {
            // Используем первую букву имени
            const firstLetter = user.first_name ? user.first_name[0].toUpperCase() : '👑';
            document.getElementById('userAvatar').textContent = firstLetter;
        }
    }
    
    // Кнопка "Назад" в Telegram
    tg.BackButton.onClick(function() {
        goBack();
    });
}

// ======================
// РЕЖИМ РАЗРАБОТКИ (БРАУЗЕР)
// ======================
function initDevMode() {
    console.log('💻 Режим разработки (браузер)');
    
    // Тестовые данные
    document.getElementById('userName').textContent = 'Привет, Алиса!';
    document.getElementById('userAvatar').textContent = '👑';
    
    // Показываем предупреждение
    showNotification('Режим разработки. В Telegram будет больше функций!', 'info');
}

// ======================
// СОЗДАНИЕ ЛЕПЕСТКОВ САКУРЫ
// ======================
function createSakuraPetals() {
    const container = document.getElementById('sakuraBackground');
    const petalCount = 15;
    
    for (let i = 0; i < petalCount; i++) {
        const petal = document.createElement('div');
        petal.className = 'sakura-petal';
        
        // Случайная позиция
        petal.style.left = Math.random() * 100 + 'vw';
        petal.style.top = '-' + (Math.random() * 100 + 50) + 'px';
        
        // Случайная задержка и длительность
        petal.style.animationDelay = Math.random() * 15 + 's';
        petal.style.animationDuration = (Math.random() * 10 + 15) + 's';
        
        // Случайный размер
        const size = Math.random() * 20 + 10;
        petal.style.width = size + 'px';
        petal.style.height = size + 'px';
        
        container.appendChild(petal);
    }
}

// ======================
// ПЕРЕКЛЮЧАТЕЛЬ ТЕМ
// ======================
function setupThemeToggle() {
    const toggleBtn = document.getElementById('themeToggle');
    
    // Проверяем сохраненную тему
    const savedTheme = localStorage.getItem('nailTheme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
    
    toggleBtn.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('nailTheme', isDark ? 'dark' : 'light');
        
        // Создаем лепестки при смене темы
        createTemporaryPetals(3);
        
        // Обновляем цвет Telegram, если в мини-приложении
        if (tg) {
            tg.setBackgroundColor(isDark ? '#5D1F31' : '#FFE4E9');
        }
    });
}

// ======================
// ВРЕМЕННЫЕ ЛЕПЕСТКИ
// ======================
function createTemporaryPetals(count) {
    const container = document.getElementById('sakuraBackground');
    
    for (let i = 0; i < count; i++) {
        const petal = document.createElement('div');
        petal.className = 'sakura-petal';
        petal.style.animationDuration = '3s';
        petal.style.left = Math.random() * 100 + 'vw';
        petal.style.top = '-50px';
        
        container.appendChild(petal);
        
        // Удаляем через 3 секунды
        setTimeout(() => {
            if (petal.parentNode) {
                petal.remove();
            }
        }, 3000);
    }
}

// ======================
## ВИЗУАЛИЗАЦИЯ КАРТОЧЕК УСЛУГ
## ======================
function renderServiceCards() {
    const container = document.getElementById('serviceCards');
    container.innerHTML = '';
    
    services.forEach(service => {
        const card = document.createElement('div');
        card.className = 'service-card-select';
        card.innerHTML = `
            <div class="service-card-icon" style="background: ${service.color}20">
                <span>${service.name.split(' ')[0]}</span>
            </div>
            <div class="service-card-info">
                <h4>${service.name}</h4>
                <p>${service.description}</p>
                <div class="service-card-details">
                    <span class="price-tag">${service.price}₽</span>
                    <span class="time-tag">${service.duration} мин</span>
                </div>
            </div>
        `;
        
        card.addEventListener('click', () => selectService(service.id));
        container.appendChild(card);
    });
}

// ======================
## ВЫБОР УСЛУГИ
## ======================
function selectService(serviceId) {
    selectedService = services.find(s => s.id === serviceId);
    
    // Подсвечиваем выбранную услугу
    document.querySelectorAll('.service-card-select').forEach(card => {
        card.classList.remove('selected');
    });
    
    event.currentTarget.classList.add('selected');
    
    // Сохраняем в данные бронирования
    bookingData.service = selectedService;
    
    // Показываем следующую кнопку
    document.getElementById('nextBtn').style.display = 'block';
    
    // Показываем выбранную услугу
    showNotification(`Выбрано: ${selectedService.name}`, 'success');
}

// ======================
## ПЕРЕКЛЮЧЕНИЕ ЭКРАНОВ
## ======================
function openBooking() {
    showScreen('bookingScreen');
    if (tg) tg.BackButton.show();
}

function openServices() {
    showScreen('servicesScreen');
    if (tg) tg.BackButton.show();
}

function openMyBookings() {
    showNotification('Здесь будут ваши записи! Скоро...', 'info');
}

function openProfile() {
    showNotification('Профиль в разработке!', 'info');
}

function showScreen(screenId) {
    // Скрываем все экраны
    document.querySelectorAll('section').forEach(section => {
        if (section.classList.contains('anime-card')) {
            section.style.display = 'none';
        }
    });
    
    // Показываем нужный экран
    document.getElementById(screenId).style.display = 'block';
    currentScreen = screenId;
}

function goBack() {
    if (currentScreen === 'bookingScreen' || currentScreen === 'servicesScreen') {
        showScreen('main');
        if (tg) tg.BackButton.hide();
    }
}

// ======================
## ШАГИ БРОНИРОВАНИЯ
## ======================
let currentStep = 1;

function nextStep() {
    if (currentStep === 1 && !selectedService) {
        showNotification('Выберите услугу!', 'error');
        return;
    }
    
    if (currentStep === 1) {
        // Переход к выбору даты
        currentStep = 2;
        updateSteps();
        showDatePicker();
    } else if (currentStep === 2) {
        // Переход к подтверждению
        currentStep = 3;
        updateSteps();
        showConfirmation();
    } else if (currentStep === 3) {
        // Отправка записи
        submitBooking();
    }
}

function updateSteps() {
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
        if (parseInt(step.dataset.step) === currentStep) {
            step.classList.add('active');
        }
    });
}

function showDatePicker() {
    document.getElementById('step1').style.display = 'none';
    
    // Создаем календарь (упрощенный)
    const datePicker = `
        <div id="step2">
            <h3>Выберите дату и время:</h3>
            <div class="date-grid">
                <div class="date-option" onclick="selectDateTime('tomorrow', '12:00')">
                    <span>Завтра</span>
                    <small>12:00 - 14:00</small>
                </div>
                <div class="date-option" onclick="selectDateTime('tomorrow', '15:00')">
                    <span>Завтра</span>
                    <small>15:00 - 17:00</small>
                </div>
                <div class="date-option" onclick="selectDateTime('day3', '11:00')">
                    <span>Послезавтра</span>
                    <small>11:00 - 13:00</small>
                </div>
                <div class="date-option" onclick="selectDateTime('day3', '18:00')">
                    <span>Послезавтра</span>
                    <small>18:00 - 20:00</small>
                </div>
            </div>
        </div>
    `;
    
    document.querySelector('.step-content').innerHTML = datePicker;
    document.getElementById('nextBtn').textContent = 'Далее →';
}

function selectDateTime(day, time) {
    bookingData.date = day;
    bookingData.time = time;
    
    // Подсветка выбранного слота
    document.querySelectorAll('.date-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    
    showNotification(`Выбрано: ${day === 'tomorrow' ? 'Завтра' : 'Послезавтра'} в ${time}`, 'success');
}

function showConfirmation() {
    document.querySelector('.step-content').innerHTML = `
        <div id="step3">
            <h3>Подтвердите запись:</h3>
            <div class="confirmation-details">
                <div class="detail-item">
                    <span>Услуга:</span>
                    <strong>${selectedService.name}</strong>
                </div>
                <div class="detail-item">
                    <span>Дата:</span>
                    <strong>${bookingData.date === 'tomorrow' ? 'Завтра' : 'Послезавтра'}</strong>
                </div>
                <div class="detail-item">
                    <span>Время:</span>
                    <strong>${bookingData.time}</strong>
                </div>
                <div class="detail-item">
                    <span>Длительность:</span>
                    <strong>${selectedService.duration} минут</strong>
                </div>
                <div class="detail-item total">
                    <span>Итого:</span>
                    <strong class="total-price">${selectedService.price}₽</strong>
                </div>
            </div>
            <div class="notes">
                <textarea id="bookingNotes" placeholder="Дополнительные пожелания..."></textarea>
            </div>
        </div>
    `;
    
    document.getElementById('nextBtn').textContent = '🎀 Записаться!';
}

// ======================
## ОТПРАВКА БРОНИРОВАНИЯ
## ======================
function submitBooking() {
    if (!selectedService || !bookingData.date) {
        showNotification('Заполните все данные!', 'error');
        return;
    }
    
    const notes = document.getElementById('bookingNotes')?.value || '';
    
    // В реальном приложении здесь будет запрос к серверу
    console.log('Отправка записи:', {
        service: selectedService,
        date: bookingData.date,
        time: bookingData.time,
        notes: notes
    });
    
    // Показываем успех
    showNotification('🎉 Запись успешно создана!', 'success');
    
    // В Telegram можно отправить данные боту
    if (tg) {
        tg.sendData(JSON.stringify({
            action: 'booking',
            service: selectedService.name,
            price: selectedService.price,
            date: bookingData.date,
            time: bookingData.time
        }));
        
        tg.close();
    } else {
        // В браузере показываем сообщение
        setTimeout(() => {
            alert(`🎉 Запись на ${selectedService.name} успешно создана!\n\nМы свяжемся с вами для подтверждения.`);
            goBack();
        }, 1000);
    }
}

// ======================
## УТИЛИТЫ
## ======================
function showNotification(message, type = 'info') {
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    document.body.appendChild(notification);
    
    // Автоудаление через 3 секунды
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// ======================
## ДОБАВЛЯЕМ CSS ДЛЯ НОВЫХ ЭЛЕМЕНТОВ
## ======================
const additionalCSS = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 15px 20px;
        border-radius: 15px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    }
    
    .notification.success {
        background: #81C784;
        color: white;
    }
    
    .notification.error {
        background: #E57373;
        color: white;
    }
    
    .notification.info {
        background: #64B5F6;
        color: white;
    }
    
    .notification button {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .service-card-select {
        background: white;
        border-radius: 20px;
        padding: 15px;
        margin: 10px 0;
        display: flex;
        align-items: center;
        gap: 15px;
        cursor: pointer;
        transition: all 0.3s ease;
        border: 2px solid transparent;
    }
    
    .service-card-select.selected {
        border-color: #FFB6C1;
        background: rgba(255, 182, 193, 0.1);
        transform: translateY(-2px);
    }
    
    .service-card-icon {
        width: 50px;
        height: 50px;
        border-radius: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
    }
    
    .service-card-info h4 {
        margin: 0;
        color: #5D1F31;
        font-size: 16px;
    }
    
    .service-card-details {
        display: flex;
        gap: 10px;
        margin-top: 5px;
    }
    
    .price-tag {
        background: #FFB6C1;
        color: white;
        padding: 3px 10px;
        border-radius: 10px;
        font-size: 14px;
    }
    
    .time-tag {
        background: #E0E0E0;
        color: #666;
        padding: 3px 10px;
        border-radius: 10px;
        font-size: 14px;
    }
    
    .date-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        margin: 20px 0;
    }
    
    .date-option {
        background: white;
        border-radius: 15px;
        padding: 15px;
        text-align: center;
        cursor: pointer;
        border: 2px solid transparent;
        transition: all 0.3s ease;
    }
    
    .date-option.selected {
        border-color: #FFB6C1;
        background: rgba(255, 182, 193, 0.1);
    }
    
    .date-option span {
        display: block;
        font-weight: bold;
        color: #5D1F31;
    }
    
    .confirmation-details {
        background: white;
        border-radius: 20px;
        padding: 20px;
        margin: 20px 0;
    }
    
    .detail-item {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        border-bottom: 1px solid #eee;
    }
    
    .detail-item.total {
        border-top: 2px solid #FFB6C1;
        margin-top: 10px;
        font-size: 18px;
    }
    
    .total-price {
        color: #D81B60;
        font-size: 24px;
    }
    
    .notes textarea {
        width: 100%;
        height: 100px;
        border-radius: 15px;
        border: 2px solid #FFB6C1;
        padding: 15px;
        font-family: inherit;
        margin-top: 20px;
        resize: none;
    }
    
    .dark-theme .service-card-select,
    .dark-theme .date-option,
    .dark-theme .confirmation-details {
        background: rgba(255, 255, 255, 0.1);
        color: white;
    }
    
    .dark-theme .service-card-info h4 {
        color: white;
    }
`;

// Добавляем CSS в документ
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);
