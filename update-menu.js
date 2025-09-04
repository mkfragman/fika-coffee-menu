// GitHub Pages için JavaScript tabanlı menü güncelleme sistemi
class MenuUpdater {
    constructor() {
        this.menuData = {};
        this.loadMenuData();
    }

    // Menü verilerini yükle
    async loadMenuData() {
        try {
            const response = await fetch('menu-data.json');
            this.menuData = await response.json();
            return this.menuData;
        } catch (error) {
            console.error('Menü verileri yüklenirken hata:', error);
            throw error;
        }
    }

    // Fiyat güncelle
    updatePrice(category, index, newPrice) {
        if (category === 'tatlilar' || category === 'extralar') {
            this.menuData[category][index].price = newPrice;
        } else {
            this.menuData.icecekler[category][index].price = newPrice;
        }
        this.saveMenuData();
    }

    // Açıklama güncelle
    updateDescription(category, index, newDescription) {
        if (category === 'tatlilar' || category === 'extralar') {
            this.menuData[category][index].description = newDescription;
        } else {
            this.menuData.icecekler[category][index].description = newDescription;
        }
        this.saveMenuData();
    }

    // Ürün sil
    removeItem(category, index) {
        if (category === 'tatlilar' || category === 'extralar') {
            this.menuData[category].splice(index, 1);
        } else {
            this.menuData.icecekler[category].splice(index, 1);
        }
        this.saveMenuData();
    }

    // Yeni ürün ekle
    addItem(category, item) {
        if (category === 'tatlilar' || category === 'extralar') {
            this.menuData[category].push(item);
        } else {
            this.menuData.icecekler[category].push(item);
        }
        this.saveMenuData();
    }

    // Menü verilerini kaydet (GitHub'a commit yap)
    async saveMenuData() {
        try {
            // JSON dosyasını güncelle
            await this.updateJSONFile();
            
            // index.html'i güncelle
            await this.updateIndexHTML();
            
            // GitHub'a commit yap
            await this.commitToGitHub();
            
            return { success: true, message: 'Menü başarıyla güncellendi!' };
        } catch (error) {
            console.error('Güncelleme hatası:', error);
            return { success: false, message: 'Güncelleme sırasında hata oluştu: ' + error.message };
        }
    }

    // JSON dosyasını güncelle
    async updateJSONFile() {
        // GitHub API kullanarak dosyayı güncelle
        const token = localStorage.getItem('github_token');
        if (!token) {
            throw new Error('GitHub token bulunamadı. Lütfen ayarlardan token ekleyin.');
        }

        const repoOwner = this.getRepoOwner();
        const repoName = this.getRepoName();
        
        const content = btoa(JSON.stringify(this.menuData, null, 2));
        
        // Önce dosyanın SHA'sını al
        const fileResponse = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/menu-data.json`, {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        const fileData = await fileResponse.json();
        
        // Dosyayı güncelle
        const updateResponse = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/menu-data.json`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'Menü verileri güncellendi',
                content: content,
                sha: fileData.sha
            })
        });

        if (!updateResponse.ok) {
            throw new Error('JSON dosyası güncellenemedi');
        }
    }

    // index.html'i güncelle
    async updateIndexHTML() {
        const token = localStorage.getItem('github_token');
        const repoOwner = this.getRepoOwner();
        const repoName = this.getRepoName();
        
        const htmlContent = this.generateIndexHTML();
        const content = btoa(htmlContent);
        
        // Önce dosyanın SHA'sını al
        const fileResponse = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/index.html`, {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        const fileData = await fileResponse.json();
        
        // Dosyayı güncelle
        const updateResponse = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/index.html`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'Menü sitesi güncellendi',
                content: content,
                sha: fileData.sha
            })
        });

        if (!updateResponse.ok) {
            throw new Error('HTML dosyası güncellenemedi');
        }
    }

    // GitHub'a commit yap
    async commitToGitHub() {
        // Bu işlem updateJSONFile ve updateIndexHTML'de otomatik olarak yapılıyor
        return true;
    }

    // Repo bilgilerini al
    getRepoOwner() {
        return localStorage.getItem('repo_owner') || 'kullaniciadi';
    }

    getRepoName() {
        return localStorage.getItem('repo_name') || 'repo-adi';
    }

    // index.html içeriğini oluştur
    generateIndexHTML() {
        // Dinamik tab'ları oluştur
        const tabs = this.menuData.categories.map(category => `
            <div class="tab" onclick="showCategory('${category.id}')">
                <img src="${category.icon}" alt="${category.name}" class="tab-image">
                <div class="tab-title">${category.name}</div>
            </div>
        `).join('');

        // Dinamik kategori bölümlerini oluştur
        const categorySections = this.menuData.categories.map((category, index) => {
            const isActive = index === 0 ? 'active' : '';
            const subcategories = category.subcategories.map(subcategory => 
                this.generateSubcategory(subcategory.name, subcategory.items)
            ).join('');
            
            return `
                <div id="${category.id}" class="category-section ${isActive}">
                    ${subcategories}
                </div>
            `;
        }).join('');

        return `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fika Coffee - Butik Kahve Dükkanı</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }

        .container {
            max-width: 430px;
            margin: 0 auto;
            background: white;
            min-height: 100vh;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }

        .header {
            background: linear-gradient(90deg, #c4390e 0%, #c4390e 100%);
            color: white;
            padding: 20px;
            text-align: center;
            position: relative;
        }

        .admin-link {
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(255,255,255,0.2);
            color: white;
            padding: 5px 10px;
            border-radius: 15px;
            text-decoration: none;
            font-size: 12px;
            transition: all 0.3s ease;
        }

        .admin-link:hover {
            background: rgba(255,255,255,0.3);
        }

        .header-logo {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            object-fit: cover;
            margin: 0 auto 15px;
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .header h1 {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 8px;
            line-height: 1.2;
        }

        .header-subtitle {
            font-size: 14px;
            opacity: 0.9;
            margin-bottom: 10px;
            font-weight: 500;
        }

        .header-slogan {
            font-size: 13px;
            opacity: 0.85;
            font-style: italic;
            line-height: 1.4;
            max-width: 300px;
            margin: 0 auto;
        }

        .tabs {
            display: flex;
            justify-content: space-around;
            padding: 20px 10px;
            background: #f8f9fa;
            border-bottom: 1px solid #e9ecef;
            flex-wrap: wrap;
        }

        .tab {
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            transition: all 0.3s ease;
            padding: 10px;
            border-radius: 15px;
            min-width: 80px;
            margin: 5px;
        }

        .tab:hover {
            background: rgba(196, 57, 14, 0.1);
            transform: translateY(-2px);
        }

        .tab.active {
            background: rgba(196, 57, 14, 0.15);
            transform: translateY(-2px);
        }

        .tab-image {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid #c4390e;
            margin-bottom: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .tab-title {
            font-size: 12px;
            font-weight: 600;
            color: #555;
            text-align: center;
        }

        .content {
            padding: 20px;
        }

        .category-section {
            display: none;
        }

        .category-section.active {
            display: block;
        }

        .subcategory {
            margin-bottom: 15px;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .subcategory-header {
            background: linear-gradient(90deg, #c4390e 0%, #c4390e 100%);
            color: white;
            padding: 15px 20px;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: all 0.3s ease;
            user-select: none;
        }

        .subcategory-header:hover {
            background: linear-gradient(90deg, #a52f0b 0%, #a52f0b 100%);
        }

        .subcategory-title {
            font-size: 16px;
            font-weight: 600;
            margin: 0;
        }

        .subcategory-arrow {
            font-size: 18px;
            transition: transform 0.3s ease;
        }

        .subcategory-arrow.rotated {
            transform: rotate(180deg);
        }

        .subcategory-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
            background: white;
        }

        .subcategory-content.open {
            max-height: 2000px;
        }

        .subcategory-items {
            padding: 15px;
        }

        .menu-item {
            background: #f0f0f0;
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 8px;
            border-left: 3px solid #c4390e;
            transition: all 0.3s ease;
        }

        .menu-item:hover {
            background: #e0e0e0;
            transform: translateX(3px);
        }

        .item-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 8px;
        }

        .item-name {
            font-size: 16px;
            font-weight: 600;
            color: #333;
            flex: 1;
        }

        .item-price {
            font-size: 16px;
            font-weight: bold;
            color: #c4390e;
            margin-left: 10px;
        }

        .item-description {
            font-size: 14px;
            color: #666;
            line-height: 1.4;
        }

        @media (max-width: 480px) {
            .container {
                max-width: 100%;
            }
            
            .tabs {
                padding: 15px 5px;
            }
            
            .tab-image {
                width: 50px;
                height: 50px;
            }
            
            .tab-title {
                font-size: 11px;
            }
            
            .content {
                padding: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <a href="admin.html" class="admin-link">⚙️ Yönetim</a>
            <img src="images/logo.jpeg" alt="Fika Coffee Logo" class="header-logo">
            <h1>Fika Coffee</h1>
            <p class="header-subtitle">Butik Kahve Dükkanı</p>
            <p class="header-slogan">Günlük koşturmaya bir fincan kahve ve tatlı ile ara vererek sakinleş ✨</p>
        </div>

        <div class="tabs">
            ${tabs}
        </div>

        <div class="content">
            ${categorySections}
        </div>
    </div>

    <script>
        function showCategory(categoryId) {
            const categories = document.querySelectorAll('.category-section');
            categories.forEach(category => {
                category.classList.remove('active');
            });

            const tabs = document.querySelectorAll('.tab');
            tabs.forEach(tab => {
                tab.classList.remove('active');
            });

            document.getElementById(categoryId).classList.add('active');
            event.currentTarget.classList.add('active');

            // İlk kategori (genellikle içecekler) için accordion'ları kapat
            const firstCategory = document.querySelector('.category-section.active');
            if (firstCategory && firstCategory.id === 'icecekler') {
                const subcategories = firstCategory.querySelectorAll('.subcategory-content');
                subcategories.forEach(subcategory => {
                    subcategory.classList.remove('open');
                });
                
                const arrows = firstCategory.querySelectorAll('.subcategory-arrow');
                arrows.forEach(arrow => {
                    arrow.classList.remove('rotated');
                });
            } else {
                // Diğer kategoriler için accordion'ları aç
                const currentSubcategories = firstCategory.querySelectorAll('.subcategory-content');
                currentSubcategories.forEach(subcategory => {
                    subcategory.classList.add('open');
                });
                
                const currentArrows = firstCategory.querySelectorAll('.subcategory-arrow');
                currentArrows.forEach(arrow => {
                    arrow.classList.add('rotated');
                });
            }
        }

        function toggleSubcategory(header) {
            const content = header.nextElementSibling;
            const arrow = header.querySelector('.subcategory-arrow');
            
            if (content.classList.contains('open')) {
                content.classList.remove('open');
                arrow.classList.remove('rotated');
            } else {
                content.classList.add('open');
                arrow.classList.add('rotated');
            }
        }

        document.addEventListener('DOMContentLoaded', function() {
            // İlk kategoriyi aktif yap
            const firstTab = document.querySelector('.tab');
            if (firstTab) {
                firstTab.classList.add('active');
            }
            
            // İlk kategori accordion'larını kapat
            const firstCategory = document.querySelector('.category-section.active');
            if (firstCategory) {
                const subcategories = firstCategory.querySelectorAll('.subcategory-content');
                subcategories.forEach(subcategory => {
                    subcategory.classList.remove('open');
                });
                
                const arrows = firstCategory.querySelectorAll('.subcategory-arrow');
                arrows.forEach(arrow => {
                    arrow.classList.remove('rotated');
                });
            }
        });
    </script>
</body>
</html>`;
    }

    // Alt kategori HTML'i oluştur
    generateSubcategory(title, items) {
        let itemsHTML = '';
        items.forEach(item => {
            itemsHTML += `
                <div class="menu-item">
                    <div class="item-header">
                        <div class="item-name">${item.name}</div>
                        <div class="item-price">${item.price}</div>
                    </div>
                    ${item.description ? `<div class="item-description">${item.description}</div>` : ''}
                </div>`;
        });

        return `
            <div class="subcategory">
                <div class="subcategory-header" onclick="toggleSubcategory(this)">
                    <h3 class="subcategory-title">${title}</h3>
                    <span class="subcategory-arrow">▼</span>
                </div>
                <div class="subcategory-content">
                    <div class="subcategory-items">
                        ${itemsHTML}
                    </div>
                </div>
            </div>`;
    }
}

// Global değişken
let menuUpdater;

// Sayfa yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', function() {
    menuUpdater = new MenuUpdater();
});
