// js/main.js

document.addEventListener('DOMContentLoaded', () => {
    
    // =================================================================
    // 1. إعدادات API (الاعتماد على المسار الجذري الحالي)
    // =================================================================
    
    // ⚠️ ملاحظة: يجب تعديل هذا المتغير ليحتوي على رابط FastAPI العام
    // (مثل https://your-api-name.up.railway.app) لكي يعمل الموقع المنشور على GitHub Pages.
    const RAILWAY_API_BASE = ''; // استخدام المسار النسبي (مثل /api/auth/login)
    
    // تم إزالة AUTH_API
    const COUNT_API = `${RAILWAY_API_BASE}/api/stats/member-count`;
    const WORKS_API = `${RAILWAY_API_BASE}/api/works/featured`;
    const AUTHOR_PREVIEW_API = `${RAILWAY_API_BASE}/api/authors/preview`;
    
    // =================================================================
    // 2. تفعيل التفاعلات الأساسية
    // =================================================================

    const loadingScreen = document.getElementById('loading-screen');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;
    
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const fullMenu = document.getElementById('full-menu');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    
    // تم إزالة جميع المتغيرات المتعلقة بالتسجيل (loginToggle, loginModal, إلخ)

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

    // C. تفعيل زر الوضع الليلي (Dark Mode) (كانت D سابقاً)
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

    // تم إزالة القسم C بالكامل (الذي كان خاصاً بتفعيل المودال ومنطق تسجيل الدخول)


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
            // لاحظ أن هذا الخطأ يظهر لك باستمرار بسبب مشكلة النطاق
            gallery.innerHTML = '<p class="error-message" style="text-align: center;">تعذر تحميل الأعمال المميزة. تحقق من اتصال API.</p>';
        }
    }
    fetchAndRenderFeaturedWorks();

    // C. تفعيل خريطة المدن التفاعلية (Map Tooltip) (كانت D سابقاً)
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
