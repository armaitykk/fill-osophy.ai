# **Lawgorithm** - AI-Powered Legal Document Simplifier

## **Team Members**
- Armaity Katki
- Bhuvana Kode

## **Purpose of the Project**
Lawgorithm is an AI-powered tool designed to simplify complex legal documents. The purpose of the project is to help users easily understand legal texts by providing simplified summaries, extracting key terms, and highlighting potentially risky clauses.

## **Tools Utilized**
- **Backend Framework**: FastAPI - Used for building the API that powers the application.
- **AI Model**: **Google Gemini API** - Utilized for generating summaries, extracting key terms, and detecting risky clauses from the uploaded legal documents.
- **Text Extraction Libraries**: 
  - **PyTesseract** - For optical character recognition (OCR) to extract text from images (e.g., JPG, PNG).
  - **PyMuPDF (fitz)** - For extracting text from PDF documents.
- **Cloud Services**: 
  - **Google Gemini API** - Used for AI-powered text processing.
- **Python Libraries**: 
  - **Pillow** - For image processing.
  - **FastAPI Middleware (CORSMiddleware)** - For handling cross-origin resource sharing.

## **Problems We Ran Into and How We Overcame Them**
1. **File Format Handling**: Extracting text from different file formats, such as PDFs and images, was initially challenging. We overcame this by integrating multiple libraries (PyTesseract for image text extraction and PyMuPDF for PDF text extraction) and handling edge cases for each file type to ensure accurate text extraction.
   
2. **AI Model Integration**: Integrating the **Google Gemini API** was initially complex, as we had to ensure that it could handle large, complex legal documents efficiently. We spent time optimizing how we used the API to process documents and handle large inputs, adjusting the prompt structure to fit the model’s requirements.

3. **API Limitations**: While using the OpenAI API earlier in the project, we struggled with reaching usage limits. The system did not display limits properly in real-time, and it took several hours before we realized we had exceeded the usage. We switched to Gemini to continue our work and adjusted our usage strategy to avoid exceeding limits.

## **Credits**
- **Google Gemini API** for providing powerful AI-driven text generation capabilities used in the project.
- **PyMuPDF** (https://pymupdf.readthedocs.io/en/latest/) for extracting text from PDF files.
- **PyTesseract** (https://github.com/madmaze/pytesseract) for optical character recognition in image files.
- **FastAPI** for enabling the rapid development of our backend API.
- **ChatGPT** for providing starter code and assisting with debugging during the development process.
