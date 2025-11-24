#!/usr/bin/env python3
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime, timezone

async def init_data():
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    db_name = os.environ.get('DB_NAME', 'vibe_wellness_db')
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    # Add initial testimonials
    testimonials_count = await db.testimonials.count_documents({})
    if testimonials_count == 0:
        testimonials = [
            {
                "id": "test1",
                "name": "Ankita",
                "location": "India",
                "text": "I was struggling with acne and inflammation, and after using the VIBE device, I saw a visible reduction in just 20 minutes. The redness calmed down, and I felt a sense of lightness I hadn't in days.",
                "rating": 5,
                "is_active": True,
                "order": 1,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": "test2",
                "name": "FCG",
                "location": "USA",
                "text": "I've been running the protocols for lower back pain and neck pain, and the results have been really good. I felt a change right away and it relieved my symptoms, much to my amazement.",
                "rating": 5,
                "is_active": True,
                "order": 2,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": "test3",
                "name": "Real User",
                "location": "Canada",
                "text": "I've been using it for about a month. I've noticed a pretty substantial difference in my quality of sleep, being able to fall asleep and stay asleep without melatonin. My migraines have gotten a lot less severe.",
                "rating": 5,
                "is_active": True,
                "order": 3,
                "created_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        await db.testimonials.insert_many(testimonials)
        print(f"✓ Added {len(testimonials)} testimonials")
    
    # Add initial FAQs
    faqs_count = await db.faqs.count_documents({})
    if faqs_count == 0:
        faqs = [
            {
                "id": "faq1",
                "question": "Is PEMF safe?",
                "answer": "Yes. PEMF therapy has been used since the 1970s and is backed by NASA and clinical research. The VIBE is an FDA-registered general wellness device.",
                "is_active": True,
                "order": 1,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": "faq2",
                "question": "How often should I use it?",
                "answer": "Start with 30 minutes a day and build gradually. Most people feel results within the first week. You can use it as often as you like, you can't overdose on frequencies.",
                "is_active": True,
                "order": 2,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": "faq3",
                "question": "Can anyone use it?",
                "answer": "Almost everyone. The only exceptions are people with pacemakers or during pregnancy. If you have medical concerns, consult your doctor.",
                "is_active": True,
                "order": 3,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": "faq4",
                "question": "What if it doesn't work for me?",
                "answer": "We offer a 30-day money-back guarantee. If you don't see improvements, return it for a full refund. No questions asked.",
                "is_active": True,
                "order": 4,
                "created_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        await db.faqs.insert_many(faqs)
        print(f"✓ Added {len(faqs)} FAQs")
    
    client.close()
    print("✓ Database initialization complete")

if __name__ == "__main__":
    asyncio.run(init_data())
