# Qafiyah (قافية) Integration

## Overview
**Qafiyah** (`raaqimorg/qafiyah`) is a comprehensive digital corpus and prosodic engine for Arabic poetry, encompassing over 17,000 poems, classical meter analysis (Arud), rhyme classifications (Qafiyah), and high-resolution historical avatars for classical and modern poets.

## Architecture
- **API Base URL**: `https://api.qafiyah.com/v1/`
- **CDN Base URL**: `https://cdn.qafiyah.com/`
- **Search Endpoint**: `GET /v1/search?q={query}` (supports poet, poem, and meter discovery)
- **Poet Avatar CDN**: `GET https://cdn.qafiyah.com/poets/{poet_slug}/avatar.webp`
- **Poem Endpoint**: `GET /v1/poems/{poem_slug}`

## Integrated Masters in Poem World
| Poet | Arabic Name | Slug | Era |
| :--- | :--- | :--- | :--- |
| Imru' al-Qais | امرؤ القيس | `iNUk` | جاهلي |
| Antarah ibn Shaddad | عنترة بن شداد | `imHZ` | جاهلي |
| Tarafa ibn al-Abd | طرفة بن العبد | `BVAn` | جاهلي |
| Zuhayr ibn Abi Sulma | زهير بن أبي سلمى | `PAKT` | جاهلي |
| Al-Khansa | الخنساء | `lVwP` | إسلامي |
| Jarir | جرير | `nswB` | أموي |
| Al-Farazdaq | الفرزدق | `NqYP` | أموي |
| Majnun Layla | قيس بن الملوح | `Lmub` | أموي |
| Jamil Buthayna | جميل بثينة | `OsSF` | أموي |
| Abu Nuwas | أبو نواس | `tQHW` | عباسي |
| Al-Mutanabbi | أبو الطيب المتنبي | `tzXD` | عباسي |
| Abu Tammam | أبو تمام | `GuRy` | عباسي |
| Al-Ma'arri | أبو العلاء المعري | `ufPs` | فاطمي |
| Al-Hallaj | الحلاج | `yUTQ` | عباسي |
| Ibn Zaydun | ابن زيدون | `TLDO` | أندلسي |
| Ahmad Shawqi | أحمد شوقي | `fusa` | حديث |
| Kahlil Gibran | جبران خليل جبران | `ocDM` | حديث |
| Badr Shakir al-Sayyab | بدر شاكر السياب | `PaSE` | حديث |
| Nizar Qabbani | نزار قباني | `tgKc` | حديث |
| Mahmoud Darwish | محمود درويش | `Idfr` | معاصر |

## Client Usage
Use the high-speed live bridge in `src/components/Diwan.tsx` to search over 17,000+ poems in real time.
