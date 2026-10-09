# English Poetry Canon & Corpora Architecture

This directory and its companion tooling suite in [`sources/english-tools/`](../english-tools/) provide the ingestion architecture, scholarly documentation, and computational prosody pipeline for the English poetic canon within **Poem World**.

---

## 1. The 6 Monumental Datasets & Repositories

| Corpus / Dataset | Volume | Primary Sources | Key Metadata & Attributes | Access & Identifiers |
|---|---|---|---|---|
| **Gutenberg Poetry Corpus** (Allison Parrish) | 3,085,117 lines (~1,191 volumes) | Project Gutenberg | Public domain English poetry, line-level JSONL, Gutenberg book IDs | [GitHub](https://github.com/aparrish/gutenberg-poetry-corpus) / [Hugging Face](https://huggingface.co/datasets/allisonparrish/gutenberg-poetry-corpus) |
| **Poems (PoemHunter) Dataset** | ~500,000+ poems (~8,000+ poets) | PoemHunter.com | Huge breadth (classical to modern/amateur), poet bio, poem title, full body | [Kaggle Dataset](https://www.kaggle.com/datasets/tgdivy/poetry-foundation-poems) |
| **Poetry Foundation Archive** | ~13,000–15,000 poems | PoetryFoundation.org | Highest curatorial quality; tags for literary schools, movements, eras, topics | [Kaggle Archive](https://www.kaggle.com/datasets/johnhallman/complete-poetryfoundationorg-dataset) |
| **Chadwyck-Healey English Poetry** | ~183,000 poems | Canon from 600 to 1900 CE | Scholarly gold standard; full-text Early Modern, Romantic, Victorian canon | ProQuest / [Zenodo Metadata](https://zenodo.org/record/4636906) |
| **Old & Middle English Corpora** | ~30,000 lines (Anglo-Saxon) + Middle English | Exeter Book, Vercelli Book, Cotton Nero A.x | All extant Old English poetry with side-by-side Modern English translations | [Anglo-Saxon Poetic Records](https://www.sacred-texts.com/neu/as/index.htm) |
| **Representative Poetry Online (RPO)** | ~4,800 canonical poems (730 poets) | Univ. of Toronto Scholarly Editions | Scholarly line notes, verified copy-texts, Rhyme/Meter structural tags | [RPO Portal](https://rpo.library.utoronto.ca/) |

---

## 2. Scholarly & Web Source Profiles

### 1. Poetry Foundation / Academy of American Poets (poets.org)
- **Role**: The premier curated collection for American and British poetry spanning the Renaissance, Romanticism, Modernism, and contemporary verse.
- **Taxonomy**: Contains hand-curated metadata for poetic forms:
  - *Sonnet* (Shakespearean, Spenserian, Petrarchan)
  - *Villanelle* (e.g. Dylan Thomas)
  - *Sestina*
  - *Ballad*
  - *Blank Verse*
  - *Terza Rima*
  - *Couplets*
- **Movements**: Categorizes works into *Metaphysical*, *Enlightenment / Augustan*, *Romanticism*, *Victorian / Pre-Raphaelite*, *Harlem Renaissance*, *Imagism*, *Modernism*, and *Confessional*.

### 2. Project Gutenberg
- **Role**: Massive coverage of unencumbered public-domain works (Shakespeare, Milton, Wordsworth, Keats, Dickinson, Whitman, Poe).
- **Processing**: Raw Gutenberg texts require line-break extraction because prose prefaces, footnotes, and publisher notes are often intermingled.

### 3. PoemHunter
- **Role**: The widest net for sheer quantity (~500k poems), but contains duplicate entries, inconsistent punctuation, OCR artifacts, and amateur submissions mixed with canonical masters. Requires algorithmic de-duplication.

### 4. Wikisource (English)
- **Role**: Fully crowd-verified public domain editions formatted in clean MediaWiki markup with stanza-level tags (`<poem>...</poem>`).

---

## 3. De-duplication & Text Cleaning Pipeline

When aggregating Gutenberg, PoemHunter, and Poetry Foundation, between **35% and 55%** of famous poems will overlap. English poetry poses specific normalization challenges that differ from prose:

### A. Handling Orthographic & Archaic Variants
1. **Elisions and Contractions**: Canonical texts alternate between modernized spelling and historic contractions:
   - `lov'd` $\to$ `loved`
   - `o'er` $\to$ `over`
   - `'neath` $\to$ `beneath`
   - `thou didst` $\to$ `thou diddest`
2. **Archaic Characters**:
   - Long 's': `ſ` $\to$ `s`
   - Typographical ligatures: `æ` $\to$ `ae`, `œ` $\to$ `oe`
   - Curly quotes and apostrophes: `’`, `‘` $\to$ `'`
3. **Punctuation Normalization**: Remove terminal punctuation at line ends for matching while preserving interior hyphens and em-dashes.

### B. Author Entity Resolution
Canonicalize poet naming aliases using a lookup dictionary:
- `"George Gordon Byron"` = `"Lord Byron"`
- `"Percy Bysshe Shelley"` = `"P. B. Shelley"`
- `"T. S. Eliot"` = `"Thomas Stearns Eliot"` = `"T.S. Eliot"`
- `"E. E. Cummings"` = `"Edward Estlin Cummings"`
- `"Alfred Tennyson"` = `"Alfred, Lord Tennyson"`

### C. Structural Fingerprinting (MinHash / Jaccard)
Because different publishers divide stanzas differently or modernize punctuation, standard exact string matching fails:
1. Normalize the poem into a single space-separated stream of lowercase alphanumeric tokens.
2. Generate 5-token shingles:
   - e.g. `"two roads diverged in a"`, `"roads diverged in a yellow"`
3. Compute Jaccard Similarity across works by the same author:
   $$\text{Similarity}(A, B) = \frac{|A \cap B|}{|A \cup B|}$$
4. If $\text{Similarity} \ge 0.88$, flag as identical poem variants. Merge by preserving the version with the best line/stanza break formatting.

---

## 4. English Prosody, Rhyme & Meter Tools

Located in [`sources/english-tools/`](../english-tools/):

1. **`prosody_scanner.py`**:
   - Maps syllables, vowel kernels, and stress markers (`0` = unstressed, `1` = primary stress).
   - Classifies meter into *Iambic Pentameter*, *Trochaic Tetrameter*, *Ballad Metre*, *Heroic Couplets*, *Blank Verse*, *Alliterative Verse*, and *Free Verse*.
   - Identifies rhyme schemes (`ABAB CDCD EFEF GG`, `ABBA ABBA CDE CDE`, `AABB`, etc.).
2. **`deduplicator.py`**:
   - Generates 5-token shingles and computes Jaccard similarity across poem pairs.
   - Detects duplicate submissions across datasets.
3. **`entity_resolver.py`**:
   - Canonicalizes poet names and aliases across Gutenberg, Kaggle, RPO, and Wikidata.

---

## 5. Sample Dataset Texts

Representative samples from the six corpora are cataloged in [`samples/`](./samples/):
- `gutenberg_sample.jsonl`: Allison Parrish corpus excerpt.
- `rpo_chaucer_sample.txt`: University of Toronto RPO edition with metrical notes.
- `anglo_saxon_wanderer.txt`: Exeter Book alliterative half-lines with modern translation.
