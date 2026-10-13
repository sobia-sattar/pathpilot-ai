"""
PathPilot AI - PDF Extraction Module
Safely extracts text from uploaded PDF resumes with file validation,
multi-engine support (PyMuPDF / pypdf), and fallback handling for scanned documents.
"""

import io
import re
from typing import Tuple, Optional

# Attempt optional library imports gracefully
try:
    import fitz  # PyMuPDF
    PYMUPDF_AVAILABLE = True
except ImportError:
    fitz = None
    PYMUPDF_AVAILABLE = False

try:
    import pypdf
    PYPDF_AVAILABLE = True
except ImportError:
    pypdf = None
    PYPDF_AVAILABLE = False

MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB

def extract_text_from_pdf_bytes(pdf_bytes: bytes, filename: str = "uploaded_resume.pdf") -> Tuple[bool, str, Optional[str]]:
    """
    Extracts text from raw PDF bytes safely.
    Returns: (success: bool, extracted_text: str, error_or_notice: Optional[str])
    """
    if not pdf_bytes:
        return False, "", "The uploaded file is empty."

    if len(pdf_bytes) > MAX_FILE_SIZE_BYTES:
        return False, "", f"File size exceeds maximum limit of {MAX_FILE_SIZE_BYTES // (1024*1024)} MB."

    # Validate PDF signature (%PDF-)
    if not pdf_bytes.startswith(b"%PDF-"):
        return False, "", "Invalid file format: File does not start with standard PDF header."

    extracted_text = ""

    # Strategy 1: PyMuPDF (High fidelity)
    if PYMUPDF_AVAILABLE and fitz is not None:
        try:
            doc = fitz.open(stream=pdf_bytes, filetype="pdf")
            pages_text = []
            for page in doc:
                text = page.get_text("text")
                if text:
                    pages_text.append(text)
            doc.close()
            extracted_text = "\n\n".join(pages_text).strip()
        except Exception as e:
            extracted_text = ""

    # Strategy 2: pypdf fallback
    if not extracted_text and PYPDF_AVAILABLE and pypdf is not None:
        try:
            reader = pypdf.PdfReader(io.BytesIO(pdf_bytes))
            pages_text = []
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    pages_text.append(text)
            extracted_text = "\n\n".join(pages_text).strip()
        except Exception as e:
            extracted_text = ""

    # Handle Scanned / Image-Only PDFs
    if not extracted_text:
        return (
            False,
            "",
            "Could not extract digital text from this PDF. This document may be a scanned image or protected. Please copy and paste your resume text directly into the text workspace."
        )

    # Sanitize text
    cleaned_text = sanitize_extracted_text(extracted_text)
    
    if len(cleaned_text.strip()) < 30:
        return (
            False,
            "",
            "Insufficient readable text extracted from PDF. Please paste your resume text manually."
        )

    return True, cleaned_text, None

def sanitize_extracted_text(text: str) -> str:
    """
    Sanitizes raw text: strips null bytes, normalizes line breaks and whitespace.
    Treats input strictly as raw data to prevent execution or injection.
    """
    if not text:
        return ""
    # Strip null bytes and non-printable control chars except \n, \r, \t
    sanitized = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', text)
    # Normalize multiple newlines
    sanitized = re.sub(r'\n{3,}', '\n\n', sanitized)
    return sanitized.strip()
