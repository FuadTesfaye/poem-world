#!/usr/bin/env python3
"""
Expands src/data/poets/arabic.ts to include the complete roster of 71 canonical masters
across all 14 historical eras.
"""

import json
import re

def generate_expanded_arabic_poets():
    registry_path = "sources/arabic-corpora/poets_registry.json"
    with open(registry_path, "r", encoding="utf-8") as f:
        registry = json.load(f)
        
    poets = registry.get("poets", [])
    
    # Read existing arabic.ts to preserve existing detailed bios where present
    with open("src/data/poets/arabic.ts", "r", encoding="utf-8") as f:
        existing_ts = f.read()
        
    ts_output = """import { Poet } from "../types";

export const ARABIC_POETS: Poet[] = [
"""
    for i, p in enumerate(poets):
        slug = p["slug"]
        name = p["name"]
        ar = p.get("ar", "")
        years = p.get("years", "")
        place = p.get("place", "")
        era = p.get("era", "")
        era_id = p.get("eraId", "")
        tag = p.get("tag", "").replace('"', '\\"')
        img = f"i{i % 28 + 1}"
        image_src = f"/images/poets/{slug}.webp"
        themes = p.get("themes", ["Literature", "Eloquence", "Verse"])
        bio_text = p.get("bio", f"Canonical master of the {era} period.")
        
        # Check if existing file has custom bio
        bio_lines = [bio_text]
        if f'slug: "{slug}"' in existing_ts:
            # Extract bio from existing file
            match = re.search(r'slug:\s*"' + re.escape(slug) + r'".*?bio:\s*\[(.*?)\]', existing_ts, re.DOTALL)
            if match:
                raw_bio = match.group(1).strip()
                bio_lines = [line.strip().strip('",').strip("'").replace('\\"', '"') for line in raw_bio.split('\n') if line.strip()]
                
        works = [f"Diwan {name}", f"Collected Odes of {name}"]
        if f'slug: "{slug}"' in existing_ts:
            w_match = re.search(r'slug:\s*"' + re.escape(slug) + r'".*?works:\s*\[(.*?)\]', existing_ts, re.DOTALL)
            if w_match:
                raw_works = w_match.group(1).strip()
                works = [line.strip().strip('",').strip("'").replace('\\"', '"') for line in raw_works.split('\n') if line.strip()]

        sayings = [f"Immortal verses composed by {name}."]
        if f'slug: "{slug}"' in existing_ts:
            s_match = re.search(r'slug:\s*"' + re.escape(slug) + r'".*?sayings:\s*\[(.*?)\]', existing_ts, re.DOTALL)
            if s_match:
                raw_sayings = s_match.group(1).strip()
                sayings = [line.strip().strip('",').strip("'").replace('\\"', '"') for line in raw_sayings.split('\n') if line.strip()]

        themes_json = json.dumps(themes, ensure_ascii=False)
        bio_json = json.dumps(bio_lines, ensure_ascii=False)
        works_json = json.dumps(works, ensure_ascii=False)
        sayings_json = json.dumps(sayings, ensure_ascii=False)

        ts_output += f"""  {{
    slug: "{slug}",
    name: "{name}",
    ar: "{ar}",
    years: "{years}",
    place: "{place}",
    language: "ar",
    era: "{era}",
    eraId: "{era_id}",
    tag: "{tag}",
    img: "{img}",
    imageSrc: "{image_src}",
    pos: "center 25%",
    bio: {bio_json},
    works: {works_json},
    themes: {themes_json},
    sayings: {sayings_json}
  }},
"""
    ts_output += "];\n"

    with open("src/data/poets/arabic.ts", "w", encoding="utf-8") as f:
        f.write(ts_output)

    print(f"✓ Successfully wrote {len(poets)} expanded Arabic poets to src/data/poets/arabic.ts")

if __name__ == "__main__":
    generate_expanded_arabic_poets()
