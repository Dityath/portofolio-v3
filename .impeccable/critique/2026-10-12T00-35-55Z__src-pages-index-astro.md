---
target: seluruh portofolio (homepage + semua route)
total_score: 22
max_score: 36
na_heuristics: 10
p0_count: 0
p1_count: 5
target_identity: "file:/Volumes/dityath-workspace/Projects/portofolio/src/pages/index.astro"
target_fingerprint: "sha256:39c433836aca4e8bf5d45aa6fc1aba647585c947f5c2ce782ae4f745a28785ce"
target_path: /Volumes/dityath-workspace/Projects/portofolio/src/pages/index.astro
timestamp: 2026-10-12T00-35-55Z
slug: src-pages-index-astro
---
⚠️ DEGRADED: single-context (harness hanya mengizinkan sub-agent atas permintaan eksplisit user; review desain diselesaikan dulu, detector dijalankan sesudahnya)

Cakupan: semua route dari dist/ (build 2026-10-12 07:11). 107 screenshot di 12 viewport (1440×900, 1366×768, 1280×720, 1024×768, 834×1194, 390×844, 375×667, 360×740, simulasi area terlihat browser HP 390×664 / 375×553 / 360×640, landscape 844×390), reduced-motion, tes keyboard, axe-core, detector impeccable. Bukti: .impeccable/review/ux-audit-2026-10-12/ (gitignored).

## Skor heuristik
| # | Heuristik | Skor | Isu utama |
|---|---|---|---|
| 1 | Visibility of system status | 3 | Rail progres + label chapter bagus di ≥1200px; di bawahnya label hilang; rail karya mobile tanpa indikator posisi |
| 2 | Match system / real world | 2 | Nama tidak terlihat, judul berganti 5×, "DITYATH / WORKSPACE" terbaca seperti produk, pengalaman tidak kronologis |
| 3 | User control & freedom | 2 | 7,3 layar animasi sebelum karya; Back setelah "See the work" tidak kembali ke atas; label rail tidak bisa diklik |
| 4 | Consistency & standards | 3 | Sistem visual konsisten; tepi kiri rail 48px vs 112px, lompat instan vs fly-through, penamaan Work/case notes |
| 5 | Error prevention | 2 | Satu-satunya jalur kontak = mailto ke email yang belum diverifikasi, tanpa fallback copy |
| 6 | Recognition vs recall | 2 | 2 dari 3 proyek tersembunyi di scroller horizontal mobile tanpa petunjuk |
| 7 | Flexibility & efficiency | 2 | Skimmer harus scroll 15,5 layar ke kontak; versi statis cuma 6,6 layar |
| 8 | Aesthetic & minimalist | 3 | Craft tinggi; plate besar berisi gambar abstrak kecil, label ganda, layar ujung rail kosong |
| 9 | Error recovery | 3 | 404 bagus; Writing menampilkan error build; mailto gagal tanpa umpan balik |
| 10 | Help & documentation | n/a | Portfolio |
| Total | | 22/36 (61%) | Acceptable |

## Verdict spesifisitas
Manual: sangat spesifik (gambar kerja beranotasi, dua tinta, bust digambari 4 langkah). Generik: scramble judul berputar, plate abstrak.
Detector CLI: 7 (5 font-size off-ramp — 0.9375rem terdokumentasi = FP, 0.875rem header Contact = valid kecil; 1 warna bayangan bust = FP; 1 overused Inter = owner-pinned, brief menang). Browser headless: home 14, home-m 15, work 15, case 3, about 4 — mayoritas FP (overflow list .moves visually-hidden, panel rail off-screen, leading display); valid: uppercase mono panjang, em-dash di rentang tanggal. Detector tidak menangkap satu pun masalah prioritas.

## Masalah prioritas
1. [P1] Clipping cerita di HP layar pendek — stage pinned overflow:clip (global.css:296-301), bust 48% (Story.astro:904). Terpotong: iPhone SE Safari 375×553 hero 40px (CTA hilang), chapter 62–88px; Android 360×640 17–43px; 375×667 3–29px; landscape 844×390 hero 113px, chapter 128–154px. Fix: matikan pin di max-height pendek seperti Path.astro:131. → /impeccable adapt
2. [P1] Identitas tidak konsisten — nama hanya sr-only (Story.astro:95), nama terlihat pertama di footer (±14.900px); h1 berputar 5 peran tiap ±3,6 dtk; OG image masih "SOFTWARE ENGINEER — Practical systems, AI workflows, and infrastructure." (public/og.png, scripts/build-og.mjs:41-44). → /impeccable clarify
3. [P1] Karya terlalu jauh — 16,6 layar (statis 6,6); karya di 7,3 layar, kontak 15,5; story 720vh (Story.astro:81, DESIGN.md bilang 560vh); "See the work" mendarat di kartu judul; Back bug (pushState setelah scroll, Story.astro:395); mobile rail: proyek 1 terlihat 24%, 2–3 0%. → /impeccable distill + /impeccable layout
4. [P1] Bukti karya lemah — plate abstrak generik (±1.240×590px, gambar ±360px); label "2021–2022" salah (WorkRail.astro:7, work/index.astro:19) vs SEAN-CSO 2022–23; tidak ada case era lead (2024–kini); artefak "Leaves behind" tidak pernah ditunjukkan; tanpa link luar. → /impeccable shape
5. [P1] Jalur kontak rapuh — mailto:hello@dityath.dev (Contact.astro:17) masih TODO verifikasi (site.ts:8-9); tanpa copy fallback/konfirmasi; tanpa subject di homepage. → /impeccable harden

## Persona
- Founder produk macet (persona proyek): preview "Software Engineer · AI" → judul berganti → nama tak ditemukan → 7 layar metode → karya 2021–2022 abstrak → mailto.
- Casey (mobile): CTA terpotong di iPhone SE, "Leaves behind" terpotong, 7,3 layar sebelum karya, swipe horizontal tanpa petunjuk, menu tanpa backdrop.
- Jordan (first-timer): label rail seperti daftar isi tapi tidak bisa diklik; link profil di kontak terlihat seperti label; istilah "case notes".
- Recruiter (persona sekunder): tanpa CV; pengalaman dikelompokkan per fase (IT Officer 2022 di "Lead", UI/UX Dev 2024 di "Design"); "since 2018" vs "2021 — now".

## Temuan lain
P2: Writing menampilkan "The feed couldn't be loaded when this site was built." (feed sekarang bisa diakses, 4 artikel; kegagalan lolos diam-diam); Experience tidak kronologis + tanpa CV; tablet portrait pakai layout HP (ruang kosong besar).
P3: tepi kiri rail x=48 vs 112 (WorkRail.astro:158); ujung rail layar kosong; tinggi panel rail beda (judul geser 27px); label FRAME..BUILD dobel di hero; mode statis menumpuk 4 gambar; titik BUILD di dalam sel grid; cabang "ditolak" Decide hampir tak terlihat; callout redup ±2,2:1; link profil kontak bergaya metadata + dobel di footer; Contact header fly-through ±13.000px dalam ±1,5 dtk; indent hero mobile 24px; menu mobile tanpa backdrop (konten di bawahnya tetap terang); CTA case sekunder di bawah pager; Stack berisi tag non-stack; penamaan Work/case notes/All work campur; uppercase mono panjang; em-dash di rentang tanggal; Services tanpa sinyal durasi/harga & tanpa tautan ke case.

## Pertanyaan
- Kalau founder cuma memberi 60 detik, apa yang dia lihat? Sekarang: 4 chapter metode, nol karya.
- Bagaimana kalau 4 langkah diceritakan lewat satu proyek nyata, sehingga metode = bukti?
- Satu peran + nama yang tegas, atau 5 peran berputar — mana yang bisa dipertanggungjawabkan dalam percakapan?
- Bisakah artefak "Leaves behind" ditampilkan versi yang disamarkan?
