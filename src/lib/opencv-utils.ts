
export interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}

// Backend API URL (Environment variable or hardcoded relative path)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const API_URL = `${BASE_URL}/tools/magic-scan`;

export async function detectQuestionBlocks(
    imageFile: File | Blob,
    roi?: { x: number; y: number; width: number; height: number }
): Promise<Rect[]> {
    console.log("🚀 Magic Scan: Sending request to Backend...");

    const formData = new FormData();
    formData.append('image', imageFile, 'page_scan.png');

    if (roi) {
        console.log("ROI Sent:", roi);
        formData.append('roiX', roi.x.toString());
        formData.append('roiY', roi.y.toString());
        formData.append('roiW', roi.width.toString());
        formData.append('roiH', roi.height.toString());
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Backend Error:", errorText);
            throw new Error(`Sunucu hatası: ${response.statusText}`);
        }

        const rects: Rect[] = await response.json();
        console.log(`✅ Magic Scan: Received ${rects.length} blocks from Backend.`);
        return rects;

    } catch (error) {
        console.error("Magic Scan Request Failed:", error);
        throw error;
    }
}
