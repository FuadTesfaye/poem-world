#!/usr/bin/env python3
"""
Arabic Prosody & Meter Classifier (علم العروض والقوافي)
======================================================
Implements Al-Khalil ibn Ahmad al-Farahidi's 16 classical Arabic meters (بحور الخليل),
Arudi phonetic conversion (الكتابة العروضية), and Qafiyah (قافية) rhyme detection.

The 16 Classical Meters:
1. Al-Tawil (الطويل): فعولن مفاعيلن فعولن مفاعلن (//0/0 //0/0/0 //0/0 //0//0)
2. Al-Kamil (الكامل): متفاعلن متفاعلن متفاعلن (///0//0 ///0//0 ///0//0)
3. Al-Basit (البسيط): مستفعلن فاعلن مستفعلن فعلن (/0/0//0 /0//0 /0/0//0 ///0)
4. Al-Wafir (الوافر): مفاعلتن مفاعلتن فعولن (//0///0 //0///0 //0/0)
5. Al-Khafif (الخفيف): فاعلاتن مستفعلن فاعلاتن (/0//0/0 /0/0//0 /0//0/0)
6. Al-Rajaz (الرجز): مستفعلن مستفعلن مستفعلن (/0/0//0 /0/0//0 /0/0//0)
7. Al-Ramal (الرمل): فاعلاتن فاعلاتن فاعلاتن (/0//0/0 /0//0/0 /0//0/0)
8. Al-Mutaqarib (المتقارب): فعولن فعولن فعولن فعولن (//0/0 //0/0 //0/0 //0/0)
9. Al-Sari' (السريع): مستفعلن مستفعلن فاعلن (/0/0//0 /0/0//0 /0//0)
10. Al-Munsarih (المنسرح): مستفعلن مفعولات مفتعلن (/0/0//0 /0/0/0/ /0///0)
11. Al-Muqtadab (المقتضب): مفعولات مستفعلن (/0/0/0/ /0/0//0)
12. Al-Mudari' (المضارع): مفاعيلُ فاعلاتن (//0/0/ /0//0/0)
13. Al-Mujtath (المجتث): مستفعلن فاعلاتن (/0/0//0 /0//0/0)
14. Al-Hazaj (الهزج): مفاعيلن مفاعيلن (//0/0/0 //0/0/0)
15. Al-Madid (المديد): فاعلاتن فاعلن فاعلاتن (/0//0/0 /0//0 /0//0/0)
16. Al-Mutadarak (المتدارك): فاعلن فاعلن فاعلن فاعلن (/0//0 /0//0 /0//0 /0//0)
"""

import re
import sys
from typing import Dict, List, Optional, Tuple

# Diacritics (Harakat)
FATHA = '\u064e'
DAMMA = '\u064f'
KASRA = '\u0650'
SUKUN = '\u0652'
SHADDA = '\u0651'
TANWIN_FATH = '\u064b'
TANWIN_DAMM = '\u064c'
TANWIN_KASR = '\u064d'
HARAKAT = {FATHA, DAMMA, KASRA, TANWIN_FATH, TANWIN_DAMM, TANWIN_KASR}

# Standard patterns for the 16 Classical Meters (Normalized Binary Form: 1=Harakah, 0=Sukun)
BAHR_PATTERNS: Dict[str, List[str]] = {
    "الطويل": [
        "1101011010101101011010",
        "11010110101011010110110",
        "110101101101101011010",
        "1101011011011010110110",
        "110101101010110101101010"
    ],
    "الكامل": [
        "111011011101101110110",
        "101011011101101110110",
        "111011010101101110110",
        "111011011101101010110",
        "101011010101101010110",
        "11101101110110"  # Majzu'
    ],
    "البسيط": [
        "10101101011010101101110",
        "10101101011010101101010",
        "101011010110101011010110",
        "1010110101101010110"  # Majzu'
    ],
    "الوافر": [
        "1101110110111011010",
        "1101010110111011010",
        "1101110110101011010",
        "1101010110101011010",
        "11011101101110"  # Majzu'
    ],
    "الخفيف": [
        "101101010101101011010",
        "1011010101011010110",
        "10110101010110101101010"
    ],
    "الرجز": [
        "101011010101101010110",
        "10101101010110",  # Majzu'
        "1010110"           # Mashtur
    ],
    "الرمل": [
        "101101010110101011010",
        "1011010101101010110",
        "10110101011010"  # Majzu'
    ],
    "المتقارب": [
        "11010110101101011010",
        "110101101011010110110",
        "110101101011010110",
        "110101101011010"  # Majzu'
    ],
    "السريع": [
        "1010110101011010110",
        "10101101010110101010",
        "101011010101101011010"
    ],
    "المنسرح": [
        "10101101010101101110",
        "1010110101010110110"
    ],
    "الهزج": [
        "11010101101010",
        "110101011010"
    ],
    "المتدارك": [
        "10110101101011010110",
        "1110111011101110",
        "101101011010110"
    ],
    "المديد": [
        "1011010101101011010",
        "10110101011010110"
    ],
    "المجتث": [
        "10101101011010",
        "101011010110"
    ],
    "المقتضب": [
        "10101011010110"
    ],
    "المضارع": [
        "11010101011010"
    ]
}

def remove_tashkeel(text: str) -> str:
    """Removes all Arabic diacritics and tatweel."""
    return re.sub(r'[\u064b-\u0652\u0640]', '', text)

def extract_qafiyah(verse: str) -> Tuple[str, str]:
    """
    Extracts the Rawiyy (الروي) and Qafiyah letter from the end of the line.
    """
    clean = remove_tashkeel(verse.strip())
    clean = re.sub(r'[^ء-ي]', '', clean)
    if not clean:
        return "", ""
    
    rawiyy = clean[-1]
    # If the last letter is a weak letter (Alif, Waw, Ya), look at the preceding consonant
    if rawiyy in {'ا', 'ى', 'و', 'ي', 'ه'} and len(clean) > 1:
        primary_consonant = clean[-2]
    else:
        primary_consonant = rawiyy
        
    return primary_consonant, rawiyy

def text_to_arudi(verse: str) -> str:
    """
    Converts Arabic verse to Arudi representation (الكتابة العروضية):
    1. Tanwin becomes Nun Sakinah (ـٌ -> ُنْ)
    2. Shaddah doubles the letter (consonant + sukun followed by consonant + harakah)
    3. Solar lam is assimilated
    4. Hamzat al-wasl is dropped
    """
    text = verse.strip()
    
    # 1. Tanwin replacement
    text = re.sub(r'([ء-ي])' + TANWIN_DAMM, r'\1' + DAMMA + 'ن' + SUKUN, text)
    text = re.sub(r'([ء-ي])' + TANWIN_KASR, r'\1' + KASRA + 'ن' + SUKUN, text)
    text = re.sub(r'([ء-ي])' + TANWIN_FATH, r'\1' + FATHA + 'ن' + SUKUN, text)
    
    # 2. Shaddah resolution: double consonant
    def replace_shaddah(match):
        letter = match.group(1)
        h = match.group(2) if match.group(2) else FATHA
        return letter + SUKUN + letter + h
        
    text = re.sub(r'([ء-ي])' + SHADDA + r'([\u064e\u064f\u0650])?', replace_shaddah, text)
    
    # 3. Handle solar letters with Al- (ال)
    solar_letters = 'تثدذرزسشصضطظلن'
    text = re.sub(r'ال([' + solar_letters + r'])' + SUKUN, r'\1' + SUKUN, text)
    
    return text

def arudi_to_binary(arudi_text: str) -> str:
    """
    Converts Arudi text to binary sequence:
    '1' = Mutaharrik (متحرك - consonant with vowel)
    '0' = Sakin (ساكن - letter with sukun or long vowel ا و ي)
    """
    pattern = []
    i = 0
    clean = re.sub(r'\s+', '', arudi_text)
    
    while i < len(clean):
        char = clean[i]
        next_char = clean[i + 1] if i + 1 < len(clean) else ''
        
        if char in HARAKAT:
            i += 1
            continue
            
        if char in {'ا', 'ى', 'و', 'ي'} and (next_char not in HARAKAT or next_char == SUKUN):
            pattern.append('0')
            i += 1
            continue
            
        if next_char == SUKUN:
            pattern.append('1')
            pattern.append('0')
            i += 2
            continue
        elif next_char in HARAKAT:
            pattern.append('1')
            i += 2
            continue
        else:
            # Default consonant heuristic
            pattern.append('1')
            i += 1
            
    return "".join(pattern)

def similarity_score(seq1: str, seq2: str) -> float:
    """Computes alignment similarity between two binary meter sequences."""
    min_len = min(len(seq1), len(seq2))
    max_len = max(len(seq1), len(seq2))
    if max_len == 0:
        return 0.0
    matches = sum(1 for a, b in zip(seq1[:min_len], seq2[:min_len]) if a == b)
    length_penalty = min_len / max_len
    return (matches / min_len) * length_penalty

def classify_meter(verse: str) -> Tuple[str, float, str]:
    """
    Identifies the poetic meter (بحر الشعر) of an Arabic verse.
    Returns: (Bahr Name, Confidence Score, Binary Pattern)
    """
    arudi = text_to_arudi(verse)
    pattern = arudi_to_binary(arudi)
    
    best_bahr = "متدارك / حر"
    best_score = 0.0
    
    for bahr, patterns in BAHR_PATTERNS.items():
        for pat in patterns:
            score = similarity_score(pattern, pat)
            if score > best_score:
                best_score = score
                best_bahr = bahr
                
    # Confidence threshold
    if best_score < 0.65:
        # Heuristic fallback based on rhythm length
        if len(pattern) >= 20:
            best_bahr = "الطويل"
        elif 16 <= len(pattern) < 20:
            best_bahr = "الكامل"
        else:
            best_bahr = "الوافر"
            
    return best_bahr, round(best_score, 2), pattern

def analyze_poem_sample():
    """Runs verification demonstration on canonical Arabic verses."""
    samples = [
        ("امرؤ القيس", "قِفا نَبكِ مِن ذِكرى حَبيبٍ وَمَنزِلِ || بِسِقطِ اللِوى بَينَ الدَخولِ فَحَومَلِ"),
        ("عنترة بن شداد", "هَل غادَرَ الشُعَراءُ مِن مُتَرَدَّمِ || أَم هَل عَرَفتَ الدارَ بَعدَ تَوَهُّمِ"),
        ("المتنبي", "الخَيلُ وَاللَيلُ وَالبَيداءُ تَعرِفُني || وَالسَيفُ وَالرُمحُ وَالقِرطاسُ وَالقَلَمُ"),
        ("أبو العلاء المعري", "غَيرُ مُجدٍ في مِلَّتي وَاِعتِقادي || نَوحُ باكٍ وَلا تَرَنُّمُ شادي"),
        ("ابن زيدون", "أَضحى التَنائي بَديلاً مِن تَدانينا || وَنابَ عَن طيبِ لُقَيانا تَجافينا"),
        ("محمود درويش", "عَلى هَذِهِ الأَرضِ ما يَستَحِقُّ الحَياةِ || تَردُّدُ نيسانَ، رائِحَةُ الخُبزِ في الفَجرِ"),
    ]
    
    print("=" * 70)
    print("   Arabic Prosody & Meter Scanner (فاحص البحور الشعرية الخليلية)   ")
    print("=" * 70)
    for poet, verse in samples:
        bahr, conf, pat = classify_meter(verse)
        rawiyy, _ = extract_qafiyah(verse)
        print(f"\n[الشاعر]: {poet}")
        print(f"[البيت]: {verse}")
        print(f"[البحر]: {bahr} (دقة التطابق: {conf * 100:.0f}%)")
        print(f"[الروي / القافية]: حرف ({rawiyy})")
        print(f"[التفعيلة الثنائية]: {pat}")
    print("\n" + "=" * 70)

if __name__ == "__main__":
    analyze_poem_sample()
