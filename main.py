# main.py
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated
from pydantic import BaseModel
import databases
import sqlalchemy
import os

# =================================================================
# 1. إعدادات قاعدة البيانات (PostgreSQL on Railway)
# =================================================================

# يجب تعيين متغير البيئة هذا على Railway (Connect tab -> Database URL)
# مثال: 'postgresql://user:password@host:port/database_name'
DATABASE_URL = os.environ.get("DATABASE_URL")

if not DATABASE_URL:
    # ⚠️ في حالة التشغيل المحلي، استخدم رابط PostgreSQL المحلي أو افحص متغير البيئة
    print("WARNING: DATABASE_URL not set. Using a placeholder.")
    DATABASE_URL = "sqlite:///./temp_app.db" # Fallback for local testing

database = databases.Database(DATABASE_URL)
metadata = sqlalchemy.MetaData()

# نموذج جدول المستخدمين (لغرض المصادقة - Authentication)
users = sqlalchemy.Table(
    "users",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("email", sqlalchemy.String, unique=True, index=True),
    sqlalchemy.Column("hashed_password", sqlalchemy.String),
    sqlalchemy.Column("is_active", sqlalchemy.Boolean, default=True),
    sqlalchemy.Column("role", sqlalchemy.String, default="member"),
)

# نموذج جدول الأعمال (لغرض عرض الأعمال المميزة)
works = sqlalchemy.Table(
    "works",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("title", sqlalchemy.String, index=True),
    sqlalchemy.Column("author", sqlalchemy.String),
    sqlalchemy.Column("image_url", sqlalchemy.String),
    sqlalchemy.Column("votes", sqlalchemy.Integer, default=0),
    sqlalchemy.Column("featured", sqlalchemy.Boolean, default=False),
)

engine = sqlalchemy.create_engine(DATABASE_URL)
# metadata.create_all(engine) # يجب تشغيل هذا مرة واحدة لإنشاء الجداول

# =================================================================
# 2. نماذج Pydantic للبيانات (Data Models)
# =================================================================

class Token(BaseModel):
    """نموذج لرمز JWT Token"""
    access_token: str
    token_type: str

class UserBase(BaseModel):
    """النموذج الأساسي للمستخدم"""
    email: str

class Work(BaseModel):
    """نموذج للعمل الأدبي المعروض"""
    id: int
    title: str
    author: str
    image_url: str
    votes: int

class Stats(BaseModel):
    """نموذج لإحصائيات العداد"""
    count: int

class AuthorPreview(BaseModel):
    """نموذج لمعاينة الكاتب في الخريطة"""
    name: str
    works_count: int

# =================================================================
# 3. إعدادات الخادم الأساسية و CORS
# =================================================================

app = FastAPI(title="اتحاد الكتاب العراقيين - Railway API")

# يجب تفعيل CORS للسماح للواجهة الأمامية (التي تعمل على نطاق مختلف) بالوصول
origins = [
    "http://localhost",
    "http://localhost:8000",
    "https://your-frontend-url.com", # ⚠️ استبدلها برابط استضافة الواجهة الأمامية
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # للسماح لأي نطاق في مرحلة التطوير
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# دالة إشارات بدء وإغلاق الاتصال
@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

# =================================================================
# 4. نقاط النهاية (Endpoints)
# =================================================================

# 4.1. نقطة نهاية تسجيل الدخول (AUTH_API)
@app.post("/api/auth/login", response_model=Token)
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    """
    تحقق من بيانات المستخدم وارجع رمز JWT.
    (⚠️ هذا مجرد نموذج، يجب إضافة منطق التحقق من الـ Hash وإنشاء JWT فعلي)
    """
    if form_data.username != "writer@union.com" or form_data.password != "123456":
         raise HTTPException(
             status_code=status.HTTP_401_UNAUTHORIZED,
             detail="بيانات الدخول غير صحيحة.",
             headers={"WWW-Authenticate": "Bearer"},
         )
         
    # ⚠️ في الإنتاج، يجب استخدام مكتبة jose لإنشاء رمز JWT
    # هنا يتم إرجاع رمز وهمي لتشغيل الواجهة الأمامية مؤقتاً
    return {"access_token": "dummy_jwt_token_for_user_writer@union.com", "token_type": "bearer"}


# 4.2. نقطة نهاية عداد الأعضاء (COUNT_API)
@app.get("/api/stats/member-count", response_model=Stats)
async def get_member_count():
    # استعلام حقيقي لقاعدة البيانات
    query = users.count() # COUNT(*) FROM users
    count = await database.fetch_val(query)
    
    # ⚠️ استبدال بالرقم الثابت/الوهمي في حال لم يتم إعداد قاعدة البيانات بعد
    if DATABASE_URL.startswith("sqlite"): 
         count = 520
         
    return {"count": count}


# 4.3. نقطة نهاية الأعمال المميزة (WORKS_API)
@app.get("/api/works/featured", response_model=list[Work])
async def get_featured_works():
    query = works.select().where(works.c.featured == True).limit(3)
    results = await database.fetch_all(query)
    
    if not results:
        # بيانات وهمية للعرض إذا لم تكن هناك نتائج حقيقية
        return [
             {"id": 1, "title": "رحلة حبر في دجلة", "author": "أحمد الجنابي", "image_url": "images/work1.jpg", "votes": 45},
             {"id": 2, "title": "أنشودة البصرة القديمة", "author": "سارة الناصر", "image_url": "images/work2.jpg", "votes": 92},
             {"id": 3, "title": "مخطوطة نينوى الأخيرة", "author": "د. خليل الربيعي", "image_url": "images/work3.jpg", "votes": 67},
        ]
        
    return results


# 4.4. نقطة نهاية معاينة الكاتب (AUTHOR_PREVIEW_API)
@app.get("/api/authors/preview/{author_id}", response_model=AuthorPreview)
async def get_author_preview(author_id: int):
    # هنا يجب أن يتم الاستعلام عن جدول المستخدمين والـ works للحصول على الإحصائيات الحقيقية
    
    # بيانات وهمية بناءً على المعرف (ID)
    if author_id == 201:
        name = "فراس الحمداني"
        works_count = 12
    elif author_id == 203:
        name = "نادية العزاوي"
        works_count = 7
    else:
        name = "كاتب جديد"
        works_count = 1

    return {"name": name, "works_count": works_count}

# ⚠️ ملاحظة: نقطة نهاية Vote/Profile الحقيقية تتطلب JWT للحماية
# @app.post("/api/works/vote/{work_id}")
# async def submit_vote(work_id: int, current_user: Annotated[UserBase, Depends(get_current_user)]):
#    ... منطق التصويت ...

