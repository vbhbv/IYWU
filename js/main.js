document.addEventListener('DOMContentLoaded', () => {

    // =======================================================
    // 1. تحميل البيانات وتشغيل الوظائف الرئيسية
    // =======================================================
    let membersData = { total_members: 0, robot_dialogues: {} };
    
    // محاولة جلب البيانات من ملف JSON
    fetch('data/members.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load members.json');
            }
            return response.json();
        })
        .then(data => {
            membersData = data;
            
            // تشغيل الوظائف التي تعتمد على البيانات
            updateMemberCount(membersData.total_members);
            initWarraq(membersData.robot_dialogues);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            // تشغيل الروبوت برسالة خطأ إذا فشل التحميل
            initWarraq({ welcome: "عذراً أيها القارئ النبيل، تواجه محابرنا عطلاً فنياً مؤقتاً في جلب البيانات." });
        });
        
    // تشغيل وظيفة ظهور العناصر (لا تعتمد على البيانات)
    initScrollReveal();

    // =======================================================
    // 2. تحديث عدد الأعضاء
    // =======================================================
    function updateMemberCount(count) {
        const countDisplay = document.getElementById('member-count-display');
        if (countDisplay) {
            countDisplay.innerHTML = `نحن <span class="highlight">${count}</span> كاتباً وأديباً، نحمل محبرة العراق إلى المستقبل.`;
        }
    }

    // =======================================================
    // 3. إدارة الوضع الليلي (إضاءة المصباح)
    // =======================================================
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const savedMode = localStorage.getItem('darkMode');

    if (savedMode === 'true') {
        document.body.classList.add('dark-mode');
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', isDark);
        });
    }

    // =======================================================
    // 4. الروبوت "الوراق" (أبو حيان) - التفاعل السياقي
    // =======================================================
    const warraq = document.getElementById('the-warraq');
    const dialogueBox = warraq ? warraq.querySelector('.robot-dialogue-box') : null;

    function initWarraq(dialogues) {
        if (!warraq || !dialogueBox) return;

        let currentDialogue;
        
        // أ. المرشد السياحي الأدبي (Contextual Guide)
        switch (document.body.id) {
            case 'homepage':
                currentDialogue = dialogues.welcome || "أهلاً بك أيها القارئ النبيل، في محراب المحبرة الرقمية.";
                break;
            case 'join-page':
                currentDialogue = "لا تتردد في مد يدك، سأرشدك إلى ميثاق الاتحاد وشروط العضوية.";
                break;
            case 'latest-members-page':
                 currentDialogue = "انظر إلى الأقلام الجديدة! لعل أحدهم سيكون نجم المستقبل.";
                break;
            default:
                currentDialogue = dialogues.welcome || "في رحاب الأدب، لا تضل البوصلة.";
        }
        
        // ظهور الروبوت والترحيب بعد فترة
        setTimeout(() => {
            warraq.style.opacity = 1;
            dialogueBox.textContent = currentDialogue;
        }, 2000); 

        // إخفاء الرسالة عند النقر على الروبوت
        warraq.addEventListener('click', () => {
            dialogueBox.textContent = "أتمنى لك رحلة ممتعة في بحور الأدب!";
            setTimeout(() => {
                dialogueBox.textContent = '';
            }, 5000);
        });
        
        // تشغيل مراقب التمرير للتحليل
        initScrollMonitor(dialogues);
    }
    
    // =======================================================
    // 5. إدارة قائمة الهامبرغر (الريشة)
    // =======================================================
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const fullMenu = document.getElementById('full-menu');

    if (hamburgerBtn && fullMenu) {
        hamburgerBtn.addEventListener('click', () => {
            fullMenu.classList.toggle('visible');
            hamburgerBtn.classList.toggle('active');
            // منع التمرير عند فتح القائمة
            document.body.style.overflow = fullMenu.classList.contains('visible') ? 'hidden' : 'auto';
        });
    }

    // =======================================================
    // 6. تأثير الانزلاق الزمني (Time Scroll Reveal)
    // =======================================================
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('.section-scroll-reveal');
        
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

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

    function initScrollMonitor(dialogues) {
        if (!focusModeToggle) return;

        focusModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('focus-mode-active');
            const status = document.body.classList.contains('focus-mode-active') ? "تفعيل وضع التركيز." : "إلغاء وضع التركيز.";
            if (dialogueBox) dialogueBox.textContent = status;
        });

        window.addEventListener('scroll', () => {
            // تحديث إظهار زر التركيز
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
                
                // إذا كان التمرير سريع جداً
                if (scrollDelta > 1000 && warraq.style.opacity === '1') {
                     if (dialogueBox) {
                         dialogueBox.textContent = "مهلاً أيها النبيل، ألم تقع عيناك على جمال العبارة؟"
                         setTimeout(() => { dialogueBox.textContent = ''; }, 5000);
                     }
                }
            }, 250);
        });
    }

    // =======================================================
    // 8. إخفاء شاشة التحميل (بوابة الرافدين)
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
        }, 1500); 
    });

});
                            
