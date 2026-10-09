# Poem World (Art-Nature & Diwan)

A comprehensive, illuminated poetry sanctuary uniting classical Arabic masterpieces, the pre-Islamic Golden Mu‘allaqat, the Renaissance, and English Romanticism within an authentic antique parchment aesthetic.

Built with **Next.js (App Router)**, **Bun**, and **Tailwind CSS**.

## ✨ Features

- **Antique Parchment Design**: Illuminated aesthetic crafted with custom serif typography (`Cormorant Garamond`, `IM Fell English`, `IM Fell English SC`, and `Amiri` for Arabic calligraphy), double-rule mat borders with corner SVG ornaments, gilded gold frames (`.gilt`), carved wooden overlays (`.carved`), radial vignettes, and fractal noise parchment textures.
- **Dedicated Poets Directory (`#/poets`)**:
  - Comprehensive listing of all available classical and modern poets (Al-Mutanabbi, Imru' al-Qais, Antarah ibn Shaddad, Jarir, Mahmoud Darwish, Ahmad Shawqi, Kahlil Gibran, Edgar Allan Poe, John Keats, Percy Bysshe Shelley, William Shakespeare, Emily Dickinson, William Blake).
  - Search by poet name, era, birthplace, or language tradition (`العربية`, `English`).
- **Poet Profile Pages (`#/poet/[slug]`)**:
  - Gilt portrait with vintage photographic filter.
  - Bilingual titles, era badges, and lifetime details.
  - Biography with illuminated drop-cap (`.ddrop`).
  - Selected works list and authentic sayings/verses in illuminated blockquotes.
  - Full collection grid of their poems with direct links.
- **Poem Route with Full Details (`#/poem/[slug]`)**:
  - Plate subtitle and illuminated frame overlay.
  - **Symmetrical Two-Hemistich (الصدر والعجز) alignment** for classical Arabic poems with poetic meter tags (بحر الطويل, بحر البسيط, بحر الكامل, بحر الوافر, بحر الرمل).
  - Stanza formatting with illuminated drop-cap for English classics.
  - One-click **Copy Verses** button with clipboard toast notification.
  - "About this poem" historical context and analysis in double-rule `.mat` box.
  - Previous and Next poem navigation.
  - "More from [Poet]" illuminated gallery.
- **Instant Search & Multidimensional Filtering**:
  - Real-time search across titles, poets, themes, meters, and verse lines.
  - Filter chips for poets, languages, and literary eras.
  - Smooth pagination and 60 FPS performance.
- **Scroll Parallax & Zoom**: Dynamic depth effects on cutout illustrations and framed paintings respecting `prefers-reduced-motion`.

## 📚 Integrated Sources (in `sources/`)

1. **[Arabic-Poems-Generation](https://github.com/ahmedkotb98/Arabic-Poems-Generation)**: Aldiwan scraping spiders, preprocessing pipelines, and cleaning tools.
2. **[ArPoT_v1.0](https://github.com/ArPoT-KSU/ArPoT_v1.0)**: King Saud University Classical Arabic Poetry Treebank (2,400 annotated verses).
3. **[PoetryDB](https://github.com/api-evangelist/poetry-db)**: OpenAPI specifications and database architecture for classical English poets.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Runtime & Package Manager**: [Bun](https://bun.sh/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## 🚀 Getting Started

### Installation

```bash
bun install
```

### Development Server

```bash
bun run dev
```

Visit [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
bun run build
bun run start
```

### Linting

```bash
bun run lint
```
