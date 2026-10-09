import os
import io
import json
import time
import urllib.request
import urllib.parse
from PIL import Image

TARGETS = [
    # AIC
    ("nighthawks-edward-hopper", "Nighthawks (painting)"),
    ("cliff-walk-at-pourville-monet", "Cliff Walk at Pourville"),
    ("stacks-of-wheat-monet", "Haystacks (Monet series)"),
    ("time-transfixed-rene-magritte", "Time Transfixed"),
    # Rijksmuseum
    ("the-jewish-bride-rembrandt", "The Jewish Bride"),
    ("the-love-letter-vermeer", "The Love Letter (Vermeer)"),
    ("woman-reading-a-letter-vermeer", "Woman Reading a Letter"),
    ("self-portrait-as-the-apostle-paul-rembrandt", "Self-Portrait as the Apostle Paul"),
    ("the-syndics-of-the-drapers-guild-rembrandt", "Syndics of the Drapers' Guild"),
    ("the-windmill-at-wijk-bij-duurstede", "The Windmill at Wijk bij Duurstede"),
    ("the-serenade-judith-leyster", "The Serenade (Judith Leyster)"),
    ("winter-landscape-with-ice-skaters-avercamp", "Winter Landscape with Ice Skaters"),
    ("the-feast-of-saint-nicholas-jan-steen", "The Feast of Saint Nicholas (Steen)"),
    # The Met
    ("madame-x-john-singer-sargent", "Portrait of Madame X"),
    ("bridge-over-a-pond-of-water-lilies-monet", "Water Lilies (Monet series)"),
    ("the-harvesters-pieter-bruegel", "The Harvesters (painting)"),
    ("view-of-toledo-el-greco", "View of Toledo"),
    ("juan-de-pareja-diego-velazquez", "Portrait of Juan de Pareja"),
    ("aristotle-with-a-bust-of-homer-rembrandt", "Aristotle with a Bust of Homer"),
    ("the-oxbow-thomas-cole", "The Oxbow"),
    ("washington-crossing-the-delaware-leutze", "Washington Crossing the Delaware (1851 painting)"),
    ("irises-vincent-van-gogh", "Irises (painting)"),
    ("bahram-gur-slaying-the-dragon", "Great Mongol Shahnameh"),
    # Europeana
    ("wanderer-above-the-sea-of-fog", "Wanderer above the Sea of Fog"),
    ("the-calling-of-saint-matthew-caravaggio", "The Calling of St Matthew (Caravaggio)"),
    ("mona-lisa-leonardo-da-vinci", "Mona Lisa"),
    ("the-school-of-athens-raphael", "The School of Athens"),
    ("girl-with-a-pearl-earring-vermeer", "Girl with a Pearl Earring"),
    ("the-third-of-may-1808-goya", "The Third of May 1808"),
    ("rain-steam-and-speed-turner", "Rain, Steam and Speed – The Great Western Railway"),
    ("primavera-sandro-botticelli", "Primavera (Botticelli)"),
    ("creation-of-adam-michelangelo", "The Creation of Adam"),
]

OUTPUT_DIR = "public/images/art"
USER_AGENT = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 PoemWorld/2.0 (contact@example.org)"

def process_and_save(slug, img_bytes):
    try:
        im = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        max_dim = 960
        w, h = im.size
        if max(w, h) > max_dim:
            scale = max_dim / max(w, h)
            new_size = (int(w * scale), int(h * scale))
            im = im.resize(new_size, Image.Resampling.LANCZOS)
            
        dest_path = os.path.join(OUTPUT_DIR, f"{slug}.webp")
        im.save(dest_path, "WEBP", quality=82)
        print(f"✓ Saved {dest_path} ({im.size[0]}x{im.size[1]}, {os.path.getsize(dest_path)} bytes)")
        return True
    except Exception as e:
        print(f"Error processing {slug}: {e}")
        return False

def main():
    chunk_size = 10
    for i in range(0, len(TARGETS), chunk_size):
        chunk = TARGETS[i:i + chunk_size]
        title_to_slug = {t[1]: t[0] for t in chunk}
        wiki_titles = [urllib.parse.quote(t[1]) for t in chunk]
        query_str = "|".join(wiki_titles)
        api_url = f"https://en.wikipedia.org/w/api.php?action=query&titles={query_str}&prop=pageimages&format=json&pithumbsize=1000"
        
        req = urllib.request.Request(api_url, headers={"User-Agent": USER_AGENT})
        try:
            with urllib.request.urlopen(req, timeout=15) as r:
                data = json.loads(r.read())["query"]["pages"]
                for pid, page in data.items():
                    title = page.get("title")
                    slug = title_to_slug.get(title)
                    if not slug:
                        for orig_title, orig_slug in title_to_slug.items():
                            if orig_title.lower() == (title or "").lower():
                                slug = orig_slug
                                break
                    thumb = page.get("thumbnail", {}).get("source")
                    if slug and thumb:
                        print(f"Downloading {slug} ({title})...")
                        time.sleep(0.5)
                        img_req = urllib.request.Request(thumb, headers={"User-Agent": USER_AGENT})
                        with urllib.request.urlopen(img_req, timeout=20) as img_res:
                            process_and_save(slug, img_res.read())
        except Exception as e:
            print(f"Chunk failed: {e}")
        time.sleep(1.0)

if __name__ == "__main__":
    main()
