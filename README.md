This is a FastAPI-based application that uses Generative AI to process legal documents. The API extracts, simplifies, and analyzes legal documents by:

Extracting the text from images or PDFs.
Simplifying the legal text into easy-to-understand bullet points.
Identifying key legal terms and definitions.
Detecting risky or unfair clauses in the document.
Features
Text Extraction: Extracts text from both images (JPG, PNG) and PDFs.
Text Simplification: Uses Generative AI (Gemini AI) to summarize and simplify complex legal text.
Key Term Extraction: Identifies and defines key legal terms in the document.
Risky Clause Detection: Flags potential legal risks or unfair clauses in the document.
Requirements
Backend Requirements
Python 3.11+

Install dependencies:

bash
Copy
Edit
pip install -r requirements.txt
fastapi - Web framework to build the API.
uvicorn - ASGI server to run the app.
google-generativeai - For calling the Gemini API.
pytesseract - OCR tool to extract text from images.
pillow - Python Imaging Library (PIL) for image processing.
PyMuPDF - Library to extract text from PDFs.
Setting Up the API Key
To use Gemini API, you'll need to set up your API key.

Sign up for Google Gemini API and get your API key.
Set the environment variable for the API key:
bash
Copy
Edit
export GEMINI_API_KEY=your-api-key-here
Running the API
Make sure your environment is set up with the required dependencies and API key.

Start the FastAPI server using uvicorn:

bash
Copy
Edit
uvicorn main:app --reload
The API will be running on http://127.0.0.1:8000.

API Endpoints
1. POST /process-legal-document/
Processes an uploaded legal document and returns:

The original extracted text.
A simplified version of the text.
A list of key legal terms and their definitions.
A list of risky or unfair clauses flagged in the document.
Request:
Content-Type: multipart/form-data
Body: The legal document file (PDF, JPG, PNG)
Response:
json
Copy
Edit
{
  "original_text": "Extracted text from the document",
  "simplified_text": "Simplified version of the document",
  "key_terms": "Key legal terms and definitions",
  "risky_clauses": "List of flagged risky clauses"
}
2. GET /
Returns a simple message indicating that the API is running.

json
Copy
Edit
{
  "message": "✅ Legal Document Simplifier API is running!"
}
Frontend Integration
The backend API is designed to work with a React frontend. Ensure the frontend is set up to send files to the /upload endpoint of the backend. CORS is enabled for all origins by default, but this should be restricted in production.

Troubleshooting
CORS Errors:
If you're running the frontend locally, make sure CORS middleware is properly configured in the backend. The current configuration allows all origins.

OCR or PDF Text Extraction Issues:
If the extraction process fails, make sure pytesseract is installed correctly, and the necessary OCR tools (like Tesseract) are configured on your system.

Gemini API Errors:
If you encounter errors related to the Gemini API, make sure the API key is set up correctly and that you're not exceeding API usage limits.

License
MIT License - See LICENSE for more details.
