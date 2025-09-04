# ☕ Fika Coffee - Menü Yönetim Sistemi

GitHub Pages üzerinde çalışan, kodlama bilgisi gerektirmeyen menü yönetim sistemi.

## 🚀 Kurulum

1. **Tüm dosyaları GitHub reponuza yükleyin**
2. **GitHub Pages'i aktifleştirin:**
   - Repo > Settings > Pages
   - Source: Deploy from a branch
   - Branch: main
   - Save

## 🔗 Linkler

- **Ana Menü:** `https://kullaniciadi.github.io/repo-adi/`
- **Yönetim Paneli:** `https://kullaniciadi.github.io/repo-adi/admin.html`

## ⚙️ İlk Kurulum

1. **Yönetim paneline gidin:** `admin.html`
2. **GitHub Ayarları bölümünü açın**
3. **GitHub Token oluşturun:**
   - GitHub > Settings > Developer settings > Personal access tokens
   - Generate new token (classic)
   - Scopes: `repo` (tam erişim)
4. **Bilgileri girin:**
   - GitHub Token: `ghp_xxxxxxxxxxxxxxxxxxxx`
   - Repo Owner: `kullaniciadi`
   - Repo Name: `repo-adi`
5. **"Ayarları Kaydet" butonuna basın**

## 📱 Kullanım

### Fiyat Güncelleme
1. Yönetim paneline gidin
2. İlgili kategorideki fiyat kutusunu düzenleyin
3. Sistem otomatik olarak günceller

### Yeni Ürün Ekleme
1. "Yeni Ürün Ekle" bölümünü açın
2. Formu doldurun
3. "Ürün Ekle" butonuna basın

### Ürün Silme
1. İlgili ürünün yanındaki "Sil" butonuna basın
2. Onaylayın

## 📁 Dosya Yapısı

```
fika-coffee-menu/
├── index.html          ← Ana menü sitesi
├── admin.html          ← Yönetim paneli
├── menu-data.json      ← Menü verileri
├── update-menu.js      ← Güncelleme sistemi
├── images/             ← Görseller
└── README.md           ← Bu dosya
```

## 🔒 Güvenlik

- **Token Güvenliği:** GitHub token sadece sizin tarayıcınızda saklanır
- **Public Repo:** Repoyu public yapabilirsiniz, güvenlidir
- **Erişim Kontrolü:** Sadece token sahibi menüyü güncelleyebilir
- **LocalStorage:** Token başkaları tarafından görülemez

## 🔧 Teknik Detaylar

- **Frontend:** HTML5, CSS3, JavaScript
- **Backend:** GitHub API
- **Hosting:** GitHub Pages
- **Veri Formatı:** JSON
- **Güvenlik:** Token tabanlı erişim

## 🎯 Özellikler

- ✅ Kodlama bilgisi gerektirmez
- ✅ Mobil uyumlu yönetim paneli
- ✅ Otomatik GitHub commit
- ✅ Anlık güncelleme
- ✅ Güvenli token tabanlı erişim

## 🆘 Sorun Giderme

### "GitHub token bulunamadı" Hatası
- GitHub Ayarları bölümünden token'ı kontrol edin
- Token'ın `repo` yetkisine sahip olduğundan emin olun

### "Dosya güncellenemedi" Hatası
- Repo adı ve kullanıcı adını kontrol edin
- Token'ın geçerli olduğundan emin olun

### Menü güncellenmiyor
- GitHub Pages'in yeniden deploy olmasını bekleyin (1-2 dakika)
- Tarayıcı cache'ini temizleyin

## 📞 Destek

Herhangi bir sorun yaşarsanız:
1. GitHub Issues bölümünden sorun bildirin
2. Hata mesajlarını ekran görüntüsü ile paylaşın
3. Tarayıcı konsolundaki hataları kontrol edin
