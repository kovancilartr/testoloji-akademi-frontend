# 🚀 Testoloji & Akademi - Kompleks Eğitim ve Sınav Platformu

Testoloji, hem modern bir **Soru Bankası/Dijitalleştirme** aracı hem de kapsamlı bir **Öğrenim Yönetim Sistemi (LMS)** olan uçtan uca bir eğitim platformudur.

<p align="center">
  <img src="https://nextjs.org/static/favicon/favicon-32x32.png" width="30" alt="Next.js Logo" />
  <img src="https://tailwindcss.com/favicons/favicon-32x32.png" width="30" alt="Tailwind Logo" />
</p>

## ✨ Öne Çıkan Özellikler

### 🔐 Güvenlik & Yetkilendirme (RBAC)
*   **Role-Based Access Control:** `ADMIN`, `TEACHER` ve `STUDENT` rolleri için tam ayrıştırılmış arayüz.
*   **Coaching Access Control:** Eğitmenler için dinamik yetki yönetimi ve özel kod tabanlı koruma.
*   **RoleProtect Wrapper:** Sayfa ve bileşen seviyesinde yetki kontrolü sağlayan gelişmiş koruma katmanı.
*   **Client-Side Security:** Yetkisiz erişimlerde kullanıcıyı ana sayfaya yönlendiren veya bilgilendiren şık Unauthorized UI.

### 🏗️ İnteraktif Kurs Oluşturucu (Academy)
*   **Müfredat Yönetimi:** Kurs -> Bölüm -> İçerik hiyerarşisinde ders yapısı oluşturma.
*   **Drag & Drop (Sürükle-Bırak):** Müfredat bölümlerini ve içeriklerini `@hello-pangea/dnd` ile saniyeler içinde düzenleyin.
*   **Zengin İçerik Desteği:** Video dersler, PDF dökümanları ve interaktif dijital testler.
*   **Optimistic UI:** `React Query` ile yapılan her değişiklik anında arayüze yansır.

### 📊 Performans Laboratuvarı (Analytics)
*   **Öğretmen Dashboard:** Sınıf ortalaması, aktif öğrenci sayısı ve gelişim trendlerini izleyin.
*   **Dinamik Dashboard:** Koçluk yetkisine sahip olmayan öğretmenler için optimize edilmiş, sadeleşmiş merkezi dashboard tasarımı.
*   **Detaylı Analiz:** Her öğrenci (Koçluk Sistemi) için Doğru, Yanlış ve Net (4Y 1D) takibi.
*   **Görsel Grafikler:** `Recharts` ile desteklenen interaktif başarı dağılım grafikleri.

### 📝 Sürükleyici Sınav Deneyimi
*   **Optik Form Arayüzü:** Dijital sınavlar için kafa karıştırmayan, optik form esintili tasarım.
*   **Canlı Süre Takibi:** Sınav süresi yönetimi ve otomatik bitirme özelliği.
*   **Hızlı Karne:** Sınav biter bitmez anlık sonuç ve detaylı analiz.

---

## 🛠️ Teknoloji Yığını

*   **Frontend:** [Next.js 14+](https://nextjs.org/) (App Router & Server Actions)
*   **Stil:** Tailwind CSS & [Shadcn UI](https://ui.shadcn.com/)
*   **Tasarım:** Framer Motion (Akıcı Geçişler)
*   **State & Cache:** [@tanstack/react-query](https://tanstack.com/query/latest)
*   **Grafikler:** `Recharts`
*   **İkonlar:** Lucide React

---

## 🚀 Hızlı Başlangıç

### Gereksinimler
*   Node.js v18+
*   Backend API (api-nest) çalışır durumda olmalıdır.

### Kurulum Adımları

1.  **Bağımlılıkları Yükleyin:**
    ```bash
    npm install
    ```

2.  **Çevresel Değişkenleri Ayarlayın (.env.local):**
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:4000
    NEXT_PUBLIC_IS_DEVELOPMENT=true  # Hızlı giriş butonlarını aktif eder (Dev Mode)
    ```

3.  **Geliştirme Sunucusunu Başlatın:**
    ```bash
    npm run dev
    ```

---

## 🤝 Mimari Yaklaşım

*   **Component-Driven:** Yeniden kullanılabilir, bağımsız UI bileşenleri.
*   **Protection Layer:** Sayfaların rol bazlı korunması (`components/providers/RoleProtect.tsx`).
*   **Custom Hooks:** API etkileşimlerinin ve karmaşık mantıkların component'lerden ayrıştırılması.

## 📑 Son Güncellemeler (Bugün)

Platformun kullanıcı deneyimini ve performansını artırmak amacıyla sistem genelinde köklü iyileştirmeler yapıldı.

### 📊 Yenilenen Admin Deneyimi
- **Modern Dashboard:** Admin sayfası tamamen yeniden tasarlandı. Artık toplam kurs, ödev ve aktif kullanıcı sayıları gibi kritik verileri canlı trend grafikleriyle birlikte sunuyor.
- **Görsel Analiz:** Kullanıcıların rol (`Admin`, `Teacher`, `Student`) ve abonelik paketi (`Free`, `Plus`, `Pro`) dağılımları Pie Chart üzerinden izlenebilir hale getirildi.
- **Hızlı Erişim:** Son kayıt olan 5 kullanıcı arayüze eklendi, böylece sistem aktiviteleri anlık takip edilebiliyor.

### 🤖 AI Koçluk & Analiz Sistemi
- **Responsive AI Chat:** AI Coach Advisor modülü mobil cihazlar için tam ekran uyumlu hale getirildi. Sohbet arayüzü ve tetikleyici butonlar optimize edildi.
- **AI Ödev Analizi:** Öğrencilerin ödev performansları AI tarafından analiz edilerek detaylı raporlar sunuluyor. Bu raporlar `static cache` stratejisi ile optimize edildi.
- **Sistem Ayarları:** Adminler için Gemini API Key ve Model (`gemini-2.0-flash` vb.) tercihlerini yönetebilecekleri, mobil uyumlu yeni bir ayarlar paneli eklendi.

### 🚀 Performans & Stabilite (React Query)
- **Global Caching:** Tüm veri çekme işlemleri (`useUsers`, `useCourses`, `useProjects`, `useAnalytics`) **5 dakikalık cache** (`staleTime`) ile hızlandırıldı. Sayfa geçişleri anlık ("lightning fast") hale getirildi.
- **Akıllı Geçersiz Kılma:** Veri değiştirildiğinde (kurs silme, ayar güncelleme) ilgili cache'ler otomatik temizlenerek verinin her zaman doğru olması sağlandı.
- **Mobil Uyumluluk:** Admin Dashboard, Ayarlar ve Kurs listesi tüm mobil ekranlara (iPhone/Android) tam uyumlu hale getirildi. Z-index çakışmaları çözüldü.

### 🎓 Kurs & İçerik Yönetimi
- **Kurs Silme:** Adminler için kursları kalıcı olarak silebilecekleri, şık bir güvenlik onayı (`AlertDialog`) içeren sistem entegre edildi.

---
## 📝 Lisans
Bu proje özel bir mülkiyettir. Tüm hakları saklıdır.
