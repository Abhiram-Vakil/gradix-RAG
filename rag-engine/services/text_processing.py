import re

def clean_text(text: str) -> str:
    """
    Clean scanned text by removing ads, noise, and fixing formatting issues.
    """

    # Define noise patterns to remove
    noise_patterns = [
        r'www\.\w+\.\w+',  # URLs/websites
        r'Download from.*',  # Download links
        r'For More Study Materials*',  # Download links
        r'Available at.*',  # Availability notes
        r'For more notes visit.*',  # Advertisement text
        r'Subscribe to.*',  # Subscription ads
        r'Follow us on.*',  # Social media ads
        r'Page \d+ of \d+',  # Page numbers
        r'©.*\d{4}',  # Copyright notices
        r'keralanotes\.com.*',  # Specific website mentions
        r'ktunotes\.in.*',  # KTU notes website
        r'Visit our website.*',  # Website promotions
        r'For latest updates.*',  # Update notifications
        r'Join our.*',  # Join promotions
        r'Contact us.*',  # Contact information
        r'Email:.*@.*\..*',  # Email addresses
        r'Phone:.*\d{10}.*',  # Phone numbers
    ]

    cleaned_text = text

    # Remove all noise patterns
    for pattern in noise_patterns:
        cleaned_text = re.sub(pattern, '', cleaned_text, flags=re.IGNORECASE)

    # Fix spacing issues
    cleaned_text = re.sub(r'\s+', ' ', cleaned_text)  # Multiple spaces → single space
    cleaned_text = re.sub(r'\n\s*\n', '\n', cleaned_text)  # Multiple newlines → single

    # Remove page references and chapter markers
    cleaned_text = re.sub(r'Page \d+', '', cleaned_text)
    cleaned_text = re.sub(r'Chapter \d+ \| Page \d+', '', cleaned_text)
    cleaned_text = re.sub(r'Page:\s*\d+', '', cleaned_text)

    # Fix encoding issues common in OCR
    encoding_fixes = {
        'â€™': "'",  # Fix apostrophes
        'â€œ': '"',  # Fix opening quotes
        'â€\x9d': '"',  # Fix closing quotes
        'â€"': '-',  # Fix em dash
        'â€¦': '...',  # Fix ellipsis
    }

    for wrong, correct in encoding_fixes.items():
        cleaned_text = cleaned_text.replace(wrong, correct)

    # Remove empty lines and extra whitespace
    lines = [line.strip() for line in cleaned_text.split('\n') if line.strip()]
    cleaned_text = '\n'.join(lines)

    # Final cleanup
    cleaned_text = cleaned_text.strip()
    
    print(f"🧹 Text Cleaned. Original: {len(text)} -> New: {len(cleaned_text)}")

    return cleaned_text

def calculate_sentence_similarity(sent1, sent2):
    """Simple word overlap similarity"""
    words1 = set(sent1.lower().split())
    words2 = set(sent2.lower().split())
    
    if not words1 or not words2:
        return 0
    
    intersection = len(words1.intersection(words2))
    union = len(words1.union(words2))
    
    return intersection / union

def similarity_based_chunking(text: str, similarity_threshold: float = 0.3) -> list[str]:
    """
    Chunk based on semantic similarity between adjacent sentences
    """
    sentences = re.split(r'(?<=[.!?])\s+', text)
    
    if not sentences:
        return []
    
    chunks = []
    current_chunk = [sentences[0]]
    
    for i in range(1, len(sentences)):
        # Calculate similarity between consecutive sentences
        similarity = calculate_sentence_similarity(sentences[i-1], sentences[i])
        
        # If similarity is high, keep in same chunk
        if similarity > similarity_threshold:
            current_chunk.append(sentences[i])
        else:
            # Low similarity = topic change, start new chunk
            chunks.append(' '.join(current_chunk))
            current_chunk = [sentences[i]]
    
    # Add last chunk
    if current_chunk:
        chunks.append(' '.join(current_chunk))
    
    # Filter very small chunks (threshold kept low for testing)
    return [chunk.strip() for chunk in chunks if len(chunk.strip()) > 5]

def simple_chunk_text(text: str, chunk_size: int = 600, overlap: int = 100) -> list[str]:
    """
    Simple fixed-size chunking with overlap.
    """
    chunks = []
    start = 0

    while start < len(text):
        # Get chunk
        end = start + chunk_size
        chunk = text[start:end]

        # Find natural break point (sentence end)
        if end < len(text):
            # Look for sentence boundary within last 50 characters
            last_period = chunk.rfind('. ')
            if last_period > chunk_size - 50:
                chunk = chunk[:last_period + 1]
                end = start + last_period + 1

        stripped_chunk = chunk.strip()
        if len(stripped_chunk) > 5: # Filter very small chunks
            chunks.append(stripped_chunk)

        # Move start position with overlap
        start = end - overlap

        # Avoid infinite loop
        if start >= len(text):
            break

    return chunks
