// js/main.js

document.addEventListener('DOMContentLoaded', () => {
    
    // =================================================================
    // 1. تفعيل التفاعلات الأساسية (الوضع الليلي والقائمة الجانبية)
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
        const isDarkMode = body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        
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
        
        if (localStorage.getItem('darkMode') === 'true') {
            toggleDarkMode(); 
        }
    }


    // =================================================================
    // 2. عرض البيانات الثابتة (بدلاً من الجلب من API)
    // =================================================================

    // A. تعيين عدد الأعضاء للقيمة الافتراضية الثابتة في HTML
    const countElement = document.getElementById('dynamic-member-count');
    if (countElement) {
         // عرض القيمة الثابتة مباشرة
         const initialCount = countElement.getAttribute('data-initial-count') || 450;
         countElement.textContent = parseInt(initialCount).toLocaleString('ar-IQ');
    }
    
    // B. تعيين الأعمال المميزة لبيانات وهمية ثابتة
    function renderStaticFeaturedWorks() {
        const gallery = document.getElementById('featured-works-gallery');
        if (!gallery) return;

        // بيانات ثابتة لعرض كتب مجول شعلان الحيالي
        const staticWorks = [
             {"id": 1, "title": "رحلة حبر في دجلة", "author": "مجول شعلان الحيالي", "image_url": "images/work1.jpg", "votes": 45},
             {"id": 2, "title": "أنشودة البصرة القديمة", "author": "مجول شعلان الحيالي", "image_url": "images/work2.jpg", "votes": 92},
             {"id": 3, "title": "مخطوطة نينوى الأخيرة", "author": "مجول شعلان الحيالي", "image_url": "images/work3.jpg", "votes": 67},
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
    }
    renderStaticFeaturedWorks();

    // C. تم إزالة كل ما يتعلق بالخريطة التفاعلية
    
});
