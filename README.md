# LifeWatch România · site public și LTSER Explorer

Proiectul are două părți, construite cu același sistem de design:

- **Site-ul public** (`/`): prezentarea infrastructurii, cele patru stații de cercetare,
  cele șase platforme LTSER, catalogul de date, documentația API, rețeaua, proiectele,
  întrebările frecvente și contactul. Conținutul pornește de la faptele publicate pe
  lifewatch.ro, rescrise integral (textele de acolo nu au fost copiate). Paginile sunt
  prerandate în HTML static, deci se indexează bine și se afișează înainte de JavaScript.
- **Exploratorul LTSER** (`/explorator/`), descris mai jos.

### Site-ul public

| Pagină | Adresă |
| --- | --- |
| Acasă | `/` |
| Despre (misiune, obiective, infrastructuri europene, istoric, credite foto) | `/despre/` |
| Infrastructură și cele patru stații | `/infrastructura/`, `/infrastructura/{braila,sfantu-gheorghe,sinaia,orsova}/` |
| Platforme LTER și LTSER și cele șase platforme | `/platforme/`, `/platforme/{delta-dunarii,insulele-brailei,neajlov,bucegi-piatra-craiului,rodna-calimani,retezat}/` |
| Catalog de date, API, documentație | `/date/`, `/date/api/`, `/date/documentatie/` |
| Servicii, rețea, proiecte | `/servicii/`, `/retea/`, `/proiecte/` |
| Întrebări frecvente, contact | `/intrebari-frecvente/`, `/contact/` |

Fiecare stație, platformă și set de date are legături directe către ecranul potrivit din
explorator (de exemplu `/explorator/#/retele/meteo?statie=MH-Ors`). Căutarea `⌘K` acoperă
pagini, stații, platforme, seturi de date și întrebări, fără să țină cont de diacritice.

Conținutul se editează în `src/site/content/` (organizație, stații, platforme,
proiecte, date și API, întrebări). Paginile noi se adaugă în `src/site/routes.tsx`.

## LTSER Explorer

Aplicație web care reunește funcționalitatea a două proiecte:

- [alexdum/ltser](https://github.com/alexdum/ltser): aplicația R Shiny „LTSER Explorer”
  (teledetecție, rețele LifeWatch, metadate, indicatori sociali);
- [GabrielMajeri/lifewatch-romania](https://github.com/GabrielMajeri/lifewatch-romania):
  platforma de date LifeWatch (FastAPI + TimescaleDB) și interfața ei Next.js.

Interfața nu conține logică de server. Datele vin din două servicii HTTP:

| Serviciu | Stare | Ce oferă |
| --- | --- | --- |
| **API LifeWatch** (FastAPI, din `lifewatch-romania`) | Există și se folosește neschimbat. | Stații, variabile, măsurători brute, disponibilitate. |
| **API LTSER** (descris în [docs/API_CONTRACT.md](docs/API_CONTRACT.md)) | **Nu există încă.** | Teledetecție, agregate meteo și eddy covariance, indicatori sociali, imagini. |

Browserul nu apelează serviciile direct. Pagina cere datele de la propria adresă, la
`/lifewatch-api/` și `/ltser-api/`, iar un proxy le trimite mai departe. Astfel API-urile
nu au nevoie de CORS, exact ca în aplicațiile originale. Cât timp un serviciu nu răspunde,
aplicația trece automat pe **date demonstrative** generate local, cu aceleași formate JSON,
și afișează eticheta „Date demonstrative” pe fiecare ecran.

## Pornire locală

Este nevoie de Node.js 20 sau mai nou.

```bash
npm ci
npm run dev
```

Site-ul pornește la <http://127.0.0.1:5173/>, exploratorul la
<http://127.0.0.1:5173/explorator/>. Serverul Vite face și proxy:
`/lifewatch-api/` către `http://127.0.0.1:8000`, `/ltser-api/` către
`http://127.0.0.1:8001/api/v1`. Pentru alte adrese, copiați `.env.example` în
`.env.local` și modificați valorile.

Local, serverul ascultă doar pe `127.0.0.1:5173`. Într-un mediu găzduit (v0, Codespaces, un
container) care setează variabila `PORT`, ascultă pe toate interfețele și acceptă domeniul
mediului. `HOST` și `PORT` se pot seta și explicit.

## Build și instalare

```bash
npm run build
```

Build-ul are trei pași: verificarea tipurilor și build-ul Vite (site și explorator), un
build SSR al site-ului și scriptul `scripts/prerender.mjs`, care scrie câte un `index.html`
pentru fiecare pagină, plus `404.html`. Cu `SITE_ORIGIN=https://domeniu.ro npm run build`
se generează și `sitemap.xml`. Cu `BASE_PATH=/subcale/` totul se servește dintr-o subcale.

Rezultatul static este în `dist`. Configurația nginx completă, cu proxy către cele
două servicii, pagina 404 și cache potrivit pentru fișierele cu hash, este în
[deploy/nginx.conf.example](deploy/nginx.conf.example).

La instalare se editează doar `dist/runtime-config.js` (sursa: `public/runtime-config.js`):
adresele serviciilor, modul de lucru (`auto`, `live`, `demo`) și hărțile de bază. Pentru o
singură vizită, `?mod=demo` sau `?mod=live` în adresa paginii suprascrie modul.

## Ce conține

| Ecran | Corespondent în aplicațiile originale |
| --- | --- |
| Prezentare | Nou: hartă SVG a zonelor și stațiilor, starea serviciilor, temperatura din ultima oră, galeria celor șase zone. |
| Teledetecție · Nivel național | `ui_national.R`: raster SSM, NDVI, FAPAR pe zonele LTSER, transparență, click pentru valoare sau serie, GeoTIFF. |
| Teledetecție · Unități administrative | `ui_admin.R`: hartă coropletă pe zone LTSER sau UAT, serie lunară, GeoJSON. |
| Rețele · Stații meteo | `ui_data_ws.R`: orar sau zilnic, 15 parametri, grafic cu două axe pe 7 sau 31 de zile, tabel cu copiere, CSV, Excel. |
| Rețele · Eddy covariance | `ui_data_ec.R`: semi-orar, 7 parametri, grafic pe 7 zile, imaginea camerei, tabel exportabil. |
| Rețele · Metadate | `ui_metadata.R`: cele șase rețele, descrieri, tabelul stațiilor, fișa și fotografia fiecărei stații. |
| Platforma de date · Explorator stații | `web-ui` Next.js: stații pe tipuri, `?statie=ID`, fișa stației, toate variabilele; în plus ferestre de până la 7 zile, 4 variabile comparate, CSV. |
| Platforma de date · Disponibilitate | Ruta `GET /stations/snapshot` a API-ului, nefolosită de interfața Next.js. |
| Indicatori sociali | `ui_social.R`: populație după domiciliu (an, sex, vârstă) și emigranți definitivi, pe UAT. |
| Despre | Pagina „About” (în original „TBA”): module, starea serviciilor, surse, credite foto. |

Paleta de comenzi (`⌘K` sau `Ctrl K`) duce la orice secțiune, zonă LTSER sau stație.
Interfața exploratorului este în română și engleză.

### Culori și teme

Paleta vine din sigla LifeWatch ERIC: bleumarin `#254380` (culoarea principală), portocaliu
`#D55A2B`, verde `#398346`, turcoaz `#4AA4A6` și nisipiu `#E49950`. Tokenurile sunt în
`src/index.css` (`--brand-*`, utilitarele `bg-brand-green`, `text-brand-orange` etc.).
Seriile din grafice și culorile rețelelor de stații folosesc aceeași paletă.

Site-ul și exploratorul au mod luminos și întunecat. Alegerea se face din butonul din antet,
din subsol sau din bara laterală a exploratorului (Sistem, Luminos, Întunecat), se păstrează
în browser și se aplică înainte de prima afișare, fără pâlpâire.

## Tehnologii

- React 19, TypeScript strict, Vite 7.
- Tailwind CSS 4 cu tokenuri proprii, `clsx` + `tailwind-merge` (`cn()`), `class-variance-authority`.
- Radix UI (dialog, popover, select, tooltip, slider, checkbox), `cmdk`, `sonner`.
- Motion pentru tranziții și indicatori animați, `lucide-react` pentru pictograme.
- Recharts 3 pentru grafice, cu reducerea seriilor lungi prin algoritmul LTTB.
- Leaflet 1.9 pentru hărți, cu controale proprii în React.
- Fonturile Geist și Geist Mono, incluse în build (fără apeluri către Google Fonts).

Paletele și clasele hărților reproduc exact funcțiile R (`RColorBrewer`, `colorRampPalette`,
`pretty`, `findInterval`, `leaflet::colorBin`); rezultatele au fost comparate cu R.
Exporturile Excel, GeoTIFF, GeoJSON, CSV și PNG sunt generate în browser.

## Structura

```
index.html                  pagina site-ului (șablon pentru prerandare)
explorator/index.html       pagina exploratorului
scripts/prerender.mjs       scrie HTML static pentru fiecare pagină a site-ului
scripts/make_basemap.py     generează contururile României și ale vecinilor pentru hărțile SVG
public/                     runtime-config.js, favicon, geometrii LTSER și UAT, stațiile rețelelor
src/
  site/                     site-ul public: router pe căi, pagini, conținut, componente, intrări client și SSR
  api/                      clienți tipizați (lifewatch.ts, ltser.ts), stare servicii, date demonstrative (mock/)
  components/ui/            primitive: button, card, select, segmented, dialog, popover, tooltip, photo
  components/map/           Leaflet în React: straturi, legendă, raster reproiectat
  components/charts/        panou de serii de timp (Recharts) și sparkline
  components/               înveliș, paletă de comenzi, tabel de date, selector de timp
  lib/                      palete, geometrie, formatare, exporturi, i18n, catalog, fotografii
  views/                    câte un fișier pentru fiecare ecran
docs/API_CONTRACT.md        contractul serviciului LTSER
deploy/nginx.conf.example   configurație nginx pentru producție
```

## Hărți

Hărțile SVG ale site-ului și ilustrația din prezentarea exploratorului desenează România, țările
vecine și Marea Neagră după granițele Natural Earth 1:50m (domeniu public). Contururile sunt
precalculate în `src/lib/basemap.ts` de `scripts/make_basemap.py`, cu aceeași
proiecție ca hărțile; scriptul se rulează din nou doar dacă se schimbă cadrul hărții.

Hărțile Leaflet din explorator folosesc câte un strat de fundal pentru fiecare temă și le comută
prin adăugare și eliminare. Schimbarea adresei unui strat cu `setUrl()` cerea plăcile la zoom
fracționar, iar serverul Esri le servea pentru altă zonă.

## Fotografii

Fotografiile zonelor și ale stațiilor provin de pe Unsplash și sunt folosite sub licența
Unsplash. Locația fiecăreia a fost verificată pe pagina fotografiei. Autorul și locația sunt
în `src/lib/photos.ts` și pe pagina „Despre” a site-ului. Pentru stații se pot folosi
oricând fotografii proprii: se înlocuiesc intrările din `STATION_PHOTOS`.

## Corecturi aplicate datelor stațiilor

`public/data/networks.json` provine din fișierele `*.geojson` ale aplicației Shiny, cu:

- redenumirile din `global.R`: `IF-Cor` afișat ca `GR-Mih` (Mihăilești, Giurgiu) și `IF-Ste`
  ca `IL-Lil` (Lilieci, Ialomița); câmpul `dataId` păstrează codul din date;
- diacriticele refăcute (Brăila, Argeș, Orșova, Drăgănești-Vlașca etc.);
- localitate și județ inversate corectate la BH-Pad, IF-Ste și TL-Sfg (CUV5), TL-Sfg (RaZON+),
  COM (eddy covariance) și GR-Com (stații meteo); localitatea stației IMB corectată în Brăila;
- câmpurile de contact (nume și telefoane) eliminate, fiindcă nu erau afișate nici în original.

## Ce urmează

1. Implementarea serviciului LTSER după [docs/API_CONTRACT.md](docs/API_CONTRACT.md),
   de exemplu un serviciu FastAPI care citește fișierele NetCDF și Parquet ale aplicației Shiny.
2. Publicarea build-ului cu configurația nginx din `deploy/`, ajustată la adresele serviciilor.
3. Verificarea conținutului site-ului de către echipă: texte, telefoane, fotografii proprii ale
   stațiilor și sigla oficială, care pot înlocui fotografiile Unsplash și semnul grafic actual.
4. Curățarea site-ului lifewatch.ro existent înainte de înlocuire: paginile lui conțin
   reclame de cazinou injectate, semn al unui WordPress compromis.
