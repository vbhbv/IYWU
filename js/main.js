document.addEventListener('DOMContentLoaded', () => {

    // =======================================================
    // 1. تحديد العناصر الرئيسية
    // =======================================================
    const body = document.body;
    const loadingScreen = document.getElementById('loading-screen');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const focusModeToggle = document.getElementById('focus-mode-toggle');
    
    // عناصر التنقل 
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const fullMenu = document.getElementById('full-menu');

    // عناصر Typewriter 
    const typewriterElements = document.querySelectorAll('.handwritten-animation');

    // =======================================================
    // 2. وظائف التحميل الأولي (Loading & Initial State)
    // =======================================================

    window.addEventListener('load', () => {
        setTimeout(() => {
            if (loadingScreen) {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    if (focusModeToggle) focusModeToggle.classList.remove('hidden'); 
                }, 800);
            }
        }, 500);
        
        // بدء تأثير الكتابة اليدوية بعد التحميل
        initTypewriter();
    });

    // =======================================================
    // 3. وظائف الوضع الداكن (Dark Mode)
    // =======================================================
    
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        body.classList.add('dark-mode');
    }

    if (darkModeToggle) {
        const initialIcon = darkModeToggle.querySelector('i');
        if (initialIcon) {
            initialIcon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
        }

        darkModeToggle.addEventListener('click', () => {
            const newMode = !body.classList.toggle('dark-mode'); 
            localStorage.setItem('darkMode', newMode);
            
            const icon = darkModeToggle.querySelector('i');
            if (icon) {
                 icon.className = newMode ? 'fas fa-sun' : 'fas fa-moon';
            }
        });
    }

    // =======================================================
    // 4. وظيفة وضع التركيز (Focus Mode)
    // =======================================================
    if (focusModeToggle) {
        focusModeToggle.addEventListener('click', () => {
            const isFocused = body.classList.toggle('focus-mode');
            const icon = focusModeToggle.querySelector('i');
            
            if (icon) {
                icon.className = isFocused ? 'fas fa-search-minus' : 'fas fa-search-plus';
            }
        });
    }


    // =======================================================
    // 5. وظيفة التنقل للهاتف المحمول (Menu Toggle) - مؤكد العمل
    // =======================================================
    if (hamburgerBtn && fullMenu && closeMenuBtn) {
        // فتح القائمة
        hamburgerBtn.addEventListener('click', () => {
            fullMenu.style.transform = 'translate3d(0, 0, 0)';
        });

        // إغلاق القائمة
        closeMenuBtn.addEventListener('click', () => {
            fullMenu.style.transform = 'translate3d(100%, 0, 0)';
        });
        
        // إغلاق القائمة عند النقر على رابط داخلي
        fullMenu.querySelectorAll('a').forEach(link => {
             link.addEventListener('click', () => {
                 fullMenu.style.transform = 'translate3d(100%, 0, 0)';
             });
        });
    }

    // =======================================================
    // 6. وظيفة الكتابة اليدوية المتحركة (Typewriter Effect)
    // =======================================================

    function startTypewriterEffect(element, delay = 0) {
        if (!element) return;
        
        element.style.visibility = 'visible'; 
        const text = element.getAttribute('data-text'); 
        element.textContent = ''; 
        
        element.style.borderRight = '2px solid var(--color-ink-dark, #2C3E50)'; 
        element.style.animation = 'blinking-cursor 0.75s step-end infinite';
        
        let i = 0;
        setTimeout(() => {
            function type() {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, 70); 
                } else {
                    element.style.borderRight = 'none';
                    element.style.animation = 'none';
                }
            }
            type();
        }, delay);
    }
    
    function initTypewriter() {
        typewriterElements.forEach((el, index) => {
            el.setAttribute('data-text', el.textContent.trim());
            el.textContent = '';
            
            startTypewriterEffect(el, index * 500 + 1000); 
        });
    }
    
    // =======================================================
    // 7. مراقبة العناصر عند التمرير (Reveal Elements)
    // =======================================================
    
    const revealElements = document.querySelectorAll('.reveal-element');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    revealElements.forEach(element => {
        observer.observe(element);
    });
});
