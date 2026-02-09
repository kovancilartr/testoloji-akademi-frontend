# 🚀 Testoloji & Akademi - Kompleks Eğitim ve Sınav Platformu

Testoloji, hem modern bir **Soru Bankası/Dijitalleştirme** aracı hem de kapsamlı bir **Öğrenim Yönetim Sistemi (LMS)** olan uçtan uca bir eğitim platformudur.

<p align="center">
  <img src="https://nextjs.org/static/favicon/favicon-32x32.png" width="30" alt="Next.js Logo" />
  <img src="https://tailwindcss.com/favicons/favicon-32x32.png" width="30" alt="Tailwind Logo" />
</p>

## ✨ Öne Çıkan Özellikler

### 🔐 Güvenlik & Yetkilendirme (RBAC)
*   **Role-Based Access Control:** `ADMIN`, `TEACHER` ve `STUDENT` rolleri için tam ayrıştırılmış arayüz.
*   **RoleProtect Wrapper:** Sayfa ve bileşen seviyesinde yetki kontrolü sağlayan gelişmiş koruma katmanı.
*   **Client-Side Security:** Yetkisiz erişimlerde kullanıcıyı ana sayfaya yönlendiren veya bilgilendiren şık Unauthorized UI.

### 🏗️ İnteraktif Kurs Oluşturucu (Academy)
*   **Müfredat Yönetimi:** Kurs -> Bölüm -> İçerik hiyerarşisinde ders yapısı oluşturma.
*   **Drag & Drop (Sürükle-Bırak):** Müfredat bölümlerini ve içeriklerini `@hello-pangea/dnd` ile saniyeler içinde düzenleyin.
*   **Zengin İçerik Desteği:** Video dersler, PDF dökümanları ve interaktif dijital testler.
*   **Optimistic UI:** `React Query` ile yapılan her değişiklik anında arayüze yansır.

### 📊 Performans Laboratuvarı (Analytics)
*   **Öğretmen Dashboard:** Sınıf ortalaması, aktif öğrenci sayısı ve gelişim trendlerini izleyin.
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

---
## 📝 Lisans
Bu proje özel bir mülkiyettir. Tüm hakları saklıdır.
