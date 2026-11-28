import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';

const run = (c) => execSync(c, { stdio: 'inherit' });

if (readFileSync('public/index.html', 'utf8').includes('ISI_API_KEY')) {
  console.error('Isi firebaseConfig di public/index.html dulu, lalu jalankan ulang.');
  process.exit(1);
}
if (!existsSync('android')) run('npx cap add android');

const f = 'android/app/src/main/AndroidManifest.xml';
let m = readFileSync(f, 'utf8');
if (!m.includes('ACCESS_FINE_LOCATION')) {
  m = m.replace('</manifest>',
    '    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />\n' +
    '    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />\n' +
    '    <uses-feature android:name="android.hardware.location.gps" />\n</manifest>');
  writeFileSync(f, m);
}
if (!m.includes('android.permission.VIBRATE')) {
  m = readFileSync(f, 'utf8').replace('</manifest>',
    '    <uses-permission android:name="android.permission.VIBRATE" />\n</manifest>');
  writeFileSync(f, m);
}
const res = 'android/app/src/main/res/';
mkdirSync(res + 'drawable', { recursive: true });
mkdirSync(res + 'mipmap-anydpi-v26', { recursive: true });
for (const n of ['ls_bg', 'ls_fg']) copyFileSync('icon/' + n + '.xml', res + 'drawable/' + n + '.xml');
for (const n of ['ic_launcher', 'ic_launcher_round']) copyFileSync('icon/ic_launcher.xml', res + 'mipmap-anydpi-v26/' + n + '.xml');
run('npx cap sync android');
console.log('\nSelesai. Jalankan: npm run open (membuka Android Studio)');
