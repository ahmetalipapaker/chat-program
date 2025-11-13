# Chat-Program

Bu proje, Flask tabanlı bir yapay zeka servisi, .NET Core tabanlı bir backend API, React tabanlı bir web arayüzü ve React Native tabanlı bir mobil arayüzden oluşan çok katmanlı bir chat uygulamasıdır.
Kullanıcıdan alınan mesajlar backend aracılığıyla AI servisine iletilir, işlenir ve sonuç frontend veya mobil arayüzde görüntülenir.


Bu proje, bazı teknik kısıtlamalar nedeniyle yalnızca lokal ortamda çalıştırılmaktadır.
GitHub’ın dosya boyutu sınırı (100 MB) ve bağımlılık yönetimi (örneğin node_modules, venv) gibi nedenlerden dolayı proje dosyalarının tamamı çevrimiçi olarak paylaşılamamıştır.
Tüm servisler — AI servisi (Flask), Backend API (Express), Frontend (React) ve Mobil Uygulama (React Native) — lokal makinede birbirine bağlı şekilde çalışacak biçimde yapılandırılmıştır.
Her modülün port ayarları README.md içinde belirtilmiştir.

Not: Bu proje kapsamında flask_api.py dosyası elle yazılmıştır. Projedeki diğer tüm dosyalar geliştirilirken yapay zekâ desteği kullanılmıştır.
---

## Proje Yapısı

```
chat-program/
│
├── ai-service/        → Flask tabanlı yapay zeka servisi
├── backend/           → .NET Core API (veritabanı yönetimi)
├── frontend/          → React tabanlı web arayüzü
└── mobile/            → React Native tabanlı mobil uygulama
```

---

## 1. AI Servis (Flask)

**Klasör:** `ai-service/`  
**Dosya:** `flask_api.py`

Bu servis, Hugging Face üzerinde eğitilmiş Türkçe duygu analizi modelini kullanır.  
Frontend veya backend’den gelen metni analiz ederek bir duygu etiketi ve olasılık skoru döndürür.

**Varsayılan Port:** `7860`

### Çalıştırma

```bash
cd ai-service
python -m venv venv
venv\Scripts\activate        # Windows için
pip install -r requirements.txt
python flask_api.py
```

**Erişim:**  
http://127.0.0.1:7860/analyze  
POST body örneği:
```json
{ "text": "Bugün harika hissediyorum." }
```

---

## 2. Backend (.NET Core API)

**Klasör:** `backend/`

Bu katman, SQLite veritabanı (`chat.db`) ile mesajların yönetimini sağlar.  
Frontend veya mobil uygulamadan gelen mesajları alır, AI servisine gönderir ve sonucu kaydeder.

**Varsayılan Port:** `http://localhost:5000`

### Önemli Dosyalar
- `Program.cs` → API giriş noktası  
- `DataContext.cs` → Veritabanı bağlantısı  
- `Models/Message.cs` → Mesaj modeli  
- `Controllers/MessagesController.cs` → Mesaj endpoint’leri  

### Çalıştırma

```bash
cd backend
dotnet restore
dotnet build
dotnet run
```

**API Uç Noktası:**  
http://localhost:5000/api/messages

---

## 3. Frontend (React)

**Klasör:** `frontend/`

Bu katman, kullanıcıların mesaj gönderip yanıtları görebildiği web arayüzünü içerir.  
Backend API’ye bağlanarak mesajları işler ve sonuçları ekrana yansıtır.

**Varsayılan Port:** `http://localhost:5173`

### Çalıştırma

```bash
cd frontend
npm install
npm run dev
```

**Yapı Dosyaları:**
- `App.jsx` → Ana bileşen, sayfa yönlendirmesi  
- `Chat.jsx` → Mesaj gönderme ve listeleme  
- `ChatWindow.jsx` → Sohbet ekranı  
- `index.jsx` & `main.jsx` → React uygulama başlangıç noktaları  
- `index.html` → Ana HTML sayfası

**Not:**  
Frontend’in backend ile iletişim kurabilmesi için `.env` veya doğrudan kodda API URL’si şu şekilde tanımlanmalıdır:
```
VITE_API_URL=http://localhost:5000
```

---

## 4. Mobil (React Native)

**Klasör:** `mobile/`

React Native ile geliştirilmiş mobil arayüz.  
Kullanıcı mesajlarını API’ye gönderir ve yanıtları mobil arayüzde gösterir.

**Varsayılan Port:** `8081` (Metro bundler)

### Önemli Dosyalar
- `App.js` → Uygulama giriş noktası  
- `ChatScreen.js` → Ana sohbet ekranı  

### Çalıştırma

```bash
cd mobile
npm install
npx react-native start
npx react-native run-android
```

**API Bağlantısı:**  
`http://10.0.2.2:5000/api/messages` (Android Emulator içinden erişim)

---

## Sistem Akışı

```
Frontend / Mobile
       ↓
Backend (.NET API - :5000)
       ↓
SQLite Veritabanı (chat.db)
       ↓
AI Service (Flask - :7860)
       ↓
Sonuç Frontend / Mobil ekranda gösterilir
```

---

## Lokalde Çalıştırma Sırası

Projeyi yerelde çalıştırmak için aşağıdaki sırayla servisleri başlatın:

1. **AI Servisi Başlatın**
   ```bash
   cd ai-service
   python flask_api.py
   ```
   Port: `7860`

2. **Backend API’yi Başlatın**
   ```bash
   cd backend
   dotnet run
   ```
   Port: `5000`

3. **Frontend’i Başlatın**
   ```bash
   cd frontend
   npm run dev
   ```
   Port: `5173`

4. **Mobil Uygulamayı Başlatın (opsiyonel)**
   ```bash
   cd mobile
   npx react-native run-android
   ```

---

## Bağımlılıklar

| Katman | Teknoloji |
|--------|------------|
| AI Servis | Python, Flask, Transformers |
| Backend | .NET 8, Entity Framework Core, SQLite |
| Frontend | React, Vite |
| Mobil | React Native |

---

## Notlar

- Büyük dosyalar (`venv`, `node_modules`, `build` klasörleri) versiyon kontrolüne dahil edilmemelidir.  
- `.gitignore` dosyasında bu klasörlerin hariç tutulduğundan emin olun.  
- Her servis kendi bağımsız `package.json`, `requirements.txt` veya `.csproj` dosyasına sahiptir.  

