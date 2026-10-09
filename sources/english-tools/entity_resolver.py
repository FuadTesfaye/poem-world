#!/usr/bin/env python3
"""
English Poetry Author Entity Resolver
Canonicalizes poet naming aliases, historical titles, and variant spellings
across Project Gutenberg, PoemHunter, Poetry Foundation, and RPO datasets.
"""

import re
import sys
from typing import Optional, Dict

CANONICAL_ALIASES: Dict[str, str] = {
    # Early & Renaissance
    "geoffrey chaucer": "Geoffrey Chaucer",
    "chaucer, geoffrey": "Geoffrey Chaucer",
    "dan geoffrey chaucer": "Geoffrey Chaucer",
    "caedmon": "Cædmon",
    "cædmon": "Cædmon",
    "saint caedmon": "Cædmon",
    "the wanderer": "The Wanderer (Anonymous)",
    "anonymous (the wanderer)": "The Wanderer (Anonymous)",
    "edmund spenser": "Edmund Spenser",
    "spenser, edmund": "Edmund Spenser",
    "christopher marlowe": "Christopher Marlowe",
    "kit marlowe": "Christopher Marlowe",
    "marlowe, christopher": "Christopher Marlowe",
    "william shakespeare": "William Shakespeare",
    "shakespeare, william": "William Shakespeare",
    "the bard of avon": "William Shakespeare",
    "w. shakespeare": "William Shakespeare",
    "john donne": "John Donne",
    "donne, john": "John Donne",
    "dr. john donne": "John Donne",
    "george herbert": "George Herbert",
    "herbert, george": "George Herbert",
    "rev. george herbert": "George Herbert",
    "john milton": "John Milton",
    "milton, john": "John Milton",
    "andrew marvell": "Andrew Marvell",
    "marvell, andrew": "Andrew Marvell",

    # Augustan & Romantic
    "alexander pope": "Alexander Pope",
    "pope, alexander": "Alexander Pope",
    "william blake": "William Blake",
    "blake, william": "William Blake",
    "william wordsworth": "William Wordsworth",
    "wordsworth, william": "William Wordsworth",
    "w. wordsworth": "William Wordsworth",
    "samuel taylor coleridge": "Samuel Taylor Coleridge",
    "s. t. coleridge": "Samuel Taylor Coleridge",
    "s.t. coleridge": "Samuel Taylor Coleridge",
    "coleridge, samuel taylor": "Samuel Taylor Coleridge",
    "george gordon byron": "Lord Byron",
    "lord byron": "Lord Byron",
    "byron, lord": "Lord Byron",
    "george gordon, lord byron": "Lord Byron",
    "percy bysshe shelley": "Percy Bysshe Shelley",
    "p. b. shelley": "Percy Bysshe Shelley",
    "p.b. shelley": "Percy Bysshe Shelley",
    "shelley, percy bysshe": "Percy Bysshe Shelley",
    "john keats": "John Keats",
    "keats, john": "John Keats",

    # Victorian
    "alfred tennyson": "Alfred, Lord Tennyson",
    "alfred, lord tennyson": "Alfred, Lord Tennyson",
    "lord tennyson": "Alfred, Lord Tennyson",
    "tennyson, alfred": "Alfred, Lord Tennyson",
    "tennyson, alfred lord": "Alfred, Lord Tennyson",
    "robert browning": "Robert Browning",
    "browning, robert": "Robert Browning",
    "elizabeth barrett browning": "Elizabeth Barrett Browning",
    "elizabeth b. browning": "Elizabeth Barrett Browning",
    "e. b. browning": "Elizabeth Barrett Browning",
    "browning, elizabeth barrett": "Elizabeth Barrett Browning",
    "matthew arnold": "Matthew Arnold",
    "arnold, matthew": "Matthew Arnold",
    "christina rossetti": "Christina Rossetti",
    "christina g. rossetti": "Christina Rossetti",
    "rossetti, christina": "Christina Rossetti",
    "gerard manley hopkins": "Gerard Manley Hopkins",
    "g. m. hopkins": "Gerard Manley Hopkins",
    "hopkins, gerard manley": "Gerard Manley Hopkins",
    "oscar wilde": "Oscar Wilde",
    "wilde, oscar": "Oscar Wilde",
    "c.3.3.": "Oscar Wilde",

    # American
    "edgar allan poe": "Edgar Allan Poe",
    "edgar a. poe": "Edgar Allan Poe",
    "poe, edgar allan": "Edgar Allan Poe",
    "walt whitman": "Walt Whitman",
    "walter whitman": "Walt Whitman",
    "whitman, walt": "Walt Whitman",
    "emily dickinson": "Emily Dickinson",
    "emily e. dickinson": "Emily Dickinson",
    "dickinson, emily": "Emily Dickinson",

    # Modernist & 20th C.
    "william butler yeats": "W.B. Yeats",
    "w. b. yeats": "W.B. Yeats",
    "w.b. yeats": "W.B. Yeats",
    "yeats, william butler": "W.B. Yeats",
    "robert frost": "Robert Frost",
    "robert lee frost": "Robert Frost",
    "frost, robert": "Robert Frost",
    "thomas stearns eliot": "T.S. Eliot",
    "t. s. eliot": "T.S. Eliot",
    "t.s. eliot": "T.S. Eliot",
    "eliot, t. s.": "T.S. Eliot",
    "wallace stevens": "Wallace Stevens",
    "stevens, wallace": "Wallace Stevens",
    "langston hughes": "Langston Hughes",
    "james mercer langston hughes": "Langston Hughes",
    "hughes, langston": "Langston Hughes",
    "wystan hugh auden": "W.H. Auden",
    "w. h. auden": "W.H. Auden",
    "w.h. auden": "W.H. Auden",
    "auden, w. h.": "W.H. Auden",
    "dylan thomas": "Dylan Thomas",
    "dylan marlais thomas": "Dylan Thomas",
    "thomas, dylan": "Dylan Thomas",
    "sylvia plath": "Sylvia Plath",
    "plath, sylvia": "Sylvia Plath"
}

def normalize_author_name(raw_name: str) -> str:
    """Cleans punctuation, extraneous whitespace, and normalizes author strings."""
    if not raw_name:
        return "Unknown"
    
    cleaned = raw_name.strip()
    cleaned = re.sub(r"\s+", " ", cleaned)
    lookup_key = cleaned.lower()
    
    # Strip honorifics for fallback lookup
    lookup_clean = re.sub(r"^(sir|dr\.?|rev\.?|lord)\s+", "", lookup_key)
    
    if lookup_key in CANONICAL_ALIASES:
        return CANONICAL_ALIASES[lookup_key]
    if lookup_clean in CANONICAL_ALIASES:
        return CANONICAL_ALIASES[lookup_clean]
        
    return cleaned

def resolve_entity(author_str: str) -> Dict[str, str]:
    """Resolves raw author entity to canonical name and slug."""
    canonical = normalize_author_name(author_str)
    # Generate kebab slug
    slug = re.sub(r"[^a-z0-9]+", "-", canonical.lower()).strip("-")
    return {
        "raw": author_str,
        "canonical": canonical,
        "slug": slug
    }

if __name__ == "__main__":
    test_cases = [
        "Percy Bysshe Shelley",
        "P. B. Shelley",
        "George Gordon Byron",
        "Lord Byron",
        "T. S. Eliot",
        "Thomas Stearns Eliot",
        "Shakespeare, William",
        "W. Shakespeare",
        "Kit Marlowe",
        "Chaucer, Geoffrey"
    ]
    print(f"{'Input Name':<28} -> {'Canonical Name':<25} (Slug)")
    print("-" * 65)
    for test in test_cases:
        res = resolve_entity(test)
        print(f"{res['raw']:<28} -> {res['canonical']:<25} ({res['slug']})")
