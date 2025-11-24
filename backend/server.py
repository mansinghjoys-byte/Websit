from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, Header
from fastapi.responses import Response, PlainTextResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
import jwt
import stripe
import redis.asyncio as redis
import json

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Redis connection
redis_client = redis.from_url(os.environ.get('REDIS_URL', 'redis://localhost:6379'), decode_responses=True)

# Redis helper functions with error handling
async def safe_redis_get(key: str) -> Optional[str]:
    """Safely get from Redis, returns None if Redis is unavailable"""
    try:
        return await redis_client.get(key)
    except Exception as e:
        logging.warning(f"Redis get failed for key {key}: {e}")
        return None

async def safe_redis_setex(key: str, time: int, value: str):
    """Safely set with expiration in Redis, silently fails if Redis is unavailable"""
    try:
        await redis_client.setex(key, time, value)
    except Exception as e:
        logging.warning(f"Redis setex failed for key {key}: {e}")

async def safe_redis_delete(key: str):
    """Safely delete from Redis, silently fails if Redis is unavailable"""
    try:
        await redis_client.delete(key)
    except Exception as e:
        logging.warning(f"Redis delete failed for key {key}: {e}")

# Stripe configuration
stripe.api_key = os.environ.get('STRIPE_SECRET_KEY', '')

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
JWT_SECRET = os.environ.get('JWT_SECRET_KEY')
JWT_ALGORITHM = os.environ.get('JWT_ALGORITHM', 'HS256')
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get('ACCESS_TOKEN_EXPIRE_MINUTES', 1440))

# Create the main app
app = FastAPI(title="VIBE Wellness API")
api_router = APIRouter(prefix="/api")

# ==================== Models ====================

class UserRole:
    CUSTOMER = "customer"
    SUPERADMIN = "superadmin"

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    role: str = UserRole.CUSTOMER
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: Dict[str, Any]

class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    regular_price: float
    sale_price: float
    stripe_product_id: str = ""
    stripe_price_id: str = ""
    features: List[str] = []
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProductCreate(BaseModel):
    name: str
    description: str
    regular_price: float
    sale_price: float
    stripe_product_id: str = ""
    stripe_price_id: str = ""
    features: List[str] = []
    is_active: bool = True

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    regular_price: Optional[float] = None
    sale_price: Optional[float] = None
    stripe_product_id: Optional[str] = None
    stripe_price_id: Optional[str] = None
    features: Optional[List[str]] = None
    is_active: Optional[bool] = None

class OrderStatus:
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"

class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    product_id: str
    quantity: int
    amount: float
    stripe_payment_intent_id: str = ""
    status: str = OrderStatus.PENDING
    customer_email: str
    customer_name: str = ""
    shipping_address: Dict[str, str] = {}
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class OrderCreate(BaseModel):
    product_id: str
    quantity: int
    customer_email: str
    customer_name: str = ""
    shipping_address: Dict[str, str] = {}

class Testimonial(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    location: str = ""
    text: str
    rating: int = 5
    is_active: bool = True
    order: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TestimonialCreate(BaseModel):
    name: str
    location: str = ""
    text: str
    rating: int = 5
    is_active: bool = True
    order: int = 0

class FAQ(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    question: str
    answer: str
    is_active: bool = True
    order: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class FAQCreate(BaseModel):
    question: str
    answer: str
    is_active: bool = True
    order: int = 0

class SEOSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = "default"
    meta_title: str
    meta_description: str
    keywords: List[str]
    og_title: str
    og_description: str
    og_image: str
    canonical_url: str
    json_ld: Dict[str, Any]
    robots_txt: str
    sitemap_xml: str
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SEOSettingsUpdate(BaseModel):
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    keywords: Optional[List[str]] = None
    og_title: Optional[str] = None
    og_description: Optional[str] = None
    og_image: Optional[str] = None
    canonical_url: Optional[str] = None
    json_ld: Optional[Dict[str, Any]] = None
    robots_txt: Optional[str] = None
    sitemap_xml: Optional[str] = None

class BlogPost(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    slug: str
    excerpt: str
    content: str
    featured_image: str = ""
    author: str = "Smita"
    tags: List[str] = []
    is_published: bool = False
    meta_title: str = ""
    meta_description: str = ""
    published_date: Optional[datetime] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class BlogPostCreate(BaseModel):
    title: str
    slug: str
    excerpt: str
    content: str
    featured_image: str = ""
    author: str = "Smita"
    tags: List[str] = []
    is_published: bool = False
    meta_title: str = ""
    meta_description: str = ""

class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    featured_image: Optional[str] = None
    author: Optional[str] = None
    tags: Optional[List[str]] = None
    is_published: Optional[bool] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None

class PaymentIntentCreate(BaseModel):
    product_id: str
    quantity: int

# ==================== Utilities ====================

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

async def get_current_user(authorization: str = Header(None)) -> Dict[str, Any]:
    if not authorization or not authorization.startswith('Bearer '):
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.split(' ')[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_superadmin_user(current_user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
    if current_user.get("role") != UserRole.SUPERADMIN:
        raise HTTPException(status_code=403, detail="Superadmin access required")
    return current_user

# ==================== Auth Routes ====================

@api_router.post("/auth/register", response_model=Token)
async def register(user_input: UserCreate):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_input.email}, {"_id": 0})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    hashed_password = hash_password(user_input.password)
    user = User(email=user_input.email, role=UserRole.CUSTOMER)
    
    user_doc = user.model_dump()
    user_doc['password'] = hashed_password
    user_doc['created_at'] = user_doc['created_at'].isoformat()
    
    await db.users.insert_one(user_doc)
    
    # Create token
    access_token = create_access_token(data={"sub": user.id, "email": user.email, "role": user.role})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {"id": user.id, "email": user.email, "role": user.role}
    }

@api_router.post("/auth/login", response_model=Token)
async def login(user_input: UserLogin):
    user = await db.users.find_one({"email": user_input.email}, {"_id": 0})
    if not user or not verify_password(user_input.password, user['password']):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token = create_access_token(data={"sub": user['id'], "email": user['email'], "role": user['role']})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {"id": user['id'], "email": user['email'], "role": user['role']}
    }

@api_router.get("/auth/me")
async def get_me(current_user: Dict[str, Any] = Depends(get_current_user)):
    return {"id": current_user['id'], "email": current_user['email'], "role": current_user['role']}

# ==================== Product Routes ====================

@api_router.get("/products", response_model=List[Product])
async def get_products():
    # Try cache first
    cached = await safe_redis_get("products:all")
    if cached:
        products = json.loads(cached)
        for p in products:
            if isinstance(p.get('created_at'), str):
                p['created_at'] = datetime.fromisoformat(p['created_at'])
        return products
    
    # Fetch from DB
    products = await db.products.find({"is_active": True}, {"_id": 0}).to_list(100)
    for p in products:
        if isinstance(p.get('created_at'), str):
            p['created_at'] = datetime.fromisoformat(p['created_at'])
    
    # Cache for 5 minutes
    cache_data = []
    for p in products:
        p_copy = p.copy()
        if isinstance(p_copy.get('created_at'), datetime):
            p_copy['created_at'] = p_copy['created_at'].isoformat()
        cache_data.append(p_copy)
    await safe_redis_setex("products:all", 300, json.dumps(cache_data))
    
    return products

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if isinstance(product.get('created_at'), str):
        product['created_at'] = datetime.fromisoformat(product['created_at'])
    return product

@api_router.post("/products", response_model=Product)
async def create_product(product_input: ProductCreate, admin: Dict[str, Any] = Depends(get_superadmin_user)):
    product = Product(**product_input.model_dump())
    product_doc = product.model_dump()
    product_doc['created_at'] = product_doc['created_at'].isoformat()
    
    await db.products.insert_one(product_doc)
    
    # Invalidate cache
    await safe_redis_delete("products:all")
    
    return product

@api_router.put("/products/{product_id}", response_model=Product)
async def update_product(product_id: str, product_input: ProductUpdate, admin: Dict[str, Any] = Depends(get_superadmin_user)):
    existing = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = {k: v for k, v in product_input.model_dump().items() if v is not None}
    if update_data:
        await db.products.update_one({"id": product_id}, {"$set": update_data})
    
    updated = await db.products.find_one({"id": product_id}, {"_id": 0})
    if isinstance(updated.get('created_at'), str):
        updated['created_at'] = datetime.fromisoformat(updated['created_at'])
    
    # Invalidate cache
    await redis_client.delete("products:all")
    
    return updated

@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str, admin: Dict[str, Any] = Depends(get_superadmin_user)):
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Invalidate cache
    await redis_client.delete("products:all")
    
    return {"message": "Product deleted"}

# ==================== Stripe Payment Routes ====================

@api_router.post("/stripe/create-payment-intent")
async def create_payment_intent(payment_data: PaymentIntentCreate, current_user: Dict[str, Any] = Depends(get_current_user)):
    if not stripe.api_key:
        raise HTTPException(status_code=500, detail="Stripe not configured")
    
    product = await db.products.find_one({"id": payment_data.product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    amount = int(product['sale_price'] * payment_data.quantity * 100)  # Convert to cents
    
    try:
        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency="usd",
            metadata={
                "product_id": payment_data.product_id,
                "user_id": current_user['id'],
                "quantity": payment_data.quantity
            }
        )
        
        return {
            "clientSecret": intent.client_secret,
            "amount": amount,
            "publishableKey": os.environ.get('STRIPE_PUBLISHABLE_KEY', '')
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/stripe/webhook")
async def stripe_webhook(request: dict):
    # Handle Stripe webhook events
    # In production, verify webhook signature
    return {"received": True}

# ==================== Order Routes ====================

@api_router.post("/orders", response_model=Order)
async def create_order(order_input: OrderCreate, current_user: Dict[str, Any] = Depends(get_current_user)):
    product = await db.products.find_one({"id": order_input.product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    amount = product['sale_price'] * order_input.quantity
    
    order = Order(
        user_id=current_user['id'],
        product_id=order_input.product_id,
        quantity=order_input.quantity,
        amount=amount,
        customer_email=order_input.customer_email,
        customer_name=order_input.customer_name,
        shipping_address=order_input.shipping_address,
        status=OrderStatus.PENDING
    )
    
    order_doc = order.model_dump()
    order_doc['created_at'] = order_doc['created_at'].isoformat()
    
    await db.orders.insert_one(order_doc)
    
    return order

@api_router.get("/orders", response_model=List[Order])
async def get_user_orders(current_user: Dict[str, Any] = Depends(get_current_user)):
    if current_user['role'] == UserRole.SUPERADMIN:
        orders = await db.orders.find({}, {"_id": 0}).to_list(1000)
    else:
        orders = await db.orders.find({"user_id": current_user['id']}, {"_id": 0}).to_list(100)
    
    for order in orders:
        if isinstance(order.get('created_at'), str):
            order['created_at'] = datetime.fromisoformat(order['created_at'])
    
    return orders

@api_router.get("/orders/{order_id}", response_model=Order)
async def get_order(order_id: str, current_user: Dict[str, Any] = Depends(get_current_user)):
    order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if current_user['role'] != UserRole.SUPERADMIN and order['user_id'] != current_user['id']:
        raise HTTPException(status_code=403, detail="Access denied")
    
    if isinstance(order.get('created_at'), str):
        order['created_at'] = datetime.fromisoformat(order['created_at'])
    
    return order

@api_router.put("/orders/{order_id}/status")
async def update_order_status(order_id: str, status: str, admin: Dict[str, Any] = Depends(get_superadmin_user)):
    result = await db.orders.update_one({"id": order_id}, {"$set": {"status": status}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": "Order status updated"}

# ==================== Testimonial Routes ====================

@api_router.get("/testimonials", response_model=List[Testimonial])
async def get_testimonials():
    testimonials = await db.testimonials.find({"is_active": True}, {"_id": 0}).sort("order", 1).to_list(100)
    for t in testimonials:
        if isinstance(t.get('created_at'), str):
            t['created_at'] = datetime.fromisoformat(t['created_at'])
    return testimonials

@api_router.post("/testimonials", response_model=Testimonial)
async def create_testimonial(testimonial_input: TestimonialCreate, admin: Dict[str, Any] = Depends(get_superadmin_user)):
    testimonial = Testimonial(**testimonial_input.model_dump())
    testimonial_doc = testimonial.model_dump()
    testimonial_doc['created_at'] = testimonial_doc['created_at'].isoformat()
    
    await db.testimonials.insert_one(testimonial_doc)
    return testimonial

@api_router.put("/testimonials/{testimonial_id}", response_model=Testimonial)
async def update_testimonial(testimonial_id: str, testimonial_input: TestimonialCreate, admin: Dict[str, Any] = Depends(get_superadmin_user)):
    update_data = testimonial_input.model_dump()
    result = await db.testimonials.update_one({"id": testimonial_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    
    updated = await db.testimonials.find_one({"id": testimonial_id}, {"_id": 0})
    if isinstance(updated.get('created_at'), str):
        updated['created_at'] = datetime.fromisoformat(updated['created_at'])
    return updated

@api_router.delete("/testimonials/{testimonial_id}")
async def delete_testimonial(testimonial_id: str, admin: Dict[str, Any] = Depends(get_superadmin_user)):
    result = await db.testimonials.delete_one({"id": testimonial_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return {"message": "Testimonial deleted"}

# ==================== FAQ Routes ====================

@api_router.get("/faqs", response_model=List[FAQ])
async def get_faqs():
    faqs = await db.faqs.find({"is_active": True}, {"_id": 0}).sort("order", 1).to_list(100)
    for f in faqs:
        if isinstance(f.get('created_at'), str):
            f['created_at'] = datetime.fromisoformat(f['created_at'])
    return faqs

@api_router.post("/faqs", response_model=FAQ)
async def create_faq(faq_input: FAQCreate, admin: Dict[str, Any] = Depends(get_superadmin_user)):
    faq = FAQ(**faq_input.model_dump())
    faq_doc = faq.model_dump()
    faq_doc['created_at'] = faq_doc['created_at'].isoformat()
    
    await db.faqs.insert_one(faq_doc)
    return faq

@api_router.put("/faqs/{faq_id}", response_model=FAQ)
async def update_faq(faq_id: str, faq_input: FAQCreate, admin: Dict[str, Any] = Depends(get_superadmin_user)):
    update_data = faq_input.model_dump()
    result = await db.faqs.update_one({"id": faq_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="FAQ not found")
    
    updated = await db.faqs.find_one({"id": faq_id}, {"_id": 0})
    if isinstance(updated.get('created_at'), str):
        updated['created_at'] = datetime.fromisoformat(updated['created_at'])
    return updated

@api_router.delete("/faqs/{faq_id}")
async def delete_faq(faq_id: str, admin: Dict[str, Any] = Depends(get_superadmin_user)):
    result = await db.faqs.delete_one({"id": faq_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="FAQ not found")
    return {"message": "FAQ deleted"}

# ==================== SEO Routes ====================

@api_router.get("/seo")
async def get_seo_settings():
    # Try cache first
    cached = await redis_client.get("seo:settings")
    if cached:
        settings = json.loads(cached)
        if isinstance(settings.get('updated_at'), str):
            settings['updated_at'] = datetime.fromisoformat(settings['updated_at'])
        return settings
    
    settings = await db.seo_settings.find_one({"id": "default"}, {"_id": 0})
    if not settings:
        # Return default SEO settings
        default_seo = {
            "id": "default",
            "meta_title": "VIBE for Wellness | Portable PEMF Device for Natural Healing",
            "meta_description": "Discover the VIBE device, a pocket-sized PEMF therapy tool that helps restore balance, relieve stress, and recharge energy naturally. NASA-tested technology.",
            "keywords": ["PEMF therapy", "frequency healing", "portable wellness device", "energy balance", "VIBE device", "natural healing", "stress relief"],
            "og_title": "VIBE for Wellness - Feel Better. Naturally.",
            "og_description": "Pocket PEMF powerhouse designed by NASA engineer. Optimize cellular energy, reduce inflammation, restore mental clarity.",
            "og_image": "/images/vibe-og.jpg",
            "canonical_url": os.environ.get('SITE_URL', 'https://vibeforwellness.com'),
            "json_ld": {},
            "robots_txt": "User-agent: *\nAllow: /\nSitemap: https://vibeforwellness.com/sitemap.xml",
            "sitemap_xml": "",
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        return default_seo
    
    if isinstance(settings.get('updated_at'), str):
        settings['updated_at'] = datetime.fromisoformat(settings['updated_at'])
    
    # Cache for 10 minutes
    cache_data = settings.copy()
    if isinstance(cache_data.get('updated_at'), datetime):
        cache_data['updated_at'] = cache_data['updated_at'].isoformat()
    await redis_client.setex("seo:settings", 600, json.dumps(cache_data))
    
    return settings

@api_router.put("/seo")
async def update_seo_settings(seo_input: SEOSettingsUpdate, admin: Dict[str, Any] = Depends(get_superadmin_user)):
    update_data = {k: v for k, v in seo_input.model_dump().items() if v is not None}
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    result = await db.seo_settings.update_one(
        {"id": "default"},
        {"$set": update_data},
        upsert=True
    )
    
    settings = await db.seo_settings.find_one({"id": "default"}, {"_id": 0})
    if isinstance(settings.get('updated_at'), str):
        settings['updated_at'] = datetime.fromisoformat(settings['updated_at'])
    
    # Invalidate cache
    await redis_client.delete("seo:settings")
    
    return settings

# ==================== Public SEO Routes ====================

@api_router.get("/robots.txt", response_class=PlainTextResponse)
async def get_robots_txt():
    settings = await db.seo_settings.find_one({"id": "default"}, {"_id": 0})
    if settings and settings.get('robots_txt'):
        return settings['robots_txt']
    return "User-agent: *\nAllow: /\nSitemap: https://vibeforwellness.com/sitemap.xml"

@api_router.get("/sitemap.xml", response_class=Response)
async def get_sitemap_xml():
    settings = await db.seo_settings.find_one({"id": "default"}, {"_id": 0})
    if settings and settings.get('sitemap_xml'):
        return Response(content=settings['sitemap_xml'], media_type="application/xml")
    
    # Generate basic sitemap
    site_url = os.environ.get('SITE_URL', 'https://vibeforwellness.com')
    sitemap = f'''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>{site_url}</loc>
        <lastmod>{datetime.now(timezone.utc).strftime('%Y-%m-%d')}</lastmod>
        <priority>1.0</priority>
    </url>
</urlset>'''
    return Response(content=sitemap, media_type="application/xml")

# ==================== Blog Routes ====================

@api_router.get("/blog", response_model=List[BlogPost])
async def get_blog_posts(published_only: bool = True):
    query = {"is_published": True} if published_only else {}
    posts = await db.blog_posts.find(query, {"_id": 0}).sort("published_date", -1).to_list(100)
    for post in posts:
        if isinstance(post.get('created_at'), str):
            post['created_at'] = datetime.fromisoformat(post['created_at'])
        if isinstance(post.get('updated_at'), str):
            post['updated_at'] = datetime.fromisoformat(post['updated_at'])
        if post.get('published_date') and isinstance(post['published_date'], str):
            post['published_date'] = datetime.fromisoformat(post['published_date'])
    return posts

@api_router.get("/blog/{slug}", response_model=BlogPost)
async def get_blog_post_by_slug(slug: str):
    post = await db.blog_posts.find_one({"slug": slug, "is_published": True}, {"_id": 0})
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    if isinstance(post.get('created_at'), str):
        post['created_at'] = datetime.fromisoformat(post['created_at'])
    if isinstance(post.get('updated_at'), str):
        post['updated_at'] = datetime.fromisoformat(post['updated_at'])
    if post.get('published_date') and isinstance(post['published_date'], str):
        post['published_date'] = datetime.fromisoformat(post['published_date'])
    
    return post

@api_router.post("/blog", response_model=BlogPost)
async def create_blog_post(post_input: BlogPostCreate, admin: Dict[str, Any] = Depends(get_superadmin_user)):
    # Check if slug already exists
    existing = await db.blog_posts.find_one({"slug": post_input.slug}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")
    
    post = BlogPost(**post_input.model_dump())
    if post_input.is_published and not post.published_date:
        post.published_date = datetime.now(timezone.utc)
    
    post_doc = post.model_dump()
    post_doc['created_at'] = post_doc['created_at'].isoformat()
    post_doc['updated_at'] = post_doc['updated_at'].isoformat()
    if post_doc.get('published_date'):
        post_doc['published_date'] = post_doc['published_date'].isoformat()
    
    await db.blog_posts.insert_one(post_doc)
    return post

@api_router.put("/blog/{post_id}", response_model=BlogPost)
async def update_blog_post(post_id: str, post_input: BlogPostUpdate, admin: Dict[str, Any] = Depends(get_superadmin_user)):
    existing = await db.blog_posts.find_one({"id": post_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    # Check slug uniqueness if being changed
    if post_input.slug and post_input.slug != existing.get('slug'):
        slug_exists = await db.blog_posts.find_one({"slug": post_input.slug}, {"_id": 0})
        if slug_exists:
            raise HTTPException(status_code=400, detail="Slug already exists")
    
    update_data = {k: v for k, v in post_input.model_dump().items() if v is not None}
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    # Set published_date when publishing for the first time
    if post_input.is_published and not existing.get('published_date'):
        update_data['published_date'] = datetime.now(timezone.utc).isoformat()
    
    await db.blog_posts.update_one({"id": post_id}, {"$set": update_data})
    
    updated = await db.blog_posts.find_one({"id": post_id}, {"_id": 0})
    if isinstance(updated.get('created_at'), str):
        updated['created_at'] = datetime.fromisoformat(updated['created_at'])
    if isinstance(updated.get('updated_at'), str):
        updated['updated_at'] = datetime.fromisoformat(updated['updated_at'])
    if updated.get('published_date') and isinstance(updated['published_date'], str):
        updated['published_date'] = datetime.fromisoformat(updated['published_date'])
    
    return updated

@api_router.delete("/blog/{post_id}")
async def delete_blog_post(post_id: str, admin: Dict[str, Any] = Depends(get_superadmin_user)):
    result = await db.blog_posts.delete_one({"id": post_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return {"message": "Blog post deleted"}

@api_router.get("/admin/blog", response_model=List[BlogPost])
async def get_all_blog_posts_admin(admin: Dict[str, Any] = Depends(get_superadmin_user)):
    posts = await db.blog_posts.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    for post in posts:
        if isinstance(post.get('created_at'), str):
            post['created_at'] = datetime.fromisoformat(post['created_at'])
        if isinstance(post.get('updated_at'), str):
            post['updated_at'] = datetime.fromisoformat(post['updated_at'])
        if post.get('published_date') and isinstance(post['published_date'], str):
            post['published_date'] = datetime.fromisoformat(post['published_date'])
    return posts

# ==================== Admin Stats ====================

@api_router.get("/admin/stats")
async def get_admin_stats(admin: Dict[str, Any] = Depends(get_superadmin_user)):
    total_users = await db.users.count_documents({"role": UserRole.CUSTOMER})
    total_orders = await db.orders.count_documents({})
    completed_orders = await db.orders.count_documents({"status": OrderStatus.COMPLETED})
    pending_orders = await db.orders.count_documents({"status": OrderStatus.PENDING})
    
    # Calculate revenue
    pipeline = [
        {"$match": {"status": OrderStatus.COMPLETED}},
        {"$group": {"_id": None, "total_revenue": {"$sum": "$amount"}}}
    ]
    revenue_result = await db.orders.aggregate(pipeline).to_list(1)
    total_revenue = revenue_result[0]['total_revenue'] if revenue_result else 0
    
    return {
        "total_users": total_users,
        "total_orders": total_orders,
        "completed_orders": completed_orders,
        "pending_orders": pending_orders,
        "total_revenue": total_revenue
    }

@api_router.get("/admin/users")
async def get_all_users(admin: Dict[str, Any] = Depends(get_superadmin_user)):
    users = await db.users.find({}, {"_id": 0, "password": 0}).to_list(1000)
    for user in users:
        if isinstance(user.get('created_at'), str):
            user['created_at'] = datetime.fromisoformat(user['created_at'])
    return users

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    # Create superadmin if not exists
    superadmin_email = "amist.joys@gmail.com"
    existing_admin = await db.users.find_one({"email": superadmin_email}, {"_id": 0})
    
    if not existing_admin:
        admin_user = User(
            email=superadmin_email,
            role=UserRole.SUPERADMIN
        )
        admin_doc = admin_user.model_dump()
        admin_doc['password'] = hash_password("Admin@123")
        admin_doc['created_at'] = admin_doc['created_at'].isoformat()
        
        await db.users.insert_one(admin_doc)
        logger.info(f"Superadmin created: {superadmin_email}")
    
    # Create default product if none exists
    product_count = await db.products.count_documents({})
    if product_count == 0:
        default_product = Product(
            name="VIBE Pocket PEMF Device",
            description="Pocket PEMF powerhouse designed by NASA Space Shuttle Chief Engineer. Optimize cellular energy, reduce inflammation, restore mental clarity.",
            regular_price=399.00,
            sale_price=299.00,
            features=[
                "60 Unique Protocols",
                "FDA-Registered Technology",
                "Works Anywhere, Anytime",
                "98% Success Rate",
                "Free Lifetime Subscription ($30/month value)",
                "30-Day Money-Back Guarantee",
                "1-Year Warranty",
                "Free Worldwide Shipping"
            ],
            is_active=True
        )
        product_doc = default_product.model_dump()
        product_doc['created_at'] = product_doc['created_at'].isoformat()
        await db.products.insert_one(product_doc)
        logger.info("Default VIBE product created")

@app.on_event("shutdown")
async def shutdown_event():
    client.close()
    await redis_client.close()
