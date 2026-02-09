import imageCompression from 'browser-image-compression';

export async function optimizeImage(file: File): Promise<File> {
    const options = {
        maxSizeMB: 0.5, // Maksimum 500KB
        maxWidthOrHeight: 1920, // FHD çözünürlük sınırı
        useWebWorker: true,
        fileType: 'image/jpeg' // JPEG formatına dönüştür (PDF uyumluluğu için)
    };

    try {
        const compressedBlob = await imageCompression(file, options);
        // Blob'u tekrar File nesnesine dönüştür
        return new File([compressedBlob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
            type: 'image/jpeg',
            lastModified: Date.now(),
        });
    } catch (error) {
        console.error("Görsel optimizasyon hatası:", error);
        return file; // Hata durumunda orijinal dosyayı döndür
    }
}
