# Cultural Art Corpora & Museum Open Access Architecture

This directory and its companion tooling in [`sources/art-tools/`](../art-tools/) provide the integration architecture and scholarly documentation for the four premier open-access art and cultural heritage institutions integrated into **Poem World**:

---

## 1. The 4 Premier Cultural Sources

| Institution / Source | Collection Scale | Primary Endpoints | Key Metadata & Attributes | Access & License |
|---|---|---|---|---|
| **The Art Institute of Chicago (AIC)** | ~120,000 digitized artworks | `https://api.artic.edu/api/v1/artworks` | Curatorial essays (`description`), ownership stories (`provenance_text`), IIIF deep zoom | [AIC API Docs](https://api.artic.edu/docs/) · CC0 Public Domain |
| **Rijksmuseum (RijksData)** | 800,000+ objects / 600,000+ images | `https://www.rijksmuseum.nl/api` | Authentic physical wall plaque descriptions, Dutch Golden Age, user-curated Rijksstudio sets | [RijksData Portal](https://data.rijksmuseum.nl/) · CC0 Public Domain |
| **The Metropolitan Museum of Art (The Met)** | 490,000 objects / 400,000+ images | `https://collectionapi.metmuseum.org/public/collection/v1/` | 5,000+ years of global culture, period classifications, geographic histories | [The Met Open Access](https://metmuseum.github.io/) · CC0 Public Domain |
| **Europeana & WikiArt** | Millions of European & global cultural items | `https://api.europeana.eu/record/v2/` | Cross-institutional European federation, artistic school categorization (Impressionism, Romanticism) | [Europeana Pro](https://pro.europeana.eu/page/apis) · Open Cultural Heritage |

---

## 2. Institutional Profiles & Capabilities

### 1. The Definitive Choice: The Art Institute of Chicago (AIC)
- **Why it's the best for storytelling**:
  Unlike traditional cataloging databases that only provide raw dimensions and medium, AIC provides complete curatorial essays written by museum scholars:
  - `description`: Comprehensive narrative context and exhibition essays.
  - `short_description`: Concise label summary.
  - `provenance_text`: Detailed chronological ownership history.
  - `publication_history`: Scholarly monographs referencing the work.
- **IIIF (International Image Interoperability Framework)**:
  Every public domain artwork has an `image_id` supporting dynamic multi-resolution scaling:
  ```
  https://www.artic.edu/iiif/2/{image_id}/full/{width},/0/default.jpg
  ```
- **Example REST Query**:
  ```bash
  curl "https://api.artic.edu/api/v1/artworks/search?q=monet&fields=id,title,artist_display,description,provenance_text,image_id"
  ```

### 2. The Narrative Master: Rijksmuseum (RijksData)
- **Plaque Descriptions**: Exposes the exact physical gallery wall texts written by curators for visitors standing before the paintings in Amsterdam.
- **Dutch Golden Age & Beyond**: Houses the undisputed world summits of Rembrandt van Rijn, Johannes Vermeer, Frans Hals, and Jan Steen.

### 3. The Pure Raw Scale: The Metropolitan Museum of Art (The Met Open Access)
- **Comprehensive Global Coverage**: Encompasses European Paintings, the American Wing, Islamic Art (miniatures, calligraphy, ceramics), Asian Art, and Ancient Near Eastern artifacts spanning 5,000+ years.
- **REST Endpoint**:
  ```
  https://collectionapi.metmuseum.org/public/collection/v1/objects/[objectID]
  ```

### 4. Open-Source Aggregators: Europeana & WikiArt
- **Movement Taxonomy**: Categorizes works into *Italian Renaissance*, *Dutch Golden Age*, *Romanticism*, *Neoclassicism*, *Impressionism*, *Pointillism*, and *Safavid Court Art*.
- **Poetry Dialogue**: Allows cross-disciplinary pairing between classical verse (Wordsworth, Keats, Blake, Tennyson, Al-Mutanabbi) and visual fine art.

---

## 3. Local Hosting & GitHub Versioning

In compliance with the project's offline and permanence standards:
- Every featured masterpiece in the curated collection is downloaded, optimized into high-definition WebP format, and committed into [`public/images/art/`](file:///home/fuayd/Personal/Poem/public/images/art/).
- All images are tracked in git and pushed directly to GitHub `main`, ensuring instantaneous sub-second loading without third-party rate limits or CDN latency.
