# Argos

Media pembelajaran visual untuk mata kuliah **Algoritma & Struktur Data**, materi **sorting**. Dibangun dengan Svelte 5 + Svelte Flow, murni frontend, dan di-deploy ke GitHub Pages.

## Fitur

- Visualisasi 3D balok yang menunjukkan pergeseran/penukaran data secara animatif (via Svelte Flow).
- 6 algoritma: Bubble Sort, Quick Sort, Merge Sort, Heap Sort, Bucket Sort, dan BST Sort — Heap Sort & BST Sort divisualisasikan sebagai struktur pohon.
- Input jumlah data dengan nilai acak, atau input nilai manual.
- Kontrol Play/Pause, Step maju/mundur, kecepatan animasi, dan progress bar.
- Panel kode Java & Python dengan highlight baris yang sedang dieksekusi, sinkron dengan animasi.
- Mode terang & gelap.

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy ke GitHub Pages

Push ke branch `main` akan otomatis men-trigger workflow `.github/workflows/deploy.yml` yang build lalu men-deploy folder `dist/` ke GitHub Pages.

Agar berjalan, aktifkan sekali di repo: **Settings → Pages → Source → GitHub Actions**.

URL setelah deploy: `https://<username>.github.io/argos/`
