from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_openai import ChatOpenAI
import uuid

# Load environment variables
load_dotenv()

if not os.getenv("GOOGLE_API_KEY"):
    raise ValueError(
        "GOOGLE_API_KEY not found! Please set it in your .env file or as an environment variable.\n"
        "Get your API key from: https://makersuite.google.com/app/apikey"
    )

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class GuidanceDocument(BaseModel):
    user_id: str
    guidance_text: str
    tags: List[str]
    class_level: str
    stream: Optional[str] = None
    education: Optional[str] = None
    percentage: Optional[str] = None

class ChatMessage(BaseModel):
    user_id: str
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str

# In-memory storage
user_guidance_store = {}
chat_sessions = {}

print("Initializing embeddings model... (this may take a moment on first run)")
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)
print("Embeddings model loaded successfully!")

print("Initializing Gemini 2.0 Flash...")
try:
    llm = ChatOpenAI(
        api_key=os.getenv("OPENROUTER_API_KEY"),
        base_url="https://openrouter.ai/api/v1",
        model="mistralai/devstral-2512:free",
    )
    print("Gemini 2.0 Flash initialized successfully!")
except Exception as e:
    print(f"Error initializing Gemini: {e}")
    raise

# Dynamic prompt template based on class level
def get_prompt_template(class_level: str) -> ChatPromptTemplate:
    if class_level == "12th":
        return ChatPromptTemplate.from_template(
            """You are a helpful and encouraging career guidance counselor assistant for Class 12th students. Respond shortly and precisely.
Use the following context from the student's personalized career guidance report to answer their questions accurately.

Context from Career Guidance Report:
{context}

Student's Profile:
- Interests: {interests}
- Stream: {stream}
- Education Path: {education}
- 12th Percentage: {percentage}

Chat History:
{chat_history}

Student's Question: {question}

Instructions:
- Provide specific, actionable advice based on the career guidance report and their academic background
- Consider their stream and education path when giving college/course recommendations
- Be encouraging and supportive about their percentage and achievements
- If the question is outside the scope of the report, politely guide them back to career-related topics
- Keep responses concise but informative
- Use examples from the report when relevant
- Suggest specific entrance exams, colleges, and career paths relevant to their stream

Answer:"""
        )
    else:  # 10th class
        return ChatPromptTemplate.from_template(
            """You are a helpful and encouraging career guidance counselor assistant for Class 10th students. Respond shortly and precisely.
Use the following context from the student's personalized career guidance report to answer their questions accurately.

Context from Career Guidance Report:
{context}

Student's Interests: {interests}

Chat History:
{chat_history}

Student's Question: {question}

Instructions:
- Provide specific, actionable advice based on the career guidance report
- Help them understand different stream options (Science, Commerce, Arts) for 11th-12th
- Be encouraging and supportive
- If the question is outside the scope of the report, politely guide them back to career-related topics
- Keep responses concise but informative
- Use examples from the report when relevant
- Focus on skill development and foundational learning

Answer:"""
        )

@app.post("/store-guidance")
async def store_guidance(doc: GuidanceDocument):
    """Store the career guidance for a user and create vector store"""
    try:
        print(f"Storing guidance for user: {doc.user_id} (Class {doc.class_level})")
        
        # Split the guidance text into chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=600,
            chunk_overlap=100,
            length_function=len
        )
        chunks = text_splitter.split_text(doc.guidance_text)
        print(f"Created {len(chunks)} chunks from guidance text")
        
        # Create vector store
        vectorstore = FAISS.from_texts(
            chunks,
            embeddings,
            metadatas=[{"source": f"guidance_{doc.user_id}"}] * len(chunks)
        )
        
        # Store user guidance and vectorstore with additional metadata
        user_guidance_store[doc.user_id] = {
            "guidance": doc.guidance_text,
            "tags": doc.tags,
            "vectorstore": vectorstore,
            "class_level": doc.class_level,
            "stream": doc.stream,
            "education": doc.education,
            "percentage": doc.percentage,
        }
        
        print(f"Guidance stored successfully for user: {doc.user_id}")
        return {
            "status": "success",
            "message": "Guidance stored successfully",
            "user_id": doc.user_id,
            "class_level": doc.class_level,
            "chunks": len(chunks)
        }
    except Exception as e:
        print(f"Error storing guidance: {e}")
        raise HTTPException(status_code=500, detail=str(e))

def format_docs(docs):
    """Format retrieved documents into a single string"""
    return "\n\n".join([doc.page_content for doc in docs])

def format_chat_history(history):
    """Format chat history into a readable string"""
    if not history:
        return "No previous conversation."
    
    formatted = []
    for msg in history:
        role = msg.get("role", "unknown")
        content = msg.get("content", "")
        formatted.append(f"{role.capitalize()}: {content}")
    
    return "\n".join(formatted)

@app.post("/chat", response_model=ChatResponse)
async def chat(chat_msg: ChatMessage):
    """Handle chat messages with RAG using Gemini 2.0 Flash"""
    try:
        # Check if user has stored guidance
        if chat_msg.user_id not in user_guidance_store:
            raise HTTPException(
                status_code=404,
                detail="No career guidance found. Please generate guidance first."
            )
        
        user_data = user_guidance_store[chat_msg.user_id]
        vectorstore = user_data["vectorstore"]
        class_level = user_data.get("class_level", "10th")
        
        # Create or retrieve session
        session_id = chat_msg.session_id or str(uuid.uuid4())
        
        if session_id not in chat_sessions:
            chat_sessions[session_id] = {
                "history": []
            }
        
        session = chat_sessions[session_id]
        
        print(f"Processing chat message for user {chat_msg.user_id}, Class {class_level}, session {session_id}")
        
        # Retrieve relevant documents
        retriever = vectorstore.as_retriever(search_kwargs={"k": 4})
        relevant_docs = retriever.invoke(chat_msg.message)
        context = format_docs(relevant_docs)

        print(f"Retrieved {len(relevant_docs)} relevant documents")
        
        # Format chat history
        chat_history = format_chat_history(session["history"])
        
        # Get appropriate prompt template based on class level
        prompt_template = get_prompt_template(class_level)
        
        # Build chain inputs based on class level
        if class_level == "12th":
            chain_inputs = {
                "context": lambda x: context,
                "interests": lambda x: ", ".join(user_data["tags"]),
                "stream": lambda x: user_data.get("stream", "Not specified"),
                "education": lambda x: user_data.get("education", "Not specified"),
                "percentage": lambda x: user_data.get("percentage", "Not specified"),
                "chat_history": lambda x: chat_history,
                "question": RunnablePassthrough(),
            }
        else:  # 10th class
            chain_inputs = {
                "context": lambda x: context,
                "interests": lambda x: ", ".join(user_data["tags"]),
                "chat_history": lambda x: chat_history,
                "question": RunnablePassthrough(),
            }
        
        # Create the chain
        chain = (
            chain_inputs
            | prompt_template
            | llm
            | StrOutputParser()
        )
        
        # Get response
        print("Generating response from Gemini...")
        response_text = chain.invoke(chat_msg.message)
        print("Response generated successfully")
        
        # Update chat history
        session["history"].append({
            "role": "user",
            "content": chat_msg.message
        })
        session["history"].append({
            "role": "assistant",
            "content": response_text
        })
        
        # Keep only last 10 messages to avoid context overflow
        if len(session["history"]) > 10:
            session["history"] = session["history"][-10:]
        
        return ChatResponse(
            response=response_text,
            session_id=session_id
        )
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")

@app.get("/chat-history/{session_id}")
async def get_chat_history(session_id: str):
    """Retrieve chat history for a session"""
    if session_id not in chat_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return {"history": chat_sessions[session_id]["history"]}

@app.delete("/clear-session/{session_id}")
async def clear_session(session_id: str):
    """Clear a chat session"""
    if session_id in chat_sessions:
        del chat_sessions[session_id]
    return {"status": "success", "message": "Session cleared"}

@app.delete("/clear-guidance/{user_id}")
async def clear_guidance(user_id: str):
    """Clear stored guidance for a user"""
    if user_id in user_guidance_store:
        del user_guidance_store[user_id]
    return {"status": "success", "message": "Guidance cleared"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "users_stored": len(user_guidance_store),
        "active_sessions": len(chat_sessions)
    }

@app.get("/")
async def root():
    return {
        "message": "Dynamic Career Guidance RAG Chatbot API (Class 10th & 12th)",
        "model": "gemini-2.0-flash",
        "status": "running",
        "supported_classes": ["10th", "12th"],
        "endpoints": {
            "store_guidance": "POST /store-guidance",
            "chat": "POST /chat",
            "history": "GET /chat-history/{session_id}",
            "clear_session": "DELETE /clear-session/{session_id}",
            "clear_guidance": "DELETE /clear-guidance/{user_id}",
            "health": "GET /health"
        }
    }

if __name__ == "__main__":
    import uvicorn
    print("\n" + "="*50)
    print("Starting Dynamic Career Guidance RAG Chatbot API")
    print("Supporting Class 10th and 12th")
    print("="*50 + "\n")
    uvicorn.run(app, host="localhost", port=5002)