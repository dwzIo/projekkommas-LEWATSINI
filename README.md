# Lewat Sini: aplikasi Android (Capacitor + Firebase)

Halaman pembeli dan pedagang terpisah. Kode web ada di `public/index.html` dan dibungkus menjadi aplikasi Android dengan Capacitor.
Belum diuji di perangkat nyata. Kalau ada error, kirim pesan error-nya.

## Yang harus terpasang
- Node.js (versi LTS) dan npm
- Android Studio (sudah termasuk Android SDK) dan JDK yang diminta Capacitor
- HP Android dengan **Opsi pengembang > USB debugging** menyala

Versi Capacitor di `package.json` dikunci ke Capacitor 8.5.0 (plugin geolocation 8.2.0), tanpa `latest` atau `^`, jadi update di npm tidak mengubah hasil build. Simpan file `package-lock.json` yang muncul setelah `npm install`. Cek dokumentasi Capacitor 8 (bagian Environment Setup) untuk versi Node, JDK, dan Android Studio yang diminta.

## 1. Siapkan Firebase
1. https://console.firebase.google.com, buat project.
2. **Authentication > Sign-in method**, aktifkan **Anonymous**.
3. **Firestore Database > Create database** (mode production).
4. Tab **Rules** di Firestore: tempel isi `firestore.rules`, lalu **Publish**.
5. **Project settings > Your apps > Web (</>)**, daftarkan app dan salin `firebaseConfig`.
6. Tempel nilainya ke `public/index.html` (baris `const firebaseConfig = {...}`).

## 2. Siapkan proyek Android
```
npm install
npm run setup
```
`npm run setup` membuat folder `android`, menambah izin lokasi, dan menyalin kode web ke dalamnya. Setiap kali `public/index.html` diubah, jalankan `npm run sync`.

## 3. Jalankan di HP
```
npm run open
```
Di Android Studio: sambungkan HP lewat USB, pilih HP di bar atas, lalu tekan **Run** (segitiga hijau). Izinkan lokasi saat diminta.

## 4. Membuat file APK
Di Android Studio: **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
Hasilnya biasanya di `android/app/build/outputs/apk/debug/app-debug.apk`. Kirim ke HP lain dan izinkan pemasangan dari sumber tidak dikenal.

## 5. Cara uji
- HP A: pilih **Saya pedagang**, tekan **Mulai jualan**, biarkan layar menyala.
- HP B: pilih **Saya pembeli**, lihat pedagang di radar, coba **Minta lewat sini**.
- Coba juga **Ramai di sini** dari HP pedagang.

## Catatan
- Peringatan pedagang dekat (halaman pembeli) diatur oleh pembeli: jarak, suara, dan getar. Hanya berbunyi saat aplikasi terbuka dan layar menyala. Jika proyek `android` sudah pernah dibuat, jalankan `npm run setup` lagi agar izin getar ditambahkan.
- Aplikasi butuh internet (data Firebase dan skrip Firebase diambil dari server).
- Pelacakan masih berhenti saat layar mati. Pelacakan latar belakang butuh plugin tambahan atau versi Flutter.
- Posisi pedagang terbaca semua pengguna aplikasi. Posisi permintaan pembeli dibulatkan ±100 m. Data lama tidak terhapus otomatis.
- Batas gratis dan harga Firebase bisa berubah, cek halaman resminya.
