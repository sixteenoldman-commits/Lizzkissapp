// ============================
// TELEGRAM MINI APP - LIQUID NAV
// ============================

let currentTab = 'main';
let startX = 0;
let currentX = 0;
let isSwiping = false;

// Телеграм объект
let tg = window.Telegram?.WebApp;

// ======================
// ИНИЦИАЛИЗАЦИЯ
// ======================
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация Telegram
    if (tg) {
        tg.ready();
        tg.expand();
        tg.setHeaderColor('#FFB6C1');
        tg.setBackgroundColor('#FFE4E9');
        
        // Настраиваем пользователя
        const user = tg.initDataUnsafe?.user;
        if (user) {
            document.getElementById('userName').textContent = `Привет, ${user.first_name || 'друг'}!`;
        }
    }
    
    // Инициализация навигации
    initNavigation();
    initSwipe();
    initTheme();
    
    // Показать руководство по свайпу (только в первый раз)
    if (!localStorage.getItem('swipeSeen')) {
        setTimeout(() => {
            document.querySelector('.swipe-guide').style.display = 'block';
        }, 1000);
    }
});

// ======================
// НАВИГАЦИЯ
// ======================
function initNavigation() {
    // Активируем главный экран
    switchTab('main');
    
    // Назначаем обработчики для кнопок навигации
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.dataset.tab;
            switchTab(tab);
        });
    });
}

function switchTab(tab) {
    // Обновляем текущую вкладку
    currentTab = tab;
    
    // Обновляем заголовок
    const titles = {
        'main': 'Nail Sakura',
        'booking': 'Запись',
        'services': 'Услуги',
        'profile': 'Профиль'
    };
    document.getElementById('pageTitle').textContent = titles[tab] || 'Nail Sakura';
    
    // Обновляем активные экраны
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(`screen-${tab}`).classList.add('active');
    
    // Обновляем активные кнопки навигации
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tab) {
            btn.classList.add('active');
        }
    });
    
    // Обновляем индикаторы свайпа
    document.querySelectorAll('.swipe-dot').forEach(dot => {
        dot.classList.remove('active');
        if (dot.dataset.tab === tab) {
            dot.classList.add('active');
        }
    });
    
    // Скрываем руководство по свайпу после первого использования
    localStorage.setItem('swipeSeen', 'true');
    document.querySelector('.swipe-guide').style.display = 'none';
}

// ======================
// СВАЙП-НАВИГАЦИЯ
// ======================
function initSwipe() {
    const content = document.getElementById('mainContent');
    
    content.addEventListener('touchstart', handleTouchStart, { passive: true });
    content.addEventListener('touchmove', handleTouchMove, { passive: true });
    content.addEventListener('touchend', handleTouchEnd);
    
    // Для десктопа (мышь)
    content.addEventListener('mousedown', handleMouseStart);
    content.addEventListener('mousemove', handleMouseMove);
    content.addEventListener('mouseup', handleMouseEnd);
    content.addEventListener('mouseleave', handleMouseEnd);
}

function handleTouchStart(e) {
    startX = e.touches[0].clientX;
    currentX = startX;
    isSwiping = true;
}

function handleTouchMove(e) {
    if (!isSwiping) return;
    currentX = e.touches[0].clientX;
    
    // Показываем визуальную обратную связь
    const diff = currentX - startX;
    if (Math.abs(diff) > 30) {
        document.querySelector('.swipe-guide').style.opacity = '0.3';
    }
}

function handleTouchEnd() {
    if (!isSwiping) return;
    
    const diff = currentX - startX;
    const threshold = 50; // Минимальное расстояние для свайпа
    
    if (Math.abs(diff) > threshold) {
        if (diff > 0) {
            // Свайп вправо - предыдущая вкладка
            switchToPrevTab();
        } else {
            // Свайп влево - следующая вкладка
            switchToNextTab();
        }
        
        // Анимация свайпа
        animateSwipe(diff > 0 ? 'right' : 'left');
    }
    
    // Сброс
    isSwiping = false;
    document.querySelector('.swipe-guide').style.opacity = '';
}

// Обработчики для мыши (десктоп)
function handleMouseStart(e) {
    startX = e.clientX;
    currentX = startX;
    isSwiping = true;
    e.preventDefault();
}

function handleMouseMove(e) {
    if (!isSwiping) return;
    currentX = e.clientX;
}

function handleMouseEnd() {
    handleTouchEnd(); // Используем ту же логику
}

// Переключение вкладок
const tabOrder = ['main', 'booking', 'services', 'profile'];

function switchToNextTab() {
    const currentIndex = tabOrder.indexOf(currentTab);
    const nextIndex = (currentIndex + 1) % tabOrder.length;
    switchTab(tabOrder[nextIndex]);
}

function switchToPrevTab() {
    const currentIndex = tabOrder.indexOf(currentTab);
    const prevIndex = (currentIndex - 1 + tabOrder.length) % tabOrder.length;
    switchTab(tabOrder[prevIndex]);
}

// Анимация свайпа
function animateSwipe(direction) {
    const content = document.getElementById('mainContent');
    content.style.transform = `translateX(${direction === 'right' ? '10px' : '-10px'})`;
    content.style.transition = 'transform 0.2s ease';
    
    setTimeout(() => {
        content.style.transform = '';
        content.style.transition = '';
    }, 200);
}

// ======================
// ТЕМНАЯ ТЕМА
// ======================
function initTheme() {
    const toggle = document.getElementById('themeToggle');
    
    // Проверяем сохраненную тему
    const savedTheme = localStorage.getItem('nailTheme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        updateThemeIcon('dark');
    }
    
    // Обработчик переключения
    toggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('nailTheme', isDark ? 'dark' : 'light');
        
        updateThemeIcon(isDark ? 'dark' : 'light');
        
        // Обновляем цвета в Telegram
        if (tg) {
            tg.setBackgroundColor(isDark ? '#5D1F31' : '#FFE4E9');
        }
        
        // Анимация переключения
        createLiquidEffect(this);
    });
}

function updateThemeIcon(theme) {
    const toggle = document.getElementById('themeToggle');
    if (theme === 'dark') {
        toggle.innerHTML = '<i class="fas fa-moon"></i>';
        toggle.style.background = 'linear-gradient(135deg, #8B475D, #5D1F31)';
    } else {
        toggle.innerHTML = '<i class="fas fa-sun"></i>';
        toggle.style.background = 'linear-gradient(135deg, #FFB6C1, #FF8FA3)';
    }
}

// ======================
## ЖИДКИЕ ЭФФЕКТЫ
## ======================
function createLiquidEffect(element) {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: absolute;
        width: 100px;
        height: 100px;
        background: radial-gradient(circle, rgba(255,182,193,0.3) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        transform: translate(-50%, -50%);
        animation: ripple 0.6s ease-out;
        z-index: 1;
    `;
    
    const rect = element.getBoundingClientRect();
    ripple.style.left = rect.left + rect.width / 2 + 'px';
    ripple.style.top = rect.top + rect.height / 2 + 'px';
    
    document.body.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// ======================
## МОДАЛЬНЫЕ ОКНА
## ======================
function openQuickBooking() {
    const modal = document.getElementById('modalOverlay');
    const content = modal.querySelector('.modal-content');
    
    content.innerHTML = `
        <div class="quick-booking">
            <div class="service-option" onclick="quickBook('manicure')">
                <i class="fas fa-hand-sparkles"></i>
                <span>Маникюр</span>
                <small>1500₽</small>
            </div>
            <div class="service-option" onclick="quickBook('gel')">
                <i class="fas fa-gem"></i>
                <span>Гель-лак</span>
                <small>2000₽</small>
            </div>
            <div class="service-option" onclick="quickBook('design')">
                <i class="fas fa-palette"></i>
                <span>Дизайн</span>
                <small>1000₽</small>
            </div>
            <button class="liquid-btn" onclick="closeModal()">
                <i class="fas fa-times"></i>
                <span>Закрыть</span>
            </button>
        </div>
    `;
    
    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('modalOverlay').style.display = 'none';
}

function quickBook(service) {
    alert(`🎉 Вы записались на ${service}! Мы свяжемся с вами.`);
    closeModal();
}

// ======================
## УТИЛИТЫ
## ======================
function goHome() {
    switchTab('main');
}

function openCart() {
    switchTab('services');
}

// CSS для анимации ripple
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
    }
    
    .quick-booking {
        padding: 20px 0;
    }
    
    .service-option {
        display: flex;
        align-items: center;
        padding: 15px;
        margin: 10px 0;
        background: #f8f9fa;
        border-radius: 15px;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .service-option:active {
        background: #FFE4E9;
        transform: scale(0.98);
    }
    
    .service-option i {
        font-size: 24px;
        color: #FFB6C1;
        margin-right: 15px;
        width: 30px;
    }
    
    .service-option span {
        flex: 1;
        font-weight: 600;
        color: #333;
    }
    
    .service-option small {
        color: #D81B60;
        font-weight: 700;
    }
`;
document.head.appendChild(style);

// Прячем руководство по свайпу при клике
document.querySelector('.swipe-guide')?.addEventListener('click', function() {
    this.style.display = 'none';
});
