# Lewat Sini: aplikasi Android (Capacitor + Firebase)

Halaman pembeli dan pedagang terpisah. Kode web ada di `public/index.html` dan dibungkus menjadi aplikasi Android dengan Capacitor.
Belum diuji di semua perangkat. Kalau ada error, kirim pesan error-nya.

## Yang harus terpasang
- Node.js (versi LTS) dan npm
- Android Studio (sudah termasuk Android SDK)
- **JDK 21** untuk Gradle. Kalau Android Studio memakai Java 25 dan muncul "Incompatible Gradle JVM version", buka **File > Settings > Build Tools > Gradle**, ubah **Gradle JDK** ke 21 (pilih **Download JDK...** kalau belum ada), lalu **Sync Project with Gradle Files**.
- HP Android dengan **Opsi pengembang > USB debugging** menyala

Versi Capacitor dikunci di `package.json` (Capacitor 8.5.0, geolocation 8.2.0), tanpa `latest` atau `^`. Simpan `package-lock.json` yang muncul setelah `npm install`.

## 1. Siapkan Firebase
1. https://console.firebase.google.com, buat project.
2. **Authentication > Get started > Sign-in method**, aktifkan **Anonymous**.
3. **Firestore Database > Create database** (mode production).
4. Tab **Rules** di Firestore: tempel isi `firestore.rules`, lalu **Publish**. Ulangi setiap kali `firestore.rules` berubah.
5. **Project settings > Your apps > Web (</>)**, daftarkan app (tanpa Hosting) dan salin `firebaseConfig`.
6. Di `public/index.html`, ganti baris `const firebaseConfig=...` dengan empat isian: `apiKey`, `authDomain`, `projectId`, `appId`. Salin `apiKey` dari Firebase, jangan diketik ulang. Abaikan `storageBucket`, `messagingSenderId`, `measurementId`, dan kode `import` atau `getAnalytics` dari halaman Firebase.

## 2. Siapkan proyek Android
Jalankan di folder yang berisi `package.json` (bukan di dalam `public`):
```
npm install
npm run setup
```
`npm run setup` membuat folder `android`, menambah izin lokasi dan getar, lalu menyalin kode web ke dalamnya. Menolak jalan selama masih ada tulisan `ISI_` di `index.html`.
Setiap kali `public/index.html` diubah: `npm run sync`.

## 3. Jalankan di HP
```
npm run open
```
Android Studio terbuka. Tunggu Gradle sync selesai (tab Build menampilkan BUILD SUCCESSFUL). Sambungkan HP lewat USB, pilih HP di bar atas, tekan **Run** (segitiga hijau). Izinkan lokasi saat diminta. Abaikan notifikasi upgrade AGP, Kotlin, atau Gradle.

## 4. Membuat file APK
Menu **Build > Build Bundle(s) / APK(s) > Build APK(s)**, lalu klik **locate**.
Hasil: `android/app/build/outputs/apk/debug/app-debug.apk`. Bagikan hanya file `.apk` itu (kirim sebagai dokumen lewat WhatsApp, Drive, atau kabel), lalu izinkan pemasangan dari sumber tidak dikenal di HP penerima.

## 5. Cara uji
- HP A: **Saya pedagang**, isi nama dan jenis dagangan (atau tulis jenis sendiri), tekan **Mulai jualan**, biarkan layar menyala. Status berjalan, berhenti, dan istirahat terdeteksi otomatis.
- HP B: **Saya pembeli**. Pilih pedagang dari dropdown atau cari lewat kolom pencarian, lalu coba **Minta ... lewat sini** dan **Pantau pedagang ini**.
- Titik ramai muncul saat dua pedagang aktif atau lebih berada dalam radius 150 m.
- Tombol terang/gelap ada di pojok kanan atas.

## Jangan unggah API key ke GitHub
`.gitignore` sudah mengabaikan `node_modules`, `android/build`, dan `.gradle`. Kalau memakai salinan berisi kunci (misal `public/original.html`), tambahkan ke `.gitignore` dan cek dengan `git status`. Kunci web Firebase bukan rahasia seperti password, tapi sebaiknya dibatasi di Google Cloud Console (APIs & Services > Credentials).

## Catatan
- Suara bawaan (lonceng, kentongan, klakson) ada di `public/sounds/`. Ganti file di sana (nama sama, format mp3) untuk mengubahnya, lalu `npm run sync`.
- Pembatalan permintaan yang sudah diterima butuh persetujuan kedua pihak dan hanya bisa saat pedagang masih lebih dari 2 km dari pembeli (dicek di aplikasi). Filter pembeli: Dekat (5 km) atau Jauh atau umum.
- Ikon aplikasi (gerobak pedagang berpayung merah kuning) ada di folder `icon/` dan dipasang otomatis oleh `npm run setup` ke proyek `android`. Untuk mengganti ikon, ubah file di `icon/`, jalankan `npm run setup`, lalu bangun ulang APK dan pasang ulang. Ikon baru hanya berlaku di Android 8 ke atas.
- Pedagang: rute terekam otomatis sejak Mulai jualan. Pembeli yang meminta lewat harus dijawab Terima atau Tolak. Setelah diterima, pedagang mendapat rute jalan kaki dan suara arahan (butuh internet dan suara TTS bahasa Indonesia di HP). Rute memakai server publik routing.openstreetmap.de, tanpa jaminan ketersediaan.
- Cara uji tanpa jalan: di emulator Android Studio, Extended controls > Location > Routes untuk memutar rute GPX.
- Peta memakai Leaflet dan data OpenStreetMap (butuh internet; cocok untuk uji coba, bukan pemakaian ramai). Google Maps butuh API key dan akun penagihan.
- Peringatan pedagang dekat diatur pembeli (jarak, suara, getar, suara sendiri) dan hanya berbunyi saat aplikasi terbuka dan layar menyala.
- Data Firestore: `vendors` (pedagang aktif), `calls` (permintaan pembeli ke satu pedagang), `users` (profil pembeli dan pedagang). Data lama tidak terhapus otomatis.
- Posisi pedagang terbaca semua pengguna aplikasi.
- Pelacakan berhenti saat layar mati. Pelacakan latar belakang butuh plugin tambahan.
- Batas gratis dan harga Firebase bisa berubah, cek halaman resminya.
