# Standard library imports
import os
import json
import time
import logging
import asyncio
from pathlib import Path
from typing import List, Dict, Any, Tuple, Optional
from enum import Enum
from io import StringIO
from datetime import date, datetime, timedelta

# Third-party imports
import aiofiles
import httpx
import PyPDF2
import pandas as pd
from fastapi import FastAPI, File, UploadFile, HTTPException, APIRouter, Body, Query, Form, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import streamlit as st
from pydantic_settings import BaseSettings
import io
from pydantic import BaseModel
import re
from datetime import date
import sqlite3
import uuid
import random
from fastapi.responses import FileResponse

# FIFO queue system for learning pathway questions
QUEUE_DIR = Path("question_queues")
QUEUE_DIR.mkdir(exist_ok=True)
QUEUE_SIZE = 20

def get_queue_path(language: str) -> Path:
    return QUEUE_DIR / f"{language.lower()}_queue.json"

def load_queue(language: str) -> list:
    path = get_queue_path(language)
    if path.exists():
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

def save_queue(language: str, queue: list):
    path = get_queue_path(language)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(queue, f, indent=2)

async def generate_questions_for_language(language: str, n: int) -> list:
    prompt = (
        f"Generate {n} step-by-step learning pathway questions for {language} programming. "
        "For each step, provide:\n"
        "- A unique id (string)\n"
        "- A title (string)\n"
        "- A description (string)\n"
        "- An array of detailed, step-by-step instructions (instructions: array of strings)\n"
        "- A challenge object with a question and expected_output\n"
        "- A hint (string)\n"
        "Respond ONLY as a JSON array of objects, each with: id, title, description, instructions (array), challenge (object with question and expected_output), hint."
    )
    headers = {
        "Authorization": f"Bearer {settings.deepseek_api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": settings.deepseek_model,
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }
    async with httpx.AsyncClient(timeout=120.0) as client:
        response = await client.post(
            settings.deepseek_url,
            headers=headers,
            json=payload
        )
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to generate questions from DeepSeek.")
        response_data = response.json()
        content = response_data["choices"][0]["message"]["content"]
        import json, re
        content = content.replace('```', '')
        json_match = re.search(r'\[.*\]', content, re.DOTALL)
        if json_match:
            try:
                questions = json.loads(json_match.group())
            except Exception as e:
                logger.error(f"JSON parsing error: {str(e)}")
                raise HTTPException(status_code=500, detail="Failed to parse generated questions.")
        else:
            logger.warning("Returning raw DeepSeek response as fallback.")
            raise HTTPException(status_code=500, detail="Could not parse structured steps from DeepSeek.")
    return questions

# Configure structured logging
log_dir = Path("logs")
log_dir.mkdir(exist_ok=True)

logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler(log_dir / "app.log"), logging.StreamHandler()],
)

logger = logging.getLogger(__name__)

# Daily Challenge Language Rotation System
SUPPORTED_LANGUAGES = ["python", "java", "c++", "c", "javascript"]
LANGUAGE_ROTATION_DAYS = len(SUPPORTED_LANGUAGES)


def get_daily_language() -> str:
    """Get the language for today based on rotation system"""
    today = date.today()
    # Use days since epoch to ensure consistent rotation
    days_since_epoch = (today - date(2024, 1, 1)).days
    language_index = days_since_epoch % LANGUAGE_ROTATION_DAYS
    return SUPPORTED_LANGUAGES[language_index]


def get_daily_challenge_key() -> str:
    """Get unique key for today's daily challenge"""
    today = date.today()
    return f"daily_challenge_{today.year}_{today.month}_{today.day}"


# Configuration class
class Settings(BaseSettings):
    upload_dir: str = "uploads"
    max_file_size: int = 10 * 1024 * 1024  # 10MB
    allowed_extensions: List[str] = [".pdf", ".txt", ".csv"]
    deepseek_model: str = "deepseek-chat"  # Using DeepSeek as default model
    deepseek_url: str = "https://api.deepseek.com/v1/chat/completions"
    deepseek_api_key: str  # No default value, must come from .env or environment

    class Config:
        env_file = ".env"
        extra = "allow"  # This will allow extra fields in the .env file


settings = Settings()
print("Loaded DeepSeek API key:", settings.deepseek_api_key)

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify your frontend URL for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

METADATA_FILE = Path(settings.upload_dir) / "file_metadata.json"


def load_metadata() -> List[Dict[str, Any]]:
    if METADATA_FILE.exists():
        with open(METADATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return []


def save_metadata(metadata: List[Dict[str, Any]]):
    with open(METADATA_FILE, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)


@app.get("/")
async def root():
    return {"message": "AutoTrainerX API is running"}


@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring server status"""
    try:
        # Test database connection
        conn = sqlite3.connect('rankings.db')
        conn.close()

        # Test DeepSeek connection (with short timeout)
        try:
            async with httpx.AsyncClient(timeout=3.0) as client:
                response = await client.get(f"{settings.deepseek_url}/v1/chat/completions")
                if response.status_code == 200:
                    deepseek_status = "connected"
                else:
                    deepseek_status = "error"
        except Exception:
            deepseek_status = "disconnected"

        return {
            "status": "healthy",
            "database": "connected",
            "deepseek": deepseek_status,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }


# Ensure upload directory exists
Path(settings.upload_dir).mkdir(exist_ok=True)


async def extract_text_from_pdf(pdf_path: str) -> str:
    """ Extracts text from a PDF asynchronously using streaming."""
    text = ""
    try:
        async with aiofiles.open(pdf_path, "rb") as file:
            pdf_content = await file.read()
            pdf_file = io.BytesIO(pdf_content)
            reader = PyPDF2.PdfReader(pdf_file)

            # Check if PDF is encrypted
            if reader.is_encrypted:
                try:
                    # Try to decrypt with empty password
                    reader.decrypt('')
                except Exception as e:
                    logger.warning(f"PDF is encrypted and couldn't be decrypted: {str(e)}")
                    return ""

            # Extract text from each page
            for page in reader.pages:
                try:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
                except Exception as e:
                    logger.warning(f"Error extracting text from page: {str(e)}")
                    continue

        if not text.strip():
            logger.warning(f"No text could be extracted from PDF: {pdf_path}")
            return ""

        logger.info(f"Successfully extracted text from PDF: {pdf_path}")
        return text
    except Exception as e:
        logger.error(f"Error extracting text from PDF: {str(e)}")
        return ""  # Return empty string instead of raising exception


async def load_text_file(text_path: str) -> str:
    """ Loads text from a file asynchronously. """
    try:
        async with aiofiles.open(text_path, "r", encoding="utf-8") as file:
            text = await file.read()
        logger.info(f"Loaded text from file: {text_path}")
        return text
    except Exception as e:
        logger.error(f"Error loading text file: {str(e)}")
        raise HTTPException(status_code=500, detail="Error loading text file")


async def load_csv_data(csv_path: str) -> List[Dict[str, Any]]:
    """ Loads CSV data asynchronously without blocking. """
    try:
        async with aiofiles.open(csv_path, "r", encoding="utf-8") as file:
            content = await file.read()
        df = pd.read_csv(StringIO(content))
        data = df.to_dict(orient="records")
        logger.info(f"Loaded CSV data from file: {csv_path}")
        return data
    except Exception as e:
        logger.error(f"Error loading CSV data: {str(e)}")
        raise HTTPException(status_code=500, detail="Error loading CSV data")


async def fetch_with_retries(api_call, retries=3, delay=2):
    """ Wrapper for API calls with exponential backoff. """
    for attempt in range(retries):
        try:
            return await api_call()
        except Exception as e:
            if attempt < retries - 1:
                await asyncio.sleep(delay * (2 ** attempt))
            else:
                raise HTTPException(status_code=500, detail=f"API error: {str(e)}")


async def analyze_content(text: str) -> Tuple[str, float, Optional[str]]:
    """ Uses DeepSeek to analyze content type asynchronously. """
    async with httpx.AsyncClient(timeout=90.0) as client:
        try:
            response = await client.post(
                f"{settings.deepseek_url}/v1/chat/completions",
                json={
                    "model": settings.deepseek_model,
                    "messages": [
                        {"role": "user", "content": f"Classify the following text into valid_conversation, technical_documentation, nonsense, or irrelevant. Respond in JSON format with category, confidence (0-1), and explanation.\n\nText: {text[:1000]}"}
                    ]
                }
            )

            if response.status_code != 200:
                raise HTTPException(status_code=500,
                                    detail=f"DeepSeek API returned status {response.status_code}: {response.text}")

            try:
                response_data = response.json()
                if 'response' in response_data:
                    response_text = response_data['response'].strip()
                    logger.info(f"Classification response: {response_text}")

                    # Try to parse JSON from the response
                    json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
                    if json_match:
                        classification_str = json_match.group()
                        parsed_classification = json.loads(classification_str)
                        category = parsed_classification.get("category", "unknown")
                        confidence = float(parsed_classification.get("confidence", 0.0))
                        explanation = parsed_classification.get("explanation")
                    else:
                        # Fallback: try to parse the entire response
                        parsed_classification = json.loads(response_text)
                        category = parsed_classification.get("category", "unknown")
                        confidence = float(parsed_classification.get("confidence", 0.0))
                        explanation = parsed_classification.get("explanation")

                    if category == "unknown":
                        logger.warning(f"Could not extract classification from DeepSeek response: {response_text}")
                        # Default to valid_conversation if we can't parse
                        return "valid_conversation", 0.5, "Default classification due to parsing issues"

                    return category, confidence, explanation
                else:
                    logger.warning(f"Invalid response format from DeepSeek: {response_data}")
                    return "valid_conversation", 0.5, "Default classification due to invalid response"

            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse classification response: {str(e)}")
                logger.error(f"Response text: {response_data.get('response', 'No response')}")
                # Default to valid_conversation if we can't parse
                return "valid_conversation", 0.5, "Default classification due to JSON parsing error"

        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error calling DeepSeek API: {str(e)}")
            raise HTTPException(status_code=500, detail=f"DeepSeek API error: {str(e)}")


async def validate_file(file: UploadFile):
    """ Validates file size and format asynchronously. """
    if file.size > settings.max_file_size:
        raise HTTPException(status_code=400, detail="File too large")

    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in settings.allowed_extensions:
        raise HTTPException(status_code=400, detail="Unsupported file format")


async def process_file(file: UploadFile) -> List[Dict[str, Any]]:
    """ Processes a file asynchronously, returning fine-tuning data. """
    await validate_file(file)
    file_path = Path(settings.upload_dir) / file.filename

    async with aiofiles.open(file_path, "wb") as f:
        await f.write(await file.read())

    if file_path.suffix == ".pdf":
        extracted_text = await extract_text_from_pdf(str(file_path))
    elif file_path.suffix == ".txt":
        extracted_text = await load_text_file(str(file_path))
    elif file_path.suffix == ".csv":
        extracted_text = json.dumps(await load_csv_data(str(file_path)))

    category, confidence, explanation = await analyze_content(extracted_text)
    if category in ["nonsense", "irrelevant"]:
        raise HTTPException(status_code=400, detail=f"Content rejected: {explanation}")

    return [{"messages": [{"role": "user", "content": extracted_text}]}]


@app.post("/upload/")
async def upload_files(
        files: List[UploadFile] = File(...),
        stream: str = Form(...),
        exam: str = Form(...),
        subject: str = Form(...)
):
    """Handles multiple file uploads asynchronously. Only saves files and metadata, no heavy processing."""
    upload_dir = Path(settings.upload_dir)
    upload_dir.mkdir(parents=True, exist_ok=True)
    for file in files:
        file_path = upload_dir / file.filename
        async with aiofiles.open(file_path, "wb") as out_file:
            content = await file.read()
            await out_file.write(content)
    # Save metadata
    metadata = load_metadata()
    for file in files:
        metadata.append({
            "filename": file.filename,
            "stream": stream,
            "exam": exam,
            "subject": subject
        })
    save_metadata(metadata)
    return {"message": "Files uploaded successfully", "data_count": len(files)}


@app.get("/files/")
async def list_files():
    """ Lists all processed files in the upload directory. """
    try:
        files = []
        upload_dir = Path(settings.upload_dir)
        if upload_dir.exists():
            for file_path in upload_dir.glob("*.*"):
                if file_path.suffix.lower() in settings.allowed_extensions:
                    files.append({
                        "filename": file_path.name,
                        "size": file_path.stat().st_size,
                        "last_modified": file_path.stat().st_mtime
                    })
        return files
    except Exception as e:
        logger.error(f"Error listing files: {str(e)}")
        raise HTTPException(status_code=500, detail="Error listing files")


@app.post("/query/")
async def query_model(prompt: Dict[str, str]):
    """ Queries the DeepSeek model with a prompt. """
    try:
        user_prompt = prompt["prompt"]
        # Add system instruction for more systematic and precise answers
        system_instruction = (
            "Answer the following question in a precise, systematic, and concise manner. "
            "Use bullet points or numbered lists if appropriate. "
            "Do not include unnecessary background information. Focus only on what is asked.\n\n"
        )
        full_prompt = system_instruction + user_prompt
        # Check if the prompt is a general question about 'Constitution' and not already specific to India
        if "constitution" in user_prompt.lower() and "india" not in user_prompt.lower():
            full_prompt += " of India"
            logger.info(f"Modified prompt to: {full_prompt}")

        async with httpx.AsyncClient(timeout=300.0) as client:
            headers = {
                "Authorization": f"Bearer {settings.deepseek_api_key}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": settings.deepseek_model,
                "messages": [
                    {"role": "system", "content": system_instruction},
                    {"role": "user", "content": user_prompt}
                ]
            }
            response = await client.post(
                settings.deepseek_url,
                headers=headers,
                json=payload
            )

            if response.status_code != 200:
                raise HTTPException(status_code=500,
                                    detail=f"DeepSeek API returned status {response.status_code}: {response.text}")

            try:
                response_data = response.json()
                content = response_data["choices"][0]["message"]["content"]
                if not content:
                    raise HTTPException(status_code=500, detail="No valid response content received from DeepSeek.")
                return {"response": content}
            except Exception as e:
                logger.error(f"Failed to parse DeepSeek response: {str(e)}")
                raise HTTPException(status_code=500, detail="Failed to parse DeepSeek response")

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying model: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error querying model: {str(e)}")


class QuestionRequest(BaseModel):
    subject: str
    topic: str
    prompt: str
    question_count: int = 5  # Default to 5 questions
    fileName: Optional[str] = None  # Add fileName parameter


class Question(BaseModel):
    question: str
    options: List[str]
    correctAnswer: str
    explanation: str


@app.post("/generate-questions/")
async def generate_questions(request: QuestionRequest):
    """Generates questions based on uploaded files and subject/topic."""
    try:
        async with httpx.AsyncClient(timeout=300.0) as client:
            files = []
            upload_dir = Path(settings.upload_dir)
            metadata = load_metadata()
            filtered_files = [m["filename"] for m in metadata if
                              m["subject"] == request.subject and m["exam"] == request.topic]
            for filename in filtered_files:
                file_path = upload_dir / filename
                if file_path.exists() and file_path.suffix.lower() in settings.allowed_extensions:
                    try:
                        if file_path.suffix == ".pdf":
                            content = await extract_text_from_pdf(str(file_path))
                        elif file_path.suffix == ".txt":
                            content = await load_text_file(str(file_path))
                        elif file_path.suffix == ".csv":
                            content = json.dumps(await load_csv_data(str(file_path)))
                        if content:
                            files.append(content)
                    except Exception as e:
                        logger.error(f"Error processing file {file_path}: {str(e)}")
                        continue
            if not files:
                raise HTTPException(
                    status_code=400,
                    detail="No valid content could be extracted from the uploaded files for the selected filters"
                )
            combined_content = "\n".join(files)
            logger.info(f"Generating questions from {len(files)} file(s) matching filters")

            # Generate questions using DeepSeek
            headers = {
                "Authorization": f"Bearer {settings.deepseek_api_key}",
                "Content-Type": "application/json"
            }
            prompt = f"""Based on the following content, generate {request.question_count} multiple choice questions about {request.topic} for {request.subject} exam preparation.\nFor each question, provide 4 options and mark the correct answer.\nAlso provide a brief explanation for each answer.\nFormat the response as a JSON array of questions.\n\nContent:\n{combined_content[:2000]}  # Limit content to avoid token limits\n\nExample format:\n[\n    {{\n        \"question\": \"What is...?\",\n        \"options\": [\"Option A\", \"Option B\", \"Option C\", \"Option D\"],\n        \"correctAnswer\": \"Option A\",\n        \"explanation\": \"Explanation why Option A is correct\"\n    }}\n]"""
            payload = {
                "model": settings.deepseek_model,
                "messages": [
                    {"role": "user", "content": prompt}
                ]
            }
            response = await client.post(
                settings.deepseek_url,
                headers=headers,
                json=payload
            )

            if response.status_code != 200:
                raise HTTPException(status_code=500, detail="Failed to generate questions")

            # Parse the response
            try:
                response_data = response.json()
                content = response_data["choices"][0]["message"]["content"]
                logger.info(f"Raw response from DeepSeek: {content[:200]}...")
                # Try to extract JSON from the response
                json_match = re.search(r'\[.*\]', content, re.DOTALL)
                if json_match:
                    questions = json.loads(json_match.group())
                else:
                    # If no JSON array found, try to parse the entire response
                    questions = json.loads(content)

                if isinstance(questions, list) and len(questions) > 0:
                    # Validate question format
                    valid_questions = []
                    for q in questions:
                        if isinstance(q, dict) and 'question' in q and 'options' in q and 'correctAnswer' in q and 'explanation' in q:
                            valid_questions.append(q)

                    if valid_questions:
                        return {"questions": valid_questions}
                    else:
                        raise HTTPException(status_code=500, detail="Generated questions have invalid format")
                else:
                    raise HTTPException(status_code=500, detail="No valid questions generated")
            except Exception as e:
                logger.error(f"Failed to parse DeepSeek response: {str(e)}")
                raise HTTPException(status_code=500, detail="Failed to parse generated questions")

    except Exception as e:
        logger.error(f"Error generating questions: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating questions: {str(e)}")


class ArenaQuestionRequest(BaseModel):
    question_count: int = 2  # Default to 2 questions for arena
    prompt: str = "Generate challenging questions from all available study materials"


def generate_fallback_arena_questions(question_count: int, filename: str) -> List[Dict[str, Any]]:
    """Generate fallback questions when AI generation fails"""
    logger.info(f"Generating {question_count} fallback arena questions for {filename}")

    # Generate generic questions based on the filename
    subject = filename.replace('.pdf', '').replace('.txt', '').replace('.csv', '').replace('_', ' ').title()

    fallback_questions = []
    for i in range(question_count):
        question = {
            "question": f"What is the main topic covered in {subject}?",
            "options": [
                f"Advanced concepts in {subject}",
                f"Basic principles of {subject}",
                f"Historical background of {subject}",
                f"Practical applications of {subject}"
            ],
            "correctAnswer": f"Basic principles of {subject}",
            "explanation": f"This question tests understanding of the fundamental concepts in {subject}."
        }
        fallback_questions.append(question)

    logger.info(f"Generated {len(fallback_questions)} fallback questions")
    return fallback_questions


@app.post("/generate-arena-questions/")
async def generate_arena_questions(request: ArenaQuestionRequest):
    """Generates questions for Countdown Arena using all uploaded files."""
    try:
        async with httpx.AsyncClient(timeout=300.0) as client:
            files = []
            upload_dir = Path(settings.upload_dir)
            metadata = load_metadata()

            # Use all uploaded files for arena questions
            all_files = [m["filename"] for m in metadata]
            logger.info(f"Arena mode: Using all {len(all_files)} uploaded files")

            if not all_files:
                raise HTTPException(
                    status_code=400,
                    detail="No uploaded files found. Please upload study materials first."
                )

            # First, let the model select which file to use for questions
            file_selection_prompt = f"""You have access to the following uploaded study files:\n{', '.join(all_files)}\n\nSelect ONE file that would be best for generating {request.question_count} challenging questions. \nRespond with ONLY the filename, nothing else.\n\nExample response: \"LEGAL_APTITUDE_AND_LOGICAL_REASONING_printable.pdf\"\n"""

            # Get file selection from DeepSeek
            headers = {
                "Authorization": f"Bearer {settings.deepseek_api_key}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": settings.deepseek_model,
                "messages": [
                    {"role": "user", "content": file_selection_prompt}
                ]
            }
            selection_response = await client.post(
                settings.deepseek_url,
                headers=headers,
                json=payload
            )

            if selection_response.status_code != 200:
                raise HTTPException(status_code=500, detail="Failed to select file for arena questions")

            selection_data = selection_response.json()
            selected_filename = selection_data["choices"][0]["message"]["content"].strip()

            # Clean up the filename (remove quotes, extra text, etc.)
            selected_filename = selected_filename.strip('"').strip("'").strip()

            # Validate that the selected file exists in our metadata
            if selected_filename not in all_files:
                logger.warning(
                    f"Model selected file '{selected_filename}' not found in uploaded files. Using first available file.")
                selected_filename = all_files[0]

            logger.info(f"Model selected file for arena questions: {selected_filename}")

            # Now process only the selected file
            file_path = upload_dir / selected_filename
            if file_path.exists() and file_path.suffix.lower() in settings.allowed_extensions:
                try:
                    if file_path.suffix == ".pdf":
                        content = await extract_text_from_pdf(str(file_path))
                    elif file_path.suffix == ".txt":
                        content = await load_text_file(str(file_path))
                    elif file_path.suffix == ".csv":
                        content = json.dumps(await load_csv_data(str(file_path)))
                    if content:
                        files.append(content)
                        logger.info(f"Successfully processed selected file for arena: {selected_filename}")
                    else:
                        raise HTTPException(
                            status_code=400,
                            detail=f"No content could be extracted from selected file: {selected_filename}"
                        )
                except Exception as e:
                    logger.error(f"Error processing selected file {file_path}: {str(e)}")
                    raise HTTPException(
                        status_code=500,
                        detail=f"Error processing selected file: {str(e)}"
                    )
            else:
                raise HTTPException(
                    status_code=400,
                    detail=f"Selected file not found or unsupported format: {selected_filename}"
                )

            combined_content = files[0]  # Only one file content
            logger.info(f"Generating arena questions from selected file: {selected_filename}")

            # Generate questions using DeepSeek from the selected file only
            arena_prompt = f"""{request.prompt}\nGenerate {request.question_count} challenging questions from the selected study material: {selected_filename}\n\nFor each question, provide 4 options and mark the correct answer.\nAlso provide a brief explanation for each answer.\nFormat the response as a JSON array of questions.\n\nContent from selected file:\n{combined_content[:2000]}  # Limit content to avoid token limits\n\nIMPORTANT: Respond with ONLY valid JSON array format, no additional text.\nExample format:\n[\n    {{\n        \"question\": \"What is...?\",\n        \"options\": [\"Option A\", \"Option B\", \"Option C\", \"Option D\"],\n        \"correctAnswer\": \"Option A\",\n        \"explanation\": \"Explanation why Option A is correct\"\n    }}\n]"""
            payload = {
                "model": settings.deepseek_model,
                "messages": [
                    {"role": "user", "content": arena_prompt}
                ]
            }
            response = await client.post(
                settings.deepseek_url,
                headers=headers,
                json=payload
            )

            if response.status_code != 200:
                raise HTTPException(status_code=500, detail="Failed to generate arena questions")

            # Parse the response with improved error handling
            try:
                response_data = response.json()
                content = response_data["choices"][0]["message"]["content"]
                logger.info(f"Raw arena response from DeepSeek: {content[:200]}...")

                # Try multiple parsing strategies
                questions = None

                # Strategy 1: Try to extract JSON array with regex
                json_match = re.search(r'\[.*\]', content, re.DOTALL)
                if json_match:
                    try:
                        questions = json.loads(json_match.group())
                        logger.info("Successfully parsed JSON using regex extraction")
                    except json.JSONDecodeError:
                        logger.warning("Regex extraction failed, trying other strategies")

                # Strategy 2: Try to parse the entire response as JSON
                if questions is None:
                    try:
                        questions = json.loads(content)
                        logger.info("Successfully parsed entire response as JSON")
                    except json.JSONDecodeError:
                        logger.warning("Direct JSON parsing failed, trying cleanup")

                # Strategy 3: Clean up the response and try again
                if questions is None:
                    try:
                        cleaned_text = content.strip()
                        if cleaned_text.startswith("```json"):
                            cleaned_text = cleaned_text[7:]
                        if cleaned_text.endswith("```"):
                            cleaned_text = cleaned_text[:-3]
                        cleaned_text = cleaned_text.strip()

                        questions = json.loads(cleaned_text)
                        logger.info("Successfully parsed JSON after cleanup")
                    except json.JSONDecodeError:
                        logger.warning("JSON cleanup failed, generating fallback questions")

                # Strategy 4: Generate fallback questions if all parsing fails
                if questions is None:
                    logger.warning("All JSON parsing strategies failed, generating fallback questions")
                    questions = generate_fallback_arena_questions(request.question_count, selected_filename)

                # Validate and return questions
                if isinstance(questions, list) and len(questions) > 0:
                    valid_questions = []
                    for q in questions:
                        if isinstance(q, dict) and 'question' in q and 'options' in q and 'correctAnswer' in q and 'explanation' in q:
                            if isinstance(q['options'], list) and len(q['options']) == 4:
                                valid_questions.append(q)
                            else:
                                logger.warning(
                                    f"Question has invalid options format: {q.get('question', 'Unknown')[:50]}...")
                        else:
                            logger.warning(
                                f"Question missing required fields: {q if isinstance(q, dict) else 'Not a dict'}")

                    if valid_questions:
                        logger.info(f"Successfully generated {len(valid_questions)} valid arena questions")
                        return {
                            "questions": valid_questions,
                            "selected_file": selected_filename
                        }
                    else:
                        logger.error("No valid questions found after parsing")
                        fallback_questions = generate_fallback_arena_questions(request.question_count,
                                                                               selected_filename)
                        logger.warning(f"Returning fallback challenges: {fallback_questions}")
                        return {
                            "questions": fallback_questions,
                            "selected_file": selected_filename
                        }
                else:
                    logger.error("Parsed questions is not a valid list")
                    fallback_questions = generate_fallback_arena_questions(request.question_count,
                                                                           selected_filename)
                    logger.warning(f"Returning fallback challenges: {fallback_questions}")
                    return {
                        "questions": fallback_questions,
                        "selected_file": selected_filename
                    }
            except Exception as e:
                logger.error(f"Failed to parse DeepSeek response: {str(e)}")
                fallback_questions = generate_fallback_arena_questions(request.question_count, selected_filename)
                logger.warning(f"Returning fallback challenges: {fallback_questions}")
                return {
                    "questions": fallback_questions,
                    "selected_file": selected_filename
                }

    except Exception as e:
        logger.error(f"Error generating arena questions: {str(e)}")
        try:
            logger.info("Attempting to generate fallback questions due to error")
            fallback_questions = generate_fallback_arena_questions(request.question_count, "study_material")
            logger.warning(f"Returning fallback challenges: {fallback_questions}")
            return {
                "questions": fallback_questions,
                "selected_file": "fallback_generated"
            }
        except Exception as fallback_error:
            logger.error(f"Fallback question generation also failed: {str(fallback_error)}")
            basic_questions = [
                {
                    "question": "What is the purpose of this study material?",
                    "options": ["To test knowledge", "To provide information", "To challenge thinking",
                                "To evaluate skills"],
                    "correctAnswer": "To provide information",
                    "explanation": "Study materials are primarily designed to provide information and knowledge."
                },
                {
                    "question": "How should you approach studying this material?",
                    "options": ["Skip difficult parts", "Read thoroughly", "Memorize only", "Ignore explanations"],
                    "correctAnswer": "Read thoroughly",
                    "explanation": "Thorough reading helps in better understanding and retention of the material."
                }
            ]
            logger.warning(f"Returning fallback challenges: {basic_questions}")
            return {
                "questions": basic_questions[:request.question_count],
                "selected_file": "basic_fallback"
            }


class CheckAnswerRequest(BaseModel):
    question: str
    options: list
    userAnswer: str
    correctAnswer: str


@app.post("/check-answer/")
async def check_answer(req: CheckAnswerRequest):
    def normalize(s, lang=None):
        s = s.strip().lower()
        # Remove comments and semicolons for code
        if lang in ["python", "java", "javascript", "c", "c++"]:
            s = re.sub(r"#.*|//.*|/\*.*?\*/", "", s)  # Remove comments
            s = s.replace(";", "")
        return s.strip()
    user_ans = normalize(req.userAnswer, req.options)
    correct_ans = normalize(req.correctAnswer, req.options)
    # AI-based check (as before, omitted for brevity)
    # Fallback: robust text comparison
    is_correct = user_ans == correct_ans
    if not is_correct and req.options:
        for opt in req.options:
            if normalize(opt) == user_ans and normalize(opt) == correct_ans:
                is_correct = True
                break
    return {"isCorrect": is_correct}


class LearningPathRequest(BaseModel):
    subject: str
    level: str  # e.g., "beginner", "intermediate", "advanced"
    goal: Optional[str] = None
    language: Optional[str] = "English"  # Optionally allow specifying output language


@app.post("/generate-learning-path/")
async def generate_learning_path(
    language: str = Body(...),
    completed_ids: list = Body(default=[])
):
    if language.lower() == "react":
        prompt = (
            f"Create a learning pathway for {language} programming with 3 steps, "
            "starting from absolute beginner (Hello World) to slightly more advanced topics. "
            "For each step, provide:\n"
            "- A clear, beginner-friendly explanation of the concept.\n"
            "- A practical coding challenge (not just Hello World).\n"
            "- Detailed, step-by-step instructions for the challenge, as if teaching a new student.\n"
            "- Each step should have a unique ID, a title, a description, instructions (array), and a challenge (with question and expected output).\n"
            f"Do NOT include steps already completed by the student (IDs: {completed_ids}).\n"
            "Respond ONLY as a JSON array of 3 objects, each with: id, title, description, instructions (array), challenge (object with question and expected output).\n"
        )
    else:
        prompt = (
            f"Create a complete learning pathway for {language} programming, "
            "starting from absolute beginner (Hello World) to advanced topics. "
            "For each step, provide:\n"
            "- A clear, beginner-friendly explanation of the concept.\n"
            "- A practical coding challenge (not just Hello World).\n"
            "- Detailed, step-by-step instructions for the challenge, as if teaching a new student.\n"
            "- Each step should have a unique ID, a title, a description, instructions (array), and a challenge (with question and expected output).\n"
            f"Do NOT include steps already completed by the student (IDs: {completed_ids}).\n"
            "Respond ONLY as a JSON array of objects, each with: id, title, description, instructions (array), challenge (object with question and expected output).\n"
        )
    async with httpx.AsyncClient(timeout=120.0) as client:
        headers = {
            "Authorization": f"Bearer {settings.deepseek_api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": settings.deepseek_model,
            "messages": [
                {"role": "user", "content": prompt}
            ]
        }
        response = await client.post(
            settings.deepseek_url,
            headers=headers,
            json=payload
        )
        if response.status_code != 200:
            logger.error(f"DeepSeek API error: {response.status_code} - {response.text}")
            raise HTTPException(status_code=500, detail="Failed to generate learning path from DeepSeek.")
        response_data = response.json()
        content = response_data["choices"][0]["message"]["content"]
        import json, re
        content = content.replace('```', '')
        json_match = re.search(r'\[.*\]', content, re.DOTALL)
        if json_match:
            try:
                learning_path = json.loads(json_match.group())
                return {"learning_path": learning_path}
            except Exception as e:
                logger.error(f"JSON parsing error: {str(e)}")
        # Fallback: return a hardcoded React Hello World challenge with detailed hint if language is react
        if language.lower() == "react":
            return {"learning_path": [
                {
                    "id": "react-hello-world",
                    "title": "Hello World in React",
                    "description": "Learn how to set up your first React app and display 'Hello World' on the screen.",
                    "instructions": [],  # Remove redundant instructions
                    "challenge": {
                        "question": "Create a React app that displays 'Hello World' on the page.",
                        "expected_output": "Hello World"
                    },
                    "hint": "Install Node.js and npm (if not already installed). Create a new React app using the command: `npx create-react-app hello-world`. Navigate to the project folder: `cd hello-world`. Open the `src/App.js` file and replace its content with a simple `Hello World` component. Run the app using `npm start` and open it in your browser."
                }
            ]}
        logger.warning("Returning raw DeepSeek response as fallback.")
        return {"learning_path": content, "warning": "Could not parse structured steps. See 'learning_path' for raw output."}


class ChallengeRequest(BaseModel):
    language: str
    difficulty: str
    type: str = "general"  # e.g., 'daily', 'learning', 'pvp', etc.


class Challenge(BaseModel):
    question: str
    hint: str


@app.post("/generate-challenges/")
async def generate_challenges(request: ChallengeRequest = Body(...), type: str = Query("general")):
    """
    If type == 'learning_pathway', serve challenges from the queue for the given language.
    Otherwise, keep existing behavior.
    """
    def map_to_full_challenge(ch, idx=0, language="python"):
        # Provide sensible defaults for all required fields
        return {
            "id": ch.get("id") or f"{language}-{idx}-{uuid.uuid4()}",
            "title": ch.get("title") or f"CHALLENGE_{idx + 1}",
            # Fallback for question/description
            "description": ch.get("question") or ch.get("title") or ch.get("prompt") or "",
            "instructions": ch.get("instructions", []),
            "starterCode": ch.get("starterCode", "# Write your code here"),
            "expectedOutput": ch.get("expectedOutput", ""),
            "hints": ch.get("hints") or ([ch["hint"]] if "hint" in ch else []),
            "difficulty": ch.get("difficulty", "NOVICE"),
            "xpReward": ch.get("xpReward", 100)
        }
    if type == "learning_pathway":
        language = request.language if hasattr(request, 'language') and request.language else 'Python'
        queue = load_queue(language)
        logger.info(f"[QUEUE] Before pop: {len(queue)} questions in {language}_queue.json")
        logger.info(f"[QUEUE] First 3 questions before pop: {[q.get('id') for q in queue[:3]]}")
        if not queue:
            queue = await generate_questions_for_language(language, QUEUE_SIZE)
        challenges_to_serve = []
        if queue:
            popped = queue.pop(0)
            logger.info(f"[QUEUE] Popped question: {popped.get('id')}")
            challenges_to_serve.append(popped)
        logger.info(f"[QUEUE] After pop: {len(queue)} questions left in {language}_queue.json")
        if len(queue) < QUEUE_SIZE // 2:
            to_generate = QUEUE_SIZE - len(queue)
            new_questions = await generate_questions_for_language(language, to_generate)
            queue.extend(new_questions)
            logger.info(f"[QUEUE] Added {to_generate} new questions. Queue size now: {len(queue)}")
        save_queue(language, queue)
        # Map to full challenge structure if needed
        challenges_to_serve = [map_to_full_challenge(ch, idx, language) for idx, ch in enumerate(challenges_to_serve)]
        return {"challenges": challenges_to_serve}
    # Default behavior for other types
    try:
        prompt = f"Generate a {request.difficulty.lower()} level {request.language} coding challenge. Provide a question and a hint. Respond as JSON with 'question' and 'hint' fields."
        async with httpx.AsyncClient(
                timeout=60.0,
                limits=httpx.Limits(max_connections=5, max_keepalive_connections=2),
                http2=False
        ) as client:
            headers = {
                "Authorization": f"Bearer {settings.deepseek_api_key}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": settings.deepseek_model,
                "messages": [
                    {"role": "user", "content": prompt}
                ]
            }
            response = await client.post(
                settings.deepseek_url,
                headers=headers,
                json=payload
            )
            response_data = response.json()
            content = response_data["choices"][0]["message"]["content"]
            import json, re
            content = content.replace('```', '')
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                try:
                    challenge = json.loads(json_match.group())
                    challenge = map_to_full_challenge(challenge, 0, request.language)
                    return {"challenges": [challenge]}
                except Exception:
                    pass
    except Exception as e:
        logger.error(f"Error generating general challenges: {e}")
    # Fallback for general challenges
    fallback_challenge = {
        "question": f"Write a simple {request.language} program that demonstrates basic concepts.",
        "hint": "Start with variables and print statements",
        "starterCode": "# Write your code here",
        "expectedOutput": "",
        "hints": ["Start with variables and print statements"],
        "difficulty": "NOVICE",
        "xpReward": 100
    }
    fallback = [map_to_full_challenge(fallback_challenge, 0, request.language)]
    return {"challenges": fallback}


class LearningContentRequest(BaseModel):
    language: str
    level: str  # e.g., 'beginner', 'intermediate', 'advanced'


@app.post("/generate-learning-content/")
async def generate_learning_content(request: LearningContentRequest = Body(...)):
    """
    Generates theory, example, and challenges for a given language and level using the model.
    Returns a JSON object with 'theory', 'example', and 'challenges'.
    """
    prompt = (
        f"For the programming language {request.language} at the {request.level} level, "
        f"provide a short theory lesson (max 120 words), a simple code example, and 3 unique coding challenges with hints. "
        f"Respond ONLY as a JSON object with keys: 'theory', 'example', 'challenges' (where 'challenges' is an array of objects with 'question' and 'hint'). "
        f"Example: {{\"theory\": \"...\", \"example\": \"...\", \"challenges\": [{{\"question\": \"...\", \"hint\": \"...\"}}, ...]}}"
    )
    async with httpx.AsyncClient(timeout=60.0) as client:
        headers = {
            "Authorization": f"Bearer {settings.deepseek_api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": settings.deepseek_model,
            "messages": [
                {"role": "user", "content": prompt}
            ]
        }
        response = await client.post(
            settings.deepseek_url,
            headers=headers,
            json=payload
        )
        response_data = response.json()
        content = response_data["choices"][0]["message"]["content"]
        import json, re
        content = content.replace('```', '')
        json_match = re.search(r'\{.*\}', content, re.DOTALL)
        if json_match:
            try:
                result = json.loads(json_match.group())
                return result
            except Exception:
                pass
    # Fallback if parsing fails
    return {"theory": "", "example": "", "challenges": []}

@app.post("/fill-queue/")
async def fill_queue(language: str = Query(...)):
    """Fill the queue for a language up to QUEUE_SIZE questions."""
    queue = load_queue(language)
    to_generate = QUEUE_SIZE - len(queue)
    if to_generate > 0:
        new_questions = await generate_questions_for_language(language, to_generate)
        queue.extend(new_questions)
        save_queue(language, queue)
    return {"message": f"Queue for {language} filled to {QUEUE_SIZE} questions.", "current_size": len(queue)}

@app.post("/next-question/")
async def next_question(language: str = Query(...)):
    """Pop and return the next question for a language. Auto-refill if queue is low."""
    queue = load_queue(language)
    if not queue:
        # Auto-refill if empty
        queue = await generate_questions_for_language(language, QUEUE_SIZE)
    question = queue.pop(0)
    # Auto-refill if queue is now below half full
    if len(queue) < QUEUE_SIZE // 2:
        to_generate = QUEUE_SIZE - len(queue)
        new_questions = await generate_questions_for_language(language, to_generate)
        queue.extend(new_questions)
    save_queue(language, queue)
    return question

@app.post("/peek-next-question/")
async def peek_next_question(language: str = Query(...)):
    """Return the next question for a language WITHOUT removing it from the queue. Auto-refill if empty."""
    queue = load_queue(language)
    if not queue:
        queue = await generate_questions_for_language(language, QUEUE_SIZE)
        save_queue(language, queue)
    # Auto-refill if queue is now below half full
    if len(queue) < QUEUE_SIZE // 2:
        to_generate = QUEUE_SIZE - len(queue)
        new_questions = await generate_questions_for_language(language, to_generate)
        queue.extend(new_questions)
    save_queue(language, queue)
    return queue[0] if queue else None

@app.post("/pop-next-question/")
async def pop_next_question(language: str = Query(...)):
    """Pop and return the next question for a language. Auto-refill if queue is low."""
    queue = load_queue(language)
    if not queue:
        queue = await generate_questions_for_language(language, QUEUE_SIZE)
    if not queue:
        save_queue(language, queue)
        return None
    question = queue.pop(0)
    # Auto-refill if queue is now below half full
    if len(queue) < QUEUE_SIZE // 2:
        to_generate = QUEUE_SIZE - len(queue)
        new_questions = await generate_questions_for_language(language, to_generate)
        queue.extend(new_questions)
    save_queue(language, queue)
    return question

@app.post("/generate-daily-challenges-llama/")
async def generate_daily_challenges_llama(payload: dict = Body(...)):
    """Generate daily challenges using DeepSeek."""
    try:
        prompt = payload.get("prompt", "Generate a daily coding challenge.")
        async with httpx.AsyncClient(timeout=60.0) as client:
            headers = {
                "Authorization": f"Bearer {settings.deepseek_api_key}",
                "Content-Type": "application/json"
            }
            ds_payload = {
                "model": settings.deepseek_model,
                "messages": [
                    {"role": "user", "content": prompt}
                ]
            }
            response = await client.post(
                settings.deepseek_url,
                headers=headers,
                json=ds_payload
            )
            response_data = response.json()
            content = response_data["choices"][0]["message"]["content"]
            return {"challenge": content}
    except Exception as e:
        logger.error(f"Error generating daily challenge with DeepSeek: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate daily challenge.")


DSA_QUESTIONS = [
    {"question": "Write a function that takes two numbers as parameters and returns their sum.", "difficulty": "basic", "type": "code"},
    {"question": "Implement a function to reverse a string.", "difficulty": "basic", "type": "code"},
    {"question": "Write a function to check if a number is prime.", "difficulty": "intermediate", "type": "code"},
    {"question": "Given an array, find the maximum subarray sum.", "difficulty": "intermediate", "type": "code"},
    {"question": "Implement a binary search algorithm.", "difficulty": "intermediate", "type": "code"},
    {"question": "Given a binary tree, return its inorder traversal.", "difficulty": "advanced", "type": "code"},
    {"question": "Solve the N-Queens problem.", "difficulty": "advanced", "type": "code"},
    {"question": "Implement Dijkstra's shortest path algorithm.", "difficulty": "advanced", "type": "code"},
]
STATE_FILE = os.path.join(os.path.dirname(__file__), 'daily_challenge_state.json')

def load_daily_state():
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, 'r') as f:
            return json.load(f)
    return {"last_index": -1, "last_time": None}

def save_daily_state(state):
    with open(STATE_FILE, 'w') as f:
        json.dump(state, f)

def get_dsa_prompt():
    return (
        "Generate a daily data structures and algorithms (DSA) problem statement. "
        "The problem should be language-independent and suitable for coding interviews. "
        "Provide only the problem statement and a difficulty level (basic, intermediate, advanced). "
        "Respond with a single line of valid JSON: {\"question\": ..., \"difficulty\": ...}"
    )

async def generate_dsa_question():
    prompt = get_dsa_prompt()
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            f"{settings.deepseek_url}/v1/chat/completions",
            json={
                "model": settings.deepseek_model,
                "messages": [
                    {"role": "user", "content": prompt}
                ]
            }
        )
        response.raise_for_status()
        content = response.json()["choices"][0]["message"]["content"]
        import json
        # Try to parse the JSON from the model's response
        try:
            result_json = json.loads(content)
            if 'question' in result_json and 'difficulty' in result_json:
                return result_json
            # If the model returns a string, try to extract JSON
            import re
            json_match = re.search(r'\{.*\}', content.decode() if isinstance(content, bytes) else str(content), re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
        except Exception:
            pass
        # Fallback if parsing fails
        return {"question": "Write a function to reverse a linked list.", "difficulty": "intermediate"}

async def generate_dsa_question_with_difficulty(difficulty):
    prompt = (
        f"Generate a daily coding interview problem about data structures and algorithms. "
        f"The problem should be language-independent. "
        f"Difficulty: {difficulty}. "
        f"Respond with a single line of valid JSON: {{\"question\": \"...\", \"difficulty\": \"...\"}}"
    )
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            settings.deepseek_url,
            headers={
                "Authorization": f"Bearer {settings.deepseek_api_key}",
                "Content-Type": "application/json"
            },
            json={
            "model": settings.deepseek_model,
            "messages": [
                {"role": "user", "content": prompt}
            ]
            }
        )
        response.raise_for_status()
        content = response.json()["choices"][0]["message"]["content"]
        import json, re
        try:
            result_json = json.loads(content)
            if "response" in result_json:
                response_text = result_json["response"]
                json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
                if json_match:
                    challenge = json.loads(json_match.group())
                else:
                    challenge = {}
            else:
                challenge = result_json
        except Exception:
            challenge = {}
        print("DeepSeek RAW RESPONSE:", challenge)
        if not (isinstance(challenge, dict) and "question" in challenge and "difficulty" in challenge):
            challenge = {"question": "Write a function to reverse a linked list.", "difficulty": difficulty}
        return challenge

DIFFICULTY_CYCLE = ["intermediate", "advanced"]

def get_next_difficulty(state):
    last_difficulty_index = state.get("last_difficulty_index", -1)
    next_index = (last_difficulty_index + 1) % len(DIFFICULTY_CYCLE)
    state["last_difficulty_index"] = next_index
    return DIFFICULTY_CYCLE[next_index]

@app.post("/techclub/daily-challenge/")
async def techclub_daily_challenge():
    state = load_daily_state()
    now = datetime.utcnow()
    last_time = (
        datetime.fromisoformat(state["last_time"]) if state.get("last_time") else None
    )
    last_challenge = state.get("last_challenge")
    used_questions = state.get("used_questions", [])
    if not last_time or (now - last_time) > timedelta(hours=24) or not last_challenge:
        difficulty = get_next_difficulty(state)
        challenge = await generate_dsa_question_with_difficulty(difficulty)
        question_text = challenge["question"]
        if question_text in used_questions:
            for _ in range(5):
                challenge = await generate_dsa_question_with_difficulty(difficulty)
                question_text = challenge["question"]
                if question_text not in used_questions:
                    break
        used_questions.append(question_text)
        if len(used_questions) >= 30:
            used_questions = []
        state["used_questions"] = used_questions
        state["last_challenge"] = challenge
        state["last_time"] = now.isoformat()
        save_daily_state(state)
    else:
        challenge = state["last_challenge"]
    return {"challenge": challenge}

@app.post("/techclub/pvp-arena-question/")
async def techclub_pvp_arena_question(payload: dict = Body(...)):
    prompt = payload.get("prompt")
    description = payload.get("description")
    problem = payload.get("problem")
    try:
        if prompt:
            model_prompt = f"Generate a coding challenge for a PVP arena match. Title: {prompt}. Description: {description or ''}. Problem: {problem or ''}. The challenge should be suitable for a timed coding battle. Respond as a JSON object with fields: question, starterCode, expectedOutput, timeLimit, difficulty, xpReward."
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    settings.deepseek_url,
                    headers={
                        "Authorization": f"Bearer {settings.deepseek_api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": settings.deepseek_model,
                        "messages": [
                            {"role": "user", "content": model_prompt}
                        ]
                    }
                )
                response.raise_for_status()
                content = response.json()["choices"][0]["message"]["content"]
                import json, re
                json_match = re.search(r'\{.*\}', content, re.DOTALL)
                if json_match:
                    challenge = json.loads(json_match.group())
                else:
                    challenge = json.loads(content)
                return {"question": challenge}
        from random import choice
        languages = ["python", "java", "c++", "c", "javascript"]
        language = choice(languages)
        challenge = await generate_llama_challenge(language, "code")
        return {"question": challenge}
    except Exception as e:
        return {"question": get_fallback_challenge("python", "code")}

# --- LMS Uploads Section ---
LMS_UPLOAD_DIR = Path("lms_uploads")
LMS_UPLOAD_DIR.mkdir(exist_ok=True)
LMS_METADATA_FILE = LMS_UPLOAD_DIR / "file_metadata.json"
LMS_SUBMISSIONS_METADATA_FILE = LMS_UPLOAD_DIR / "submissions_metadata.json"

async def lms_validate_file(file: UploadFile):
    ext = Path(file.filename).suffix.lower()
    if ext not in settings.allowed_extensions:
        raise HTTPException(status_code=400, detail=f"File type {ext} not allowed.")
    # Read the file content to check the size
    content = await file.read()
    if len(content) > settings.max_file_size:
        raise HTTPException(status_code=400, detail="File too large.")
    # Reset the file pointer so it can be read again later
    await file.seek(0)

async def lms_save_file(file: UploadFile, subdir: str = "") -> str:
    subdir_path = LMS_UPLOAD_DIR / subdir if subdir else LMS_UPLOAD_DIR
    subdir_path.mkdir(exist_ok=True)
    file_path = subdir_path / file.filename
    async with aiofiles.open(file_path, "wb") as out_file:
        content = await file.read()
        await out_file.write(content)
    return str(file_path)

def lms_load_metadata(meta_file=LMS_METADATA_FILE):
    if meta_file.exists():
        with open(meta_file, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

def lms_save_metadata(metadata, meta_file=LMS_METADATA_FILE):
    with open(meta_file, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

# --- LMS Quiz/Assignment Storage ---
LMS_QUIZ_FILE = LMS_UPLOAD_DIR / "quiz_metadata.json"

def lms_load_quizzes():
    if LMS_QUIZ_FILE.exists():
        with open(LMS_QUIZ_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

def lms_save_quizzes(quizzes):
    with open(LMS_QUIZ_FILE, "w", encoding="utf-8") as f:
        json.dump(quizzes, f, indent=2)

# --- LMS Quiz Assignment Storage ---
LMS_ASSIGN_FILE = LMS_UPLOAD_DIR / "quiz_assignments.json"

def lms_load_assignments():
    if LMS_ASSIGN_FILE.exists():
        with open(LMS_ASSIGN_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

def lms_save_assignments(assignments):
    with open(LMS_ASSIGN_FILE, "w", encoding="utf-8") as f:
        json.dump(assignments, f, indent=2)

def lms_load_quiz_results():
    """Load quiz results from JSON file."""
    results_file = LMS_UPLOAD_DIR / "quiz_results.json"
    if results_file.exists():
        with open(results_file, "r") as f:
            return json.load(f)
    return []

def lms_save_quiz_results(results):
    """Save quiz results to JSON file."""
    results_file = LMS_UPLOAD_DIR / "quiz_results.json"
    with open(results_file, "w") as f:
        json.dump(results, f, indent=2)

@app.post("/lms/upload/")
async def lms_upload_files(
    files: List[UploadFile] = File(...),
    teacher: str = Form(...),
    course: str = Form(...),
    description: str = Form("")
):
    """Teacher uploads notes/assignments for LMS."""
    metadata = lms_load_metadata()
    uploaded = []
    for file in files:
        await lms_validate_file(file)
        # Generate unique filename
        unique_id = str(uuid.uuid4())
        ext = Path(file.filename).suffix
        unique_filename = f"{teacher}_{course}_{unique_id}{ext}"
        file_path = LMS_UPLOAD_DIR / "notes" / unique_filename
        # Save file
        async with aiofiles.open(file_path, "wb") as out_file:
            content = await file.read()
            await out_file.write(content)
        public_url = f"http://localhost:8000/lms/public/notes/{unique_filename}"
        entry = {
            "filename": unique_filename,
            "original_filename": file.filename,
            "path": str(file_path),
            "public_url": public_url,
            "teacher": teacher,
            "course": course,
            "description": description,
            "uploaded_at": datetime.utcnow().isoformat(),
            "uuid": unique_id
        }
        metadata.append(entry)
        uploaded.append(entry)
    lms_save_metadata(metadata)
    return {"uploaded": uploaded}

@app.get("/lms/files/")
async def lms_list_files():
    """List all LMS teacher-uploaded files."""
    return lms_load_metadata()

@app.get("/lms/public/notes/{filename}")
async def serve_public_note(filename: str):
    file_path = LMS_UPLOAD_DIR / "notes" / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found.")
    return FileResponse(str(file_path), filename=filename)

@app.get("/lms/public/submissions/{filename}")
async def serve_public_submission(filename: str):
    file_path = LMS_UPLOAD_DIR / "submissions" / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found.")
    return FileResponse(str(file_path), filename=filename)

@app.post("/lms/submission/")
async def lms_upload_submission(
    file: UploadFile = File(...),
    student: str = Form(...),
    assignment: str = Form(...),
    notes: str = Form("")
):
    """Student uploads assignment submission for LMS."""
    meta_file = LMS_SUBMISSIONS_METADATA_FILE
    metadata = lms_load_metadata(meta_file)
    await lms_validate_file(file)
    # Generate unique filename
    unique_id = str(uuid.uuid4())
    ext = Path(file.filename).suffix
    unique_filename = f"{student}_{assignment}_{unique_id}{ext}"
    file_path = LMS_UPLOAD_DIR / "submissions" / unique_filename
    # Save file
    async with aiofiles.open(file_path, "wb") as out_file:
        content = await file.read()
        await out_file.write(content)
    public_url = f"http://localhost:8000/lms/public/submissions/{unique_filename}"
    entry = {
        "filename": unique_filename,
        "original_filename": file.filename,
        "path": str(file_path),
        "public_url": public_url,
        "student": student,
        "assignment": assignment,
        "notes": notes,
        "uploaded_at": datetime.utcnow().isoformat(),
        "uuid": unique_id
    }
    metadata.append(entry)
    lms_save_metadata(metadata, meta_file)
    return {"uploaded": entry}

@app.get("/lms/submissions/")
async def lms_list_submissions():
    """List all LMS student submissions."""
    return lms_load_metadata(LMS_SUBMISSIONS_METADATA_FILE)

@app.get("/lms/download/notes/{filename}")
async def download_lms_note(filename: str):
    """Download a teacher-uploaded LMS note/assignment by filename."""
    file_path = LMS_UPLOAD_DIR / "notes" / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found.")
    return FileResponse(str(file_path), filename=filename)

@app.get("/lms/download/submissions/{filename}")
async def download_lms_submission(filename: str):
    """Download a student submission by filename."""
    file_path = LMS_UPLOAD_DIR / "submissions" / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found.")
    return FileResponse(str(file_path), filename=filename)

class LMSAIQuizRequest(BaseModel):
    file_url: str
    instructions: str = "Generate a quiz from this file."

class LMSAIAssessmentRequest(BaseModel):
    file_url: str
    student_answer: str
    instructions: str = "Grade this answer based on the file."

@app.post("/lms/ai/generate-quiz/")
async def lms_generate_quiz(payload: LMSAIQuizRequest):
    """Generate a quiz from a Supabase file using DeepSeek AI."""
    # Download file from Supabase Storage
    async with httpx.AsyncClient() as client:
        file_response = await client.get(payload.file_url)
        if file_response.status_code != 200:
            raise HTTPException(status_code=400, detail="Could not fetch file from Supabase Storage.")
        file_content = file_response.text
    
    # Truncate file content if too large (DeepSeek has limits)
    MAX_CONTENT_LENGTH = 8000  # characters
    if len(file_content) > MAX_CONTENT_LENGTH:
        file_content = file_content[:MAX_CONTENT_LENGTH] + "\n\n[Content truncated due to size limits]"
        print(f"DEBUG: File content truncated from {len(file_response.text)} to {len(file_content)} characters")
    
    # Compose prompt for DeepSeek with specific MCQ format
    prompt = f"""{payload.instructions}

File Content:
{file_content}

Generate multiple choice questions in the following JSON format:
[
  {{
    "question": "What is the main purpose of LLMs?",
    "options": [
      "To process natural language",
      "To generate images",
      "To play games",
      "To create music"
    ],
    "correct_answer": "To process natural language",
    "explanation": "LLMs are designed to understand and generate human language."
  }}
]

Make sure each question has exactly 4 options and one correct_answer. Return only the JSON array."""
    
    # Use DeepSeek logic (reuse existing)
    headers = {
        "Authorization": f"Bearer {settings.deepseek_api_key}",
        "Content-Type": "application/json"
    }
    deepseek_payload = {
        "model": settings.deepseek_model,
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }
    async with httpx.AsyncClient(timeout=120.0) as client:
        response = await client.post(
            settings.deepseek_url,
            headers=headers,
            json=deepseek_payload
        )
        if response.status_code != 200:
            error_detail = f"DeepSeek API error: {response.status_code}"
            if response.status_code == 413:
                error_detail = "File content too large for AI processing. Please try with a smaller file."
            elif response.status_code == 429:
                error_detail = "API rate limit exceeded. Please try again later."
            elif response.status_code == 401:
                error_detail = "API key authentication failed."
            
            print(f"DEBUG: DeepSeek API error - Status: {response.status_code}, Detail: {error_detail}")
            raise HTTPException(status_code=500, detail=error_detail)
        
        response_data = response.json()
        content = response_data["choices"][0]["message"]["content"]

    # Extract JSON code block
    match = re.search(r"```json\s*([\s\S]+?)```", content)
    if match:
        json_str = match.group(1)
    else:
        # fallback: try to find first [...] block (array)
        match = re.search(r"(\[[\s\S]+\])", content)
        if match:
            json_str = match.group(1)
        else:
            # fallback: try to find first {...} block
            match = re.search(r"({[\s\S]+})", content)
            json_str = match.group(1) if match else None

    if json_str:
        import json
        try:
            quiz_json = json.loads(json_str)
            print(f"DEBUG: Generated quiz JSON: {quiz_json}")
            # If it's an object with 'quiz', return that array, else return the object
            if isinstance(quiz_json, dict) and 'quiz' in quiz_json:
                return {"quiz": quiz_json["quiz"]}
            elif isinstance(quiz_json, list):
                return {"quiz": quiz_json}
            else:
                return {"quiz": [quiz_json]}
        except Exception as e:
            print(f"DEBUG: JSON parsing error: {e}")
            pass

    # fallback: return an empty array
    print(f"DEBUG: Using fallback empty quiz")
    return {"quiz": []}

@app.post("/lms/ai/grade-submission/")
async def lms_grade_submission(payload: LMSAIAssessmentRequest):
    """Grade a student answer using a Supabase file and DeepSeek AI."""
    # Download file from Supabase Storage
    async with httpx.AsyncClient() as client:
        file_response = await client.get(payload.file_url)
        if file_response.status_code != 200:
            raise HTTPException(status_code=400, detail="Could not fetch file from Supabase Storage.")
        file_content = file_response.text
    # Compose prompt for DeepSeek
    prompt = (
        f"{payload.instructions}\n\nReference File Content:\n{file_content}\n\nStudent Answer:\n{payload.student_answer}\n\nProvide a grade and feedback."
    )
    headers = {
        "Authorization": f"Bearer {settings.deepseek_api_key}",
        "Content-Type": "application/json"
    }
    deepseek_payload = {
        "model": settings.deepseek_model,
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }
    async with httpx.AsyncClient(timeout=120.0) as client:
        response = await client.post(
            settings.deepseek_url,
            headers=headers,
            json=deepseek_payload
        )
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to grade submission from DeepSeek.")
        response_data = response.json()
        content = response_data["choices"][0]["message"]["content"]
    return {"grade": content}

@app.post("/lms/quiz/")
async def lms_save_quiz(request: Request):
    data = await request.json()
    print(f"DEBUG: Saving quiz data: {data}")
    quizzes = lms_load_quizzes()
    print(f"DEBUG: Current quizzes: {quizzes}")
    # Add a unique ID and timestamp
    import uuid
    quiz_id = str(uuid.uuid4())
    data["id"] = quiz_id
    data["created_at"] = datetime.utcnow().isoformat()
    print(f"DEBUG: Quiz ID generated: {quiz_id}")
    quizzes.append(data)
    lms_save_quizzes(quizzes)
    print(f"DEBUG: Quiz saved successfully")
    return {"status": "success", "id": quiz_id}

@app.get("/lms/quiz/")
async def lms_list_quizzes():
    return lms_load_quizzes()

@app.post("/lms/quiz/assign/")
async def lms_assign_quiz(request: Request):
    data = await request.json()
    quiz_id = data.get("quiz_id")
    class_id = data.get("class_id")
    print(f"DEBUG: Assigning quiz {quiz_id} to class {class_id}")
    
    if not quiz_id or not class_id:
        raise HTTPException(status_code=400, detail="quiz_id and class_id are required")
    
    assignments = lms_load_assignments()
    print(f"DEBUG: Current assignments: {assignments}")
    
    # Prevent duplicate assignment
    for a in assignments:
        if a["quiz_id"] == quiz_id and a["class_id"] == class_id:
            print(f"DEBUG: Quiz already assigned")
            return {"status": "already_assigned"}
    
    new_assignment = {
        "quiz_id": quiz_id,
        "class_id": class_id,
        "assigned_at": datetime.utcnow().isoformat()
    }
    assignments.append(new_assignment)
    print(f"DEBUG: Saving assignments: {assignments}")
    lms_save_assignments(assignments)
    return {"status": "success"}

@app.get("/lms/quiz/assigned/{class_id}")
async def lms_list_assigned_quizzes(class_id: str):
    print(f"DEBUG: Fetching assigned quizzes for class {class_id}")
    assignments = lms_load_assignments()
    quizzes = lms_load_quizzes()
    print(f"DEBUG: All assignments: {assignments}")
    print(f"DEBUG: All quizzes: {quizzes}")
    assigned_quiz_ids = [a["quiz_id"] for a in assignments if a["class_id"] == class_id]
    print(f"DEBUG: Assigned quiz IDs for class {class_id}: {assigned_quiz_ids}")
    assigned_quizzes = [q for q in quizzes if q["id"] in assigned_quiz_ids]
    print(f"DEBUG: Final assigned quizzes: {assigned_quizzes}")
    return assigned_quizzes

@app.post("/lms/quiz/result/")
async def lms_save_quiz_result(request: Request):
    """Save quiz result when student completes a quiz."""
    data = await request.json()
    quiz_id = data.get("quizId") or data.get("quiz_id")
    student_id = data.get("studentId") or data.get("student_id")
    student_name = data.get("studentName") or data.get("student_name")
    class_id = data.get("classId") or data.get("class_id")
    answers = data.get("answers", [])
    score = data.get("score", 0)
    time_taken = data.get("timeTaken") or data.get("time_taken", 0)
    completed_at = data.get("completedAt") or datetime.utcnow().isoformat()
    
    if not quiz_id or not student_id:
        raise HTTPException(status_code=400, detail="quizId and studentId are required")
    
    results = lms_load_quiz_results()
    
    # Add unique ID and timestamp
    import uuid
    result_id = str(uuid.uuid4())
    result_data = {
        "id": result_id,
        "quizId": quiz_id,
        "studentId": student_id,
        "studentName": student_name,
        "classId": class_id,
        "answers": answers,
        "score": score,
        "timeTaken": time_taken,
        "completedAt": completed_at
    }
    
    results.append(result_data)
    lms_save_quiz_results(results)
    
    print(f"DEBUG: Saved quiz result: {result_data}")
    return {"status": "success", "id": result_id}

@app.get("/lms/quiz/results/{quiz_id}")
async def lms_get_quiz_results(quiz_id: str):
    """Get all results for a specific quiz."""
    results = lms_load_quiz_results()
    # Handle both quiz_id and quizId field names
    quiz_results = [r for r in results if r.get("quiz_id") == quiz_id or r.get("quizId") == quiz_id]
    
    # Normalize the response format
    normalized_results = []
    for result in quiz_results:
        normalized_result = {
            "id": result.get("id"),
            "quiz_id": result.get("quiz_id") or result.get("quizId"),
            "student_id": result.get("student_id") or result.get("studentId"),
            "student_name": result.get("student_name") or result.get("studentName"),
            "class_id": result.get("class_id") or result.get("classId"),
            "answers": result.get("answers", []),
            "score": result.get("score", 0),
            "time_taken": result.get("time_taken") or result.get("timeTaken", 0),
            "completed_at": result.get("completed_at") or result.get("completedAt")
        }
        normalized_results.append(normalized_result)
    
    return normalized_results

@app.get("/lms/quiz/student-results/{student_id}")
async def lms_get_student_results(student_id: str):
    """Get all quiz results for a specific student"""
    try:
        results = lms_load_quiz_results()
        student_results = [r for r in results if r.get('studentId') == student_id]
        return student_results
    except Exception as e:
        logger.error(f"Error getting student results: {e}")
        raise HTTPException(status_code=500, detail="Failed to get student results")

@app.get("/get-quiz-results")
async def get_quiz_results(studentId: str = Query(...), classId: str = Query(...)):
    """Get quiz results for a specific student in a specific class"""
    try:
        results = lms_load_quiz_results()
        filtered_results = [
            r for r in results 
            if r.get('studentId') == studentId and r.get('classId') == classId
        ]
        return filtered_results
    except Exception as e:
        logger.error(f"Error getting quiz results: {e}")
        raise HTTPException(status_code=500, detail="Failed to get quiz results")

@app.post("/lms/ai/generate-quiz-from-file/")
async def lms_generate_quiz_from_file(
    file: UploadFile = File(...),
    instructions: str = Form("Generate a quiz from this file.")
):
    """Generate a quiz from an uploaded file using DeepSeek AI."""
    try:
        # Validate file
        await lms_validate_file(file)
        
        # Read file content
        content = await file.read()
        file_content = content.decode('utf-8', errors='ignore')
        
        # Truncate file content if too large (DeepSeek has limits)
        MAX_CONTENT_LENGTH = 8000  # characters
        if len(file_content) > MAX_CONTENT_LENGTH:
            file_content = file_content[:MAX_CONTENT_LENGTH] + "\n\n[Content truncated due to size limits]"
            print(f"DEBUG: File content truncated from {len(content.decode('utf-8', errors='ignore'))} to {len(file_content)} characters")
        
        # Compose prompt for DeepSeek with specific MCQ format
        prompt = f"""{instructions}

File Content:
{file_content}

Generate multiple choice questions in the following JSON format:
[
  {{
    "question": "What is the main purpose of LLMs?",
    "options": [
      "To process natural language",
      "To generate images",
      "To play games",
      "To create music"
    ],
    "correct_answer": "To process natural language",
    "explanation": "LLMs are designed to understand and generate human language."
  }}
]

Make sure each question has exactly 4 options and one correct_answer. Return only the JSON array."""
        
        # Use DeepSeek logic
        headers = {
            "Authorization": f"Bearer {settings.deepseek_api_key}",
            "Content-Type": "application/json"
        }
        deepseek_payload = {
            "model": settings.deepseek_model,
            "messages": [
                {"role": "user", "content": prompt}
            ]
        }
        
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                settings.deepseek_url,
                headers=headers,
                json=deepseek_payload
            )
            if response.status_code != 200:
                error_detail = f"DeepSeek API error: {response.status_code}"
                if response.status_code == 413:
                    error_detail = "File content too large for AI processing. Please try with a smaller file."
                elif response.status_code == 429:
                    error_detail = "API rate limit exceeded. Please try again later."
                elif response.status_code == 401:
                    error_detail = "API key authentication failed."
                
                print(f"DEBUG: DeepSeek API error - Status: {response.status_code}, Detail: {error_detail}")
                raise HTTPException(status_code=500, detail=error_detail)
            
            response_data = response.json()
            content = response_data["choices"][0]["message"]["content"]

        # Extract JSON code block
        match = re.search(r"```json\s*([\s\S]+?)```", content)
        if match:
            json_str = match.group(1)
        else:
            # Try to find JSON array directly
            match = re.search(r"\[\s*\{[\s\S]+\}\s*\]", content)
            if match:
                json_str = match.group(0)
            else:
                raise HTTPException(status_code=500, detail="Could not extract JSON from AI response")

        try:
            quiz_data = json.loads(json_str)
            print(f"DEBUG: Generated quiz with {len(quiz_data)} questions")
            return {"quiz": quiz_data}
        except json.JSONDecodeError as e:
            print(f"DEBUG: JSON parsing error: {e}")
            print(f"DEBUG: Raw content: {content}")
            raise HTTPException(status_code=500, detail="Failed to parse quiz JSON from AI response")
            
    except Exception as e:
        print(f"DEBUG: Quiz generation error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate quiz: {str(e)}")





if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)