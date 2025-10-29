// js/main.js

document.addEventListener('DOMContentLoaded', () => {
    
    // =================================================================
    // 1. إعدادات API (الاعتماد على المسار الجذري الحالي)
    // =================================================================
    
    // ⚠️ تم إزالة الرابط المباشر. هذا الكود سيعمل بشكل صحيح إذا قمت بنشر
    // الواجهة الأمامية على نفس نطاق خادم FastAPI أو استخدمت Reverse Proxy.
    // للحصول على أفضل توافق، يجب تغيير هذا إلى رابط Railway Public URL
    // (مثل https://your-app-name.up.railway.app) إذا كانت الواجهة الأمامية
    // تعمل على نطاق مختلف.
    const RAILWAY_API_BASE = ''; // استخدام المسار النسبي (مثل /api/auth/login)
    
    const AUTH_API = `${RAILWAY_API_BASE}/api/auth/login`; 
    const COUNT_API = `${RAILWAY_API_BASE}/api/stats/member-count`;
    const WORKS_API = `${RAILWAY_API_BASE}/api/works/featured`;
    const AUTHOR_PREVIEW_API = `${RAILWAY_API_BASE}/api/authors/preview`;
    
    // =================================================================
    // 2. تفعيل التفاعلات الأساسية (الأيقونات المعطلة)
    // =================================================================

    const loadingScreen = document.getElementById('loading-screen');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;
    
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const fullMenu = document.getElementById('full-menu');
    const closeMenuBtn = document.getElementById('close-menu-btn');

    const loginToggle = document.getElementById('login-toggle');
    const loginModal = document.getElementById('login-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const loginForm = document.getElementById('login-form');
    const loginMessage = document.getElementById('login-message');


    // A. وظيفة إخفاء شاشة التحميل
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (loadingScreen) {
                loadingScreen.classList.add('fade-out');
                setTimeout(() => loadingScreen.style.display = 'none', 500);
            }
        }, 500);
    });

    // B. تفعيل زر الهامبرغر وقائمة التنقل
    if (hamburgerBtn && fullMenu && closeMenuBtn) {
        hamburgerBtn.addEventListener('click', () => {
            fullMenu.classList.add('is-open');
        });
        closeMenuBtn.addEventListener('click', () => {
            fullMenu.classList.remove('is-open');
        });
    }

    // C. تفعيل زر تسجيل الدخول و النافذة المنبثقة (Modal)
    if (loginToggle && loginModal && closeModalBtn) {
        loginToggle.addEventListener('click', () => {
            loginModal.style.display = 'flex';
        });
        closeModalBtn.addEventListener('click', () => {
            loginModal.style.display = 'none';
        });
        // إغلاق عند النقر خارج النافذة
        window.addEventListener('click', (event) => {
            if (event.target === loginModal) {
                loginModal.style.display = 'none';
            }
        });
    }

    // D. تفعيل زر الوضع الليلي (Dark Mode)
    function toggleDarkMode() {
        body.classList.toggle('dark-mode');
        // حفظ التفضيل في التخزين المحلي
        const isDarkMode = body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        
        // تحديث أيقونة الزر
        const icon = darkModeToggle.querySelector('i');
        if (isDarkMode) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
        
        // التحقق من التفضيل عند تحميل الصفحة
        if (localStorage.getItem('darkMode') === 'true') {
            toggleDarkMode(); // تفعيل الوضع الداكن إذا كان مفضلاً
        }
    }


    // =================================================================
    // 3. الدوال التفاعلية مع API (تفعيل الميزات الديناميكية)
    // =================================================================

    // A. جلب وإظهار عدد الأعضاء
    async function fetchAndAnimateMemberCount() {
        const countElement = document.getElementById('dynamic-member-count');
        if (!countElement) return;

        try {
            const response = await fetch(COUNT_API);
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            const finalCount = data.count || parseInt(countElement.getAttribute('data-initial-count'));
            
            // إضافة تأثير العد
            let currentCount = 0;
            const step = Math.ceil(finalCount / 100); 
            const interval = setInterval(() => {
                currentCount += step;
                if (currentCount >= finalCount) {
                    currentCount = finalCount;
                    clearInterval(interval);
                }
                countElement.textContent = currentCount.toLocaleString('ar-IQ');
            }, 10);

        } catch (error) {
            console.error("Error fetching member count:", error);
            // في حالة الفشل، نستخدم القيمة الافتراضية في HTML
        }
    }
    fetchAndAnimateMemberCount();


    // B. جلب وعرض الأعمال المميزة
    async function fetchAndRenderFeaturedWorks() {
        const gallery = document.getElementById('featured-works-gallery');
        if (!gallery) return;

        try {
            const response = await fetch(WORKS_API);
            if (!response.ok) throw new Error('Network response was not ok');
            
            const works = await response.json();
            gallery.innerHTML = ''; // تفريغ المعرض

            works.forEach(work => {
                const card = document.createElement('div');
                card.classList.add('work-card', 'hand-drawn-effect');
                card.innerHTML = `
                    <div class="card-image-wrapper">
                        <img src="${work.image_url}" alt="غلاف عمل ${work.title}" class="card-image">
                    </div>
                    <div class="card-info">
                        <h3>${work.title}</h3>
                        <p class="author-name">للكاتب: ${work.author}</p>
                        <div class="card-footer">
                            <span class="votes-count"><i class="fas fa-heart"></i> ${work.votes.toLocaleString('ar-IQ')} صوت</span>
                            <button class="btn tiny-btn drawn-btn vote-btn" data-work-id="${work.id}">صوت</button>
                        </div>
                    </div>
                `;
                gallery.appendChild(card);
            });

        } catch (error) {
            console.error("Error fetching featured works:", error);
            gallery.innerHTML = '<p class="error-message" style="text-align: center;">تعذر تحميل الأعمال المميزة. تحقق من اتصال API.</p>';
        }
    }
    fetchAndRenderFeaturedWorks();


    // C. منطق المصادقة وتسجيل الدخول (AUTH)
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            loginMessage.style.display = 'none';
            loginMessage.classList.remove('success-message');
            loginMessage.classList.remove('error-message');

            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            // بناء بيانات النموذج بصيغة x-www-form-urlencoded كما يتوقعها FastAPI
            const formBody = new URLSearchParams();
            formBody.append('username', email);
            formBody.append('password', password);

            try {
                const response = await fetch(AUTH_API, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: formBody
                });

                const result = await response.json();

                if (response.ok) {
                    // نجاح تسجيل الدخول - حفظ الرمز (Token)
                    localStorage.setItem('access_token', result.access_token);
                    loginMessage.textContent = 'تم تسجيل الدخول بنجاح! جارِ التوجيه...';
                    loginMessage.classList.add('success-message');
                    loginMessage.style.display = 'block';
                    
                    // إغلاق النافذة بعد ثوانٍ (يمكنك إعادة تحميل الصفحة أو التوجيه)
                    setTimeout(() => {
                        loginModal.style.display = 'none';
                        // تحديث واجهة المستخدم (تغيير أيقونة المستخدم إلى أيقونة بروفايل مثلاً)
                        // window.location.reload(); 
                    }, 1500);

                } else {
                    // فشل تسجيل الدخول
                    loginMessage.textContent = result.detail || 'فشل تسجيل الدخول. تحقق من البيانات.';
                    loginMessage.classList.add('error-message');
                    loginMessage.style.display = 'block';
                }

            } catch (error) {
                console.error('Login error:', error);
                loginMessage.textContent = 'حدث خطأ في الاتصال بالخادم.';
                loginMessage.classList.add('error-message');
                loginMessage.style.display = 'block';
            }
        });
    }

    // D. تفعيل خريطة المدن التفاعلية (Map Tooltip)
    const cityPoints = document.querySelectorAll('.city-point');
    const tooltip = document.getElementById('micro-profile-tooltip');
    const authorNameTooltip = document.querySelector('.author-name-tooltip');
    const authorStatsTooltip = document.querySelector('.author-stats-tooltip');

    if (cityPoints.length > 0 && tooltip) {
        cityPoints.forEach(point => {
            const authorId = point.getAttribute('data-author-id');
            const cityName = point.getAttribute('data-city');

            // دالة جلب بيانات الكاتب
            async function fetchAuthorPreview() {
                try {
                    // استخدام الـ ID لجلب بيانات الكاتب من API
                    const response = await fetch(`${AUTHOR_PREVIEW_API}/${authorId}`);
                    const data = await response.json();
                    
                    authorNameTooltip.textContent = `الكاتب: ${data.name}`;
                    authorStatsTooltip.textContent = `من ${cityName} | له ${data.works_count.toLocaleString('ar-IQ')} عمل`;

                } catch (error) {
                    authorNameTooltip.textContent = `الكاتب: (بيانات غير متوفرة)`;
                    authorStatsTooltip.textContent = `من ${cityName} | جلب البيانات فشل`;
                    console.error("Error fetching author preview:", error);
                }
            }

            // إظهار التلميح (Tooltip)
            point.addEventListener('mouseenter', () => {
                fetchAuthorPreview(); // جلب البيانات عند مرور الماوس
                
                // تحديد موضع التلميح
                const rect = point.getBoundingClientRect();
                tooltip.style.left = `${rect.left + window.scrollX + rect.width}px`;
                tooltip.style.top = `${rect.top + window.scrollY - 10}px`; 
                tooltip.style.display = 'block';
            });

            // إخفاء التلميح
            point.addEventListener('mouseleave', () => {
                tooltip.style.display = 'none';
            });
        });
    }
});
