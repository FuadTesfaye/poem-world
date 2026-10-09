#!/usr/bin/env python3
"""
Arabic In-Repo Offline Index Builder
====================================
Compiles partitioned corpus shards into high-performance, lightweight
offline search indexes located in public/data/arabic-archive/
"""

import json
import os
import glob
import re
from typing import Dict, List, Any

def normalize_for_search(text: str) -> str:
    """Pre-normalizes text for instant index matching."""
    t = text.lower()
    # Strip diacritics
    t = re.sub(r'[\u064b-\u0652\u0640]', '', t)
    # Normalize alef variants
    t = re.sub(r'[إأآٱ]', 'ا', t)
    # Normalize ya / alif maqsura
    t = re.sub(r'ى', 'ي', t)
    # Normalize ta marbuta
    t = re.sub(r'ة', 'ه', t)
    # Strip punctuation
    t = re.sub(r'[^ء-يa-z0-9\s]', ' ', t)
    return " ".join(t.split())

def build_offline_archive():
    shards_dir = "sources/arabic-corpora/shards"
    out_dir = "public/data/arabic-archive"
    os.makedirs(out_dir, exist_ok=True)
    
    # Load poets
    poets_file = "sources/arabic-corpora/poets_registry.json"
    poets_map = {}
    if os.path.exists(poets_file):
        with open(poets_file, "r", encoding="utf-8") as f:
            p_data = json.load(f)
            for p in p_data.get("poets", []):
                poets_map[p["slug"]] = p
                
    shard_files = glob.glob(os.path.join(shards_dir, "*.jsonl"))
    all_poems: List[Dict[str, Any]] = []
    
    item_id = 1
    for sf in sorted(shard_files):
        era_id = os.path.basename(sf).replace(".jsonl", "")
        with open(sf, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                poem = json.loads(line)
                
                poet_slug = poem.get("poetSlug", "")
                poet_info = poets_map.get(poet_slug, {})
                
                title = poem.get("title", "")
                poet_name = poem.get("poet", poet_info.get("ar", "شاعر عربي"))
                meter = poem.get("meter", "الطويل")
                qafiyah = poem.get("qafiyah", "اللام")
                lines = poem.get("lines", [])
                
                # Full searchable corpus text
                full_text = " ".join(lines)
                search_blob = f"{title} {poet_name} {meter} {qafiyah} {full_text}"
                norm_search = normalize_for_search(search_blob)
                
                preview = lines[0] if lines else ""
                
                all_poems.append({
                    "id": item_id,
                    "title": title,
                    "poet": poet_name,
                    "poetSlug": poet_slug,
                    "eraId": era_id,
                    "era": poet_info.get("era", "العصر الكلاسيكي"),
                    "meter": meter,
                    "qafiyah": qafiyah,
                    "lines": lines,
                    "preview": preview,
                    "searchTokens": norm_search
                })
                item_id += 1
                
    # Export full offline index
    out_index_path = os.path.join(out_dir, "index.json")
    with open(out_index_path, "w", encoding="utf-8") as f:
        json.dump({
            "version": "1.0.0",
            "source": "Poem World In-Repo Arabic Archive (Offline Zero-API)",
            "totalPoems": len(all_poems),
            "poems": all_poems
        }, f, ensure_ascii=False, indent=2)
        
    print(f"✓ Generated in-repo offline archive index: {out_index_path}")
    print(f"✓ Indexed {len(all_poems)} master poems across {len(shard_files)} era shards with zero external API dependency.")

if __name__ == "__main__":
    build_offline_archive()
