export interface Poet {
  slug: string;
  name: string;
  ar?: string;
  years: string;
  place: string;
  language: "ar" | "en" | "bilingual";
  era: string;
  tag: string;
  img: string;
  pos: string;
  bio: string[];
  works: string[];
  themes: string[];
  sayings?: string[];
}

export interface Poem {
  slug: string;
  title: string;
  titleAr?: string;
  poet: string;
  language: "ar" | "en";
  era: string;
  meter?: string;
  img: string;
  pos: string;
  shape: "arch" | "oval" | "rect";
  frame: "gilt" | "carved" | "none";
  orig: boolean;
  tags: string[];
  plate: string;
  about: string;
  text: string;
  source?: string;
}

export const ROM = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI", "XXII", "XXIII", "XXIV", "XXV", "XXVI"];

export const POETS: Poet[] = [
  {
    "slug": "mahmoud-darwish",
    "name": "Mahmoud Darwish",
    "ar": "محمود درويش",
    "years": "1941 – 2008",
    "place": "al-Birwa, Galilee",
    "language": "ar",
    "era": "Modern",
    "tag": "The poet of homeland, exile and memory",
    "img": "i5",
    "pos": "70% 40%",
    "bio": [
      "Mahmoud Darwish was born in 1941 in the village of al-Birwa in Galilee. In 1948 his family fled across the border; when they returned in secret, their village had been destroyed. That double wound, of leaving and of finding nothing to return to, runs under almost everything he wrote.",
      "Writing in Arabic, he became widely regarded as Palestine's national poet. His early poem “Identity Card” (1964) made him famous across the Arab world. He lived in Beirut, Paris, Tunis and Ramallah, and his later books turned from slogan to a quieter, more musical voice in which love, myth and loss share a single line.",
      "He died in Houston on 9 August 2008. His funeral in Ramallah drew crowds of mourners."
    ],
    "works": [
      "Memory for Forgetfulness (prose, 1982)",
      "Why Did You Leave the Horse Alone? (1995)",
      "Mural (2000)",
      "State of Siege (2002)"
    ],
    "themes": [
      "Homeland",
      "Exile",
      "Memory",
      "Love",
      "Identity"
    ],
    "sayings": [
      "A homeland is what we carry when everything else has been counted.",
      "The road is longer than the map, and kinder.",
      "Memory is the only country that cannot be crossed out.",
      "Say your name to the olive tree before you say it to the world."
    ]
  },
  {
    "slug": "al-mutanabbi",
    "name": "Al-Mutanabbi",
    "ar": "أبو الطيب المتنبي",
    "years": "915 – 965 CE",
    "place": "Kufa, Iraq / Aleppo, Syria",
    "language": "ar",
    "era": "Classical Abbasid",
    "tag": "The supreme voice of Arabic classical poetry",
    "img": "i3",
    "pos": "center 35%",
    "bio": [
      "Abu al-Tayyib Ahmad ibn al-Husayn al-Mutanabbi is universally celebrated as the greatest poet in the Arabic language. Born in Kufa in 915 CE, his extraordinary command of metric eloquence, philosophical grandeur, and soaring confidence transformed classical verse forever.",
      "At the court of Prince Sayf al-Dawla in Aleppo, he composed magnificent panegyrics and battle odes that celebrate courage, nobility, and the tragic burden of greatness. His verses are quoted across centuries as proverbs of truth."
    ],
    "works": [
      "Diwan al-Mutanabbi",
      "Al-Sayfiyyat (Odes for Sayf al-Dawla)",
      "Al-Kafuriyyat (Odes of Egypt)"
    ],
    "themes": [
      "Pride",
      "Courage",
      "Honor",
      "Wisdom",
      "Destiny"
    ],
    "sayings": [
      "الخيل والليل والبيداء تعرفني والسيف والرمح والقرطاس والقلم",
      "على قدر أهل العزم تأتي العزائم وتأتي على قدر الكرام المكارم",
      "إذا غامرت في شرف مروم فلا تقنع بما دون النجوم"
    ]
  },
  {
    "slug": "imru-al-qais",
    "name": "Imru' al-Qais",
    "ar": "امرؤ القيس",
    "years": "~500 – 544 CE",
    "place": "Najd, Arabia",
    "language": "ar",
    "era": "Pre-Islamic",
    "tag": "The Prince of Wandering Poets and master of the Golden Mu‘allaqa",
    "img": "i1",
    "pos": "center 30%",
    "bio": [
      "Imru' al-Qais ibn Hujr al-Kindi was a pre-Islamic Arabian prince and poet, renowned as the inventor of the classical qasida structure. Following the assassination of his father the King, he took up arms and wandered the desert seeking justice.",
      "His Mu‘allaqa is the crowning jewel of the suspended odes upon the Kaaba, immortalizing the opening halt before the desert ruins: “Stop, let us weep for the memory of a beloved and an abode.”"
    ],
    "works": [
      "The Golden Mu‘allaqa (قفا نبك)",
      "Diwan Imru' al-Qais"
    ],
    "themes": [
      "Desert",
      "Love",
      "Remembrance",
      "Fate",
      "Knightly Valor"
    ],
    "sayings": [
      "قفا نبك من ذكرى حبيب ومنزل بسقط اللوى بين الدخول فحومل",
      "وليل كموج البحر أرخى سدوله علي بأنواع الهموم ليبتلي"
    ]
  },
  {
    "slug": "antara-ibn-shaddad",
    "name": "Antarah ibn Shaddad",
    "ar": "عنترة بن شداد",
    "years": "~525 – 608 CE",
    "place": "Najd, Arabia",
    "language": "ar",
    "era": "Pre-Islamic",
    "tag": "The legendary knight of the Abs tribe and poet of eternal chivalry",
    "img": "i4",
    "pos": "center 30%",
    "bio": [
      "Antarah ibn Shaddad was an Arabian knight-poet famed for courage in battle and devoted love for his cousin Abla. Born to an enslaved mother, he won his freedom and nobility through peerless valor defending his tribe against all invaders.",
      "His Mu‘allaqa unites the thunder of desert combat with tender recollections of love, epitomizing the heroic ethos of pre-Islamic chivalry."
    ],
    "works": [
      "Mu‘allaqat Antarah",
      "Sirat Antar (Epic Romance)"
    ],
    "themes": [
      "Chivalry",
      "Valour",
      "Pure Love",
      "Freedom",
      "Honor"
    ],
    "sayings": [
      "ولقد ذكرتك والرماح نواهل مني وبيض الهند تقطر من دمي",
      "فوددت تقبيل السيوف لأنها لمعت كبارق ثغرك المتبسم"
    ]
  },
  {
    "slug": "ahmad-shawqi",
    "name": "Ahmad Shawqi",
    "ar": "أحمد شوقي",
    "years": "1868 – 1932",
    "place": "Cairo, Egypt",
    "language": "ar",
    "era": "Modern",
    "tag": "Amir al-Shu‘ara (Prince of Poets) who led the modern Arabic renaissance",
    "img": "poet-shawqi",
    "pos": "center",
    "bio": [
      "Ahmad Shawqi was crowned Amir al-Shu‘ara (The Prince of Poets) in 1927 in Cairo. He revived the grand metric cadence of classical Arabic poetry while pioneering poetic drama and modern national lyricism.",
      "His monumental odes remain among the most celebrated compositions taught and recited throughout the Arab world."
    ],
    "works": [
      "Al-Shawqiyyat (4 volumes)",
      "Majnun Layla",
      "The Death of Cleopatra"
    ],
    "themes": [
      "Homeland",
      "Wisdom",
      "Education",
      "Heritage",
      "Arabic Pride"
    ],
    "sayings": [
      "قم للمعلم وفه التبجيلا كاد المعلم أن يكون رسولا",
      "وما نيل المطالب بالتمني ولكن تؤخذ الدنيا غلابا"
    ]
  },
  {
    "slug": "kahlil-gibran",
    "name": "Kahlil Gibran",
    "ar": "جبران خليل جبران",
    "years": "1883 – 1931",
    "place": "Bsharri, Lebanon / Boston, USA",
    "language": "bilingual",
    "era": "Modern",
    "tag": "Philosopher-poet of love, spiritual freedom and the immortal soul",
    "img": "poet-gibran",
    "pos": "center",
    "bio": [
      "Kahlil Gibran was a Lebanese-American poet, philosopher, and visual artist. He established the New York Pen League, infusing Arabic poetry with profound romantic spirituality and universal humanism.",
      "His iconic work “The Prophet” (1923) has touched millions around the globe with its timeless counsel on love, pain, freedom, and beauty."
    ],
    "works": [
      "The Prophet (1923)",
      "The Processions (المواكب, 1919)",
      "Broken Wings (1912)",
      "Sand and Foam (1926)"
    ],
    "themes": [
      "Spiritual Love",
      "Nature",
      "Freedom",
      "Music",
      "Truth"
    ],
    "sayings": [
      "أعطني الناي وغن فالغنا سر الوجود",
      "إنما الناس سطور كتبت لكن بمية"
    ]
  },
  {
    "slug": "jarir",
    "name": "Jarir",
    "ar": "جرير",
    "years": "650 – 728 CE",
    "place": "Yamama, Najd",
    "language": "ar",
    "era": "Umayyad",
    "tag": "The sweet lyricist of the Umayyad era whose elegies touch the heart",
    "img": "i2",
    "pos": "center",
    "bio": [
      "Jarir ibn Atiyah was one of the foremost poets of the Umayyad period. Renowned for his metrical purity and emotional delicacy, his love lyrics (ghazal) and elegies are celebrated in the ArPoT Classical Arabic Treebank.",
      "His famous verses depicting the bewitching eyes of the beloved are among the most quoted lines in Arabic literary history."
    ],
    "works": [
      "Diwan Jarir"
    ],
    "themes": [
      "Love",
      "Longing",
      "Elegies",
      "Desert Memory",
      "Musicality"
    ],
    "sayings": [
      "إن العيون التي في طرفها حور قتلننا ثم لم يحيين قتلانا"
    ]
  },
  {
    "slug": "edgar-allan-poe",
    "name": "Edgar Allan Poe",
    "years": "1809 – 1849",
    "place": "Boston / Baltimore, USA",
    "language": "en",
    "era": "Romantic",
    "tag": "Architect of the macabre, pure musicality and haunting melancholia",
    "img": "poet-poe",
    "pos": "center",
    "bio": [
      "Edgar Allan Poe was an American poet, critic, and editor whose hypnotic meter and haunting gothic themes created a new dimension in world literature. He believed poetry must strive toward melancholy beauty and melodic rhythm.",
      "Masterpieces such as “The Raven” and “Annabel Lee” remain universally recited touchstones of romantic verse."
    ],
    "works": [
      "The Raven and Other Poems (1845)",
      "Tamerlane and Other Poems (1827)",
      "The Philosophy of Composition (1846)"
    ],
    "themes": [
      "Melancholy",
      "Lost Love",
      "Mortality",
      "Night",
      "Eternity"
    ],
    "sayings": [
      "All that we see or seem is but a dream within a dream.",
      "Quoth the Raven: “Nevermore.”",
      "I was a child and she was a child, in this kingdom by the sea."
    ]
  },
  {
    "slug": "john-keats",
    "name": "John Keats",
    "years": "1795 – 1821",
    "place": "London / Rome",
    "language": "en",
    "era": "Romantic",
    "tag": "The sublime English Romantic who wrote of truth, autumn and eternity",
    "img": "poet-keats",
    "pos": "center",
    "bio": [
      "John Keats was one of the central figures of the second generation of English Romantic poets. Despite passing away at the young age of twenty-five, he composed the greatest philosophical odes in the English language.",
      "His Great Odes explore the boundary between human mortality and immortal artistic perfection with unmatched sensual richness."
    ],
    "works": [
      "Ode on a Grecian Urn (1819)",
      "Ode to a Nightingale (1819)",
      "To Autumn (1819)",
      "Endymion (1818)"
    ],
    "themes": [
      "Beauty",
      "Truth",
      "Nature",
      "Immortality",
      "Sensuousness"
    ],
    "sayings": [
      "Beauty is truth, truth beauty,—that is all ye know on earth, and all ye need to know.",
      "A thing of beauty is a joy for ever.",
      "Season of mists and mellow fruitfulness!"
    ]
  },
  {
    "slug": "percy-bysshe-shelley",
    "name": "Percy Bysshe Shelley",
    "years": "1792 – 1822",
    "place": "Horsham, England / Lerici, Italy",
    "language": "en",
    "era": "Romantic",
    "tag": "Visionary radical, lyric idealist and author of Ozymandias",
    "img": "poet-shelley",
    "pos": "center",
    "bio": [
      "Percy Bysshe Shelley was a major English Romantic poet whose passionate idealism, lyrical mastery, and prophetic imagination made him an enduring voice of human aspiration.",
      "His sonnet “Ozymandias” stands as the definitive meditation on the inevitable decay of empire, power, and tyrannical hubris before the sands of time."
    ],
    "works": [
      "Ozymandias (1818)",
      "Ode to the West Wind (1819)",
      "To a Skylark (1820)",
      "Prometheus Unbound (1820)"
    ],
    "themes": [
      "Liberty",
      "Time",
      "Fallen Empires",
      "Nature",
      "Idealism"
    ],
    "sayings": [
      "My name is Ozymandias, King of Kings; Look on my Works, ye Mighty, and despair!",
      "Poets are the unacknowledged legislators of the world."
    ]
  },
  {
    "slug": "william-shakespeare",
    "name": "William Shakespeare",
    "years": "1564 – 1616",
    "place": "Stratford-upon-Avon, England",
    "language": "en",
    "era": "Renaissance",
    "tag": "Playwright, dramatist and author of 154 immortal sonnets",
    "img": "i2",
    "pos": "center",
    "bio": [
      "William Shakespeare is celebrated as the greatest writer in the English language. His 154 sonnets, published in 1609, represent the summit of Renaissance lyric verse—fourteen lines, intricate rhyming patterns, and profound reflections on love and mortality.",
      "Sonnet 18 and Sonnet 116 are among the most revered and memorized poems in world literature."
    ],
    "works": [
      "Sonnets (1609)",
      "Venus and Adonis (1593)",
      "The Rape of Lucrece (1594)"
    ],
    "themes": [
      "Love",
      "Time",
      "Beauty",
      "Immortality"
    ],
    "sayings": [
      "So long as men can breathe or eyes can see, So long lives this, and this gives life to thee.",
      "Love is not love which alters when it alteration finds."
    ]
  },
  {
    "slug": "emily-dickinson",
    "name": "Emily Dickinson",
    "years": "1830 – 1886",
    "place": "Amherst, Massachusetts",
    "language": "en",
    "era": "Victorian",
    "tag": "The recluse who kept the whole sky in a room",
    "img": "i6",
    "pos": "center",
    "bio": [
      "Emily Dickinson spent almost her entire life in Amherst, Massachusetts, writing in near-secret. She left nearly 1,800 poems, of which only a handful appeared in print during her lifetime.",
      "Her poems are short, hymn-like, and piercingly visionary—using dashes for breath, precise slant rhymes, and a gaze that finds infinity in a bird or an afternoon shadow."
    ],
    "works": [
      "The Poems of Emily Dickinson"
    ],
    "themes": [
      "Hope",
      "Death",
      "Nature",
      "Solitude",
      "Eternity"
    ],
    "sayings": [
      "“Hope” is the thing with feathers that perches in the soul.",
      "Because I could not stop for Death – He kindly stopped for me."
    ]
  },
  {
    "slug": "william-blake",
    "name": "William Blake",
    "years": "1757 – 1827",
    "place": "London, England",
    "language": "en",
    "era": "Romantic",
    "tag": "Engraver, visionary, poet of innocence and experience",
    "img": "i4",
    "pos": "center 30%",
    "bio": [
      "William Blake was a London engraver, painter, and visionary poet who printed and illuminated his own books by hand. Unrecognized in his lifetime, he is now celebrated as one of the most original minds in British art.",
      "His Songs of Innocence and of Experience (1794) balances youthful wonder with the fierce moral consciousness of Experience."
    ],
    "works": [
      "Songs of Innocence and of Experience (1794)",
      "The Marriage of Heaven and Hell (1790)"
    ],
    "themes": [
      "Innocence",
      "Experience",
      "Mystery",
      "Nature",
      "Creation"
    ],
    "sayings": [
      "To see a World in a Grain of Sand And a Heaven in a Wild Flower.",
      "Tyger Tyger, burning bright, In the forests of the night."
    ]
  }
];

export const POEMS: Poem[] = [
  {
    "slug": "night-on-the-terrace",
    "title": "Night on the Terrace",
    "poet": "mahmoud-darwish",
    "language": "en",
    "era": "Modern",
    "img": "i1",
    "pos": "center 30%",
    "shape": "arch",
    "frame": "gilt",
    "orig": true,
    "tags": [
      "Love",
      "Night"
    ],
    "plate": "Moon, roses and two shadows",
    "about": "An original poem written for this site in the spirit of Darwish's love poetry, where tenderness always sits beside the knowledge of departure.",
    "text": "The moon leans on the garden wall\nlike a guest who has forgotten the hour.\nBelow, the roses lose their gold to dark\nand two shadows decide to be one shadow.\n\nYou say the stars are very far.\nI say: let them be far; they have no hands.\nHere is a shoulder, here is a cloak of silver thread,\nhere is the whole of what the night can promise.\n\nTomorrow the road will want its feet again,\nthe map its borders, the clock its argument.\nBut tonight the petals fall without a passport,\nand every door in us stands open to the sky."
  },
  {
    "slug": "the-man-who-walks-away-from-the-sea",
    "title": "The Man Who Walks Away From the Sea",
    "poet": "mahmoud-darwish",
    "language": "en",
    "era": "Modern",
    "img": "i5",
    "pos": "center",
    "shape": "oval",
    "frame": "gilt",
    "orig": true,
    "tags": [
      "Exile",
      "Memory"
    ],
    "plate": "A coat the colour of old soil",
    "about": "An original poem on exile, written for this site in the spirit of Darwish's themes of the key, the house and the sentence left unfinished.",
    "text": "He turns his collar up against a country of wind.\nThe gulls insist on staying; they have learned\nthat a coast is only a long goodbye.\n\nBehind him, a house keeps its lamp in the memory of a window.\nBefore him, a street that has not been told his name.\nHe carries a key that opens nothing now\nbut still opens everything when he holds it.\n\nAsk him where he is from. He will point\nat the salt in his hair, the red of the old soil on his coat,\nthe sentence he has not finished saying to the shore.\n\nExile is not a place, he thinks. It is a verb\nthat learns to conjugate in every language of rain,\nand the gulls, who owe no one a border, circle once\nand give him back the sky."
  },
  {
    "slug": "dreaming-a-country-the-size-of-the-moon",
    "title": "Dreaming a Country the Size of the Moon",
    "poet": "mahmoud-darwish",
    "language": "en",
    "era": "Modern",
    "img": "i3",
    "pos": "center 35%",
    "shape": "arch",
    "frame": "gilt",
    "orig": true,
    "tags": [
      "Homeland",
      "Dreams"
    ],
    "plate": "The painter asleep on his map",
    "about": "An original poem written for this site in the spirit of Darwish, for whom a homeland could survive as a drawing, a name, a field remembered stone by stone.",
    "text": "In the studio of sleep I paint a country\nno larger than a moon, and hang it where the ceiling forgets.\nIts rivers are pale chalk, its borders brushstrokes\nthat wash away when the morning asks questions.\n\nMy cheek rests on the map. The brushes keep watch.\nSomewhere a village is learning the names of its own stones,\nand a child is counting stars the way others count change.\n\nWake me gently, hour of the ordinary.\nLet me finish the last field, the last olive,\nbefore the world rubs its eyes\nand calls my homeland a dream."
  },
  {
    "slug": "on-this-earth-what-deserves-life",
    "title": "On This Earth What Deserves Life",
    "titleAr": "على هذه الأرض ما يستحق الحياة",
    "poet": "mahmoud-darwish",
    "language": "ar",
    "era": "Modern",
    "meter": "شعر التفعيلة",
    "img": "i5",
    "pos": "center 40%",
    "shape": "arch",
    "frame": "gilt",
    "orig": false,
    "tags": [
      "Homeland",
      "Life",
      "Freedom"
    ],
    "plate": "The morning apricot and olive tree",
    "about": "One of Darwish's most celebrated anthems: a luminous litany of everyday beauty, remembrance, and the enduring resilience of the human soul on its rightful soil.",
    "text": "عَلى هَذِهِ الأَرْضِ مَا يَسْتَحِقُّ الحَيَاةْ || تَرَدُّدُ إِبْرِيلَ، رَائِحَةُ الخُبْزِ فِي الفَجْرِ\nآرَاءُ امْرَأَةٍ فِي الرِّجَالِ، كِتَابَاتُ إِسْخِيلُوسَ || أَوَّلُ الحُبِّ، عُشْبٌ عَلَى حَجَرٍ\nأُمَّهَاتٌ تَقِفْنَ عَلَى خَيْطِ نَايٍ || وَخَوْفُ الغُزَاةِ مِنَ الذِّكْرَيَاتْ\n\nعَلى هَذِهِ الأَرْضِ مَا يَسْتَحِقُّ الحَيَاةْ || نِهَايَةُ أَيْلُولَ، سَيِّدَةٌ تَتْرُكُ الأَرْبَعِينَ بِكَامِلِ مِشْمِشِهَا\nسَاعَةُ الشَّمْسِ فِي السِّجْنِ، غَيْمٌ يُقَلِّدُ سِرْبًا مِنَ الكَائِنَاتْ || هُتَافَاتُ شَعْبٍ لِمَنْ يَصْعَدُونَ إِلَى حَتْفِهِمْ بَاسِمِينَ\nوَخَوْفُ الطُّغَاةِ مِنَ الأُغْنِيَاتْ\n\nعَلى هَذِهِ الأَرْضِ مَا يَسْتَحِقُّ الحَيَاةْ || عَلَى هَذِهِ الأَرْضِ سَيِّدَةُ الأَرْضِ\nأُمُّ البِدَايَاتِ، أُمُّ النِّهَايَاتِ || كَانَتْ تُسَمَّى فِلَسْطِينْ.. صَارَتْ تُسَمَّى فِلَسْطِينْ\nسَيِّدَتِي: أَسْتَحِقُّ، لأَنَّكِ سَيِّدَتِي، أَسْتَحِقُّ الحَيَاةْ"
  },
  {
    "slug": "the-horse-the-night-and-the-desert",
    "title": "The Horse, the Night and the Desert",
    "titleAr": "الخيل والليل والبيداء تعرفني",
    "poet": "al-mutanabbi",
    "language": "ar",
    "era": "Classical Abbasid",
    "meter": "بحر البسيط",
    "img": "i3",
    "pos": "center 30%",
    "shape": "rect",
    "frame": "carved",
    "orig": false,
    "tags": [
      "Pride",
      "Courage",
      "Chivalry",
      "Sword & Pen"
    ],
    "plate": "The knight of the desert sands",
    "about": "The most famous self-eulogy and martial proclamation in Arabic history. Composed in the majestic Bahr al-Basit meter, these immortal lines celebrate martial courage alongside the power of the written word.",
    "text": "الخَيلُ وَاللَيلُ وَالبَيداءُ تَعرِفُني || وَالسَيفُ وَالرُمحُ وَالقِرطاسُ وَالقَلَمُ\nصَحِبتُ في الفَلَواتِ الوَحشَ مُنفَرِداً || حَتّى تَعَجَّبَ مِنّي القورُ وَالأَكَمُ\nيا مَن يَعِزُّ عَلَينا أَن نُفارِقَهُم || وِجدانُنا كُلَّ شَيءٍ بَعدَكُم عَدَمُ\nما كانَ أَخلَقَنا مِنكُم بِتَكرِمَةٍ || لَو أَنَّ أَمرَكُمُ مِن أَمرِنا أَمَمُ\nإِن كانَ سَرَّكُمُ ما قالَ حاسِدُنا || فَما لِجُرحٍ إِذا أَرضاكُمُ أَلَمُ\nوَشَرُّ ما كَسَبَ الإِنسانُ ما وَصَمَت || بِهِ عَلَيهِ مَقالُ السوءِ وَالذَمَمُ"
  },
  {
    "slug": "to-the-extent-of-people-of-resolve",
    "title": "People of Resolve",
    "titleAr": "على قدر أهل العزم تأتي العزائم",
    "poet": "al-mutanabbi",
    "language": "ar",
    "era": "Classical Abbasid",
    "meter": "بحر الطويل",
    "img": "i1",
    "pos": "center 25%",
    "shape": "arch",
    "frame": "gilt",
    "orig": false,
    "tags": [
      "Honor",
      "Greatness",
      "Sayf al-Dawla",
      "Fortress of al-Hadath"
    ],
    "plate": "Golden fortress under mountain peaks",
    "about": "Mutanabbi's supreme panegyric commemorating Sayf al-Dawla's victory at the fortress of al-Hadath in 954 CE. The opening bayt is universally quoted across the Arab world.",
    "text": "عَلى قَدرِ أَهلِ العَزمِ تَأتي العَزائِمُ || وَتَأتي عَلى قَدرِ الكِرامِ المَكارِمُ\nوَتَعظُمُ في عَينِ الصَغيرِ صِغارُها || وَتَصغُرُ في عَينِ العَظيمِ العَظائِمُ\nيُكَلِّفُ سَيفُ الدَولَةِ الجَيشَ هَمَّهُ || وَقَد عَجَزَت عَنهُ الجُيوشُ الخَضارِمُ\nوَهَل رُدَّ أَمرٌ لِلإِلَهِ كَفَيتَهُ || بِعَزمٍ تَفُلُّ الحادِثاتِ الهَوازِمُ\nوَقَفتَ وَما في المَوتِ شَكٌّ لِواقِفٍ || كَأَنَّكَ في جَفنِ الرَدى وَهُوَ نائِمُ\nتَمُرُّ بِكَ الأَبطالُ كَلمى هَزيمَةً || وَوَجهُكَ وَضّاحٌ وَثَغرُكَ باسِمُ"
  },
  {
    "slug": "muallaqa-imru-al-qais",
    "title": "The Golden Mu‘allaqa",
    "titleAr": "قفا نبك من ذكرى حبيب ومنزل",
    "poet": "imru-al-qais",
    "language": "ar",
    "era": "Pre-Islamic",
    "meter": "بحر الطويل",
    "img": "i2",
    "pos": "center 40%",
    "shape": "arch",
    "frame": "gilt",
    "orig": false,
    "tags": [
      "The Golden Ode",
      "Desert",
      "Atlal",
      "Remembrance"
    ],
    "plate": "The windswept sands of Siqt al-Liwa",
    "about": "The paramount ode of pre-Islamic literature, the first of the legendary Hanging Odes (Al-Mu‘allaqat). Composed in Bahr al-Tawil, its opening weeping at the encampment ruins founded the classical tradition.",
    "text": "قِفا نَبكِ مِن ذِكرى حَبيبٍ وَمَنزِلِ || بِسِقطِ اللِوى بَينَ الدَخولِ فَحَومَلِ\nفَتوضِحَ فَالمِقراةِ لَم يَعفُ رَسمُها || لِما نَسَجَتها مِن جَنوبٍ وَشَمأَلِ\nتَرى بَعَرَ الأَرآمِ في عَرَصاتِها || وَقيعانِها كَأَنَّهُ حَبُّ فُلفُلِ\nكَأَنّي غَداةَ البَينِ يَومَ تَحَمَّلوا || لَدى سَمُراتِ الحَيِّ ناقِفُ حَنظَلِ\nوُقوفاً بِها صَحبي عَلَيَّ مَطِيَّهُم || يَقولونَ لا تَهلِك أَسىً وَتَجَمَّلِ\nوَإِنَّ شِفائي عَبرَةٌ مُهَراقَةٌ || فَهَل عِندَ رَسمٍ دارِسٍ مِن مُعَوَّلِ"
  },
  {
    "slug": "night-like-a-sea-wave",
    "title": "Night Like a Sea Wave",
    "titleAr": "وليل كموج البحر أرخى سدوله",
    "poet": "imru-al-qais",
    "language": "ar",
    "era": "Pre-Islamic",
    "meter": "بحر الطويل",
    "img": "i1",
    "pos": "center 30%",
    "shape": "oval",
    "frame": "gilt",
    "orig": false,
    "tags": [
      "Night",
      "Solitude",
      "Stars",
      "Cosmos"
    ],
    "plate": "Stars moored to the granite mountain",
    "about": "A celebrated movement from Imru' al-Qais's Mu‘allaqa describing the oppressive weight of the desert night, portrayed as an endless dark ocean whose stars appear tied to cliffs with ropes of hemp.",
    "text": "وَلَيلٍ كَمَوجِ البَحرِ أَرخى سُدولَهُ || عَلَيَّ بِأَنواعِ الهُمومِ لِيَبتَلي\nفَقُلتُ لَهُ لَمّا تَمَطّى بِصُلبِهِ || وَأَردَفَ أَعجازاً وَناءَ بِكَلكَلِ\nأَلا أَيُّها اللَيلُ الطَويلُ أَلا انجَلي || بِصُبحٍ وَما الإِصباحُ مِنكَ بِأَمثَلِ\nفَيا لَكَ مِن لَيلٍ كَأَنَّ نُجومَهُ || بِكُلِّ مُغارِ الفَتلِ شُدَّت بِيَذبُلِ\nكَأَنَّ الثُرَيّا عُلِّقَت في مَصامِها || بِأَمراسِ كَتّانٍ إِلى صُمِّ جَندَلِ"
  },
  {
    "slug": "muallaqa-antara",
    "title": "The Mu‘allaqa of Chivalry",
    "titleAr": "هل غادر الشعراء من متردم",
    "poet": "antara-ibn-shaddad",
    "language": "ar",
    "era": "Pre-Islamic",
    "meter": "بحر الكامل",
    "img": "i4",
    "pos": "center 25%",
    "shape": "rect",
    "frame": "carved",
    "orig": false,
    "tags": [
      "Chivalry",
      "The Mu‘allaqa",
      "Abla",
      "Valour"
    ],
    "plate": "The knight of the Abs tribe",
    "about": "Antarah's immortal Golden Ode in Bahr al-Kamil meter. It begins with the iconic contemplation on poetic originality and weaves together knightly honor with undying passion for Abla.",
    "text": "هَل غادَرَ الشُعَراءُ مِن مُتَرَدَّمِ || أَم هَل عَرَفتَ الدارَ بَعدَ تَوَهُّمِ\nيا دارَ عَبلَةَ بِالجِواءِ تَكَلَّمي || وَعَمي صَباحاً دارَ عَبلَةَ وَاِسلَمي\nفَوَقَفتُ فيها ناقتي وَكَأَنَّها || فَدَنٌ لِأَقضِيَ حاجَةَ المُتَلَوِّمِ\nإِذ لا أَرى شَيئاً أُريدُ كَأَنَّني || في مَوقِفٍ بَينَ السَحابِ الأَدهَمِ\nهَلّا سَأَلتِ الخَيلَ يا اِبنَةَ مالِكٍ || إِن كُنتِ جاهِلَةً بِما لَم تَعلَمي\nيُخبِركِ مَن شَهِدَ الوَقيعَةَ أَنَّني || أَغشى الوَغى وَأَعِفُّ عِندَ المَغنَمِ"
  },
  {
    "slug": "remembrance-amid-the-spears",
    "title": "Remembrance Amid the Spears",
    "titleAr": "ولقد ذكرتك والرماح نواهل",
    "poet": "antara-ibn-shaddad",
    "language": "ar",
    "era": "Pre-Islamic",
    "meter": "بحر الكامل",
    "img": "i4",
    "pos": "center 35%",
    "shape": "arch",
    "frame": "gilt",
    "orig": false,
    "tags": [
      "Love",
      "Battle",
      "Courage",
      "Swords"
    ],
    "plate": "Glittering steel in the dust of battle",
    "about": "Among the most tender and celebrated couplets in world literature: a warrior in the midst of blood and spears remembering the radiant smile of his beloved.",
    "text": "وَلَقَد ذَكَرتُكِ وَالرِماحُ نَواهِلٌ || مِنّي وَبيضُ الهِندِ تَقطُرُ مِن دَمي\nفَوَدِدتُ تَقبيلَ السُيوفِ لِأَنَّها || لَمَعَت كَبارِقِ ثَغرِكِ المُتَبَسِّمِ\nوَلَقَد شَفَى نَفسي وَأَبرَأَ سُقمَها || قِيلُ الفَوارِسِ وَيكَ عَنتَرَ أَقدِمِ\nمُهري لَهُ في كُلِّ يَومِ كَريهَةٍ || حِصنٌ حَصينٌ مِن كُلومِ الأَدهَمِ"
  },
  {
    "slug": "stand-for-the-teacher",
    "title": "Stand for the Teacher",
    "titleAr": "قم للمعلم وفه التبجيلا",
    "poet": "ahmad-shawqi",
    "language": "ar",
    "era": "Modern",
    "meter": "بحر الكامل",
    "img": "poet-shawqi",
    "pos": "center",
    "shape": "rect",
    "frame": "gilt",
    "orig": false,
    "tags": [
      "Knowledge",
      "Teacher",
      "Wisdom",
      "Education"
    ],
    "plate": "Illuminated inkwell and scroll",
    "about": "Ahmad Shawqi's monumental ode honoring educators, composed in 1927. The opening couplet comparing the teacher's noble mission to that of prophets is memorized across the Arab world.",
    "text": "قُم لِلمُعَلِّمِ وَفِّهِ التَبجيلا || كادَ المُعَلِّمُ أَن يَكونَ رَسولا\nأَعَلِمتَ أَشرَفَ أَو أَجَلَّ مِنَ الَّذي || يَبني وَيُنشِئُ أَنفُساً وَعُقولا\nسُبحانَكَ اللَهُمَّ خَيرَ مُعَلِّمٍ || عَلَّمتَ بِالقَلَمِ القُرونَ الأولى\nأَخرَجتَ هَذا العَقلَ مِن ظُلُماتِهِ || وَهَدَيتَهُ النورَ المُبينَ سَبيلا\nطَبَعَ الحَياةَ مَعاشِراً وَأَجَلَّهُم || سَيرُ المُعَلِّمِ هادِياً وَدَليلا"
  },
  {
    "slug": "give-me-the-flute",
    "title": "Give Me the Flute and Sing",
    "titleAr": "أعطني الناي وغن",
    "poet": "kahlil-gibran",
    "language": "ar",
    "era": "Modern",
    "meter": "بحر الرمل",
    "img": "poet-gibran",
    "pos": "center",
    "shape": "oval",
    "frame": "gilt",
    "orig": false,
    "tags": [
      "Music",
      "Nature",
      "Soul",
      "Mysticism"
    ],
    "plate": "Reed flute by the cedar mountain",
    "about": "From Gibran's philosophical masterwork “The Processions” (المواكب). Sung famously by Fairuz, it celebrates the flute as the timeless voice of nature and the eternal soul.",
    "text": "أَعطِني النّايَ وَغَنِّ || فَالغِنا سِرُّ الوُجود\nوَأَنينُ النّايِ يَبقى || بَعدَ أَن يَفنى الوُجود\nهَل تَخَذتَ الغابَ مِثلي || مَنزِلاً دونَ القُصور\nفَتَتَبَّعتَ السَواقي || وَتَسَلَّقتَ الصُخور\nهَل تَحَمَّمتَ بِعِطرٍ || وَتَنَشَّفتَ بِنور\nوَشَرِبتَ الفَجرَ خَمراً || في كُؤوسٍ مِن أَثير\nأَعطِني النّايَ وَغَنِّ || فَالغِنا خَيرُ صَلاة\nوَأَنينُ النّايِ يَبقى || بَعدَ أَن تَفنى الحَياة"
  },
  {
    "slug": "those-eyes-with-houri-glance",
    "title": "Those Eyes with Houri Glance",
    "titleAr": "إن العيون التي في طرفها حور",
    "poet": "jarir",
    "language": "ar",
    "era": "Umayyad",
    "meter": "بحر الوافر",
    "img": "i2",
    "pos": "center",
    "shape": "arch",
    "frame": "gilt",
    "orig": false,
    "tags": [
      "Love",
      "Ghazal",
      "ArPoT Corpus",
      "Eyes"
    ],
    "plate": "The veil and the desert blossom",
    "about": "From the ArPoT Classical Arabic Treebank corpus. One of the most famous love couplets in Arabic literature, praising the fragility yet immense power of beautiful eyes.",
    "text": "إِنَّ العُيونَ الَّتي في طَرفِها حَوَرٌ || قَتَلنَنا ثُمَّ لَم يُحيِينَ قَتلانا\nيَصرَعنَ ذا اللُبِّ حَتّى لا حِراكَ بِهِ || وَهُنَّ أَضعَفُ خَلقِ اللَهِ أَركانا\nيا حَبَّذا جَبَلُ الرَيّانِ مِن جَبَلٍ || وَحَبَّذا ساكِنُ الرَيّانِ مَن كانا\nوَحَبَّذا نَفَحاتٌ مِن يَمانِيَةٍ || تَأتيكَ مِن قِبَلِ الرَيّانِ أَحيانا"
  },
  {
    "slug": "the-raven",
    "title": "The Raven",
    "poet": "edgar-allan-poe",
    "language": "en",
    "era": "Romantic",
    "meter": "Trochaic Octameter",
    "img": "poet-poe",
    "pos": "center 20%",
    "shape": "rect",
    "frame": "carved",
    "orig": false,
    "tags": [
      "Melancholy",
      "Night",
      "Gothic",
      "Nevermore"
    ],
    "plate": "Bust of Pallas and the ebony bird",
    "about": "First published in 1845, Poe's supreme masterpiece of hypnotic musicality and grief. The talking raven visits a desolate student lamenting his lost Lenore, repeating only the solemn refrain: Nevermore.",
    "text": "Once upon a midnight dreary, while I pondered, weak and weary,\nOver many a quaint and curious volume of forgotten lore—\nWhile I nodded, nearly napping, suddenly there came a tapping,\nAs of some one gently rapping, rapping at my chamber door.\n“'Tis some visitor,” I muttered, “tapping at my chamber door—\nOnly this and nothing more.”\n\nAh, distinctly I remember it was in the bleak December;\nAnd each separate dying ember wrought its ghost upon the floor.\nEagerly I wished the morrow;—vainly I had sought to borrow\nFrom my books surcease of sorrow—sorrow for the lost Lenore—\nFor the rare and radiant maiden whom the angels name Lenore—\nNameless here for evermore.\n\nOpen here I flung the shutter, when, with many a flirt and flutter,\nIn there stepped a stately Raven of the saintly days of yore;\nNot the least obeisance made he; not a minute stopped or stayed he;\nBut, with mien of lord or lady, perched above my chamber door—\nPerched upon a bust of Pallas just above my chamber door—\nPerched, and sat, and nothing more.\n\nThen this ebony bird beguiling my sad fancy into smiling,\nBy the grave and stern decorum of the countenance it wore,\n“Though thy crest be shorn and shaven, thou,” I said, “art sure no craven,\nGhastly grim and ancient Raven wandering from the Nightly shore—\nTell me what thy lordly name is on the Night's Plutonian shore!”\nQuoth the Raven “Nevermore.”"
  },
  {
    "slug": "annabel-lee",
    "title": "Annabel Lee",
    "poet": "edgar-allan-poe",
    "language": "en",
    "era": "Romantic",
    "meter": "Anapestic / Iambic",
    "img": "poet-poe",
    "pos": "center",
    "shape": "arch",
    "frame": "gilt",
    "orig": false,
    "tags": [
      "Love",
      "Sea",
      "Angels",
      "Eternity"
    ],
    "plate": "The kingdom by the sounding sea",
    "about": "The last complete poem written by Edgar Allan Poe before his death in 1849. A timeless melody of love that neither angels in heaven nor demons below the sea can ever dissever.",
    "text": "It was many and many a year ago,\nIn a kingdom by the sea,\nThat a maiden there lived whom you may know\nBy the name of Annabel Lee;\nAnd this maiden she lived with no other thought\nThan to love and be loved by me.\n\nI was a child and she was a child,\nIn this kingdom by the sea,\nBut we loved with a love that was more than love—\nI and my Annabel Lee—\nWith a love that the winged seraphs of Heaven\nCoveted her and me.\n\nAnd this was the reason that, long ago,\nIn this kingdom by the sea,\nA wind blew out of a cloud, chilling\nMy beautiful Annabel Lee;\nSo that her highborn kinsmen came\nAnd bore her away from me,\nTo shut her up in a sepulchre\nIn this kingdom by the sea.\n\nFor the moon never beams, without bringing me dreams\nOf the beautiful Annabel Lee;\nAnd the stars never rise, but I feel the bright eyes\nOf the beautiful Annabel Lee;\nAnd so, all the night-tide, I lie down by the side\nOf my darling—my darling—my life and my bride,\nIn her sepulchre there by the sea—\nIn her tomb by the sounding sea."
  },
  {
    "slug": "ode-on-a-grecian-urn",
    "title": "Ode on a Grecian Urn",
    "poet": "john-keats",
    "language": "en",
    "era": "Romantic",
    "meter": "Iambic Pentameter",
    "img": "poet-keats",
    "pos": "center 30%",
    "shape": "rect",
    "frame": "gilt",
    "orig": false,
    "tags": [
      "Art",
      "Beauty",
      "Truth",
      "Eternity"
    ],
    "plate": "The marble piper and fair youth",
    "about": "Composed in May 1819, Keats's supreme meditation on art, time, and immortality. The scenes carved upon the urn remain forever frozen in youthful joy and unblemished spring.",
    "text": "Thou still unravish'd bride of quietness,\nThou foster-child of silence and slow time,\nSylvan historian, who canst thus express\nA flowery tale more sweetly than our rhyme:\nWhat leaf-fring'd legend haunts about thy shape\nOf deities or mortals, or of both,\nIn Tempe or the dales of Arcady?\nWhat men or gods are these? What maidens loth?\nWhat mad pursuit? What struggle to escape?\nWhat pipes and timbrels? What wild ecstasy?\n\nHeard melodies are sweet, but those unheard\nAre sweeter; therefore, ye soft pipes, play on;\nNot to the sensual ear, but, more endear'd,\nPipe to the spirit ditties of no tone:\nFair youth, beneath the trees, thou canst not leave\nThy song, nor ever can those trees be bare;\nBold Lover, never, never canst thou kiss,\nThough winning near the goal yet, do not grieve;\nShe cannot fade, though thou hast not thy bliss,\nFor ever wilt thou love, and she be fair!\n\nWhen old age shall this generation waste,\nThou shalt remain, in midst of other woe\nThan ours, a friend to man, to whom thou say'st,\n“Beauty is truth, truth beauty,”—that is all\nYe know on earth, and all ye need to know."
  },
  {
    "slug": "to-autumn",
    "title": "To Autumn",
    "poet": "john-keats",
    "language": "en",
    "era": "Romantic",
    "meter": "Iambic Pentameter",
    "img": "poet-keats",
    "pos": "center",
    "shape": "oval",
    "frame": "gilt",
    "orig": false,
    "tags": [
      "Autumn",
      "Harvest",
      "Seasons",
      "Ripeness"
    ],
    "plate": "Season of mists and cider-press",
    "about": "Written on September 19, 1819 following a walk near Winchester, England. Widely considered one of the most flawless and serene odes in the English language.",
    "text": "Season of mists and mellow fruitfulness,\nClose bosom-friend of the maturing sun;\nConspiring with him how to load and bless\nWith fruit the vines that round the thatch-eves run;\nTo bend with apples the moss'd cottage-trees,\nAnd fill all fruit with ripeness to the core;\nTo swell the gourd, and plump the hazel shells\nWith a sweet kernel; to set budding more,\nAnd still more, later flowers for the bees,\nUntil they think warm days will never cease,\nFor summer has o'er-brimm'd their clammy cells.\n\nWhere are the songs of spring? Ay, Where are they?\nThink not of them, thou hast thy music too,—\nWhile barred clouds bloom the soft-dying day,\nAnd touch the stubble-plains with rosy hue;\nThen in a wailful choir the small gnats mourn\nAmong the river sallows, borne aloft\nOr sinking as the light wind lives or dies;\nAnd full-grown lambs loud bleat from hilly bourn;\nHedge-crickets sing; and now with treble soft\nThe red-breast whistles from a garden-croft;\nAnd gathering swallows twitter in the skies."
  },
  {
    "slug": "ozymandias",
    "title": "Ozymandias",
    "poet": "percy-bysshe-shelley",
    "language": "en",
    "era": "Romantic",
    "meter": "Petrarchan / Iambic Sonnet",
    "img": "poet-shelley",
    "pos": "center 25%",
    "shape": "rect",
    "frame": "carved",
    "orig": false,
    "tags": [
      "Empire",
      "Time",
      "Desert",
      "Pride & Ruin"
    ],
    "plate": "Two vast and trunkless legs of stone",
    "about": "Published in January 1818, Shelley's legendary sonnet exposes the folly of worldly power and tyrannical empire before the boundless, level sands of time.",
    "text": "I met a traveller from an antique land,\nWho said—“Two vast and trunkless legs of stone\nStand in the desert. . . . Near them, on the sand,\nHalf sunk a shattered visage lies, whose frown,\nAnd wrinkled lip, and sneer of cold command,\nTell that its sculptor well those passions read\nWhich yet survive, stamped on these lifeless things,\nThe hand that mocked them, and the heart that fed;\nAnd on the pedestal, these words appear:\nMy name is Ozymandias, King of Kings;\nLook on my Works, ye Mighty, and despair!\nNothing beside remains. Round the decay\nOf that colossal Wreck, boundless and bare\nThe lone and level sands stretch far away.”"
  },
  {
    "slug": "sonnet-18",
    "title": "Sonnet 18",
    "poet": "william-shakespeare",
    "language": "en",
    "era": "Renaissance",
    "meter": "Shakespearean Sonnet",
    "img": "i2",
    "pos": "center",
    "shape": "rect",
    "frame": "carved",
    "orig": false,
    "tags": [
      "Love",
      "Summer",
      "Immortality"
    ],
    "plate": "A lake in late summer light",
    "about": "The most famous of the sonnets. The first eight lines argue that summer is the lesser thing; the last six promise that the poem itself will keep the beloved alive.",
    "text": "Shall I compare thee to a summer's day?\nThou art more lovely and more temperate:\nRough winds do shake the darling buds of May,\nAnd summer's lease hath all too short a date;\nSometime too hot the eye of heaven shines,\nAnd often is his gold complexion dimm'd;\nAnd every fair from fair sometime declines,\nBy chance or nature's changing course untrimm'd;\nBut thy eternal summer shall not fade,\nNor lose possession of that fair thou ow'st;\nNor shall death brag thou wander'st in his shade,\nWhen in eternal lines to time thou grow'st:\nSo long as men can breathe or eyes can see,\nSo long lives this, and this gives life to thee."
  },
  {
    "slug": "sonnet-116",
    "title": "Sonnet 116",
    "poet": "william-shakespeare",
    "language": "en",
    "era": "Renaissance",
    "meter": "Shakespearean Sonnet",
    "img": "i2",
    "pos": "center 30%",
    "shape": "arch",
    "frame": "gilt",
    "orig": false,
    "tags": [
      "True Love",
      "Constancy",
      "Time",
      "Ever-fixed Mark"
    ],
    "plate": "An ever-fixed mark upon the tempest",
    "about": "Shakespeare's definitive defense of unconditional, constant love: an ever-fixed mark that looks on tempests and is never shaken, outlasting time's bending sickle.",
    "text": "Let me not to the marriage of true minds\nAdmit impediments. Love is not love\nWhich alters when it alteration finds,\nOr bends with the remover to remove:\nO no! it is an ever-fixed mark\nThat looks on tempests and is never shaken;\nIt is the star to every wandering bark,\nWhose worth's unknown, although his height be taken.\nLove's not Time's fool, though rosy lips and cheeks\nWithin his bending sickle's compass come;\nLove alters not with his brief hours and weeks,\nBut bears it out even to the edge of doom.\nIf this be error and upon me prov'd,\nI never writ, nor no man ever lov'd."
  },
  {
    "slug": "hope-is-the-thing-with-feathers",
    "title": "“Hope” is the thing with feathers",
    "poet": "emily-dickinson",
    "language": "en",
    "era": "Victorian",
    "img": "i6",
    "pos": "center",
    "shape": "rect",
    "frame": "none",
    "orig": false,
    "tags": [
      "Hope",
      "Nature",
      "Soul"
    ],
    "plate": "A dark bird, a patient hand",
    "about": "One of Dickinson's best-loved poems: three stanzas that turn an abstraction into a small bird that asks for nothing.",
    "text": "“Hope” is the thing with feathers —\nThat perches in the soul —\nAnd sings the tune without the words —\nAnd never stops — at all —\n\nAnd sweetest — in the Gale — is heard —\nAnd sore must be the storm —\nThat could abash the little Bird\nThat kept so many warm —\n\nI've heard it in the chillest land —\nAnd on the strangest Sea —\nYet — never — in Extremity,\nIt asked a crumb — of me."
  },
  {
    "slug": "because-i-could-not-stop-for-death",
    "title": "Because I could not stop for Death",
    "poet": "emily-dickinson",
    "language": "en",
    "era": "Victorian",
    "img": "i6",
    "pos": "center 30%",
    "shape": "arch",
    "frame": "gilt",
    "orig": false,
    "tags": [
      "Mortality",
      "Carriage",
      "Eternity"
    ],
    "plate": "The carriage passing the setting sun",
    "about": "Dickinson's masterpiece personifying Death as a courteous gentleman taking the speaker on a slow carriage ride past childhood, fields of grain, and toward eternity.",
    "text": "Because I could not stop for Death –\nHe kindly stopped for me –\nThe Carriage held but just Ourselves –\nAnd Immortality.\n\nWe slowly drove – He knew no haste\nAnd I had put away\nMy labor and my leisure too,\nFor His Civility –\n\nWe passed the School, where Children strove\nAt Recess – in the Ring –\nWe passed the Fields of Gazing Grain –\nWe passed the Setting Sun –\n\nSince then – 'tis Centuries – and yet\nFeels shorter than the Day\nI first surmised the Horses' Heads\nWere toward Eternity –"
  },
  {
    "slug": "the-sick-rose",
    "title": "The Sick Rose",
    "poet": "william-blake",
    "language": "en",
    "era": "Romantic",
    "img": "i4",
    "pos": "center 30%",
    "shape": "oval",
    "frame": "gilt",
    "orig": false,
    "tags": [
      "Love",
      "Secrecy",
      "Experience"
    ],
    "plate": "A woman against the storm",
    "about": "From Songs of Experience (1794). Eight lines, one rose, one worm: readers have found in it disease, desire, jealousy and the harm done by secret love.",
    "text": "O Rose, thou art sick!\nThe invisible worm\nThat flies in the night,\nIn the howling storm,\n\nHas found out thy bed\nOf crimson joy,\nAnd his dark secret love\nDoes thy life destroy."
  },
  {
    "slug": "the-tyger",
    "title": "The Tyger",
    "poet": "william-blake",
    "language": "en",
    "era": "Romantic",
    "meter": "Trochaic Tetrameter",
    "img": "i4",
    "pos": "center",
    "shape": "rect",
    "frame": "carved",
    "orig": false,
    "tags": [
      "Creation",
      "Mystery",
      "Fire",
      "Experience"
    ],
    "plate": "Burning bright in the forest of the night",
    "about": "From Songs of Experience (1794). Blake marvels at the fierce, dread beauty of the tiger and asks the eternal question: Did He who made the Lamb make thee?",
    "text": "Tyger Tyger, burning bright,\nIn the forests of the night;\nWhat immortal hand or eye,\nCould frame thy fearful symmetry?\n\nIn what distant deeps or skies.\nBurnt the fire of thine eyes?\nOn what wings dare he aspire?\nWhat the hand, dare seize the fire?\n\nAnd what shoulder, & what art,\nCould twist the sinews of thy heart?\nAnd when thy heart began to beat,\nWhat dread hand? & what dread feet?\n\nWhen the stars threw down their spears\nAnd water'd heaven with their tears:\nDid he smile his work to see?\nDid he who made the Lamb make thee?\n\nTyger Tyger burning bright,\nIn the forests of the night:\nWhat immortal hand or eye,\nDare frame thy fearful symmetry?"
  }
];

export function getPoet(slug: string): Poet | undefined {
  return POETS.find((p) => p.slug === slug);
}

export function getPoem(slug: string): Poem | undefined {
  return POEMS.find((p) => p.slug === slug);
}

export function getPoemsByPoet(poetSlug: string): Poem[] {
  return POEMS.filter((p) => p.poet === poetSlug);
}

export function stripTags(str: string): string {
  return str.replace(/&[a-z]+;/g, " ").replace(/<[^>]+>/g, "");
}
