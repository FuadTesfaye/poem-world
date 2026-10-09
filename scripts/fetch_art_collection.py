import os
import io
import json
import urllib.request
import urllib.parse
from PIL import Image, ImageOps, ImageEnhance

ARTWORKS = {
    "the-bedroom-van-gogh": {
        "wiki": "Bedroom in Arles",
        "alt_url": None
    },
    "a-sunday-on-la-grande-jatte": {
        "wiki": "A Sunday Afternoon on the Island of La Grande Jatte",
        "alt_url": None
    },
    "water-lilies-monet": {
        "wiki": "Water Lilies (Monet series)",
        "alt_url": None
    },
    "the-great-wave-hokusai": {
        "wiki": "The Great Wave off Kanagawa",
        "alt_url": None
    },
    "the-night-watch-rembrandt": {
        "wiki": "The Night Watch",
        "alt_url": None
    },
    "the-milkmaid-vermeer": {
        "wiki": "The Milkmaid (Vermeer)",
        "alt_url": None
    },
    "the-little-street-vermeer": {
        "wiki": "The Little Street",
        "alt_url": None
    },
    "portrait-of-a-couple-frans-hals": {
        "wiki": "Portrait of a Couple Probably Isaac Abrahamsz Massa and Beatrix van der Laen",
        "alt_url": None
    },
    "wheat-field-with-cypresses": {
        "wiki": "Wheat Field with Cypresses",
        "alt_url": "https://images.metmuseum.org/CRDImages/ep/web-large/DP-42549-001.jpg"
    },
    "the-death-of-socrates": {
        "wiki": "The Death of Socrates",
        "alt_url": None
    },
    "two-men-contemplating-the-moon": {
        "wiki": "Two Men Contemplating the Moon",
        "alt_url": None
    },
    "the-court-of-gayumars": {
        "wiki": "Shahnameh of Shah Tahmasp",
        "alt_url": None
    },
    "the-ancient-of-days": {
        "wiki": "The Ancient of Days",
        "alt_url": None
    },
    "the-fighting-temeraire": {
        "wiki": "The Fighting Temeraire",
        "alt_url": None
    },
    "impression-sunrise": {
        "wiki": "Impression, Sunrise",
        "alt_url": None
    },
    "the-birth-of-venus": {
        "wiki": "The Birth of Venus",
        "alt_url": None
    }
}

OUTPUT_DIR = "public/images/art"
os.makedirs(OUTPUT_DIR, exist_ok=True)
USER_AGENT = "PoemWorldArt/1.0 (contact@poemworld.org)"

def get_wiki_thumb(wiki_title):
    query_title = urllib.parse.quote(wiki_title)
    api_url = f"https://en.wikipedia.org/w/api.php?action=query&titles={query_title}&prop=pageimages&format=json&pithumbsize=1000"
    req = urllib.request.Request(api_url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=12) as r:
            data = json.loads(r.read())["query"]["pages"]
            for pid, p in data.items():
                thumb = p.get("thumbnail", {}).get("source")
                if thumb:
                    return thumb
    except Exception as e:
        print(f"Error querying wiki for '{wiki_title}': {e}")
    return None

def process_and_save(slug, img_bytes):
    im = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    
    # Resize preserving aspect ratio (max dimension 960px)
    max_dim = 960
    w, h = im.size
    if max(w, h) > max_dim:
        scale = max_dim / max(w, h)
        new_size = (int(w * scale), int(h * scale))
        im = im.resize(new_size, Image.Resampling.LANCZOS)
        
    dest_path = os.path.join(OUTPUT_DIR, f"{slug}.webp")
    im.save(dest_path, "WEBP", quality=85)
    print(f"✓ Saved {dest_path} ({im.size[0]}x{im.size[1]}, {os.path.getsize(dest_path)} bytes)")

def create_ornate_fallback(slug, title):
    from PIL import ImageDraw
    im = Image.new("RGB", (800, 600), color=(236, 217, 171)) # paper #ecd9ab
    draw = ImageDraw.Draw(im)
    draw.rectangle([20, 20, 780, 580], outline=(154, 107, 31), width=4) # gilt #9a6b1f
    draw.rectangle([30, 30, 770, 570], outline=(52, 25, 10), width=2) # ink #34190a
    draw.text((400, 300), title, fill=(168, 72, 26), anchor="mm")
    dest_path = os.path.join(OUTPUT_DIR, f"{slug}.webp")
    im.save(dest_path, "WEBP", quality=85)
    print(f"✓ Saved fallback {dest_path}")

def main():
    for slug, meta in ARTWORKS.items():
        dest = os.path.join(OUTPUT_DIR, f"{slug}.webp")
        if os.path.exists(dest) and os.path.getsize(dest) > 1000:
            print(f"Skipping {slug}, already downloaded.")
            continue
            
        print(f"Processing {slug} (Wiki: {meta['wiki']})...")
        thumb_url = None
        if meta.get("alt_url"):
            thumb_url = meta["alt_url"]
        else:
            thumb_url = get_wiki_thumb(meta["wiki"])
            
        success = False
        if thumb_url:
            req = urllib.request.Request(thumb_url, headers={"User-Agent": USER_AGENT})
            try:
                with urllib.request.urlopen(req, timeout=15) as r:
                    data = r.read()
                    process_and_save(slug, data)
                    success = True
            except Exception as e:
                print(f"Download failed for {thumb_url}: {e}")
                
        if not success:
            create_ornate_fallback(slug, meta["wiki"])

if __name__ == "__main__":
    main()
