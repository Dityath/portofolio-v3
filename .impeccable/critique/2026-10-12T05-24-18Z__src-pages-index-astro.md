---
target: homepage portofolio (cek ulang setelah perbaikan)
total_score: 27
max_score: 36
na_heuristics: 10
p0_count: 1
p1_count: 1
target_identity: "file:/Volumes/dityath-workspace/Projects/portofolio/src/pages/index.astro"
target_fingerprint: "sha256:39c433836aca4e8bf5d45aa6fc1aba647585c947f5c2ce782ae4f745a28785ce"
target_path: /Volumes/dityath-workspace/Projects/portofolio/src/pages/index.astro
timestamp: 2026-10-12T05-24-18Z
slug: src-pages-index-astro
---
⚠️ DEGRADED: single-context (sub-agent hanya boleh dipakai kalau user minta langsung; review desain selesai dulu, detector sesudahnya)

# Cek ulang UI/UX homepage — 12 Okt 2026 (re-check setelah perbaikan owner)

Belum semuanya. Dari 5 masalah prioritas sebelumnya: 2 beres penuh, 2 sebagian, 1 belum. Dunia visualnya tetap spesifik (bust + anotasi dua tinta), tidak berubah jadi template. Masalah baru terbesar: domain dityath.dev belum terdaftar.

Metode: build baru dari source (ke .impeccable/review/ux-recheck-2026-10-12/build, dihapus setelahnya), 15 viewport (13 pinned: 1440×900, 1366×657, 1280×600, 1024×768, 834×1112, 768×1024, 390×844, 390×664, 375×667, 375×629, 414×622, 360×640, 360×600; 2 statis: 375×553, 844×390), interaksi (See the work, Back, header Contact, copy, tick rail, menu), axe, detector CLI + browser. biome ci, tsc, build lolos. Tidak ada kode diubah (fingerprint sama). Bukti 01–18 di .impeccable/review/ux-recheck-2026-10-12/.

## [P0] Domain dityath.dev belum ada
- RDAP registry .dev: "dityath.dev not found"; DNS NXDOMAIN.
- hello@dityath.dev (satu-satunya email: Contact, footer, service) pasti bounce. site.ts:8 masih TODO.
- astro.config.mjs site 'https://dityath.dev' dipakai canonical, og:image, sitemap, robots → preview LinkedIn tidak bisa ambil OG kalau deploy di domain lain.
- Fix: daftarkan domain + MX sebelum launch, atau pakai alamat aktif dan set `site` ke domain deploy sebenarnya.

## Status 5 prioritas lama
1. Konten terpotong di HP pendek — BERES: 0px terpotong di 13 viewport pinned; "Leaves behind" sisa ruang ≥83px; <600px tinggi pakai versi statis (MOTION_QUERY).
2. Identitas — BERES: nama di layar pertama, judul tetap "Technical Lead" (8 detik), OG dari site.ts.
3. Karya terlalu jauh — SEBAGIAN BESAR: See the work → proyek 1 87% terlihat + fokus ke h2; Back kembali ke hero; header Contact instan; mobile rail vertikal (100% / 41%); tick rail bisa diklik; ujung rail tidak kosong; judul sejajar (712px). Sisa: scroll biasa bertemu karya di layar 6,1 (dulu 7,3); halaman 13,3 layar (dulu 16,6).
4. Bukti karya lemah — BELUM (kecuali label tahun 2021–2023 dari data): plate SVG abstrak; tidak ada case 2024–sekarang padahal hero "Technical Lead"; artefak Leaves behind dan link eksternal belum ada.
5. Jalur kontak — KODE BERES, ALAMAT MATI: subject, tombol Copy + "Copied" (role=status), link profil bergaris bawah; tapi lihat P0.

## Temuan lain
Beres: backdrop menu mobile + tap luar menutup; experience terbaru dulu + "Professional work, 2021–now"; CTA case primer sebelum pager; tepi kiri rail 112 = header, tinggi panel seragam; statis desktop tanpa penggaris/grid; header Contact instan; indent hero mobile sejajar logo; en-dash; "case notes" hilang; Writing fallback ramah + 3× retry, build baru 4 artikel.

Tersisa:
- [P2] Tablet portrait 834×1112 masih layout HP, ±1/3 hero kosong.
- [P2] dist/ (09:26) dibuat saat feed gagal → 0 artikel; build ulang sebelum deploy; CI tanpa MEDIUM_REQUIRED=1.
- [P3] Back memutar cerita mundur ±1 detik (smooth scroll saat restore).
- [P3] Label FRAME…BUILD dobel di hero (rail + callout).
- [P3] Cabang fork ditolak samar; callout redup (opacity 0.5–0.6); statis HP frame + fork + 4 label padat.
- [P3] Stack berisi tag non-stack; Services tanpa durasi/harga/link case; tanpa CV; wordmark "WORKSPACE".
- [P3] Font di luar ramp dari perbaikan mobile: 0.875rem / 0.9375rem (Story.astro:925, :928).
- [P3] Excerpt Writing jadi kalimat sambung (heading artikel ikut tergabung).
- Perlu tes iPhone asli: batas MOTION_QUERY 600px vs tinggi Safari SE/mini 553 ↔ 629 saat toolbar mengecil.

## Persona
- Founder: tahu siapa dan peran; See the work langsung ke proyek; tapi karya 2021–2023 abstrak, tanpa case era Lead; email bounce.
- HP: tidak terpotong, proyek vertikal, backdrop; iPhone SE tombol hero 28px di bawah layar pertama (wajar).
- Recruiter: pengalaman urut waktu; belum ada CV.

## Skor
| # | Heuristik | Dulu | Sekarang |
|---|---|---|---|
| 1 | Visibility of system status | 3 | 3 |
| 2 | Match with real world | 2 | 3 |
| 3 | User control & freedom | 2 | 3 |
| 4 | Consistency & standards | 3 | 3 |
| 5 | Error prevention | 2 | 2 |
| 6 | Recognition vs recall | 2 | 3 |
| 7 | Flexibility & efficiency | 2 | 3 |
| 8 | Aesthetic & minimalist | 3 | 3 |
| 9 | Error recovery | 3 | 4 |
| 10 | Help & docs | n/a | n/a |
| | Total | 22/36 (61%) | 27/36 (75%) Good |

Teknis 14/20 → 16/20: A11y 3→4 (axe 0 di 10 kondisi), Perf 3, Responsif 2→3, Theming 4, Integritas 2 (domain/email, dist tanpa artikel, plate dekoratif).

Detector: CLI 9 advisory (dulu 7; 2 baru = font mobile di atas, sisanya false positive lama). Browser 15/halaman, semua false positive (list sr-only, pinned story, line-height 1.30 vs 1.3). Masalah domain ketemu dari DNS/RDAP, bukan detector.

## Pertanyaan
- Alamat email mana yang aktif saat launch: daftarkan dityath.dev, atau pakai alamat yang sudah jalan dulu?
- Bisakah tiap proyek punya satu artefak asli (screenshot/decision record yang disamarkan) plus satu case 2024–2025 untuk mendukung "Technical Lead"?
