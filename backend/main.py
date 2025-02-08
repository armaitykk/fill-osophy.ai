import os
import google.generativeai as genai
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
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

# ✅ Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all domains (change for production)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# ✅ Extract text from a legal document
def extract_text_from_file(file: UploadFile):
    """Extract text from uploaded PDF or image file."""
    file_extension = file.filename.split(".")[-1].lower()

    if file_extension in ["jpg", "jpeg", "png"]:
        image = Image.open(file.file)
        return pytesseract.image_to_string(image)

    elif file_extension == "pdf":
        pdf_document = fitz.open(stream=file.file.read(), filetype="pdf")
        text = "\n".join([page.get_text() for page in pdf_document])
        return text

    else:
        raise HTTPException(status_code=400, detail="❌ Unsupported file type. Upload a PDF or an Image.")

# ✅ Function to simplify legal text into bullet points
def extract_key_terms(text: str) -> str:
    """Use Gemini AI to extract and define key legal terms."""
    try:
        model = genai.GenerativeModel("gemini-pro")
        response = model.generate_content(f"""
        Extract the most important legal terms from the following document. 
        Provide a brief and easy-to-understand definition for each term.

        {text}
        """)
        return response.text.strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"🚨 Gemini API Error: {str(e)}")

def simplify_legal_text(text: str) -> str:
    """Summarize each section separately using AI."""
    try:
        model = genai.GenerativeModel("gemini-pro")
        response = model.generate_content(f"""
        Break down the following legal document **section by section**.
        - Summarize each section separately.
        - Highlight **important clauses, deadlines, and penalties** in **bold**.

        {text}
        """)
        return response.text.strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"🚨 Gemini API Error: {str(e)}")

def detect_risky_clauses(text: str) -> str:
    """Use AI to detect unfair or risky legal clauses."""
    try:
        model = genai.GenerativeModel("gemini-pro")
        response = model.generate_content(f"""
        Analyze the following legal document and **flag any risky or unfair clauses**.
        - Identify sections that could be **legally risky or unfair to the signer**.
        - Highlight potential **financial penalties, hidden fees, and restrictive conditions**.

        {text}
        """)
        return response.text.strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"🚨 Gemini API Error: {str(e)}")

# ✅ API Endpoint to process legal documents
@app.post("/process-legal-document/")
async def process_legal_document(file: UploadFile = File(...)):
    extracted_text = extract_text_from_file(file)
    simplified_text = simplify_legal_text(extracted_text)
    key_terms = extract_key_terms(extracted_text)
    risky_clauses = detect_risky_clauses(extracted_text)

    return {
        "original_text": extracted_text,
        "simplified_text": simplified_text,
        "key_terms": key_terms,
        "risky_clauses": risky_clauses
    }



# ✅ API health check
@app.get("/")
async def root():
    return {"message": "✅ Legal Document Simplifier API is running!"}
