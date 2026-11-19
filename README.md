# ZCY Mimarlık

ZCY Mimarlık için Astro ve TypeScript ile hazırlanan, içerik ve medya eklemeye açık başlangıç projesi.

## Teknoloji seçimi

- **Astro:** Portföy, stüdyo ve hizmet sayfaları gibi ağırlıklı olarak içerik sunan sayfaları hafif HTML olarak üretir. Etkileşim gereken yerlere sonradan küçük bileşenler eklenebilir.
- **TypeScript:** Proje ve medya verilerini tutarlı biçimde modellemeye yardımcı olur.
- **Yerel CSS:** İlk tasarım sistemi ve duyarlı düzen için ek bir UI çatısı gerektirmez.
- **Yerel video bileşeni:** `src/components/VideoStage.astro` video kaynaklarını poster, oran ve uygun oynatma davranışıyla sunar.

## Geliştirme

Node.js `22.22.0` veya üzeri gerekir (önerilen: Node 24 LTS).

```sh
npm install
npm run dev
```

Üretim derlemesi ve yerel önizleme:

```sh
npm run build
npm run preview
```

## Klasör yapısı

```text
src/
  components/   Ortak başlık, altbilgi ve medya bileşenleri
  data/         Proje ve ana sayfa video alanlarının sırası
  layouts/      Ortak sayfa iskeleti ve SEO başlıkları
  pages/        Ana sayfa, projeler, hizmetler, stüdyo, iletişim
  styles/       Duyarlı tasarım sistemi
public/videos/  Sonradan verilecek video dosyaları için alan
```

## Medya akışı

Dokuz video `public/videos/` içine kopyalanmış; posterleri `public/images/videos/` içinde hazırlanmıştır. Anlatı sırası ve kaynak dosya eşleşmeleri `src/data/media-slots.ts` içinde tutulur. Proje adları, konumlar, gerçek iletişim bilgileri, stüdyo metinleri ve hizmet kapsamı henüz teyit edilmemiştir. İlk ekranlardaki metinler başlangıç taslağıdır; ZCY'nin onaylı içerikleriyle değiştirilecektir.
