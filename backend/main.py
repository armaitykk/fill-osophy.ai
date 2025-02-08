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
def simplify_legal_text(text: str) -> str:
    """Use Gemini AI to simplify legal documents and highlight key points."""
    try:
        model = genai.GenerativeModel("gemini-pro")
        response = model.generate_content(f"""
        Read the following legal document and simplify it into **bullet points**.
        Highlight **important clauses, penalties, deadlines, legal responsibilities, and key conditions** in **bold**:
        
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
    return {
        "original_text": extracted_text,
        "simplified_text": simplified_text
    }

# ✅ API health check
@app.get("/")
async def root():
    return {"message": "✅ Legal Document Simplifier API is running!"}
