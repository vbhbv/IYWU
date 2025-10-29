/*======================================================================*/
/* CSS لملف المحبرة الرقمية (Style.css) - تصميم "الورقة المخطوطة V10.4"  */
/* تم دمج أنماط تسجيل الدخول والبطاقات الديناميكية.                       */
/*======================================================================*/

/* 1. متغيرات الألوان والخطوط الأساسية */
:root {
    --color-paper: #FFFDF5;            
    --color-ink-dark: #2C3E50;         
    --color-ink-light: #7F8C8D;        
    --color-accent: #8E44AD;           
    --color-highlight: #F39C12;        
    
    --font-heading: 'Reem Kufi Fun', cursive, sans-serif;
    --font-body: 'Vazirmatn', sans-serif;
    --paper-line-height: 38px;
    --border-thickness: 3px;
    --shadow-depth: 10px;
}

/* 2. الوضع الليلي (Dark Mode) */
.dark-mode {
    --color-paper: #1B2631;
    --color-ink-dark: #ECF0F1;
    --color-ink-light: #BDC3C7;
    --color-accent: #9B59B6;
    --color-highlight: #F1C40F;
}

/*======================================================================*/
/* 3. الإعدادات العامة وتأثير الورقة الخلفية                             */
/*======================================================================*/
* { 
    box-sizing: border-box; 
    margin: 0;
    padding: 0;
}
#page-container {
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}
#content-wrap {
    flex-grow: 1;
}

body {
    background-color: var(--color-paper);
    color: var(--color-ink-dark);
    font-family: var(--font-body); 
    line-height: 1.8;
    transition: background-color 0.8s ease, color 0.8s ease;
    
    /* خلفية الورقة (مموجة + مسطرة أفقية وعمودية) */
    background-image: 
        radial-gradient(circle at 10% 10%, rgba(0,0,0,0.05) 1%, transparent 1%),
        radial-gradient(circle at 70% 50%, rgba(0,0,0,0.05) 1%, transparent 1%),
        repeating-linear-gradient(to bottom, var(--color-paper) 0px, var(--color-paper) calc(var(--paper-line-height) - 1px), rgba(var(--color-ink-light), 0.2) calc(var(--paper-line-height) - 1px), rgba(var(--color-ink-light), 0.2) var(--paper-line-height)), 
        repeating-linear-gradient(to left, rgba(var(--color-ink-light), 0.05) 0, rgba(var(--color-ink-light), 0.05) 1px, transparent 1px, transparent 200px);
    
    background-size: 100% 100%, 100% 100%, 100% var(--paper-line-height), 100% 100%;
    background-attachment: fixed;
}

.content-wrapper {
    max-width: 900px;
    margin: 0 auto;
    padding: 30px 20px;
    padding-top: 100px;
    position: relative;
    z-index: 10;
    
    background-color: rgba(255, 255, 255, 0.6); 
    backdrop-filter: blur(2px);
    transition: background-color 0.5s ease, backdrop-filter 0.5s ease;
}

/* 4. الخطوط وتأثيرات الحبر (Typography & Ink Bleed) */
h1, h2, h3 {
    font-family: var(--font-heading); 
    font-weight: 700 !important; 
    line-height: 1.3;
}

.main-header .logo-text {
    font-family: var(--font-heading) !important;
    font-size: 1.7rem; 
}

.ink-bleed-title {
    filter: url(#ink-bleed); 
    text-shadow: 2px 2px 0 rgba(44, 62, 80, 0.4); 
    mix-blend-mode: multiply; 
    display: inline-block; 
}
.dark-mode .ink-bleed-title {
    mix-blend-mode: normal;
}
/* إعدادات Typewriter Animation */
.handwritten-animation {
    white-space: nowrap;
    overflow: hidden;
}

/* حاوية القلم والقلم نفسه */
.handwritten-title-container {
    position: relative;
    display: flex;
    align-items: center;
}
.pen-mover-icon {
    position: absolute;
    font-size: 2rem;
    color: var(--color-accent);
    z-index: 10;
    transition: transform 0.07s linear; /* تحديث هذه القيمة في JS أيضاً */
}


/* 5. الحواف والحدود (Hand-Drawn Borders & Fold Effect) */
.hand-drawn-border {
    border: var(--border-thickness) solid var(--color-ink-dark);
    box-shadow: var(--shadow-depth) var(--shadow-depth) 0 0 var(--color-ink-light); 
    transition: box-shadow 0.3s, transform 0.3s;
    border-radius: 10px 15px 10px 15px; 
    padding: 40px;
    margin: 30px 0;
    background-color: var(--color-paper);
    filter: url(#rough-filter); 
    overflow: hidden; 
    position: relative; 
}
.hand-drawn-border:hover {
    box-shadow: calc(var(--shadow-depth) - 2px) calc(var(--shadow-depth) - 2px) 0 0 var(--color-ink-light);
    transform: translateY(-2px); 
}

/* تأثير الثني (Fold Effect) */
.paper-fold {
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
    z-index: 50;
    filter: url(#rough-filter);
    opacity: 0.2;
}
.top-left {
    top: 0;
    left: 0;
    border-width: 40px 40px 0 0;
    border-color: var(--color-ink-light) transparent transparent transparent;
    transform: rotate(90deg);
}
.bottom-right {
    bottom: 0;
    right: 0;
    border-width: 40px 40px 0 0;
    border-color: var(--color-ink-light) transparent transparent transparent;
    transform: rotate(-90deg);
}


/* 6. الأزرار والتفاعلات (Buttons & Micro-Interactions) */
.btn {
    border-radius: 5px 15px 5px 10px;
    border: 2px solid var(--color-ink-dark);
    position: relative;
    transition: all 0.2s;
    filter: url(#rough-filter);
    text-decoration: none;
    padding: 10px 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-weight: 700;
    box-shadow: 3px 3px 0 var(--color-ink-dark); 
}
.btn:hover {
    box-shadow: 1px 1px 0 var(--color-ink-dark); 
    transform: translateY(1px); 
}
.primary-btn {
    background-color: var(--color-ink-dark);
    color: var(--color-paper) !important;
}
.secondary-btn {
    background-color: transparent;
    color: var(--color-ink-dark) !important;
}
.seal-effect {
    padding-right: 50px; 
}
.seal-effect::after {
    content: '\f02d'; 
    font-family: 'Font Awesome 6 Free';
    font-weight: 900;
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%) rotate(5deg);
    font-size: 1.4rem; 
    color: var(--color-accent); 
    border: 3px solid var(--color-ink-dark);
    border-radius: 50%;
    padding: 6px;
    box-shadow: 2px 2px 0 var(--color-ink-light); 
    transition: transform 0.3s, opacity 0.3s;
}
.btn:hover.seal-effect::after {
    transform: translateY(-50%) rotate(0deg) scale(1.1);
    opacity: 0.8;
}

/* 7. شريط التنقل العلوي (Header) */
.main-header {
    background-color: var(--color-paper);
    border-bottom: 2px dashed var(--color-ink-light);
    border-left: 2px dashed var(--color-accent);
    border-right: 2px dashed var(--color-accent);
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
    padding: 15px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    filter: url(#rough-filter);
    transition: background-color 0.8s ease;
}
.header-nav {
    display: flex; 
    align-items: center;
}
.header-nav a { 
    display: none; 
}
.mobile-only {
    display: block !important; 
}

/* زر الملف الشخصي بعد الدخول */
#profile-btn {
    margin-right: 10px;
    color: var(--color-accent);
}


/* 8. القائمة الجانبية (Sidebar) */
.sidebar-menu {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--color-ink-dark); 
    z-index: 10000;
    transform: translate3d(100%, 0, 0); 
    transition: transform 0.3s ease-out;
    padding-top: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--color-paper);
}
.sidebar-menu.active { 
    transform: translate3d(0, 0, 0);
}
.sidebar-menu a {
    color: var(--color-paper); 
    text-decoration: none;
    font-size: 1.5rem;
    padding: 15px 0;
    transition: color 0.3s;
    filter: url(#rough-filter); 
}
.sidebar-menu .close-btn {
    position: absolute;
    top: 20px;
    left: 20px; 
    color: var(--color-paper);
    background-color: transparent;
    border: none;
    font-size: 2rem;
    cursor: pointer;
}

/* 9. زر "انضم الآن" العائم */
.write-now-btn {
    position: fixed;
    bottom: 30px; 
    right: 30px; 
    z-index: 900;
    display: flex;
    align-items: center;
    background-color: var(--color-accent);
    color: var(--color-paper);
    padding: 15px 20px;
    border-radius: 50px;
    box-shadow: 4px 4px 0 var(--color-ink-dark);
    text-decoration: none;
    transition: transform 0.3s, box-shadow 0.3s;
    filter: url(#rough-filter);
}
.write-now-btn:hover {
    transform: translateY(-3px);
    box-shadow: 6px 6px 0 var(--color-ink-dark);
}
.floating-quill {
    font-size: 1.5rem;
    margin-left: 10px;
    transform: rotate(15deg);
}


/*======================================================================*/
/* 10. أنماط معرض الأعمال المميزة (Featured Works Gallery)               */
/*======================================================================*/

.gallery-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 30px;
    margin-top: 30px;
}
.work-card {
    border: 1px solid var(--color-ink-light);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 5px 5px 0 var(--color-ink-light);
    background-color: var(--color-paper);
    transition: transform 0.3s, box-shadow 0.3s;
    position: relative;
    filter: url(#rough-filter);
    opacity: 0; /* مخفي للأنيميشن */
    transform: translateY(20px);
}

/* الميزة الجمالية: تأثير التلاشي المتسلسل */
.work-card.animate-show {
    animation: fadeInSlide 0.6s ease-out forwards;
}
@keyframes fadeInSlide {
    to { opacity: 1; transform: translateY(0); }
}

/* الميزة الجمالية: تأثير طية الورقة عند التمرير */
.work-card:hover {
    transform: perspective(1000px) rotateX(2deg) translateY(-5px); 
    box-shadow: 10px 10px 0 var(--color-accent);
}

.work-card .card-image {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-bottom: 2px dashed var(--color-ink-light);
}
.work-card .card-content {
    padding: 15px;
}
.card-title {
    font-size: 1.2rem;
    color: var(--color-accent);
    margin-bottom: 5px;
}
.card-author {
    font-size: 0.95rem;
    color: var(--color-ink-light);
    margin-bottom: 10px;
}


/*======================================================================*/
/* 11. أنماط تسجيل الدخول والـ Modal                                     */
/*======================================================================*/

.login-modal {
    display: none; 
    position: fixed;
    z-index: 2000; 
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6); 
    display: flex; 
    justify-content: center;
    align-items: center;
}

.modal-content {
    background-color: var(--color-paper); 
    border: var(--border-thickness) solid var(--color-ink-dark);
    box-shadow: var(--shadow-depth) var(--shadow-depth) 0 0 var(--color-ink-light); 
    border-radius: 12px;
    padding: 30px;
    width: 90%; 
    max-width: 400px; 
    position: relative;
    filter: url(#rough-filter); 
    animation: modal-fade-in 0.4s ease-out;
}

@keyframes modal-fade-in {
    from { opacity: 0; transform: translateY(-50px); }
    to { opacity: 1; transform: translateY(0); }
}

.modal-content .close-btn {
    position: absolute;
    top: 10px;
    left: 10px; 
    font-size: 1.5em;
    cursor: pointer;
    background: none;
    border: none;
    color: var(--color-ink-dark);
    filter: url(#rough-filter);
}

.auth-form .form-group {
    margin-bottom: 20px;
}
.input-paper-style {
    width: 100%;
    padding: 10px 0;
    border: none;
    border-bottom: 2px dashed var(--color-ink-light);
    background-color: transparent;
    font-family: var(--font-body);
    font-size: 1.1rem;
    color: var(--color-ink-dark);
    line-height: 1.5;
    transition: border-bottom 0.3s;
}

.input-paper-style:focus {
    outline: none;
    border-bottom: 2px solid var(--color-accent);
}

.full-width-btn {
    width: 100%;
    margin-top: 20px;
}

.error-message {
    font-size: 0.95rem;
    background-color: #ffeaea; 
    color: #cc0000;
    border: 2px dashed #cc0000;
    padding: 10px;
    margin-top: 15px;
    border-radius: 6px;
    font-family: var(--font-body);
}

.error-message[style*="008000"] { 
    background-color: #eaf8ea !important; 
    color: #008000 !important;
    border-color: #008000 !important;
}


/*======================================================================*/
/* 12. أنماط خريطة أصوات المدن الأدبية (Micro-Profile)                   */
/*======================================================================*/

.map-style-container {
    position: relative;
    width: 100%;
    height: 500px; 
    padding: 0;
    overflow: hidden;
    background-color: var(--color-paper);
    border: 3px solid var(--color-ink-light);
}

.map-outline {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #ECECEC; 
    background-position: center;
    background-size: cover;
    opacity: 0.8;
}

.city-point {
    position: absolute;
    width: 65px; 
    height: 65px;
    background-color: var(--color-accent);
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: var(--color-paper);
    cursor: pointer;
    box-shadow: 0 0 0 5px rgba(142, 68, 173, 0.4); 
    transition: all 0.3s ease;
    text-decoration: none;
    font-size: 0.8rem;
    z-index: 20;
    filter: url(#rough-filter); 
}

/* الميزة الجمالية: فقاعة معلومات الملف الشخصي المصغرة */
.micro-profile-tooltip {
    position: fixed; /* يجب أن تكون ثابتة لتحريكها بـ JS */
    z-index: 3000;
    background-color: var(--color-ink-dark);
    color: var(--color-paper);
    padding: 10px 15px;
    border-radius: 5px;
    pointer-events: none; /* لا يجب أن تعترض النقر */
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    border: 1px solid var(--color-accent);
    font-family: var(--font-body);
    font-size: 0.9rem;
    line-height: 1.5;
}
.author-name-tooltip {
    font-weight: 700;
    color: var(--color-highlight);
    margin-bottom: 3px;
}
.author-stats-tooltip {
    color: var(--color-ink-light);
}

/* 13. استجابة التصميم (Media Queries) */
@media (max-width: 600px) {
    /* ... (Media Queries الأخرى هنا) ... */
     #hero .hero-content h1.ink-bleed-title,
     .about-union-section h1.ink-bleed-title {
        font-size: 2rem; 
        white-space: normal; 
        padding: 0; 
        filter: none; 
        text-shadow: none;
    }
    .main-header .logo-text {
        font-size: 1.3rem !important; 
    }
}
