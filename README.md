# My Key System 🔑

Sistem key sederhana untuk integrasi dengan PlatoBoost yang menampilkan UI langsung seperti Delta X.

## ✨ Fitur

- **🎯 Generate Key**: Endpoint callback untuk PlatoBoost dengan format `FREE_` + 32 karakter
- **✅ Validasi Key**: Endpoint untuk memvalidasi status key (VALID/EXPIRED/INVALID)  
- **⏰ Auto Expire**: Setiap key berlaku 24 jam
- **🎨 UI Display**: Halaman display key yang menarik (muncul langsung di PlatoBoost)
- **📱 Responsive**: UI yang responsive untuk mobile & desktop
- **📋 Copy to Clipboard**: Tombol copy key dengan feedback visual

## 🚀 Quick Start

### 1. Setup Project
```bash
git clone <your-repo>
cd my-key-system
npm install
```

### 2. Setup Supabase
Buat project baru di [Supabase](https://supabase.com) dan jalankan SQL:

```sql
create table keys (
  id uuid default gen_random_uuid() primary key,
  key text unique not null,
  created_at timestamp default now(),
  expires_at timestamp not null,
  used boolean default false
);
```

### 3. Environment Variables
Copy `.env.local` dan isi dengan credentials Supabase:

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE=eyJhbGciOi...
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Run Development
```bash
npm run dev
```

Buka http://localhost:3000 - server siap!

## 📡 API Endpoints

### `GET /api/callback`
**Untuk PlatoBoost callback** - Generate key dan redirect ke UI display.

**Query Parameters:**
- `token` (required): Token verifikasi

**Behavior:**
- Generate key format: `FREE_abcd1234...` (36 chars total)
- Simpan ke database dengan expire 24 jam
- **Redirect ke `/display?key=...&expires=...`** (ini yang bikin UI muncul di PlatoBoost!)

**Usage:**
```bash
curl -L "https://your-domain.vercel.app/api/callback?token=xyz123"
# Will redirect to display page with generated key
```

### `GET /api/validate` 
**Untuk validasi key dari aplikasi/script user.**

**Query Parameters:**
- `key` (required): Key yang akan divalidasi

**Response:**
```json
// Valid
{ "status": "VALID", "expires": "2025-08-27T12:00:00Z" }

// Expired  
{ "status": "EXPIRED" }

// Not found
{ "status": "INVALID" }
```

**Usage:**
```bash
curl "https://your-domain.vercel.app/api/validate?key=FREE_abc123def456..."
```

## 🎨 UI Display Flow

1. **PlatoBoost** → `GET /api/callback?token=xyz`
2. **Server** → Generate key → Redirect ke `/display?key=...`
3. **User** → Melihat halaman UI key yang cantik
4. **User** → Copy key untuk digunakan di aplikasi

UI menampilkan:
- ✅ Success icon dengan animasi
- 🕐 Countdown timer (23 hours 59 minutes left)
- 📋 Copy button dengan feedback
- 🔗 Footer links

## 🌐 Deploy ke Vercel

### 1. Push ke GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Import ke Vercel
- Masuk ke [Vercel Dashboard](https://vercel.com)
- Import project dari GitHub
- Set environment variables:
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY` 
  - `SUPABASE_SERVICE_ROLE`
  - `NEXT_PUBLIC_BASE_URL` = `https://your-app.vercel.app`

### 3. Deploy! 🎉
Vercel akan auto-deploy dan berikan URL production.

## 🧪 Testing

### Test Callback (dengan redirect):
```bash
curl -L "https://your-domain.vercel.app/api/callback?token=test123"
```

### Test Validate:
```bash  
curl "https://your-domain.vercel.app/api/validate?key=FREE_abc123def456ghi789jkl"
```

### Test UI Display:
Buka browser: `https://your-domain.vercel.app/display?key=FREE_test123&expires=2025-08-27T12:00:00Z`

## 🔧 Struktur Project

```
my-key-system/
├── pages/
│   ├── index.js              # Homepage dengan dokumentasi
│   ├── display.js            # UI display key (yang muncul di PlatoBoost)
│   └── api/
│       ├── callback.js       # Generate key + redirect
│       └── validate.js       # Validasi key
├── package.json              # Dependencies
├── .env.local               # Environment variables (local)
├── .gitignore              # Git ignore
└── README.md               # Dokumentasi ini
```

## 🎯 Kenapa UI Muncul di PlatoBoost?

Ketika PlatoBoost hit endpoint `/api/callback`, server tidak return JSON biasa, tapi **redirect (302)** ke halaman `/display`. PlatoBoost mengikuti redirect ini dan menampilkan halaman UI key.

Ini sama seperti yang dilakukan Delta X - mereka redirect ke halaman display mereka, makanya UI-nya muncul langsung di browser PlatoBoost.

## 🛠️ Customization

### Ubah Format Key:
Edit function `generateKey()` di `pages/api/callback.js`

### Ubah UI Design:
Edit styles di `pages/display.js`

### Ubah Expire Time:
```javascript
// Di callback.js, ubah dari 24 jam ke yang lain
expiresAt.setHours(expiresAt.getHours() + 48) // 48 jam
```

## 🔍 Troubleshooting

**UI tidak muncul di PlatoBoost?**
- Pastikan `NEXT_PUBLIC_BASE_URL` sudah benar
- Test redirect manual: `curl -L "your-domain.com/api/callback?token=test"`
- Cek logs di Vercel Function

**Key tidak tersimpan?**
- Cek credentials Supabase di environment variables
- Pastikan tabel `keys` sudah dibuat dengan benar
- Cek logs error di Vercel

**Expired time salah?**
- Pastikan server timezone sudah benar
- Cek format ISO string di database

## 📞 Support

Jika ada issue, cek:
1. Vercel Function Logs
2. Browser Developer Console  
3. Supabase Database Logs

---

**Happy Coding! 🚀**

Built with ❤️ using Next.js & Supabase
