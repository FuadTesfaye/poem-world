import os
import io
import json
import urllib.request
import urllib.parse
from PIL import Image

ARTWORKS = {
    # --- 1. Art Institute of Chicago (AIC) ---
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
    "american-gothic-grant-wood": {
        "wiki": "American Gothic",
        "alt_url": None
    },
    "nighthawks-edward-hopper": {
        "wiki": "Nighthawks (Edward Hopper)",
        "alt_url": None
    },
    "paris-street-rainy-day-caillebotte": {
        "wiki": "Paris Street; Rainy Day",
        "alt_url": None
    },
    "the-old-guitarist-picasso": {
        "wiki": "The Old Guitarist",
        "alt_url": None
    },
    "at-the-moulin-rouge-toulouse-lautrec": {
        "wiki": "At the Moulin Rouge",
        "alt_url": None
    },
    "the-childs-bath-mary-cassatt": {
        "wiki": "The Child's Bath",
        "alt_url": None
    },
    "two-sisters-on-the-terrace-renoir": {
        "wiki": "Two Sisters (On the Terrace)",
        "alt_url": None
    },
    "the-basket-of-apples-cezanne": {
        "wiki": "The Basket of Apples",
        "alt_url": None
    },
    "cliff-walk-at-pourville-monet": {
        "wiki": "Cliff Walk at Pourville",
        "alt_url": None
    },
    "stacks-of-wheat-monet": {
        "wiki": "Haystacks (Monet series)",
        "alt_url": None
    },
    "time-transfixed-rene-magritte": {
        "wiki": "Time Transfixed",
        "alt_url": None
    },

    # --- 2. Rijksmuseum Amsterdam (RijksData) ---
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
    "the-jewish-bride-rembrandt": {
        "wiki": "The Jewish Bride",
        "alt_url": None
    },
    "the-love-letter-vermeer": {
        "wiki": "The Love Letter (Vermeer)",
        "alt_url": None
    },
    "woman-reading-a-letter-vermeer": {
        "wiki": "Woman Reading a Letter (Vermeer)",
        "alt_url": None
    },
    "self-portrait-as-the-apostle-paul-rembrandt": {
        "wiki": "Self-Portrait as the Apostle Paul",
        "alt_url": None
    },
    "the-syndics-of-the-drapers-guild-rembrandt": {
        "wiki": "Syndics of the Drapers' Guild",
        "alt_url": None
    },
    "the-merry-drinker-frans-hals": {
        "wiki": "The Merry Drinker",
        "alt_url": None
    },
    "the-threatened-swan-jan-asselijn": {
        "wiki": "The Threatened Swan",
        "alt_url": None
    },
    "the-windmill-at-wijk-bij-duurstede": {
        "wiki": "The Windmill at Wijk bij Duurstede",
        "alt_url": None
    },
    "the-serenade-judith-leyster": {
        "wiki": "The Serenade (Leyster)",
        "alt_url": None
    },
    "winter-landscape-with-ice-skaters-avercamp": {
        "wiki": "Winter Landscape with Ice Skaters",
        "alt_url": None
    },
    "the-feast-of-saint-nicholas-jan-steen": {
        "wiki": "The Feast of Saint Nicholas (Steen)",
        "alt_url": None
    },

    # --- 3. The Metropolitan Museum of Art (The Met Open Access) ---
    "wheat-field-with-cypresses": {
        "wiki": "Wheat Field with Cypresses",
        "alt_url": "https://images.metmuseum.org/CRDImages/ep/web-large/DP-42549-001.jpg"
    },
    "the-death-of-socrates": {
        "wiki": "The Death of Socrates",
        "alt_url": "https://images.metmuseum.org/CRDImages/ep/web-large/DP-13139-001.jpg"
    },
    "two-men-contemplating-the-moon": {
        "wiki": "Two Men Contemplating the Moon",
        "alt_url": "https://images.metmuseum.org/CRDImages/ep/web-large/DP-14165-001.jpg"
    },
    "the-court-of-gayumars": {
        "wiki": "Shahnameh of Shah Tahmasp",
        "alt_url": None
    },
    "madame-x-john-singer-sargent": {
        "wiki": "Portrait of Madame X",
        "alt_url": "https://images.metmuseum.org/CRDImages/ap/web-large/DP121287.jpg"
    },
    "self-portrait-with-a-straw-hat-van-gogh": {
        "wiki": "Self-Portrait with a Straw Hat",
        "alt_url": "https://images.metmuseum.org/CRDImages/ep/web-large/DP130999.jpg"
    },
    "bridge-over-a-pond-of-water-lilies-monet": {
        "wiki": "The Water Lily Pond",
        "alt_url": "https://images.metmuseum.org/CRDImages/ep/web-large/DP-41584-001.jpg"
    },
    "the-harvesters-pieter-bruegel": {
        "wiki": "The Harvesters (painting)",
        "alt_url": "https://images.metmuseum.org/CRDImages/ep/web-large/DP-20490-001.jpg"
    },
    "view-of-toledo-el-greco": {
        "wiki": "View of Toledo",
        "alt_url": "https://images.metmuseum.org/CRDImages/ep/web-large/DP358075.jpg"
    },
    "juan-de-pareja-diego-velazquez": {
        "wiki": "Portrait of Juan de Pareja",
        "alt_url": "https://images.metmuseum.org/CRDImages/ep/web-large/DP-17117-001.jpg"
    },
    "young-woman-with-a-water-pitcher-vermeer": {
        "wiki": "Young Woman with a Water Pitcher",
        "alt_url": "https://images.metmuseum.org/CRDImages/ep/web-large/DP145920.jpg"
    },
    "aristotle-with-a-bust-of-homer-rembrandt": {
        "wiki": "Aristotle with a Bust of Homer",
        "alt_url": "https://images.metmuseum.org/CRDImages/ep/web-large/DP-13725-001.jpg"
    },
    "the-oxbow-thomas-cole": {
        "wiki": "The Oxbow",
        "alt_url": "https://images.metmuseum.org/CRDImages/ap/web-large/DP-30378-001.jpg"
    },
    "washington-crossing-the-delaware-leutze": {
        "wiki": "Washington Crossing the Delaware (1851 painting)",
        "alt_url": "https://images.metmuseum.org/CRDImages/ap/web-large/DP-15878-001.jpg"
    },
    "irises-vincent-van-gogh": {
        "wiki": "Irises (painting)",
        "alt_url": "https://images.metmuseum.org/CRDImages/ep/web-large/DP-41530-001.jpg"
    },
    "bahram-gur-slaying-the-dragon": {
        "wiki": "Great Mongol Shahnameh",
        "alt_url": "https://images.metmuseum.org/CRDImages/is/web-large/DP110756.jpg"
    },

    # --- 4. Europeana & WikiArt ---
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
    },
    "wanderer-above-the-sea-of-fog": {
        "wiki": "Wanderer above the Sea of Fog",
        "alt_url": None
    },
    "the-starry-night": {
        "wiki": "The Starry Night",
        "alt_url": None
    },
    "the-kiss-gustav-klimt": {
        "wiki": "The Kiss (Klimt)",
        "alt_url": None
    },
    "liberty-leading-the-people-delacroix": {
        "wiki": "Liberty Leading the People",
        "alt_url": None
    },
    "the-calling-of-saint-matthew-caravaggio": {
        "wiki": "The Calling of St Matthew (Caravaggio)",
        "alt_url": None
    },
    "mona-lisa-leonardo-da-vinci": {
        "wiki": "Mona Lisa",
        "alt_url": None
    },
    "the-school-of-athens-raphael": {
        "wiki": "The School of Athens",
        "alt_url": None
    },
    "girl-with-a-pearl-earring-vermeer": {
        "wiki": "Girl with a Pearl Earring",
        "alt_url": None
    },
    "the-third-of-may-1808-goya": {
        "wiki": "The Third of May 1808",
        "alt_url": None
    },
    "rain-steam-and-speed-turner": {
        "wiki": "Rain, Steam and Speed – The Great Western Railway",
        "alt_url": None
    },
    "primavera-sandro-botticelli": {
        "wiki": "Primavera (Botticelli)",
        "alt_url": None
    },
    "creation-of-adam-michelangelo": {
        "wiki": "The Creation of Adam",
        "alt_url": None
    }
}

OUTPUT_DIR = "public/images/art"
os.makedirs(OUTPUT_DIR, exist_ok=True)
USER_AGENT = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 PoemWorld/2.0"

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
    im.save(dest_path, "WEBP", quality=82)
    print(f"✓ Saved {dest_path} ({im.size[0]}x{im.size[1]}, {os.path.getsize(dest_path)} bytes)")

def create_ornate_fallback(slug, title):
    from PIL import ImageDraw
    im = Image.new("RGB", (800, 600), color=(236, 217, 171)) # paper #ecd9ab
    draw = ImageDraw.Draw(im)
    draw.rectangle([20, 20, 780, 580], outline=(154, 107, 31), width=4) # gilt #9a6b1f
    draw.rectangle([30, 30, 770, 570], outline=(52, 25, 10), width=2) # ink #34190a
    draw.text((400, 300), title, fill=(168, 72, 26), anchor="mm")
    dest_path = os.path.join(OUTPUT_DIR, f"{slug}.webp")
    im.save(dest_path, "WEBP", quality=82)
    print(f"✓ Saved fallback {dest_path}")

def main():
    total = len(ARTWORKS)
    done = 0
    for slug, meta in ARTWORKS.items():
        done += 1
        dest = os.path.join(OUTPUT_DIR, f"{slug}.webp")
        if os.path.exists(dest) and os.path.getsize(dest) > 1000:
            print(f"[{done}/{total}] Skipping {slug}, already present.")
            continue
            
        print(f"[{done}/{total}] Processing {slug} (Wiki: {meta['wiki']})...")
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
