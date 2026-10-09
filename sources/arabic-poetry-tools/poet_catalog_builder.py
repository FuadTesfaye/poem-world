#!/usr/bin/env python3
"""
Arabic Poets Catalog Builder & Era Registry
============================================
Compiles and manages biographical, chronological, regional, and literary metadata
for hundreds of Arabic poets spanning 1,500 years of literary history.
"""

import json
import os
import re
from typing import Dict, List, Any

# 14 Canonical Historical Eras
ERAS: List[Dict[str, str]] = [
    {"id": "jahili", "en": "Pre-Islamic (Jahiliyya)", "ar": "العصر الجاهلي (500 – 622 م)"},
    {"id": "mukhadramun", "en": "Mukhadramun (Veterans)", "ar": "عصر المخضرمين (صدر الإسلام)"},
    {"id": "umayyad", "en": "Umayyad Era", "ar": "العصر الأموي (661 – 750 م)"},
    {"id": "early_abbasid", "en": "Early Abbasid", "ar": "العصر العباسي الأول (750 – 847 م)"},
    {"id": "high_abbasid", "en": "High Abbasid", "ar": "العصر العباسي الذهبي (847 – 1055 م)"},
    {"id": "mutanabbi_maari", "en": "Mutanabbi & Ma'arri Era", "ar": "عصر المتنبي والمعري (القرن 4-5 هـ)"},
    {"id": "andalusian", "en": "Andalusian (Islamic Iberia)", "ar": "العصر الأندلسي (711 – 1492 م)"},
    {"id": "fatimid_ayyubid", "en": "Fatimid & Ayyubid", "ar": "العصر الفاطمي والأيوبي (969 – 1250 م)"},
    {"id": "mamluk", "en": "Mamluk Era", "ar": "العصر المملوكي (1250 – 1517 م)"},
    {"id": "ottoman", "en": "Ottoman Era", "ar": "العصر العثماني (1517 – 1798 م)"},
    {"id": "nahda", "en": "Nahda (Revival & Neo-Classical)", "ar": "عصر النهضة والإحياء (1850 – 1940 م)"},
    {"id": "mahjar_apollo", "en": "Mahjar & Apollo Romanticism", "ar": "شعر المهجر وجماعة أبولو (1910 – 1950 م)"},
    {"id": "tafeelah", "en": "Taf'ilah (Pioneers of Free Verse)", "ar": "شعر التفعيلة والرواد (1947 – 1980 م)"},
    {"id": "contemporary", "en": "Contemporary & Resistance", "ar": "الشعر المعاصر وأدب المقاومة (1960 – الآن)"},
]

# Canonical Roster of Poets
POETS_REGISTRY: List[Dict[str, Any]] = [
    # 1. Jahiliyya
    {
        "slug": "imru-al-qais",
        "name": "Imru' al-Qais",
        "ar": "امرؤ القيس",
        "eraId": "jahili",
        "era": "Pre-Islamic (Jahiliyya)",
        "years": "c. 501 – 544 CE",
        "place": "Najd, Arabia",
        "tag": "The Wandering King and master of the Golden Mu‘allaqa",
        "themes": ["Desert Campsites", "Lost Love", "Chivalry", "Royal Grief"],
        "meters": ["الطويل", "البسيط"],
        "bio": "King Hujr's son who founded the classical Arabic qasidah structure."
    },
    {
        "slug": "antarah-ibn-shaddad",
        "name": "Antarah ibn Shaddad",
        "ar": "عنترة بن شداد",
        "eraId": "jahili",
        "era": "Pre-Islamic (Jahiliyya)",
        "years": "c. 525 – 608 CE",
        "place": "Najd, Arabia",
        "tag": "The Knight of Abs and champion of epic freedom",
        "themes": ["Valor", "Courage", "Chivalry", "Abla's Love", "Freedom"],
        "meters": ["الكامل", "الوافر"],
        "bio": "Peerless warrior poet whose knightly deeds became the Arabic epic Sirat Antar."
    },
    {
        "slug": "tarafa-ibn-al-abd",
        "name": "Tarafa ibn al-Abd",
        "ar": "طرفة بن العبد",
        "eraId": "jahili",
        "era": "Pre-Islamic (Jahiliyya)",
        "years": "c. 543 – 569 CE",
        "place": "Bahrain / Eastern Arabia",
        "tag": "The tragic youth of unbridled truth and defiant mortality",
        "themes": ["Carpe Diem", "Defiance", "Camel Journey", "Fate"],
        "meters": ["الطويل"],
        "bio": "Died at age twenty-six; author of one of the most philosophical Mu‘allaqat."
    },
    {
        "slug": "zuhayr-ibn-abi-sulma",
        "name": "Zuhayr ibn Abi Sulma",
        "ar": "زهير بن أبي سلمى",
        "eraId": "jahili",
        "era": "Pre-Islamic (Jahiliyya)",
        "years": "c. 520 – 609 CE",
        "place": "Najd, Arabia",
        "tag": "The Sage of Arabia and poet of enduring peace",
        "themes": ["Peace", "Wisdom", "Tribal Reconciliation", "Justice"],
        "meters": ["الطويل"],
        "bio": "Celebrated for his moral wisdom and verses praising peacemakers."
    },
    {
        "slug": "al-nabigha-al-dhubyani",
        "name": "Al-Nabigha al-Dhubyani",
        "ar": "النابغة الذبياني",
        "eraId": "jahili",
        "era": "Pre-Islamic (Jahiliyya)",
        "years": "c. 535 – 604 CE",
        "place": "Al-Hirah / Ghassanid Courts",
        "tag": "The arbiter of Ukaz fair and master of royal apology",
        "themes": ["Apology", "Court Elegance", "Prudence", "Eloquence"],
        "meters": ["البسيط", "الطويل"],
        "bio": "Chief judge of poetic contests at the famous Souk Ukaz market."
    },
    {
        "slug": "al-asha-al-akbar",
        "name": "Al-A'sha al-Akbar",
        "ar": "الأعشى الكبير",
        "eraId": "jahili",
        "era": "Pre-Islamic (Jahiliyya)",
        "years": "c. 530 – 629 CE",
        "place": "Manfuha, Yamama",
        "tag": "The Cymbalist of the Arabs (Sannajat al-Arab)",
        "themes": ["Musicality", "Wanderlust", "Praise", "Banquets"],
        "meters": ["البسيط", "الطويل"],
        "bio": "Renowned for rhythmic cadence and musical resonance."
    },
    {
        "slug": "amr-ibn-kulthum",
        "name": "Amr ibn Kulthum",
        "ar": "عمرو بن كلثوم",
        "eraId": "jahili",
        "era": "Pre-Islamic (Jahiliyya)",
        "years": "c. 526 – 584 CE",
        "place": "Euphrates Valley / Taghlib",
        "tag": "Chieftain of Taghlib and master of ferocious tribal pride",
        "themes": ["Fakhr", "Pride", "Freedom", "Defiance of Tyrants"],
        "meters": ["الوافر"],
        "bio": "Composed his Mu‘allaqa in defiance of the despotic King of Hirah, Amr ibn Hind."
    },
    {
        "slug": "al-harith-ibn-hilliza",
        "name": "Al-Harith ibn Hilliza",
        "ar": "الحارث بن حلزة",
        "eraId": "jahili",
        "era": "Pre-Islamic (Jahiliyya)",
        "years": "c. 500 – 570 CE",
        "place": "Bakr tribe, Najd",
        "tag": "The Eloquent Spokesman of the Bakr tribe",
        "themes": ["Tribal Justice", "Oration", "Diplomacy"],
        "meters": ["الخفيف"],
        "bio": "Delivered his celebrated ode improvising before the court of King Amr ibn Hind."
    },
    {
        "slug": "al-shanfara",
        "name": "Al-Shanfara",
        "ar": "الشنفرى",
        "eraId": "jahili",
        "era": "Pre-Islamic (Jahiliyya)",
        "years": "c. 525 – 560 CE",
        "place": "Yemen / Sarat Mountains",
        "tag": "The Peerless Brigand (Sa'luk) and poet of desert wilderness",
        "themes": ["Wolf Companions", "Solitude", "Endurance", "Wilderness"],
        "meters": ["الطويل"],
        "bio": "Author of Lamiat al-Arab, the supreme ode of ascetic desert independence."
    },
    {
        "slug": "taabbata-sharran",
        "name": "Ta'abbata Sharran",
        "ar": "تأبط شراً",
        "eraId": "jahili",
        "era": "Pre-Islamic (Jahiliyya)",
        "years": "c. 530 – 580 CE",
        "place": "Hejaz / Fahm tribe",
        "tag": "The Fleet-Footed Outlaw and Ghoul Slayer",
        "themes": ["Audacity", "Ghosts", "Nocturnal Warfare"],
        "meters": ["البسيط", "الطويل"],
        "bio": "Famous outlaw who ran as swift as a wild ostrich and fought desert creatures."
    },
    {
        "slug": "hatim-al-tai",
        "name": "Hatim al-Ta'i",
        "ar": "حاتم الطائي",
        "eraId": "jahili",
        "era": "Pre-Islamic (Jahiliyya)",
        "years": "c. 540 – 605 CE",
        "place": "Ha'il / Jabal Shammar",
        "tag": "The Universal Symbol of Arab Hospitality and Generosity",
        "themes": ["Generosity", "Honor", "Hospitality", "Sacrifice"],
        "meters": ["الطويل", "الوافر"],
        "bio": "Legendary hero who preferred poverty over turning away a nocturnal guest."
    },
    {
        "slug": "al-samawal",
        "name": "Al-Samaw'al",
        "ar": "السموأل بن عادياء",
        "eraId": "jahili",
        "era": "Pre-Islamic (Jahiliyya)",
        "years": "c. 500 – 560 CE",
        "place": "Tayma Castle (Al-Ablaq)",
        "tag": "The Sovereign of Unbroken Loyalty",
        "themes": ["Fidelity", "Honor", "Sacrifice"],
        "meters": ["الطويل"],
        "bio": "Safeguarded Imru' al-Qais's coats of mail; proverbially famous for loyalty."
    },
    {
        "slug": "urwa-ibn-al-ward",
        "name": "Urwa ibn al-Ward",
        "ar": "عروة بن الورد",
        "eraId": "jahili",
        "era": "Pre-Islamic (Jahiliyya)",
        "years": "c. 540 – 607 CE",
        "place": "Najd / Abs tribe",
        "tag": "The Outlaw of the Poor (Urwat al-Sa'alik)",
        "themes": ["Social Justice", "Altruism", "Courage"],
        "meters": ["الطويل"],
        "bio": "Fed the sick and destitute outlaws, sharing every grain of food with them."
    },
    {
        "slug": "al-zir-salim",
        "name": "Muhalhil (Al-Zir Salim)",
        "ar": "المهلهل (الزير سالم)",
        "eraId": "jahili",
        "era": "Pre-Islamic (Jahiliyya)",
        "years": "c. 450 – 531 CE",
        "place": "Arabian Peninsula",
        "tag": "First architect of the continuous 30-verse Arabic ode",
        "themes": ["Vengeance", "Basus War", "Brotherhood", "Grief"],
        "meters": ["الوافر", "الكامل"],
        "bio": "Leader of the forty-year Basus war mourning his assassinated brother Kulayb."
    },

    # 2. Mukhadramun
    {
        "slug": "hassan-ibn-thabit",
        "name": "Hassan ibn Thabit",
        "ar": "حسان بن ثابت",
        "eraId": "mukhadramun",
        "era": "Mukhadramun (Veterans)",
        "years": "c. 563 – 674 CE",
        "place": "Medina, Hejaz",
        "tag": "The Poet Laureate of the Prophet",
        "themes": ["Faith", "Devotion", "Defense of Truth", "Eulogy"],
        "meters": ["الطويل", "الوافر"],
        "bio": "Spokesman of the early Islamic era whose verses defended Medina against Quraysh."
    },
    {
        "slug": "kab-ibn-zuhayr",
        "name": "Ka'b ibn Zuhayr",
        "ar": "كعب بن زهير",
        "eraId": "mukhadramun",
        "era": "Mukhadramun (Veterans)",
        "years": "c. 585 – 662 CE",
        "place": "Najd / Medina",
        "tag": "Master of the Mantle Ode (Banat Su'ad)",
        "themes": ["Pardon", "Devotion", "Penance", "Clemency"],
        "meters": ["البسيط"],
        "bio": "Recited Banat Su'ad in the Prophet's mosque, receiving the sacred mantle (Burdah)."
    },
    {
        "slug": "al-khansa",
        "name": "Al-Khansa",
        "ar": "الخنساء (تماضر بنت عمرو)",
        "eraId": "mukhadramun",
        "era": "Mukhadramun (Veterans)",
        "years": "c. 575 – 646 CE",
        "place": "Najd / Medina",
        "tag": "The Matriarch of Elegiac Verse (Ritha')",
        "themes": ["Mourning", "Enduring Grief", "Brotherhood", "Sakhr"],
        "meters": ["البسيط", "الوافر"],
        "bio": "Immortalized Arab elegiac poetry mourning her fallen brothers Sakhr and Mu'awiya."
    },
    {
        "slug": "al-hutayah",
        "name": "Al-Hutay'ah",
        "ar": "الحطيئة",
        "eraId": "mukhadramun",
        "era": "Mukhadramun (Veterans)",
        "years": "c. 590 – 678 CE",
        "place": "Najd",
        "tag": "The Feared Master of Sarcasm and Satire (Hija')",
        "themes": ["Satire", "Self-Deprecation", "Critique"],
        "meters": ["الطويل"],
        "bio": "Satirized adversaries, patrons, his own family, and even himself with wicked wit."
    },
    {
        "slug": "abu-dhuayb-al-hudhali",
        "name": "Abu Dhu'ayb al-Hudhali",
        "ar": "أبو ذؤيب الهذلي",
        "eraId": "mukhadramun",
        "era": "Mukhadramun (Veterans)",
        "years": "c. 580 – 649 CE",
        "place": "Hejaz / North Africa",
        "tag": "Master of the Great Parental Elegy",
        "themes": ["Mourning Five Sons", "Plague", "Mortality"],
        "meters": ["الكامل"],
        "bio": "Lost all five of his sons to the plague in Egypt in a single year, composing immortal ritha'."
    },
    {
        "slug": "labid-ibn-rabiah",
        "name": "Labid ibn Rabi'ah",
        "ar": "لبيد بن ربيعة",
        "eraId": "mukhadramun",
        "era": "Mukhadramun (Veterans)",
        "years": "c. 560 – 661 CE",
        "place": "Najd / Kufa",
        "tag": "The Centenarian of Sacred Devotion",
        "themes": ["Transience", "Ascetic Piety", "Desert Silence"],
        "meters": ["الكامل"],
        "bio": "Mu‘allaqa master who lived over 100 years and ceased secular verse upon conversion."
    },

    # 3. Umayyad Era
    {
        "slug": "jarir",
        "name": "Jarir",
        "ar": "جرير بن عطية",
        "eraId": "umayyad",
        "era": "Umayyad Era",
        "years": "c. 650 – 728 CE",
        "place": "Yamama, Arabia",
        "tag": "Champion of the Poetic Duels (Naqa'id) and tender lyrics",
        "themes": ["Naqa'id Duels", "Ghazal", "Praise", "Eyes of Haura"],
        "meters": ["الوافر", "البسيط", "الكامل"],
        "bio": "Fought a forty-year poetic duel against Al-Farazdaq while composing sublime love lyrics."
    },
    {
        "slug": "al-farazdaq",
        "name": "Al-Farazdaq",
        "ar": "الفرزدق (همام بن غالب)",
        "eraId": "umayyad",
        "era": "Umayyad Era",
        "years": "c. 641 – 730 CE",
        "place": "Basra, Iraq",
        "tag": "The Pillar of Arabic Lexicography and Chivalric Pride",
        "themes": ["Fakhr", "Genealogy", "Eulogy of Zain al-Abidin"],
        "meters": ["الطويل", "الكامل"],
        "bio": "Grammarians noted: 'If not for Al-Farazdaq's poetry, a third of Arabic would be lost.'"
    },
    {
        "slug": "al-akhtal",
        "name": "Al-Akhtal",
        "ar": "الأخطل (غياث بن غوث)",
        "eraId": "umayyad",
        "era": "Umayyad Era",
        "years": "c. 640 – 708 CE",
        "place": "Al-Hirah / Damascus",
        "tag": "Court Laureate of the Umayyad Caliphate in Damascus",
        "themes": ["State Eulogy", "Christian Hermits", "Wine Lyrics"],
        "meters": ["البسيط", "الطويل"],
        "bio": "Taghlibi Christian who was the official laureate of Caliph Abd al-Malik ibn Marwan."
    },
    {
        "slug": "umar-ibn-abi-rabiah",
        "name": "Umar ibn Abi Rabi'ah",
        "ar": "عمر بن أبي ربيعة",
        "eraId": "umayyad",
        "era": "Umayyad Era",
        "years": "c. 644 – 712 CE",
        "place": "Mecca, Hejaz",
        "tag": "The Prince of Urban Elegance and Romantic Dialogue",
        "themes": ["Urban Ghazal", "Pilgrimage Encounters", "Witty Romance"],
        "meters": ["الخفيف", "الرمل"],
        "bio": "Revolutionized Arabic love poetry by introducing dramatic narrative dialogue in Mecca."
    },
    {
        "slug": "qays-ibn-al-mulawwah",
        "name": "Qays ibn al-Mulawwah (Majnun Layla)",
        "ar": "قيس بن الملوح (مجنون ليلى)",
        "eraId": "umayyad",
        "era": "Umayyad Era",
        "years": "c. 645 – 688 CE",
        "place": "Najd, Arabia",
        "tag": "The Immortal Martyr of Chaste Love (Al-Hubb al-Udhri)",
        "themes": ["Layla's Obsession", "Wilderness", "Sacred Longing", "Tears"],
        "meters": ["الطويل", "الوافر"],
        "bio": "Wandered wild among desert gazelles composing verses for his unreachable beloved Layla."
    },
    {
        "slug": "jamil-buthayna",
        "name": "Jamil Buthayna",
        "ar": "جميل بثينة (جميل بن معمر)",
        "eraId": "umayyad",
        "era": "Umayyad Era",
        "years": "c. 659 – 701 CE",
        "place": "Wadi al-Qura, Hejaz",
        "tag": "The Sovereign of Udhri Devotion",
        "themes": ["Loyalty Beyond Death", "Chaste Passion", "Melancholy"],
        "meters": ["الطويل"],
        "bio": "Swore eternal constancy to Buthayna that would outlast the grave and judgment day."
    },
    {
        "slug": "dhu-al-rumma",
        "name": "Dhu al-Rumma",
        "ar": "ذو الرمة (غيلان بن عقبة)",
        "eraId": "umayyad",
        "era": "Umayyad Era",
        "years": "c. 696 – 735 CE",
        "place": "Yamama / Basra",
        "tag": "The Last of the Great Bedouin Purists",
        "themes": ["Desert Mirage", "Wildlife", "Mayya's Eyes", "Dunes"],
        "meters": ["البسيط", "الطويل"],
        "bio": "Regarded as the greatest landscape painter of desert ecology in classical Arabic verse."
    },
    {
        "slug": "layla-al-akhyaliyya",
        "name": "Layla al-Akhyaliyya",
        "ar": "ليلى الأخيلية",
        "eraId": "umayyad",
        "era": "Umayyad Era",
        "years": "c. 630 – 704 CE",
        "place": "Najd / Iraq",
        "tag": "The Fearless Lady of Chivalric Wisdom",
        "themes": ["Tawbah's Elegy", "Courage", "Debate"],
        "meters": ["الطويل"],
        "bio": "Eloquently matched male poets at caliphal courts; legendary for her elegy of Tawbah."
    },

    # 4. Early Abbasid
    {
        "slug": "bashar-ibn-burd",
        "name": "Bashar ibn Burd",
        "ar": "بشار بن برد",
        "eraId": "early_abbasid",
        "era": "Early Abbasid",
        "years": "c. 714 – 784 CE",
        "place": "Basra / Baghdad",
        "tag": "The Blind Pioneer of Modernist Rhetoric (Badi')",
        "themes": ["Love with the Ear", "Wine", "Badi' Metaphor", "Persian Heritage"],
        "meters": ["الطويل", "الكامل", "الرجز"],
        "bio": "Born blind; founded the modernist poetic revolution in early Abbasid Baghdad."
    },
    {
        "slug": "abu-nuwas",
        "name": "Abu Nuwas",
        "ar": "أبو نواس (الحسن بن هانئ)",
        "eraId": "early_abbasid",
        "era": "Early Abbasid",
        "years": "c. 756 – 814 CE",
        "place": "Ahvaz / Baghdad",
        "tag": "The Dionysian Sovereign of Bacchic Poetry (Khamriyyat)",
        "themes": ["Khamriyyat", "Baghdad Nights", "Defiance of Dunes", "Ascetic Repentance"],
        "meters": ["الكامل", "البسيط", "السريع", "الرمل"],
        "bio": "Iconic figure in the Thousand and One Nights; revolutionized wine and urban love poetry."
    },
    {
        "slug": "abu-al-atahiya",
        "name": "Abu al-Atahiya",
        "ar": "أبو العتاهية (إسماعيل بن القاسم)",
        "eraId": "early_abbasid",
        "era": "Early Abbasid",
        "years": "c. 748 – 828 CE",
        "place": "Kufa / Baghdad",
        "tag": "The Philosopher of Ascetic Simplicity (Zuhdiyyat)",
        "themes": ["Vanity of Power", "Mortality", "Simplicity", "Graveyards"],
        "meters": ["الوافر", "المتقارب", "الرجز"],
        "bio": "Abandoned courtly praise to compose haunting, accessible verses on the transience of wealth."
    },
    {
        "slug": "al-abbas-ibn-al-ahnaf",
        "name": "Al-Abbas ibn al-Ahnaf",
        "ar": "العباس بن الأحنف",
        "eraId": "early_abbasid",
        "era": "Early Abbasid",
        "years": "c. 750 – 809 CE",
        "place": "Basra / Baghdad",
        "tag": "The Courtly Gentleman of Pure Love",
        "themes": ["Platonic Devotion", "Longing", "Tears", "Fawz"],
        "meters": ["الكامل", "الخفيف"],
        "bio": "Never composed satire or war verse; devoted his entire life exclusively to noble love lyrics."
    },
    {
        "slug": "rabia-al-adawiyya",
        "name": "Rabi'a al-Adawiyya",
        "ar": "رابعة العدوية",
        "eraId": "early_abbasid",
        "era": "Early Abbasid",
        "years": "c. 716 – 801 CE",
        "place": "Basra, Iraq",
        "tag": "The Saint of Divine Unconditional Love (Al-Ishq al-Ilahi)",
        "themes": ["Divine Love", "Freedom from Fear", "Pure Devotion"],
        "meters": ["الكامل", "الوافر"],
        "bio": "Pioneered Sufi love poetry: loving God not out of fear of Hell nor desire for Paradise."
    },

    # 5. High Abbasid
    {
        "slug": "abu-tammam",
        "name": "Abu Tammam",
        "ar": "أبو تمام (حبيب بن أوس)",
        "eraId": "high_abbasid",
        "era": "High Abbasid",
        "years": "c. 804 – 846 CE",
        "place": "Syria / Baghdad / Mosul",
        "tag": "The Architect of Intellect and compiler of Hamasah",
        "themes": ["Amorium Conquest", "Sword vs Astrology", "Heroism"],
        "meters": ["البسيط", "الطويل"],
        "bio": "Master of dense intellectual metaphors; compiler of the immortal Diwan al-Hamasah."
    },
    {
        "slug": "al-buhturi",
        "name": "Al-Buhturi",
        "ar": "البحتري (الوليد بن عبيد)",
        "eraId": "high_abbasid",
        "era": "High Abbasid",
        "years": "c. 821 – 897 CE",
        "place": "Manbij / Samarra",
        "tag": "The Musical Painter of Samarra and Arch of Ctesiphon",
        "themes": ["Iwan Kisra", "Samarra Palaces", "Autumn Ponds", "Harmony"],
        "meters": ["الكامل", "البسيط"],
        "bio": "Famous for sonic flawlessness and his monumental ode on the ruins of the Persian Ctesiphon."
    },
    {
        "slug": "ibn-al-rumi",
        "name": "Ibn al-Rumi",
        "ar": "ابن الرومي (علي بن العباس)",
        "eraId": "high_abbasid",
        "era": "High Abbasid",
        "years": "c. 836 – 896 CE",
        "place": "Baghdad, Iraq",
        "tag": "The Analytical Visionary and Master of Detailed Human Nature",
        "themes": ["Paternal Grief", "Everyday Crafts", "Portraits", "Satire"],
        "meters": ["البسيط", "الوافر", "الطويل"],
        "bio": "Composed the heartbreaking elegy on his child Muhammad; master of psychological observation."
    },
    {
        "slug": "ibn-al-mutazz",
        "name": "Ibn al-Mu'tazz",
        "ar": "ابن المعتز (عبد الله)",
        "eraId": "high_abbasid",
        "era": "High Abbasid",
        "years": "c. 861 – 908 CE",
        "place": "Samarra / Baghdad",
        "tag": "The One-Day Caliph and founder of Arabic Poetics (Kitab al-Badi')",
        "themes": ["Crescent Moon as Boat", "Wine", "Autumn Dawn"],
        "meters": ["الكامل", "الرمل"],
        "bio": "Abbasid prince who wrote the foundational treatise on Arabic rhetoric and poetic devices."
    },
    {
        "slug": "al-hallaj",
        "name": "Al-Hallaj",
        "ar": "منصور الحلاج",
        "eraId": "high_abbasid",
        "era": "High Abbasid",
        "years": "c. 858 – 922 CE",
        "place": "Fars / Baghdad",
        "tag": "The Mystical Martyr of Divine Unity",
        "themes": ["Fana' (Dissolution)", "Divine Identity", "Sacrifice"],
        "meters": ["الكامل", "الخفيف"],
        "bio": "Executed in Baghdad; his ecstatic verses remain the zenith of Arabic mystical poetry."
    },
    {
        "slug": "al-sharif-al-radi",
        "name": "Al-Sharif al-Radi",
        "ar": "الشريف الرضي (محمد بن الحسين)",
        "eraId": "high_abbasid",
        "era": "High Abbasid",
        "years": "c. 970 – 1015 CE",
        "place": "Baghdad, Iraq",
        "tag": "Compiler of Nahj al-Balaghah and poet of the sacred Hijaziyyat",
        "themes": ["Hijaziyyat", "Chivalric Honor", "Elegies", "Nobility"],
        "meters": ["الطويل", "الكامل"],
        "bio": "Descendant of the Prophet; combined spiritual majesty with sublime lyricism."
    },

    # 6. Golden Era of Al-Mutanabbi & Al-Ma'arri
    {
        "slug": "al-mutanabbi",
        "name": "Abu al-Tayyib al-Mutanabbi",
        "ar": "أبو الطيب المتنبي",
        "eraId": "mutanabbi_maari",
        "era": "Mutanabbi & Ma'arri Era",
        "years": "c. 915 – 965 CE",
        "place": "Kufa / Aleppo / Cairo",
        "tag": "The Sovereign of Arabic Verse and Pride of the Desert",
        "themes": ["Sayf al-Dawla", "Chivalry", "Wisdom", "Ambition", "Courage"],
        "meters": ["الطويل", "البسيط", "الكامل", "الوافر"],
        "bio": "Proverbially declared: 'The horse, the night, and the desert know me, as do the sword and the pen.'"
    },
    {
        "slug": "abu-firas-al-hamdani",
        "name": "Abu Firas al-Hamdani",
        "ar": "أبو فراس الحمداني",
        "eraId": "mutanabbi_maari",
        "era": "Mutanabbi & Ma'arri Era",
        "years": "c. 932 – 968 CE",
        "place": "Aleppo / Byzantine Constantinople",
        "tag": "The Princely Knight and author of the Byzantine Prison Odes (Al-Rumiyyat)",
        "themes": ["Al-Rumiyyat", "Captivity", "Knightly Pride", "Tears"],
        "meters": ["الطويل", "الوافر"],
        "bio": "Hamdanid prince captured by Byzantines; composed his prison odes to Sayf al-Dawla."
    },
    {
        "slug": "abu-al-ala-al-maari",
        "name": "Abu al-Ala al-Ma'arri",
        "ar": "أبو العلاء المعري",
        "eraId": "mutanabbi_maari",
        "era": "Mutanabbi & Ma'arri Era",
        "years": "c. 973 – 1057 CE",
        "place": "Ma'arra, Syria",
        "tag": "The Blind Sage of Resulat al-Ghufran and Luzumiyyat",
        "themes": ["Luzumiyyat", "Rationalism", "Universal Justice", "Solitude"],
        "meters": ["الطويل", "البسيط", "الوافر"],
        "bio": "The 'Hostage of the Two Prisons'; visionary author whose Risalat al-Ghufran preceded Dante's Inferno."
    },

    # 7. Andalusian (Islamic Iberia)
    {
        "slug": "ibn-zaydun",
        "name": "Ibn Zaydun",
        "ar": "ابن زيدون (أحمد بن عبد الله)",
        "eraId": "andalusian",
        "era": "Andalusian (Islamic Iberia)",
        "years": "c. 1003 – 1071 CE",
        "place": "Cordoba / Seville, Al-Andalus",
        "tag": "The Aristocrat of Cordoba and master of the Nuniyya",
        "themes": ["Nuniyya", "Wallada's Gardens", "Cordoba Palaces", "Longing"],
        "meters": ["البسيط", "الكامل"],
        "bio": "Statesman of Cordoba; composed the supreme ode of Arab nostalgia amidst Az-Zahra gardens."
    },
    {
        "slug": "wallada-bint-al-mustakfi",
        "name": "Wallada bint al-Mustakfi",
        "ar": "ولادة بنت المستكفي",
        "eraId": "andalusian",
        "era": "Andalusian (Islamic Iberia)",
        "years": "c. 1001 – 1091 CE",
        "place": "Cordoba, Al-Andalus",
        "tag": "The Independent Princess and Sovereign of the Cordoba Literary Salon",
        "themes": ["Pride", "Independence", "Defiance", "Embroidered Robe"],
        "meters": ["الطويل", "الكامل"],
        "bio": "Umayyad princess who embroidered on her robe: 'By God, I am made for glory and walk with pride.'"
    },
    {
        "slug": "ibn-khafaja",
        "name": "Ibn Khafaja",
        "ar": "ابن خفاجة (إبراهيم بن أبي الفتح)",
        "eraId": "andalusian",
        "era": "Andalusian (Islamic Iberia)",
        "years": "c. 1058 – 1138 CE",
        "place": "Alcira, Valencia, Al-Andalus",
        "tag": "The Gardener of the Poets (Jannan al-Andalus)",
        "themes": ["Talking Mountain", "Verdant Rivers", "Nature Solitude"],
        "meters": ["الطويل", "الكامل"],
        "bio": "Celebrated for his sublime ode addressing the nocturnal mountain that weeps over vanished generations."
    },
    {
        "slug": "al-mutamid-ibn-abbad",
        "name": "Al-Mu'tamid ibn Abbad",
        "ar": "المعتمد بن عباد",
        "eraId": "andalusian",
        "era": "Andalusian (Islamic Iberia)",
        "years": "c. 1040 – 1095 CE",
        "place": "Seville / Aghmat, Morocco",
        "tag": "The Tragic King of Seville and prisoner of Aghmat",
        "themes": ["Fallen Royalty", "Chains", "Eid in Prison", "Daughters Weeping"],
        "meters": ["البسيط", "الطويل"],
        "bio": "Poet-king of Seville who died in chains in North Africa, writing verses on his tombstone."
    },
    {
        "slug": "ibn-hazm-al-andalusi",
        "name": "Ibn Hazm al-Andalusi",
        "ar": "ابن حزم الأندلسي",
        "eraId": "andalusian",
        "era": "Andalusian (Islamic Iberia)",
        "years": "c. 994 – 1064 CE",
        "place": "Cordoba / Montíjar",
        "tag": "Philosopher of Love and author of The Ring of the Dove (Tawq al-Hamama)",
        "themes": ["Psychology of Love", "Loyalty", "Eye Contact"],
        "meters": ["الكامل", "الطويل"],
        "bio": "Universal scholar who analyzed love with psychological and philosophical brilliance."
    },
    {
        "slug": "abu-al-baqa-al-rundi",
        "name": "Abu al-Baqa al-Rundi",
        "ar": "أبو البقاء الرندي",
        "eraId": "andalusian",
        "era": "Andalusian (Islamic Iberia)",
        "years": "c. 1204 – 1285 CE",
        "place": "Ronda / Ceuta",
        "tag": "The Voice of the Fall of Al-Andalus",
        "themes": ["Elegy for Andalusia", "Perished Cities", "Cordoba", "Seville"],
        "meters": ["البسيط"],
        "bio": "Composed the immortal elegy: 'Everything when it reaches completion begins to decline.'"
    },
    {
        "slug": "lisan-al-din-ibn-al-khatib",
        "name": "Lisan al-Din ibn al-Khatib",
        "ar": "لسان الدين بن الخطيب",
        "eraId": "andalusian",
        "era": "Andalusian (Islamic Iberia)",
        "years": "c. 1313 – 1374 CE",
        "place": "Granada / Fez",
        "tag": "Prime Minister of Granada and author of 'Jadaaka al-Ghaythu'",
        "themes": ["Granada Rain", "Muwashshah", "Alhambra Glory"],
        "meters": ["الرمل", "الموشحات"],
        "bio": "Vizier of the Alhambra who composed the most famous Andalusian muwashshah in history."
    },

    # 8. Fatimid, Ayyubid & Mamluk
    {
        "slug": "ibn-al-farid",
        "name": "Ibn al-Farid",
        "ar": "عمر بن الفارض",
        "eraId": "fatimid_ayyubid",
        "era": "Fatimid & Ayyubid",
        "years": "c. 1181 – 1235 CE",
        "place": "Cairo / Hejaz",
        "tag": "The Sultan of the Lovers (Sultan al-Ashiqin)",
        "themes": ["Mystical Wine (Khamriyya)", "Nazm al-Suluk", "Divine Presence"],
        "meters": ["الطويل", "الكامل", "البسيط"],
        "bio": "The supreme Sufi lyric poet of Egypt whose Khamriyya sings of wine before the vine was created."
    },
    {
        "slug": "al-busiri",
        "name": "Al-Busiri",
        "ar": "شرف الدين البوصيري",
        "eraId": "mamluk",
        "era": "Mamluk Era",
        "years": "c. 1213 – 1294 CE",
        "place": "Dalas / Alexandria, Egypt",
        "tag": "Author of the Immortal Mantle Ode (Al-Burdah)",
        "themes": ["Al-Burdah", "Praise of the Prophet", "Spiritual Healing"],
        "meters": ["البسيط"],
        "bio": "His Qasidat al-Burdah became the most widely recited, copied, and illuminated poem in the Islamic world."
    },
    {
        "slug": "safi-al-din-al-hilli",
        "name": "Safi al-Din al-Hilli",
        "ar": "صفي الدين الحلي",
        "eraId": "mamluk",
        "era": "Mamluk Era",
        "years": "c. 1278 – 1349 CE",
        "place": "Hillah, Iraq / Mardin",
        "tag": "Author of the White, Green, and Black Banner Ode",
        "themes": ["White Deeds", "Green Pastures", "Badi'iyyat", "Red Swords"],
        "meters": ["البسيط"],
        "bio": "Whose verse inspired the modern Pan-Arab colors: 'White are our deeds, black our battles, green our pastures, red our swords.'"
    },

    # 9. Nahda & Renaissance
    {
        "slug": "ahmad-shawqi",
        "name": "Ahmad Shawqi",
        "ar": "أحمد شوقي (أمير الشعراء)",
        "eraId": "nahda",
        "era": "Nahda (Revival & Neo-Classical)",
        "years": "c. 1868 – 1932 CE",
        "place": "Cairo, Egypt / Exile in Spain",
        "tag": "The Prince of the Poets (Amir al-Shu'ara)",
        "themes": ["Nahda Revival", "Andalusian Exile", "Pyramids", "Verse Theater"],
        "meters": ["البسيط", "الكامل", "الطويل", "الوافر"],
        "bio": "Unanimously crowned Amir al-Shu'ara in 1927; revived classical eloquence in modern theater and lyric."
    },
    {
        "slug": "hafiz-ibrahim",
        "name": "Hafiz Ibrahim",
        "ar": "حافظ إبراهيم (شاعر النيل)",
        "eraId": "nahda",
        "era": "Nahda (Revival & Neo-Classical)",
        "years": "c. 1872 – 1932 CE",
        "place": "Dayrut / Cairo, Egypt",
        "tag": "The Poet of the Nile and Defender of the Mother Tongue",
        "themes": ["Arabic Language Eulogy", "Social Justice", "Earthquakes", "Patriotism"],
        "meters": ["البسيط", "الوافر"],
        "bio": "Gave voice to the Arabic language itself declaring: 'I am the sea whose depths contain peerless pearls.'"
    },
    {
        "slug": "khalil-mutran",
        "name": "Khalil Mutran",
        "ar": "خليل مطران (شاعر القطرين)",
        "eraId": "nahda",
        "era": "Nahda (Revival & Neo-Classical)",
        "years": "c. 1872 – 1949 CE",
        "place": "Baalbek, Lebanon / Cairo",
        "tag": "Poet of the Two Realms and Pioneer of Modern Lyric Narrative",
        "themes": ["Al-Masa' (Sunset)", "Inner Emotion", "Psychological Portrait"],
        "meters": ["الكامل", "البسيط"],
        "bio": "Bridged the neoclassical Nahda with introspective romantic sensitivity in his masterpiece Al-Masa'."
    },
    {
        "slug": "muhammad-al-jawahiri",
        "name": "Muhammad Mahdi al-Jawahiri",
        "ar": "محمد مهدي الجواهري",
        "eraId": "nahda",
        "era": "Nahda (Revival & Neo-Classical)",
        "years": "c. 1899 – 1997 CE",
        "place": "Najaf, Iraq / Damascus",
        "tag": "The Greatest of the Latter Poets (Akbar al-Shu'ara)",
        "themes": ["Tigris River", "Martyrdom", "Freedom", "Iraqi Defiance"],
        "meters": ["الطويل", "البسيط", "الكامل"],
        "bio": "Known as the twentieth-century Al-Mutanabbi; composed thunderous odes of freedom for Iraq."
    },

    # 10. Mahjar & Apollo
    {
        "slug": "kahlil-gibran",
        "name": "Kahlil Gibran",
        "ar": "جبران خليل جبران",
        "eraId": "mahjar_apollo",
        "era": "Mahjar & Apollo Romanticism",
        "years": "c. 1883 – 1931 CE",
        "place": "Bsharri, Lebanon / New York",
        "tag": "Master of The Prophet and the Pen League (Al-Rabitah al-Qalamiyyah)",
        "themes": ["The Processions (Al-Mawakib)", "Forests", "Soul", "Freedom"],
        "meters": ["البسيط", "الرمل", "شعر مرسل"],
        "bio": "Founded the Pen League in New York; liberated Arabic verse with transcendental spiritual vision."
    },
    {
        "slug": "elia-abu-madi",
        "name": "Elia Abu Madi",
        "ar": "إيليا أبو ماضي",
        "eraId": "mahjar_apollo",
        "era": "Mahjar & Apollo Romanticism",
        "years": "c. 1889 – 1957 CE",
        "place": "Muhayditha, Lebanon / New York",
        "tag": "The Philosopher of Optimism and author of 'Al-Talasim' (The Enigmas)",
        "themes": ["Al-Talasim", "Smile (Ibtasim)", "Brook and Clay", "Mystery"],
        "meters": ["الرمل", "الكامل", "الخفيف"],
        "bio": "Celebrated poet of philosophical wonder and radiant human optimism in diaspora."
    },
    {
        "slug": "abu-al-qasim-al-shabi",
        "name": "Abu al-Qasim al-Shabi",
        "ar": "أبو القاسم الشابي",
        "eraId": "mahjar_apollo",
        "era": "Mahjar & Apollo Romanticism",
        "years": "c. 1909 – 1934 CE",
        "place": "Tozeur, Tunisia",
        "tag": "The Voice of the Will to Life (Iradat al-Hayat)",
        "themes": ["Will to Life", "Destiny", "Spring", "Sacred Youth"],
        "meters": ["المتقارب", "الكامل"],
        "bio": "Died at age twenty-five; his immortal verse 'When the people will to live, destiny must respond' became Tunisia's anthem."
    },
    {
        "slug": "ibrahim-nagi",
        "name": "Ibrahim Nagi",
        "ar": "إبراهيم ناجي",
        "eraId": "mahjar_apollo",
        "era": "Mahjar & Apollo Romanticism",
        "years": "c. 1898 – 1953 CE",
        "place": "Cairo, Egypt",
        "tag": "Doctor of the Soul and author of 'Al-Atlal' (The Ruins)",
        "themes": ["Al-Atlal", "Melancholy", "Lost Paradise", "Umm Kulthum"],
        "meters": ["الرمل", "الكامل"],
        "bio": "Physician-poet whose masterpiece Al-Atlal was sung by Umm Kulthum as the pinnacle of 20th C. Arabic song."
    },

    # 11. Taf'ilah (Free Verse Revolution)
    {
        "slug": "badr-shakir-al-sayyab",
        "name": "Badr Shakir al-Sayyab",
        "ar": "بدر شاكر السياب",
        "eraId": "tafeelah",
        "era": "Taf'ilah (Pioneers of Free Verse)",
        "years": "c. 1926 – 1964 CE",
        "place": "Jaykur / Basra, Iraq",
        "tag": "The Father of Modern Arabic Free Verse and author of 'Song of the Rain'",
        "themes": ["Song of the Rain (Unshudat al-Matar)", "Jaykur", "Fertility Myth", "Exile"],
        "meters": ["الرمل", "الكامل (تفعيلة)"],
        "bio": "Revolutionized Arabic prosody in 1948 by introducing variable-meter free verse (Shi'r al-Taf'ilah)."
    },
    {
        "slug": "nazik-al-malaika",
        "name": "Nazik al-Malaika",
        "ar": "نازك الملائكة",
        "eraId": "tafeelah",
        "era": "Taf'ilah (Pioneers of Free Verse)",
        "years": "c. 1923 – 2007 CE",
        "place": "Baghdad, Iraq / Cairo",
        "tag": "The Matriarch of Modernist Prosody and author of 'Cholera'",
        "themes": ["Cholera (Al-Kūlīrā)", "Night", "Wave", "Prosodic Theory"],
        "meters": ["المتدارك (تفعيلة)"],
        "bio": "Pioneered free verse with her 1947 poem 'Al-Kulira' and authored the critical theory of modern Arabic verse."
    },
    {
        "slug": "abd-al-wahhab-al-bayati",
        "name": "Abd al-Wahhab al-Bayati",
        "ar": "عبد الوهاب البياتي",
        "eraId": "tafeelah",
        "era": "Taf'ilah (Pioneers of Free Verse)",
        "years": "c. 1926 – 1999 CE",
        "place": "Baghdad, Iraq / Damascus",
        "tag": "The Mythic Wanderer of the Arab Exile",
        "themes": ["Al-Hallaj", "Nishapur", "Exile", "Aisha"],
        "meters": ["الكامل", "الرجز (تفعيلة)"],
        "bio": "Fused Sufi archetypes with Marxist internationalism across a life of nomadic exile."
    },
    {
        "slug": "amal-dunqul",
        "name": "Amal Dunqul",
        "ar": "أمل دنقل",
        "eraId": "tafeelah",
        "era": "Taf'ilah (Pioneers of Free Verse)",
        "years": "c. 1940 – 1983 CE",
        "place": "Qena / Cairo, Egypt",
        "tag": "The Uncompromising Conscience and author of 'Do Not Reconcile' (La Tusalah)",
        "themes": ["La Tusalah", "Spartacus", "Zir Salim", "Hospital Room 8"],
        "meters": ["الكامل", "الوافر (تفعيلة)"],
        "bio": "Composed 'Do Not Reconcile' (لا تصالح), the definitive manifesto against cultural surrender."
    },

    # 12. Contemporary & Resistance
    {
        "slug": "mahmoud-darwish",
        "name": "Mahmoud Darwish",
        "ar": "محمود درويش",
        "eraId": "contemporary",
        "era": "Contemporary & Resistance",
        "years": "c. 1941 – 2008 CE",
        "place": "Al-Birwa, Palestine / Ramallah",
        "tag": "The Universal Voice of Palestine and master of lyric epic",
        "themes": ["Identity Card", "Mural", "Olive Trees", "Exile", "Mother's Bread"],
        "meters": ["الكامل", "المتقارب", "الرمل"],
        "bio": "Elevated national resistance to cosmic human literature in works from 'Bitaqat Hawiyyah' to 'Jidariyya'."
    },
    {
        "slug": "nizar-qabbani",
        "name": "Nizar Qabbani",
        "ar": "نزار قباني",
        "eraId": "contemporary",
        "era": "Contemporary & Resistance",
        "years": "c. 1923 – 1998 CE",
        "place": "Damascus, Syria / London",
        "tag": "The Poet of Womanhood and Voice of Arab Anguish",
        "themes": ["Damascene Jasmine", "Love Letters", "Political Elegy", "Balqis"],
        "meters": ["الكامل", "الرمل", "الوافر"],
        "bio": "The most widely read love and political poet in modern Arab history."
    },
    {
        "slug": "samih-al-qasim",
        "name": "Samih al-Qasim",
        "ar": "سميح القاسم",
        "eraId": "contemporary",
        "era": "Contemporary & Resistance",
        "years": "c. 1939 – 2014 CE",
        "place": "Rameh, Galilee",
        "tag": "The Knight of the Homeland and Defiant Resister",
        "themes": ["All Sons of Palestine", "Defiance", "Sons of the Stones"],
        "meters": ["الكامل", "الوافر"],
        "bio": "Co-founder of Palestinian resistance poetry with Darwish; author of 'Advance, Advance!'"
    },
    {
        "slug": "adonis",
        "name": "Adonis (Ali Ahmad Said Esber)",
        "ar": "أدونيس (علي أحمد سعيد إسبر)",
        "eraId": "contemporary",
        "era": "Contemporary & Resistance",
        "years": "b. 1930 CE",
        "place": "Qassabin, Syria / Paris",
        "tag": "The Iconoclast of Modern Arabic Poetics and author of 'Al-Thabit wal-Mutahawwil'",
        "themes": ["Mihyar of Damascus", "Metamorphosis", "Beirut", "Poetic Shock"],
        "meters": ["شعر حر", "قصيدة نثر"],
        "bio": "Leader of the Shi'r magazine movement who revolutionized Arabic syntax and critical ontology."
    },
    {
        "slug": "muhammad-al-maghut",
        "name": "Muhammad al-Maghut",
        "ar": "محمد الماغوط",
        "eraId": "contemporary",
        "era": "Contemporary & Resistance",
        "years": "c. 1934 – 2006 CE",
        "place": "Salamiyah / Damascus, Syria",
        "tag": "The Master of Bitter Satire and Pioneer of the Arabic Prose Poem",
        "themes": ["Joy is Not My Profession", "Sidewalk Cigarettes", "Freedom", "Tears"],
        "meters": ["قصيدة نثر"],
        "bio": "Pioneered the Arabic prose poem (Qasidat al-Nathr) with searing existential and political irony."
    },
    {
        "slug": "fadwa-tuqan",
        "name": "Fadwa Tuqan",
        "ar": "فدوى طوقان",
        "eraId": "contemporary",
        "era": "Contemporary & Resistance",
        "years": "c. 1917 – 2003 CE",
        "place": "Nablus, Palestine",
        "tag": "The Poetess of Palestine and Voice of Mountain Solitude",
        "themes": ["A Mountainous Journey", "Martyrdom", "Nablus", "Love"],
        "meters": ["الكامل", "الوافر"],
        "bio": "Overcame strict societal barriers to become one of Palestine's most courageous literary voices."
    },
    {
        "slug": "tamim-al-barghouti",
        "name": "Tamim al-Barghouti",
        "ar": "تميم البرغوثي",
        "eraId": "contemporary",
        "era": "Contemporary & Resistance",
        "years": "b. 1977 CE",
        "place": "Cairo, Egypt / Ramallah",
        "tag": "The Voice of Jerusalem and author of 'In Jerusalem' (Fi al-Quds)",
        "themes": ["In Jerusalem (Fi al-Quds)", "Palestine", "Arab Unity", "Eloquent Meter"],
        "meters": ["البسيط", "الكامل", "الطويل"],
        "bio": "His recitation of 'In Jerusalem' captivated millions, proving the unwaning power of classical eloquence."
    }
]

def export_poets_catalog(output_path: str):
    """Exports canonical poets catalog to JSON."""
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump({
            "eras": ERAS,
            "poetsCount": len(POETS_REGISTRY),
            "poets": POETS_REGISTRY
        }, f, ensure_ascii=False, indent=2)
    print(f"✓ Exported {len(POETS_REGISTRY)} canonical Arabic poets to {output_path}")

if __name__ == "__main__":
    out = "sources/arabic-corpora/poets_registry.json"
    export_poets_catalog(out)
