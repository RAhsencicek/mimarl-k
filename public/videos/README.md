# Video alanları

Gönderilen dokuz MP4, kaynak klasör korunarak buraya kopyalandı ve web için anlaşılır adlar verildi. Görsel posterler `public/images/videos/` içindedir.

| Kaynak dosya | Web dosyası | Bölüm |
| --- | --- | --- |
| `Video Project 7 (1).mp4` | `konut-yasam.mp4` | Ana sayfa açılışı |
| `Video Project 1.mp4` | `mekan-atrium.mp4` | Seçilmiş mekânlar |
| `Video Project 1 (1).mp4` | `banyo-detayi.mp4` | Seçilmiş mekânlar |
| `Video Project 1 (2).mp4` | `ic-mekan-dikey.mp4` | Seçilmiş mekânlar, düşey kadraj |
| `Video Project 5.mp4` | `ticari-mekan.mp4` | Seçilmiş mekânlar |
| `Video Project 9 (1).mp4` | `konaklama-masa.mp4` | Seçilmiş mekânlar |
| `Video Project 7.mp4` | `isik-zaman-gecisi.mp4` | Işık ve zaman |
| `Video Project 9 (2).mp4` | `uretim-detayi.mp4` | Üretim süreci |
| `Video Project 9.mp4` | `malzeme-isik.mp4` | Malzeme ve ışık |

Yerleşim sırası ve erişilebilir açıklamalar `src/data/media-slots.ts` içindedir. İlk açılış filmi sessiz ve döngülü oynar. Diğer klipler posterle görünür; `preload="none"` ve oynatma kontrolleri kullanır. Böylece dokuz klibin tamamı sayfa açılır açılmaz yüklenmez.
