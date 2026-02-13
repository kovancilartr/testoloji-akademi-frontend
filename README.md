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

## 📑 Son Güncellemeler (13.02.2026 – Güncelleme 2)

Bugünkü güncelleme, öğrenci ve öğretmen dashboard'larını modern ve işlevsel bir hale getirmeye, PDF çıktı kalitesini artırmaya ve arayüz çakışma sorunlarını gidermeye odaklandı.

### 🏠 Öğretmen Dashboard - Yeniden Tasarım
- **Modern Hero Section:** Zamana göre kişiselleştirilmiş selamlama ("Günaydın", "İyi günler", "İyi akşamlar") ve dekoratif gradient arka plan eklendi.
- **Öğrenci Performans Tablosu:** Analiz sayfasındaki öğrenci verileri artık doğrudan dashboard'da görüntüleniyor:
  - Başarıya göre sıralama ve ilk 3'e 🥇🥈🥉 madalya.
  - Renk kodlu başarı puanları (%80+ yeşil, %60+ koyu, %40+ sarı, altı kırmızı).
  - Doğru/Yanlış, Ortalama Net ve kayıtlı kurs bilgileri.
  - Tıklanabilir satırlar ile öğrenci detay sayfasına yönlendirme.
- **Sınıf Ortalaması Mini-Header:** Sınıf ortalaması ve toplam öğrenci sayısı özet bar'ı.
- **Mobil Uyumlu Kart Görünümü:** Masaüstünde tablo, mobilde kart tasarımı ile tam responsive yapı.
- **Sayfalama (Pagination):** 5'er 5'er öğrenci listeleme ve navigasyon kontrolleri.

### 🎓 Öğrenci Dashboard - Sınav Sonuçları Entegrasyonu
- **Son Sınav Sonuçları Tablosu:** Analiz sayfasındaki sınav verileri `useStudentAnalytics` hook'u aracılığıyla dashboard'a entegre edildi.
- **Sınav Detay Modalı:** Tıklanan sınav için soru bazlı analiz, optik rapor ve doğru/yanlış gösterimi.
- **AI Koç Erişimi:** Tablodaki "AI" butonuyla doğrudan AI analiz modalı açılabiliyor.
- **Boş Durum Yönetimi:** Henüz sınav sonucu yoksa şık placeholder gösterimi.

### 🔧 Select Z-Index Düzeltmesi
- **Sorun:** Sheet (z-300) içindeki Select dropdown'ları (z-200) Sheet'in arkasında kalarak açılmıyordu.
- **Çözüm:** `SelectContent` bileşeninin z-index'i `z-9999` olarak güncellenerek tüm overlay bileşenlerinin üstünde render edilmesi sağlandı.
- **Etki:** Proje Ayarları panelindeki tüm select'ler (Soru Boşluğu, Sütun Sayısı, Yazı Tipi, Çalışma Modu) artık sorunsuz açılıyor.

### 📄 PDF LaTeX Temizleme (AI Analiz Raporları)
- **Sorun:** AI Koç analiz PDF'lerinde `$22,22\%$` gibi ham LaTeX kodları görünüyordu.
- **Çözüm:** `AiAnalysisPDF.tsx` dosyasına `stripLatex` + `latexToPlain` fonksiyonları eklendi.
- **Desteklenen Dönüşümler:**
  | LaTeX | PDF Çıktısı |
  | :--- | :--- |
  | `$22,22\%$` | `22,22%` |
  | `$x^{2}$` | `x²` |
  | `$\frac{a}{b}$` | `a/b` |
  | `$\sqrt{16}$` | `√(16)` |
  | `$\pi$`, `$\alpha$` | `π`, `α` |
  | `$x \times y$` | `x × y` |
  | `$x \leq 18$` | `x ≤ 18` |

---

## 📑 Önceki Güncellemeler (13.02.2026)

Platformun kullanıcı deneyimini ve performansını artırmak amacıyla sistem genelinde köklü iyileştirmeler yapıldı.

### 📊 Yenilenen Admin Deneyimi
- **Modern Dashboard:** Admin sayfası tamamen yeniden tasarlandı. Artık toplam kurs, ödev ve aktif kullanıcı sayıları gibi kritik verileri canlı trend grafikleriyle birlikte sunuyor.
- **Görsel Analiz:** Kullanıcıların rol (`Admin`, `Teacher`, `Student`) ve abonelik paketi (`Free`, `Plus`, `Pro`) dağılımları Pie Chart üzerinden izlenebilir hale getirildi.
- **Hızlı Erişim:** Son kayıt olan 5 kullanıcı arayüze eklendi, böylece sistem aktiviteleri anlık takip edilebiliyor.

### 🤖 AI Koçluk & Analiz Sistemi
- **Responsive AI Chat:** AI Coach Advisor modülü mobil cihazlar için tam ekran uyumlu hale getirildi. Sohbet arayüzü ve tetikleyici butonlar optimize edildi.
- **AI Ödev Analizi:** Öğrencilerin ödev performansları AI tarafından analiz edilerek detaylı raporlar sunuluyor. Bu raporlar `static cache` stratejisi ile optimize edildi.
- **Sistem Ayarları:** Adminler için Gemini API Key ve Model (`gemini-2.0-flash` vb.) tercihlerini yönetebilecekleri, mobil uyumlu yeni bir ayarlar paneli eklendi.

#### 🧠 Desteklenen Modeller & Limitler:
| Model | RPM | TPM | RPD | Kullanım Senaryosu |
| :--- | :--- | :--- | :--- | :--- |
| **2.0 Flash** | 15 | 1M | 1.500 | **Genel Kullanım (Önerilen)** |
| **2.0 Lite** | 30 | 1M | 14.400 | **Seri Üretim / Yüksek Trafik** |
| **2.5 Flash** | 10 | 250K | 500 | **Karmaşık Analizler** |

### 🚀 Performans & Stabilite (React Query)
- **Global Caching:** Tüm veri çekme işlemleri (`useUsers`, `useCourses`, `useProjects`, `useAnalytics`) **5 dakikalık cache** (`staleTime`) ile hızlandırıldı. Sayfa geçişleri anlık ("lightning fast") hale getirildi.
- **Akıllı Geçersiz Kılma:** Veri değiştirildiğinde (kurs silme, ayar güncelleme) ilgili cache'ler otomatik temizlenerek verinin her zaman doğru olması sağlandı.
- **Mobil Uyumluluk:** Admin Dashboard, Ayarlar ve Kurs listesi tüm mobil ekranlara (iPhone/Android) tam uyumlu hale getirildi. Z-index çakışmaları çözüldü.

### 🎓 Kurs & İçerik Yönetimi
- **Kurs Silme:** Adminler için kursları kalıcı olarak silebilecekleri, şık bir güvenlik onayı (`AlertDialog`) içeren sistem entegre edildi.

---
## 📝 Lisans
Bu proje özel bir mülkiyettir. Tüm hakları saklıdır.

