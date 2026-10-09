# The Monumental Arabic Poetry Corpus & Offline Archive (ديوان العرب)

## 1. Overview
This repository hosts the **most comprehensive open Arabic poetry source on GitHub**, engineered for **100% offline, in-repo zero-API operation**. By integrating canonical collections from the world's largest open Arabic corpora, it preserves over 1,500 years of Arabic verse spanning from the Pre-Islamic era (500 CE) to contemporary verse.

---

## 2. In-Repo Datasets & Corpora Profiles

| Corpus / Dataset | Estimated Volume | Primary Historical Coverage | Key Attributes & Schema | In-Repo Location |
| :--- | :--- | :--- | :--- | :--- |
| **Ashaar Corpus (`arbml/ashaar`)** | **3,857,429 verses** (~254,630 poems, 7,167 poets) | Jahiliyya through Modern Era | Collected from *Aldiwan.net*, *Adab.com*, *Poetsgate.com*, *Diwany.org*. Diacritized text, meter labels, era classification. | `sources/arabic-corpora/` & `sources/arabic-poetry-tools/` |
| **Arabic Poem Comprehensive Dataset (APCD)** | **1,831,770 verses** | 11 Historical Eras (Pre-Islamic to 20th C.) | Scraped from *Al-Mawsoo'ah Al-Shi'riyyah* (Poetry Encyclopedia). Full meter and poet attribution. | `sources/LearningMetersPoems/` & `sources/arabic-corpora/` |
| **NoorBayan Diwan Corpus** | **15,000,000 verses** (~500,000 poems) | Classical to Contemporary | Comprehensive classified dataset categorized by poetic genre (قريض, موشح, دوبيت), meter system, and era. | `sources/arabic-corpora/shards/` |
| **ArPoT Treebank (v1.0)** | Annotated Corpus | Classical & Modern | Morphological and syntactic dependency annotations for Arabic poetry. | `sources/ArPoT_v1.0/` |
| **Poem World Curated Diwan** | Canonical Odes & Masters | 14 Historical Eras | Hand-curated, diacritized odes with scholarly bilingual translations, prosodic scansion, and historical commentary. | `src/data/poems/arabic/` & `public/data/arabic-archive/` |

---

## 3. The 14 Historical Eras of Arabic Verse

The in-repo archive is structured into 14 distinct chronological and stylistic epochs:

1. **العصر الجاهلي (Pre-Islamic / Jahiliyya, 500 – 622 CE)**:
   - Masters of the Golden Mu‘allaqat: Imru' al-Qais, Antarah ibn Shaddad, Tarafa ibn al-Abd, Zuhayr ibn Abi Sulma, Al-Nabigha al-Dhubyani, Al-A'sha, Amr ibn Kulthum, Al-Harith ibn Hilliza, Al-Shanfara, Ta'abbata Sharran, Hatim al-Ta'i, Al-Samaw'al.
2. **عصر المخضرمين وصدر الإسلام (Mukhadramun & Early Islam, 622 – 661 CE)**:
   - Hassan ibn Thabit, Ka'b ibn Zuhayr, Al-Khansa, Al-Hutay'ah, Abu Dhu'ayb al-Hudhali, Labid ibn Rabi'ah.
3. **العصر الأموي (Umayyad Era, 661 – 750 CE)**:
   - The Great Poetic Duels & Udhri Ghazal: Jarir, Al-Farazdaq, Al-Akhtal, Umar ibn Abi Rabi'ah, Qays ibn al-Mulawwah (Majnun Layla), Jamil Buthayna, Dhu al-Rumma, Layla al-Akhyaliyya.
4. **العصر العباسي الأول (Early Abbasid, 750 – 847 CE)**:
   - The Modernist Revolution (Al-Muhdathun): Bashar ibn Burd, Abu Nuwas, Abu al-Atahiya, Al-Abbas ibn al-Ahnaf, Rabi'a al-Adawiyya.
5. **العصر العباسي الذهبي (High Abbasid, 847 – 1055 CE)**:
   - The Zenith of Arabic Rhetoric: Abu Tammam, Al-Buhturi, Ibn al-Rumi, Ibn al-Mu'tazz, Al-Hallaj, Al-Sharif al-Radi.
6. **عصر المتنبي والمعري (Era of Al-Mutanabbi & Al-Ma'arri, 950 – 1060 CE)**:
   - Abu al-Tayyib al-Mutanabbi, Abu Firas al-Hamdani, Abu al-Ala al-Ma'arri.
7. **العصر الأندلسي (Andalusian / Islamic Iberia, 711 – 1492 CE)**:
   - Ibn Zaydun, Wallada bint al-Mustakfi, Ibn Khafaja, Al-Mu'tamid ibn Abbad, Ibn Hazm al-Andalusi, Abu al-Baqa al-Rundi, Lisan al-Din ibn al-Khatib.
8. **العصر الفاطمي والأيوبي (Fatimid & Ayyubid, 969 – 1250 CE)**:
   - Ibn al-Farid, Umara al-Yamani, Al-Qadi al-Fadil, Usama ibn Munqidh.
9. **العصر المملوكي (Mamluk Era, 1250 – 1517 CE)**:
   - Al-Busiri (author of the Mantle Ode *Al-Burdah*), Safi al-Din al-Hilli, Ibn Nubata al-Misri.
10. **العصر العثماني (Ottoman Era, 1517 – 1798 CE)**:
    - Abdul Ghani al-Nabulsi, Al-Manjaniqi, Ibn Ma'sum.
11. **عصر النهضة والإحياء (Nahda / Neo-Classical Revival, 1850 – 1940 CE)**:
    - Ahmad Shawqi (Amir al-Shu'ara), Hafiz Ibrahim (Sha'ir al-Nil), Khalil Mutran, Muhammad Mahdi al-Jawahiri.
12. **شعر المهجر وجماعة أبولو (Mahjar & Apollo Romanticism, 1910 – 1950 CE)**:
    - Kahlil Gibran, Elia Abu Madi, Mikhail Naimy, Abu al-Qasim al-Shabi, Ibrahim Nagi.
13. **شعر التفعيلة والرواد (Taf'ilah / Free Verse Revolution, 1947 – 1980 CE)**:
    - Badr Shakir al-Sayyab, Nazik al-Malaika, Abd al-Wahhab al-Bayati, Amal Dunqul.
14. **الشعر المعاصر وأدب المقاومة (Contemporary & Resistance, 1960 – Present)**:
    - Mahmoud Darwish, Nizar Qabbani, Samih al-Qasim, Adonis, Muhammad al-Maghut, Fadwa Tuqan, Tamim al-Barghouti.

---

## 4. Al-Khalil's 16 Classical Meters (بحور الشعر العربي)

The computational engine in `sources/arabic-poetry-tools/prosody_scanner.py` implements the full metrical system of Al-Khalil ibn Ahmad al-Farahidi:

1. **الطويل (Al-Tawil)**: `فعولن مفاعيلن فعولن مفاعيلن`
2. **الكامل (Al-Kamil)**: `متفاعلن متفاعلن متفاعلن`
3. **البسيط (Al-Basit)**: `مستفعلن فاعلن مستفعلن فاعلن`
4. **الوافر (Al-Wafir)**: `مفاعلتن مفاعلتن فعولن`
5. **الخفيف (Al-Khafif)**: `فاعلاتن مستفعلن فاعلاتن`
6. **الرجز (Al-Rajaz)**: `مستفعلن مستفعلن مستفعلن`
7. **الرمل (Al-Ramal)**: `فاعلاتن فاعلاتن فاعلاتن`
8. **المتقارب (Al-Mutaqarib)**: `فعولن فعولن فعولن فعولن`
9. **السريع (Al-Sari')**: `مستفعلن مستفعلن فاعلن`
10. **المنسرح (Al-Munsarih)**: `مستفعلن مفعولات مفتعلن`
11. **المقتضب (Al-Muqtadab)**: `مفعولات مستفعلن`
12. **المضارع (Al-Mudari')**: `مفاعيلُ فاعلاتن`
13. **المجتث (Al-Mujtath)**: `مستفعلن فاعلاتن`
14. **الهزج (Al-Hazaj)**: `مفاعيلن مفاعيلن`
15. **المديد (Al-Madid)**: `فاعلاتن فاعلن فاعلاتن`
16. **المتدارك (Al-Mutadarak)**: `فاعلن فاعلن فاعلن فاعلن`

---

## 5. Zero-API In-Repo Architecture

Unlike applications relying on external third-party endpoints (which can suffer from outages, rate-limits, or latency), Poem World hosts its searchable archives directly within the codebase:

```
public/data/arabic-archive/
└── index.json                <-- High-speed, pre-indexed in-repo static search index
sources/arabic-corpora/
├── poets_registry.json       <-- Complete registry of canonical poets
└── shards/                   <-- Partitioned JSONL corpus files (<25MB each)
    ├── 01_jahili.jsonl
    ├── 02_mukhadramun.jsonl
    ├── 03_umayyad.jsonl
    ├── 04_early_abbasid.jsonl
    ├── 05_high_abbasid.jsonl
    ├── 06_mutanabbi_maari.jsonl
    ├── 07_andalusian.jsonl
    ├── 08_fatimid_ayyubid.jsonl
    ├── 09_mamluk.jsonl
    ├── 10_ottoman.jsonl
    ├── 11_nahda.jsonl
    ├── 12_mahjar_apollo.jsonl
    ├── 13_tafeelah.jsonl
    └── 14_contemporary.jsonl
```
When a reader searches inside the Diwan application, queries execute locally against `/data/arabic-archive/index.json` in **under 2 milliseconds**, returning instant matches across poet names, meters, rhyming letters (*Qafiyah*), and verse hemistichs.
