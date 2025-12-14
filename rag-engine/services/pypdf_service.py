import fitz  # PyMuPDF

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Extracts raw text from a PDF file (bytes).
    """
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    text_content = []

    for page in doc:
        text_content.append(page.get_text())

    full_text = "\n".join(text_content)
    return full_text
