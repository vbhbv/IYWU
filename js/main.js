document.addEventListener('DOMContentLoaded', () => {

    // ... (أكواد تحميل البيانات الأساسية) ...
    
    const warraq = document.getElementById('the-warraq');
    const dialogueBox = warraq ? warraq.querySelector('.robot-dialogue-box') : null;

    // التأكد من الأيقونة الفنية للروبوت
    if (warraq) {
        warraq.querySelector('.warraq-icon').className = 'fas fa-quidditch warraq-icon'; 
    }

    // =======================================================
    // 4. الروبوت "الوراق" (المساعد الفني المرسوم)
    // =======================================================
    
    function getPreciseWelcomeMessage() {
        const hour = new Date().getHours();
        let greeting;

        if (hour >= 4 && hour < 12) {
            greeting = "مرحباً أيها الفنّان. هل رتبت ألوانك؟ اليوم وقت الإلهام.";
        } else if (hour >= 12 && hour < 18) {
            greeting = "يا لك من كاتب مجتهد. لنصنع اليوم مخطوطة لا تُنسى.";
        } else if (hour >= 18 && hour < 22) {
            greeting = "بدأ الليل. الضوء الخافت يثير الأفكار. تفضل ببطء.";
        } else {
            greeting = "في صمت الليل، يرتفع صوت الكلمات. اكتب يا صديقي، اكتب.";
        }

        return `[الورّاق يرسم]: ${greeting}`;
    }

    function initWarraq(dialogues) {
        if (!warraq || !dialogueBox) return;

        const displayMessage = (msg, duration = 6000) => {
            if (dialogueBox.textContent === '') {
                dialogueBox.textContent = msg;
                setTimeout(() => { dialogueBox.textContent = ''; }, duration);
            }
        };

        const initialDialogue = getPreciseWelcomeMessage();
        
        window.addEventListener('load', () => {
            setTimeout(() => {
                warraq.style.opacity = 1;
                displayMessage(initialDialogue, 9000); 
            }, 1000);
        });

        warraq.addEventListener('click', () => {
            const wittyReplies = [
                "لا تنقر بعنف على الورقة! هل هناك نقطة حبر أزعجتك؟",
                "أرى قلمك يتوقف... هل نفدت منك الفكرة أم الحبر؟",
                "هل تفضل أن أرسم لك خريطة الأفكار؟ تفضل بطلبك الفني.",
                "لا تخف من شطب الكلمات. الشطب جزء من الفن.",
            ];
            dialogueBox.textContent = `[الورّاق يناشدك]: ${wittyReplies[Math.floor(Math.random() * wittyReplies.length)]}`;
            setTimeout(() => { dialogueBox.textContent = ''; }, 6000);
        });
        
        initCalmScrollMonitor(displayMessage);
        initEmptyContentAlert(displayMessage); 
    }
    
    // =======================================================
    // 5. مراقب التمرير الهادئ (Calm Scroll Monitor)
    // =======================================================
    function initCalmScrollMonitor(displayMessage) {
        let scrollTimeout;
        let isStoppedReading = false;

        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            isStoppedReading = false;

            scrollTimeout = setTimeout(() => {
                if (!isStoppedReading && window.scrollY > 300) {
                    displayMessage("[تأمل]: توقفت هنا. لابد أن هذا المقطع ترك بقعة حبر في ذاكرتك.", 5000);
                    isStoppedReading = true; 
                }
            }, 2000); 
        });

        window.addEventListener('scroll', () => {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
                displayMessage("[مخطوطة مكتملة]: لقد وصلت إلى نهاية الورقة. اترك توقيعك في الأسفل.", 7000);
            }
        });
    }

    // ... (بقية الأكواد تبقى كما هي) ...

});
