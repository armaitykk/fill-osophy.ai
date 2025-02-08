from fastapi import FastAPI, UploadFile, File, Form
import openai
import pytesseract
from PIL import Image
import os
from database import collection

app = FastAPI()

# Fetch OpenAI API Key from environment variable
openai.api_key = os.getenv("OPENAI_API_KEY")

def extract_text_from_image(image_file):
    image = Image.open(image_file)
    return pytesseract.image_to_string(image)

def simplify_text(text):
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": f"Simplify this form:\n{text}"}]
    )
    return response["choices"][0]["message"]["content"]

def autofill_fields(text):
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": f"Autofill this form based on common patterns:\n{text}"}]
    )
    return response["choices"][0]["message"]["content"]

@app.post("/process-form/")
async def process_form(file: UploadFile = File(...), user_id: str = Form(...)):
    extracted_text = extract_text_from_image(file.file)
    simplified_text = simplify_text(extracted_text)
    autofilled_data = autofill_fields(extracted_text)

    form_data = {
        "user_id": user_id,
        "original_text": extracted_text,
        "simplified_text": simplified_text,
        "autofilled_data": autofilled_data
    }
    collection.insert_one(form_data)
    return form_data

@app.get("/user-forms/{user_id}")
async def get_user_forms(user_id: str):
    return list(collection.find({"user_id": user_id}, {"_id": 0}))
