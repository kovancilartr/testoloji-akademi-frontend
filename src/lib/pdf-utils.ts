import { PixelCrop, Crop } from "react-image-crop";

export const getAutoFocusedCrop = (canvas: HTMLCanvasElement, pixelCrop: PixelCrop): PixelCrop => {
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return pixelCrop;

    const scaleX = canvas.width / canvas.clientWidth;
    const scaleY = canvas.height / canvas.clientHeight;

    const sourceX = Math.floor(pixelCrop.x * scaleX);
    const sourceY = Math.floor(pixelCrop.y * scaleY);
    const sourceWidth = Math.floor(pixelCrop.width * scaleX);
    const sourceHeight = Math.floor(pixelCrop.height * scaleY);

    if (sourceWidth <= 0 || sourceHeight <= 0) return pixelCrop;

    const imageData = ctx.getImageData(sourceX, sourceY, sourceWidth, sourceHeight);
    const data = imageData.data;

    let minX = sourceWidth, minY = sourceHeight, maxX = 0, maxY = 0;
    let found = false;
    const threshold = 5;

    for (let y = 0; y < sourceHeight; y++) {
        for (let x = 0; x < sourceWidth; x++) {
            const i = (y * sourceWidth + x) * 4;
            if ((data[i] < 255 - threshold || data[i + 1] < 255 - threshold || data[i + 2] < 255 - threshold) && data[i + 3] > 10) {
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
                found = true;
            }
        }
    }

    if (!found) return pixelCrop;

    const padding = 10;
    const finalSourceX = Math.max(0, sourceX + minX - (padding * scaleX));
    const finalSourceY = Math.max(0, sourceY + minY - (padding * scaleY));
    const finalSourceWidth = Math.min(canvas.width - finalSourceX, (maxX - minX) + (padding * 2 * scaleX));
    const finalSourceHeight = Math.min(canvas.height - finalSourceY, (maxY - minY) + (padding * 2 * scaleY));

    return {
        unit: 'px',
        x: finalSourceX / scaleX,
        y: finalSourceY / scaleY,
        width: finalSourceWidth / scaleX,
        height: finalSourceHeight / scaleY
    };
};

export const convertToPercent = (pixelCrop: PixelCrop, width: number, height: number): Crop => {
    return {
        unit: '%',
        x: (pixelCrop.x / width) * 100,
        y: (pixelCrop.y / height) * 100,
        width: (pixelCrop.width / width) * 100,
        height: (pixelCrop.height / height) * 100
    };
};
