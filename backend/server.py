from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Store active chat sessions
chat_sessions = {}

# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class ChatMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    role: str  # 'user' or 'assistant'
    content: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ChatRequest(BaseModel):
    session_id: str
    message: str

class ChatResponse(BaseModel):
    session_id: str
    response: str
    timestamp: datetime

class ChatSession(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str = "নতুন কথোপকথন"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class NewSessionRequest(BaseModel):
    title: Optional[str] = "নতুন কথোপকথন"

class TranslationRequest(BaseModel):
    text: str
    source: str  # Source language code (e.g., 'bn', 'en')
    target: str  # Target language code

class TranslationResponse(BaseModel):
    translated_text: str
    source: str
    target: str

# System message for Bengali AI Assistant
SYSTEM_MESSAGE = """আপনি বিডিআস্ক (BdAsk), বাংলাদেশের জন্য একটি উন্নত AI সহকারী। আপনি বাংলা এবং ইংরেজি উভয় ভাষায় সাহায্য করতে পারেন।

আপনার বৈশিষ্ট্য:
- বাংলাদেশের সংস্কৃতি ও প্রেক্ষাপট সম্পর্কে গভীর জ্ঞান
- বাংলা ভাষায় প্রাঞ্জল ও শুদ্ধ যোগাযোগ
- সহায়ক, বিনয়ী এবং তথ্যবহুল উত্তর প্রদান
- বাংলিশ (বাংলা + ইংরেজি মিশ্রিত) বোঝার ক্ষমতা

আপনি সাহায্য করতে পারেন:
- সাধারণ জ্ঞান ও তথ্য
- বাংলাদেশ সম্পর্কিত প্রশ্ন
- শিক্ষা ও গবেষণা
- দৈনন্দিন সমস্যার সমাধান
- সৃজনশীল লেখালেখি
- এবং আরও অনেক কিছু!

সবসময় বিনয়ী, সহায়ক এবং সংক্ষিপ্ত উত্তর দিন।"""

def get_or_create_chat(session_id: str) -> LlmChat:
    """Get existing chat session or create a new one"""
    if session_id not in chat_sessions:
        api_key = os.environ.get('EMERGENT_LLM_KEY')
        if not api_key:
            raise ValueError("EMERGENT_LLM_KEY not found in environment variables")
        
        chat = LlmChat(
            api_key=api_key,
            session_id=session_id,
            system_message=SYSTEM_MESSAGE
        ).with_model("gemini", "gemini-3-flash-preview")
        
        chat_sessions[session_id] = chat
        logger.info(f"Created new chat session: {session_id}")
    
    return chat_sessions[session_id]

# Routes
@api_router.get("/")
async def root():
    return {"message": "BdAsk API - বাংলাদেশের AI সহকারী"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks

# Chat endpoints
@api_router.post("/chat/session", response_model=ChatSession)
async def create_chat_session(request: NewSessionRequest):
    """Create a new chat session"""
    session = ChatSession(title=request.title or "নতুন কথোপকথন")
    doc = session.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    await db.chat_sessions.insert_one(doc)
    logger.info(f"Created chat session: {session.id}")
    return session

@api_router.get("/chat/sessions", response_model=List[ChatSession])
async def get_chat_sessions():
    """Get all chat sessions"""
    sessions = await db.chat_sessions.find({}, {"_id": 0}).sort("updated_at", -1).to_list(100)
    for session in sessions:
        if isinstance(session.get('created_at'), str):
            session['created_at'] = datetime.fromisoformat(session['created_at'])
        if isinstance(session.get('updated_at'), str):
            session['updated_at'] = datetime.fromisoformat(session['updated_at'])
    return sessions

@api_router.get("/chat/messages/{session_id}", response_model=List[ChatMessage])
async def get_chat_messages(session_id: str):
    """Get all messages for a session"""
    messages = await db.chat_messages.find(
        {"session_id": session_id}, 
        {"_id": 0}
    ).sort("timestamp", 1).to_list(1000)
    
    for msg in messages:
        if isinstance(msg.get('timestamp'), str):
            msg['timestamp'] = datetime.fromisoformat(msg['timestamp'])
    return messages

@api_router.post("/chat/send", response_model=ChatResponse)
async def send_chat_message(request: ChatRequest):
    """Send a message and get AI response"""
    try:
        # Save user message
        user_msg = ChatMessage(
            session_id=request.session_id,
            role="user",
            content=request.message
        )
        user_doc = user_msg.model_dump()
        user_doc['timestamp'] = user_doc['timestamp'].isoformat()
        await db.chat_messages.insert_one(user_doc)
        
        # Get or create chat session
        chat = get_or_create_chat(request.session_id)
        
        # Send message to AI
        user_message = UserMessage(text=request.message)
        response = await chat.send_message(user_message)
        
        # Save AI response
        ai_msg = ChatMessage(
            session_id=request.session_id,
            role="assistant",
            content=response
        )
        ai_doc = ai_msg.model_dump()
        ai_doc['timestamp'] = ai_doc['timestamp'].isoformat()
        await db.chat_messages.insert_one(ai_doc)
        
        # Update session timestamp
        await db.chat_sessions.update_one(
            {"id": request.session_id},
            {"$set": {"updated_at": datetime.now(timezone.utc).isoformat()}}
        )
        
        logger.info(f"Chat response sent for session: {request.session_id}")
        
        return ChatResponse(
            session_id=request.session_id,
            response=response,
            timestamp=datetime.now(timezone.utc)
        )
        
    except Exception as e:
        logger.error(f"Error in chat: {str(e)}")
        raise HTTPException(status_code=500, detail=f"চ্যাটে সমস্যা হয়েছে: {str(e)}")

@api_router.delete("/chat/session/{session_id}")
async def delete_chat_session(session_id: str):
    """Delete a chat session and its messages"""
    await db.chat_sessions.delete_one({"id": session_id})
    await db.chat_messages.delete_many({"session_id": session_id})
    
    if session_id in chat_sessions:
        del chat_sessions[session_id]
    
    logger.info(f"Deleted chat session: {session_id}")
    return {"message": "সেশন মুছে ফেলা হয়েছে"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
