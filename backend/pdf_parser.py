import io
import os
import tempfile

from pdfminer.high_level import extract_text as pdfminer_extract


def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """Extract text from PDF bytes. Falls back to OCR if no text is found."""
    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
        tmp.write(pdf_bytes)
        tmp_path = tmp.name

    try:
        text = pdfminer_extract(tmp_path)
        if text and text.strip():
            return text.strip()

        return _ocr_fallback(tmp_path)
    finally:
        os.unlink(tmp_path)


def _ocr_fallback(pdf_path: str) -> str:
    """Convert PDF pages to images and run OCR via pytesseract."""
    try:
        import pytesseract
        from PIL import Image
        from pdf2image import convert_from_path

        pages = convert_from_path(pdf_path, dpi=300)
        text_parts = []
        for page in pages:
            text_parts.append(
                pytesseract.image_to_string(page, lang="swe+eng")
            )
        return "\n".join(text_parts).strip()
    except ImportError:
        raise RuntimeError(
            "PDF saknar text och OCR-beroenden (pdf2image, pytesseract) "
            "är inte installerade. Kör: pip install pdf2image pytesseract"
        )
    except Exception as e:
        raise RuntimeError(f"OCR misslyckades: {e}")
