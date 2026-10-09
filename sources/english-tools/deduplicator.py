#!/usr/bin/env python3
"""
English Poetry De-duplication and Normalization Pipeline
Implements 5-token shingling, Jaccard similarity indexing (threshold >= 0.88),
and archaic orthography normalization across aggregated poetry corpora.
"""

import re
import unicodedata
from typing import Set, List, Tuple, Dict, Any

# Common historical orthographic elisions & contractions
ELISION_MAP = {
    r"\blov'd\b": "loved",
    r"\blov’d\b": "loved",
    r"\bo'er\b": "over",
    r"\bo’er\b": "over",
    r"\b'neath\b": "beneath",
    r"\b’neath\b": "beneath",
    r"\be'en\b": "even",
    r"\be’en\b": "even",
    r"\be'er\b": "ever",
    r"\be’er\b": "ever",
    r"\bthou didst\b": "thou diddest",
    r"\btis\b": "it is",
    r"\b'tis\b": "it is",
    r"\b’tis\b": "it is",
    r"\b'twas\b": "it was",
    r"\b’twas\b": "it was",
    r"\bshalt\b": "shall",
    r"\bhast\b": "have",
    r"\bhath\b": "has",
    r"\bdoth\b": "does",
}

def normalize_archaic_text(text: str) -> str:
    """
    Normalizes archaic characters, typographical ligatures,
    curly quotation marks, and common poetic contractions.
    """
    # 1. Unicode normalization (decompose and recompose)
    res = unicodedata.normalize("NFKC", text)
    
    # 2. Archaic ligatures and long 's'
    res = res.replace("ſ", "s")
    res = res.replace("æ", "ae").replace("Æ", "Ae")
    res = res.replace("œ", "oe").replace("Œ", "Oe")
    
    # 3. Curly quotes and em-dashes
    res = res.replace("’", "'").replace("‘", "'")
    res = res.replace("“", '"').replace("”", '"')
    res = res.replace("—", " -- ").replace("–", " - ")
    
    # 4. Contracted past participles (e.g. dimm'd -> dimmed, bloom'd -> bloomed)
    res = re.sub(r"\b(\w+)['’]d\b", r"\1ed", res, flags=re.IGNORECASE)

    # 5. Elisions and contractions
    for pattern, replacement in ELISION_MAP.items():
        res = re.sub(pattern, replacement, res, flags=re.IGNORECASE)
        
    return res

def tokenize_stream(text: str) -> List[str]:
    """Converts poem into a stream of lowercase alphanumeric tokens."""
    norm = normalize_archaic_text(text).lower()
    # Replace linebreaks with spaces
    norm = re.sub(r"[^\w\s]", "", norm)
    tokens = norm.split()
    return tokens

def generate_shingles(tokens: List[str], k: int = 5) -> Set[Tuple[str, ...]]:
    """Generates k-token shingles from a token list."""
    if len(tokens) < k:
        return {tuple(tokens)}
    return {tuple(tokens[i : i + k]) for i in range(len(tokens) - k + 1)}

def jaccard_similarity(shingles_a: Set[Tuple[str, ...]], shingles_b: Set[Tuple[str, ...]]) -> float:
    """Computes Jaccard index: |A ∩ B| / |A ∪ B|."""
    if not shingles_a or not shingles_b:
        return 0.0
    intersection = shingles_a.intersection(shingles_b)
    union = shingles_a.union(shingles_b)
    return len(intersection) / len(union)

def evaluate_poem_formatting(poem_text: str) -> int:
    """
    Scores formatting quality to choose the best version when merging duplicates:
    - Proper stanza separation (double newlines)
    - Reasonable line length distribution
    - Balanced punctuation
    """
    score = 0
    lines = [l.strip() for l in poem_text.strip().split("\n")]
    if not lines:
        return 0
        
    stanzas = [s for s in poem_text.split("\n\n") if s.strip()]
    if len(stanzas) > 1:
        score += 25  # Has clean stanza divisions
        
    # Reward consistent poetic line length (15 to 80 chars)
    valid_lengths = [l for l in lines if 15 <= len(l) <= 80]
    score += int((len(valid_lengths) / len(lines)) * 40)
    
    # Reward presence of capital line openings
    capitalized = [l for l in lines if l and l[0].isupper()]
    score += int((len(capitalized) / len(lines)) * 25)
    
    # Check for excessive OCR glitches (e.g. orphan underscores, tildes)
    glitches = len(re.findall(r"[_~\|\\]", poem_text))
    score -= min(glitches * 2, 20)
    
    return max(score, 0)

def match_and_deduplicate(poem_a: str, poem_b: str, threshold: float = 0.88) -> Dict[str, Any]:
    """Compares two poem texts, calculates similarity, and picks the best edition."""
    tokens_a = tokenize_stream(poem_a)
    tokens_b = tokenize_stream(poem_b)
    
    shingles_a = generate_shingles(tokens_a, k=5)
    shingles_b = generate_shingles(tokens_b, k=5)
    
    sim = jaccard_similarity(shingles_a, shingles_b)
    is_duplicate = sim >= threshold
    
    score_a = evaluate_poem_formatting(poem_a)
    score_b = evaluate_poem_formatting(poem_b)
    
    preferred = "A" if score_a >= score_b else "B"
    
    return {
        "similarity": round(sim, 4),
        "is_duplicate": is_duplicate,
        "format_score_a": score_a,
        "format_score_b": score_b,
        "preferred_version": preferred
    }

if __name__ == "__main__":
    version_a = """
Shall I compare thee to a summer's day?
Thou art more lovely and more temperate:
Rough winds do shake the darling buds of May,
And summer's lease hath all too short a date:
Sometime too hot the eye of heaven shines,
And often is his gold complexion dimm'd;
And every fair from fair sometime declines,
By chance, or nature's changing course untrimm'd;
    """

    version_b = """
Shall I compare thee to a summer’s day?
Thou art more lovely and more temperate:
Rough winds do shake the darling buds of May,
And summer’s lease has all too short a date:
Sometime too hot the eye of heaven shines,
And often is his gold complexion dimmed;
And every fair from fair sometime declines,
By chance or nature’s changing course untrimmed;
    """

    res = match_and_deduplicate(version_a, version_b)
    print("Deduplication Test Results:")
    print(f"Jaccard Similarity: {res['similarity'] * 100:.1f}%")
    print(f"Is Duplicate: {res['is_duplicate']} (Threshold >= 88%)")
    print(f"Preferred Version: {res['preferred_version']}")
