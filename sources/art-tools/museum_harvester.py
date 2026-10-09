#!/usr/bin/env python3
"""
Museum Art Harvester CLI
Queries the Art Institute of Chicago (AIC) and The Metropolitan Museum of Art (The Met)
Open Access APIs for curatorial descriptions, provenance, and IIIF imagery.
"""

import sys
import json
import urllib.request
import urllib.parse
from typing import List, Dict, Any

USER_AGENT = "PoemWorldHarvester/1.0 (contact@poemworld.org)"

def search_aic(query: str, limit: int = 5) -> List[Dict[str, Any]]:
    """Searches the Art Institute of Chicago API."""
    encoded_q = urllib.parse.quote(query)
    fields = "id,title,artist_display,date_display,medium_display,description,provenance_text,image_id"
    url = f"https://api.artic.edu/api/v1/artworks/search?q={encoded_q}&limit={limit}&fields={fields}"
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            data = json.loads(r.read().decode("utf-8"))
            results = []
            for item in data.get("data", []):
                image_id = item.get("image_id")
                iiif_url = f"https://www.artic.edu/iiif/2/{image_id}/full/843,/0/default.jpg" if image_id else None
                results.append({
                    "museum": "Art Institute of Chicago",
                    "id": item.get("id"),
                    "title": item.get("title"),
                    "artist": item.get("artist_display"),
                    "date": item.get("date_display"),
                    "medium": item.get("medium_display"),
                    "description": item.get("description"),
                    "provenance": item.get("provenance_text"),
                    "iiif_url": iiif_url
                })
            return results
    except Exception as e:
        print(f"AIC search error: {e}")
        return []

def search_met(query: str, limit: int = 5) -> List[Dict[str, Any]]:
    """Searches The Metropolitan Museum of Art Open Access API."""
    encoded_q = urllib.parse.quote(query)
    search_url = f"https://collectionapi.metmuseum.org/public/collection/v1/search?q={encoded_q}&hasImages=true"
    req = urllib.request.Request(search_url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            search_data = json.loads(r.read().decode("utf-8"))
            object_ids = search_data.get("objectIDs", [])[:limit]
            
        results = []
        for obj_id in object_ids:
            obj_url = f"https://collectionapi.metmuseum.org/public/collection/v1/objects/{obj_id}"
            req_obj = urllib.request.Request(obj_url, headers={"User-Agent": USER_AGENT})
            try:
                with urllib.request.urlopen(req_obj, timeout=8) as r_obj:
                    item = json.loads(r_obj.read().decode("utf-8"))
                    results.append({
                        "museum": "The Metropolitan Museum of Art",
                        "id": item.get("objectID"),
                        "title": item.get("title"),
                        "artist": item.get("artistDisplayName"),
                        "date": item.get("objectDate"),
                        "medium": item.get("medium"),
                        "image_url": item.get("primaryImageSmall")
                    })
            except Exception:
                continue
        return results
    except Exception as e:
        print(f"The Met search error: {e}")
        return []

if __name__ == "__main__":
    q = sys.argv[1] if len(sys.argv) > 1 else "monet"
    print(f"=== Harvesting Artworks for: '{q}' ===")
    
    print("\n--- Art Institute of Chicago ---")
    aic_items = search_aic(q, limit=2)
    for it in aic_items:
        print(f"• {it['title']} by {it['artist']} ({it['date']})")
        if it['iiif_url']:
            print(f"  IIIF: {it['iiif_url']}")
            
    print("\n--- The Metropolitan Museum of Art ---")
    met_items = search_met(q, limit=2)
    for it in met_items:
        print(f"• {it['title']} by {it['artist']} ({it['date']})")
        if it.get('image_url'):
            print(f"  Image: {it['image_url']}")
