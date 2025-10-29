// js/main.js

document.addEventListener('DOMContentLoaded', () => {
    
    // =================================================================
    // 1. إعدادات API (تم إزالة جميع الروابط والدوال المرتبطة بها)
    // =================================================================
    
    // تم حذف: RAILWAY_API_BASE, COUNT_API, WORKS_API, AUTHOR_PREVIEW_API

    // =================================================================
    // 2. تفعيل التفاعلات الأساسية
    // =================================================================

    const loadingScreen = document.getElementById('loading-screen');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;
    
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const fullMenu = document.getElementById('full-menu');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    
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

    // C. تفعيل زر الوضع الليلي (Dark Mode)
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
            toggleDarkMode(); 
        }
    }


    // =================================================================
    // 3. عرض البيانات الثابتة (لأن API أزيلت)
    // =================================================================

    // A. تعيين عدد الأعضاء للقيمة الافتراضية الثابتة في HTML
    const countElement = document.getElementById('dynamic-member-count');
    if (countElement) {
         // سيتم عرض القيمة الثابتة 450 من HTML بدون أي محاولة اتصال API
         console.log("Member count is now static.");
    }
    
    // B. تعيين الأعمال المميزة لبيانات وهمية ثابتة (بدلاً من محاولة الجلب)
    function renderStaticFeaturedWorks() {
        const gallery = document.getElementById('featured-works-gallery');
        if (!gallery) return;

        // بيانات ثابتة لضمان ظهور المحتوى وعدم ظهور رسالة الخطأ الحمراء
        const staticWorks = [
             {"id": 1, "title": "رحلة حبر في دجلة", "author": "أحمد الجنابي", "image_url": "images/work1.jpg", "votes": 45},
             {"id": 2, "title": "أنشودة البصرة القديمة", "author": "سارة الناصر", "image_url": "images/work2.jpg", "votes": 92},
             {"id": 3, "title": "مخطوطة نينوى الأخيرة", "author": "د. خليل الربيعي", "image_url": "images/work3.jpg", "votes": 67},
        ];

        gallery.innerHTML = ''; 

        staticWorks.forEach(work => {
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
        console.log("Static featured works rendered successfully.");
    }
    renderStaticFeaturedWorks();

    // C. تفعيل خريطة المدن التفاعلية (Map Tooltip) - الآن ثابتة
    const cityPoints = document.querySelectorAll('.city-point');
    const tooltip = document.getElementById('micro-profile-tooltip');
    const authorNameTooltip = document.querySelector('.author-name-tooltip');
    const authorStatsTooltip = document.querySelector('.author-stats-tooltip');

    if (cityPoints.length > 0 && tooltip) {
        cityPoints.forEach(point => {
            const cityName = point.getAttribute('data-city');

            // إظهار التلميح ببيانات ثابتة
            point.addEventListener('mouseenter', () => {
                authorNameTooltip.textContent = `الكاتب: (بيانات ثابتة للعرض)`;
                authorStatsTooltip.textContent = `من ${cityName} | له (10) أعمال`;
                
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
