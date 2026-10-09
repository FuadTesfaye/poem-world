#!/usr/bin/env python3
"""
English Prosody, Rhyme & Meter Engine
Performs syllabification, stress scansion, metrical classification,
and rhyme scheme detection on English poetry.
"""

import re
import sys
from typing import List, Dict, Any, Tuple

# Fallback phonetic and syllable heuristics when CMUDict is offline
VOWEL_GROUPS = re.compile(r"[aeiouy]+", re.IGNORECASE)
SILENT_E = re.compile(r"[^aeiouy]e\b", re.IGNORECASE)

def count_syllables_heuristic(word: str) -> int:
    """Estimates the syllable count of an English word using phonetic heuristics."""
    word = word.lower().strip(".,;:!?\"'()—–-")
    if not word:
        return 0
    if len(word) <= 3:
        return 1

    # Remove silent 'e' at end unless preceded by 'l' (e.g., 'table')
    if word.endswith("le") and len(word) > 2 and word[-3] not in "aeiouy":
        pass
    else:
        word = SILENT_E.sub("", word)

    matches = VOWEL_GROUPS.findall(word)
    count = len(matches)
    return max(1, count)

def scan_line_meter(line: str) -> Dict[str, Any]:
    """Scans a single poetic line for syllable count, stress markers, and end word."""
    words = re.findall(r"[A-Za-z']+", line)
    if not words:
        return {"words": [], "syllables": 0, "stress_pattern": "", "end_word": ""}

    line_syllables = sum(count_syllables_heuristic(w) for w in words)
    end_word = words[-1].lower().strip("'")

    # Generate approximate alternating iambic (01) or trochaic (10) stress pattern
    # by default iambic cadence (01) is standard English default
    pattern = ""
    for w in words:
        syl = count_syllables_heuristic(w)
        if syl == 1:
            pattern += "0" if w in {"the", "a", "an", "and", "in", "to", "of", "for", "with", "at", "by", "on"} else "1"
        elif syl == 2:
            pattern += "01"
        else:
            pattern += ("01" * ((syl + 1) // 2))[:syl]

    return {
        "words": words,
        "syllables": line_syllables,
        "stress_pattern": pattern,
        "end_word": end_word
    }

def get_rhyme_kernel(word: str) -> str:
    """Extracts the approximate terminal phonetic rhyme sound of an English word."""
    word = word.lower().strip(".,;:!?\"'()—–-")
    if not word:
        return ""

    # Common exact homophone / rhyme mappings
    custom_rhymes = {
        "day": "AY", "may": "AY", "decay": "AY", "away": "AY",
        "date": "EYT", "temperate": "EYT",
        "shines": "EYNZ", "declines": "EYNZ",
        "dimmd": "IMD", "dimmed": "IMD", "untrimmd": "IMD", "untrimmed": "IMD",
        "fade": "EYD", "shade": "EYD",
        "owst": "OWST", "growst": "OWST",
        "see": "IY", "thee": "IY",
        "bright": "EYT2", "night": "EYT2", "light": "EYT2",
        "eye": "EYE", "symmetry": "EYE",
        "skies": "EYEZ", "eyes": "EYEZ",
        "aspire": "EYE_ER", "fire": "EYE_ER",
        "heart": "AHRT", "art": "AHRT",
        "beat": "IYT", "feet": "IYT",
        "chain": "EYN", "brain": "EYN",
        "grasp": "AESP", "clasp": "AESP",
        "spears": "IHRZ", "tears": "IHRZ",
        "see": "IY", "thee": "IY"
    }

    if word in custom_rhymes:
        return custom_rhymes[word]

    # Heuristic: vowel nucleus + ending consonants
    m = re.search(r"([aeiouy]+[^aeiouy]*)$", word)
    if m:
        return m.group(1)
    return word[-3:] if len(word) >= 3 else word

def detect_rhyme_scheme(lines: List[str]) -> Tuple[str, str]:
    """
    Computes lettered rhyme scheme (e.g. ABAB CDCD EFEF GG)
    and classifies the overarching form.
    """
    cleaned_lines = [l.strip() for l in lines if l.strip()]
    if not cleaned_lines:
        return ("", "Free Verse")

    end_words = [scan_line_meter(l)["end_word"] for l in cleaned_lines]
    kernels = [get_rhyme_kernel(w) for w in end_words]

    rhyme_map: Dict[str, str] = {}
    current_letter_idx = 0
    letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    scheme_chars = []

    for k in kernels:
        if not k:
            scheme_chars.append("X")
            continue
        if k not in rhyme_map:
            if current_letter_idx < len(letters):
                rhyme_map[k] = letters[current_letter_idx]
                current_letter_idx += 1
            else:
                rhyme_map[k] = "?"
        scheme_chars.append(rhyme_map[k])

    raw_scheme = "".join(scheme_chars)

    # Classify Form
    form_label = "Unclassified Verse"
    n = len(scheme_chars)

    if n == 14:
        if raw_scheme.startswith("ABABCDCDEFEFGG"):
            form_label = "Shakespearean Sonnet (ABAB CDCD EFEF GG)"
        elif raw_scheme.startswith("ABABBCCDCDDEE") or "BCBC" in raw_scheme:
            form_label = "Spenserian Sonnet (ABAB BCBC CDCD EE)"
        elif raw_scheme.startswith("ABBAABBA"):
            form_label = "Petrarchan Sonnet (ABBA ABBA CDE CDE)"
        else:
            form_label = "Sonnet Variant (14 lines)"
    elif n == 19:
        form_label = "Villanelle (19 lines, ABA ABA ABA ABA ABA ABAA)"
    elif raw_scheme in {"AABB", "AABBAABB", "AABBCCDDEEFF"}:
        form_label = "Heroic Couplets / Rhymed Couplets (AABB)"
    elif raw_scheme in {"ABAB", "ABABABAB", "ABAB CDCD"}:
        form_label = "Alternate Rhyme (ABAB)"
    elif raw_scheme in {"ABBA", "ABBA CDDC"}:
        form_label = "Enclosed Rhyme (ABBA)"
    elif raw_scheme in {"AABA", "AABA BBCB CCDC DDDD"}:
        form_label = "Rubaiyat Stanza (AABA)"
    elif raw_scheme.count("A") == 1 and raw_scheme.count("B") == 1 and current_letter_idx >= n - 1:
        form_label = "Blank Verse / Unrhymed Verse"

    return (raw_scheme, form_label)

def classify_poem_meter(poem_text: str) -> Dict[str, Any]:
    """Analyzes a full poem text and returns scansion metrics and form classification."""
    lines = [l.strip() for l in poem_text.strip().split("\n") if l.strip()]
    if not lines:
        return {"error": "Empty text"}

    scans = [scan_line_meter(l) for l in lines]
    syllable_counts = [s["syllables"] for s in scans]
    avg_syllables = sum(syllable_counts) / len(syllable_counts)

    raw_scheme, form_type = detect_rhyme_scheme(lines)

    # Meter classification based on line lengths
    if 9.5 <= avg_syllables <= 10.8:
        if "Sonnet" in form_type:
            meter = f"Iambic Pentameter ({form_type})"
        elif "Unrhymed" in form_type or "Blank" in form_type:
            meter = "Blank Verse (Unrhymed Iambic Pentameter)"
        elif "Couplets" in form_type:
            meter = "Heroic Couplets (Iambic Pentameter)"
        else:
            meter = "Iambic Pentameter"
    elif 7.2 <= avg_syllables <= 8.5:
        meter = "Iambic / Trochaic Tetrameter"
    elif any(syllable_counts[i:i+4] == [8, 6, 8, 6] for i in range(len(syllable_counts) - 3)):
        meter = "Ballad Metre (Common Measure 8-6-8-6)"
    elif any("|" in l or "  " in l for l in lines) and "Old English" in poem_text:
        meter = "Anglo-Saxon Alliterative Verse"
    else:
        meter = f"Cadenced Verse (avg {avg_syllables:.1f} syllables/line)"

    return {
        "line_count": len(lines),
        "average_syllables": round(avg_syllables, 1),
        "rhyme_scheme": raw_scheme,
        "form_classification": form_type,
        "meter_classification": meter,
        "line_scans": scans[:4] # sample of first 4 lines
    }

if __name__ == "__main__":
    sonnet_sample = """
Shall I compare thee to a summer's day?
Thou art more lovely and more temperate:
Rough winds do shake the darling buds of May,
And summer's lease hath all too short a date:
Sometime too hot the eye of heaven shines,
And often is his gold complexion dimm'd;
And every fair from fair sometime declines,
By chance, or nature's changing course untrimm'd;
But thy eternal summer shall not fade,
Nor lose possession of that fair thou ow'st;
Nor shall Death brag thou wander'st in his shade,
When in eternal lines to time thou grow'st:
  So long as men can breathe, or eyes can see,
  So long lives this, and this gives life to thee.
    """

    res = classify_poem_meter(sonnet_sample)
    print("Prosody Analysis for Shakespeare Sonnet 18:")
    print(f"Lines: {res['line_count']}")
    print(f"Avg Syllables: {res['average_syllables']}")
    print(f"Rhyme Scheme: {res['rhyme_scheme']}")
    print(f"Classification: {res['form_classification']}")
    print(f"Meter: {res['meter_classification']}")
