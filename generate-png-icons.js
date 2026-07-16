const fs = require('fs');
const path = require('path');

// Sharp kütüphanesini kullanarak SVG'yi PNG'ye dönüştürme
async function generateIcons() {
  try {
    // Proje kökündeki node_modules'tan sharp'ı çek
    const sharp = require('sharp');
    const svgPath = path.join(__dirname, 'public', 'icon.svg');
    
    console.log('PNG ikonları oluşturuluyor...');
    
    await sharp(svgPath)
      .resize(192, 192)
      .png()
      .toFile(path.join(__dirname, 'public', 'icon-192x192.png'));
      
    await sharp(svgPath)
      .resize(512, 512)
      .png()
      .toFile(path.join(__dirname, 'public', 'icon-512x512.png'));
      
    console.log('✅ PNG ikonları başarıyla oluşturuldu: public/icon-192x192.png ve public/icon-512x512.png');
  } catch (error) {
    console.error('İkon oluşturulurken hata:', error);
  }
}

generateIcons();
