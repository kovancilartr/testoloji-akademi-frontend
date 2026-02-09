# 🚀 Testoloji & Akademi - Kompleks Eğitim ve Sınav Platformu

Testoloji, hem modern bir **Soru Bankası/Dijitalleştirme** aracı hem de kapsamlı bir **Öğrenim Yönetim Sistemi (LMS)** olan uçtan uca bir eğitim platformudur.

<p align="center">
  <img src="https://nextjs.org/static/favicon/favicon-32x32.png" width="30" alt="Next.js Logo" />
  <img src="https://tailwindcss.com/favicons/favicon-32x32.png" width="30" alt="Tailwind Logo" />
</p>

## ✨ Öne Çıkan Özellikler

### 🏗️ İnteraktif Kurs Oluşturucu (Academy)
*   **Drag & Drop (Sürükle-Bırak):** Müfredat bölümlerini ve içeriklerini `@hello-pangea/dnd` ile saniyeler içinde düzenleyin.
*   **Zengin İçerik Desteği:** Video dersler, dökümanlar ve dijital testler ekleyin.
*   **Hızlı Yönetim:** Tek bir panelden kurs ayarlarını, öğrenci atamalarını ve yayın durumunu kontrol edin.
*   **Optimistic UI:** `React Query` ile yapılan her değişiklik anında arayüze yansır, hızdan ödün verilmez.

### 📊 Performans Laboratuvarı (Analytics)
*   **Gelişmiş Dashboard:** Sınıf ortalaması, aktif öğrenci sayısı ve başarı trendleri.
*   **Detaylı Analiz:** Her öğrenci için Doğru, Yanlış ve Net (4Y 1D) takibi.
*   **Görsel Grafikler:** `Recharts` ile desteklenen interaktif başarı dağılım grafikleri.

### 📝 Sürükleyici Sınav Deneyimi
*   **Optik Form Arayüzü:** Dijital sınavlar için kafa karıştırmayan, optik form esintili tasarım.
*   **Anlık Geri Bildirim:** Sınav sonunda detaylı karne (Doğru/Yanlış/Net) ve detaylı inceleme modu.
*   **Canlı Süre Takibi:** Sınav süresi yönetimi ve otomatik bitirme özelliği.

### ✂️ Akıllı Soru Dijitalleştirme
*   **AI Scan:** PDF'lerden soruları yapay zeka ile otomatik algılama ve kırpma.
*   **Hassas Düzenleme:** Gelişmiş crop araçları ve soru havuzu yönetimi.

## 🛠️ Teknoloji Yığını

*   **Frontend:** [Next.js 14+](https://nextjs.org/) (App Router)
*   **Stil:** Tailwind CSS & [Shadcn UI](https://ui.shadcn.com/)
*   **State & Cache:** [@tanstack/react-query](https://tanstack.com/query/latest)
*   **Sıralama:** `@hello-pangea/dnd`
*   **Grafikler:** `Recharts`
*   **İkonlar:** Lucide React

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
    ```

3.  **Geliştirme Sunucusunu Başlatın:**
    ```bash
    npm run dev
    ```

4.  **Hemen Deneyimleyin:**
    Tarayıcınızda `http://localhost:3000` adresine gidin.

## 🤝 Mimari Yaklaşım

*   **Component-Driven:** Yeniden kullanılabilir, bağımsız UI bileşenleri.
*   **Hook-First logic:** Veri çekme ve mutasyon işlemlerinin `custom hooks` altında toplanması.
*   **Premium UX:** Akıcı animasyonlar (framer-motion) ve minimalist tasarım dili.

---
## 📝 Lisans
Bu proje [MIT](LICENSE) lisansı ile lisanslanmıştır.
