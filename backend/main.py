from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import google.generativeai as genai
import pytesseract
from PIL import Image
import fitz  # PyMuPDF

# ✅ Set up Gemini API Key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("❌ Gemini API key is missing. Set it using 'export GEMINI_API_KEY=your_key'")

genai.configure(api_key=GEMINI_API_KEY)

# ✅ Initialize FastAPI app
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all domains (change for production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Store document text globally
document_text = ""

class ChatRequest(BaseModel):
    question: str

# ✅ Function to extract text from uploaded files
def extract_text_from_file(file: UploadFile):
    global document_text
    file_extension = file.filename.split(".")[-1].lower()

    if file_extension in ["jpg", "jpeg", "png"]:
        image = Image.open(file.file)
        document_text = pytesseract.image_to_string(image)

    elif file_extension == "pdf":
        pdf_document = fitz.open(stream=file.file.read(), filetype="pdf")
        document_text = "\n".join([page.get_text() for page in pdf_document])

    else:
        raise HTTPException(status_code=400, detail="❌ Unsupported file type. Upload a PDF or an Image.")

# ✅ AI Processing Functions
def simplify_legal_text(text):
    model = genai.GenerativeModel("gemini-pro")
    response = model.generate_content(f"Summarize this legal document:\n\n{text}")
    return response.text.strip()

def extract_key_terms(text):
    model = genai.GenerativeModel("gemini-pro")
    response = model.generate_content(f"Extract key legal terms:\n\n{text}")
    return response.text.strip()

def detect_risky_clauses(text):
    model = genai.GenerativeModel("gemini-pro")
    response = model.generate_content(f"Identify risky clauses:\n\n{text}")
    return response.text.strip()

# ✅ API Endpoint to Process Documents
@app.post("/process-legal-document/")
async def process_legal_document(file: UploadFile = File(...)):
    global document_text
    extract_text_from_file(file)

    # Ensure chatbot can access the document
    if not document_text.strip():
        raise HTTPException(status_code=400, detail="❌ Document processing failed. Please try again.")

    simplified_text = simplify_legal_text(document_text)
    key_terms = extract_key_terms(document_text)
    risky_clauses = detect_risky_clauses(document_text)

    return {
        "simplified_text": simplified_text,
        "key_terms": key_terms,
        "risky_clauses": risky_clauses
    }

# ✅ API: Chatbot to Explain Document
@app.post("/chatbot/")
async def chatbot(request: ChatRequest):
    global document_text

    if not document_text.strip():
        return {"answer": "❌ No document uploaded. Please upload a document first."}

    try:
        model = genai.GenerativeModel("gemini-pro")
        response = model.generate_content(f"Based on this legal document, answer the following:\n\nDocument:\n{document_text}\n\nQuestion: {request.question}")
        return {"answer": response.text.strip()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"🚨 Chatbot Error: {str(e)}")

# ✅ API health check
@app.get("/")
async def root():
    return {"message": "✅ Legal Document Simplifier API is running!"}
