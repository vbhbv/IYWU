document.addEventListener('DOMContentLoaded', () => {

    // =======================================================
    // 1. تحميل البيانات والوظائف الأساسية
    // =======================================================
    let membersData = { total_members: 0, robot_dialogues: {} };
    
    // محاولة جلب البيانات (افتراض أن الملف موجود في مسار 'data/members.json')
    fetch('data/members.json')
        .then(response => {
            if (!response.ok) throw new Error('Failed to load members.json');
            return response.json();
        })
        .then(data => {
            membersData = data;
            updateMemberCount(membersData.total_members);
            initWarraq(membersData.robot_dialogues);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            // بيانات افتراضية للعمل إذا فشل الجلب
            updateMemberCount(200); 
            initWarraq({ welcome: "أهلاً بك أيها القارئ، الموقع يعمل بشكل كامل، لكن بيانات الأعضاء مؤقتة حالياً." });
        });
        
    // تشغيل وظيفة ظهور العناصر
    initScrollReveal();
    
    // =======================================================
    // 2. تحديث عدد الأعضاء
    // =======================================================
    function updateMemberCount(count) {
        const countDisplay = document.getElementById('member-count-display');
        if (countDisplay) {
            countDisplay.innerHTML = `<i class="fas fa-quote-right"></i> نحن نجمع أكثر من <span style="color: var(--color-accent);">${count}</span> قلمًا شابًا.`;
        }
    }

    // =======================================================
    // 3. إدارة الوضع الليلي (Dark Mode)
    // =======================================================
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const savedMode = localStorage.getItem('darkMode');

    if (savedMode === 'true') {
        document.body.classList.add('dark-mode');
        // تغيير أيقونة القمر إلى شمس في الوضع الليلي
        darkModeToggle.querySelector('i').className = 'fas fa-sun';
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', isDark);
            // تبديل الأيقونة
            darkModeToggle.querySelector('i').className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        });
    }

    // =======================================================
    // 4. الروبوت "الوراق" (المساعد التفاعلي)
    // =======================================================
    const warraq = document.getElementById('the-warraq');
    const dialogueBox = warraq ? warraq.querySelector('.robot-dialogue-box') : null;

    function initWarraq(dialogues) {
        if (!warraq || !dialogueBox) return;

        let currentDialogue;
        switch (document.body.id) {
            case 'homepage': currentDialogue = dialogues.welcome || "أهلاً، سأكون دليلك هنا. اكتشفوا أصواتنا الجديدة."; break;
            case 'join-page': currentDialogue = "أهلاً بالكاتب الطموح، تفضل بقراءة ميثاق الانضمام بالتفصيل."; break;
            default: currentDialogue = "أتمنى لكم تجربة قراءة ممتعة وعميقة.";
        }
        
        setTimeout(() => {
            warraq.style.opacity = 1;
            dialogueBox.textContent = currentDialogue;
        }, 1500); 

        warraq.addEventListener('click', () => {
            dialogueBox.textContent = "تابعني! أنا موجود للإجابة على استفساراتك المنهجية.";
            setTimeout(() => { dialogueBox.textContent = ''; }, 5000);
        });
        
        initScrollMonitor(); // تشغيل مراقبة التمرير
    }
    
    // =======================================================
    // 5. إدارة القائمة الجانبية (Sidebar)
    // =======================================================
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const fullMenu = document.getElementById('full-menu');

    if (hamburgerBtn && fullMenu && closeMenuBtn) {
        // فتح القائمة
        hamburgerBtn.addEventListener('click', () => {
            fullMenu.classList.add('visible');
            document.body.style.overflow = 'hidden';
        });
        // إغلاق القائمة
        closeMenuBtn.addEventListener('click', () => {
            fullMenu.classList.remove('visible');
            document.body.style.overflow = 'auto';
        });
        // إغلاق عند النقر على رابط
        fullMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                fullMenu.classList.remove('visible');
                document.body.style.overflow = 'auto';
            });
        });
    }

    // =======================================================
    // 6. تأثير الظهور عند التمرير (Scroll Reveal)
    // =======================================================
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal-element');
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px', threshold: 0.1 });

        revealElements.forEach(el => {
            observer.observe(el);
        });
    }

    // =======================================================
    // 7. وضع التركيز ومراقب التمرير (التحليل السطحي)
    // =======================================================
    const focusModeToggle = document.getElementById('focus-mode-toggle');
    let lastScrollY = window.scrollY;
    let scrollTimeout;

    function initScrollMonitor() {
        if (!focusModeToggle) return;

        focusModeToggle.addEventListener('click', () => {
            const isActive = document.body.classList.toggle('focus-mode-active');
            const status = isActive ? "تفعيل وضع التركيز، قراءة هادئة." : "إلغاء وضع التركيز.";
            if (dialogueBox) dialogueBox.textContent = status;
        });

        window.addEventListener('scroll', () => {
            // إظهار زر التركيز بعد التمرير قليلاً
            if (window.scrollY > 400) {
                 focusModeToggle.classList.remove('hidden');
            } else {
                 focusModeToggle.classList.add('hidden');
            }

            // منطق الروبوت لتحليل سرعة التمرير
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const currentScrollY = window.scrollY;
                const scrollDelta = Math.abs(currentScrollY - lastScrollY);
                lastScrollY = currentScrollY;
                
                if (scrollDelta > 800 && warraq.style.opacity === '1') {
                     if (dialogueBox) {
                         dialogueBox.textContent = "تريث أيها القارئ، لا تفوت جمال الفكرة!";
                         setTimeout(() => { dialogueBox.textContent = ''; }, 4000);
                     }
                }
            }, 300);
        });
    }

    // =======================================================
    // 8. إخفاء شاشة التحميل
    // =======================================================
    const loadingScreen = document.getElementById('loading-screen');
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (loadingScreen) {
                loadingScreen.style.opacity = 0;
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 1000); 
            }
        }, 800); // وقت عرض الشاشة أقصر للسرعة
    });
});
