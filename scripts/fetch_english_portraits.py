import os
import io
import json
import urllib.request
import urllib.parse
from PIL import Image, ImageEnhance, ImageOps

POET_WIKI_MAP = {
    "caedmon": "Cædmon",
    "the-wanderer": "Exeter Book",
    "geoffrey-chaucer": "Geoffrey Chaucer",
    "edmund-spenser": "Edmund Spenser",
    "christopher-marlowe": "Christopher Marlowe",
    "george-herbert": "George Herbert",
    "andrew-marvell": "Andrew Marvell",
    "alexander-pope": "Alexander Pope",
    "alfred-lord-tennyson": "Alfred, Lord Tennyson",
    "robert-browning": "Robert Browning",
    "elizabeth-barrett-browning": "Elizabeth Barrett Browning",
    "matthew-arnold": "Matthew Arnold",
    "christina-rossetti": "Christina Rossetti",
    "gerard-manley-hopkins": "Gerard Manley Hopkins",
    "ts-eliot": "T. S. Eliot",
    "wallace-stevens": "Wallace Stevens",
    "langston-hughes": "Langston Hughes",
    "wh-auden": "W. H. Auden",
    "dylan-thomas": "Dylan Thomas",
    "sylvia-plath": "Sylvia Plath"
}

OUTPUT_DIR = "public/images/poets"
os.makedirs(OUTPUT_DIR, exist_ok=True)

USER_AGENT = "PoemWorldCurator/1.0 (contact@poemworld.org)"

def get_wiki_image_url(title):
    query_title = urllib.parse.quote(title)
    api_url = f"https://en.wikipedia.org/w/api.php?action=query&titles={query_title}&prop=pageimages&format=json&pithumbsize=600"
    req = urllib.request.Request(api_url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=12) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get("query", {}).get("pages", {})
            for pid, pdata in pages.items():
                if "thumbnail" in pdata and "source" in pdata["thumbnail"]:
                    return pdata["thumbnail"]["source"]
    except Exception as e:
        print(f"Error querying wiki for '{title}': {e}")
    return None

def process_and_save(slug, img_bytes):
    im = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    
    # Crop to pleasant portrait aspect ratio (e.g. 500x500 square or 480x600)
    w, h = im.size
    target_size = (500, 500)
    
    # Fit into target_size with centering
    im_fitted = ImageOps.fit(im, target_size, method=Image.Resampling.LANCZOS, centering=(0.5, 0.35))
    
    # Subtle antique manuscript grading: slight warm tint, rich contrast
    # Enhance contrast slightly
    enhancer = ImageEnhance.Contrast(im_fitted)
    im_graded = enhancer.enhance(1.08)
    
    # Subtle color warmth
    color_enhancer = ImageEnhance.Color(im_graded)
    im_graded = color_enhancer.enhance(0.95)
    
    dest_path = os.path.join(OUTPUT_DIR, f"{slug}.webp")
    im_graded.save(dest_path, "WEBP", quality=88)
    print(f"✓ Saved {dest_path} ({os.path.getsize(dest_path)} bytes)")

def create_illuminated_fallback(slug, name):
    # If network fails, create a beautiful parchment medallion
    from PIL import ImageDraw, ImageFont
    im = Image.new("RGB", (500, 500), color=(236, 217, 171)) # #ecd9ab paper
    draw = ImageDraw.Draw(im)
    
    # Decorative rings
    draw.ellipse([20, 20, 480, 480], outline=(154, 107, 31), width=4) # #9a6b1f gilt
    draw.ellipse([30, 30, 470, 470], outline=(52, 25, 10), width=2) # #34190a ink
    
    # Center text
    initials = "".join([part[0].upper() for part in slug.split("-") if part])
    draw.text((250, 220), initials, fill=(168, 72, 26), anchor="mm")
    draw.text((250, 300), name, fill=(52, 25, 10), anchor="mm")
    
    dest_path = os.path.join(OUTPUT_DIR, f"{slug}.webp")
    im.save(dest_path, "WEBP", quality=88)
    print(f"✓ Created illuminated medallion for {dest_path}")

def main():
    for slug, wiki_title in POET_WIKI_MAP.items():
        dest = os.path.join(OUTPUT_DIR, f"{slug}.webp")
        if os.path.exists(dest) and os.path.getsize(dest) > 1000:
            print(f"Skipping {slug}, already exists.")
            continue
            
        print(f"Fetching portrait for {slug} (Wiki: {wiki_title})...")
        img_url = get_wiki_image_url(wiki_title)
        
        success = False
        if img_url:
            req = urllib.request.Request(img_url, headers={"User-Agent": USER_AGENT})
            try:
                with urllib.request.urlopen(req, timeout=15) as resp:
                    data = resp.read()
                    process_and_save(slug, data)
                    success = True
            except Exception as e:
                print(f"Error downloading {img_url}: {e}")
                
        if not success:
            print(f"Generating illuminated manuscript medallion for {slug}...")
            create_illuminated_fallback(slug, wiki_title)

if __name__ == "__main__":
    main()
