/**
 * Utility to download a base64 image in a specific format
 */
export async function downloadBase64Image(base64Data: string, fileName: string, format: 'png' | 'jpeg') {
  return new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Fill background for JPEG (since PNG might have transparency)
      if (format === 'jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);
      
      const mimeType = `image/${format}`;
      const dataUrl = canvas.toDataURL(mimeType, 0.9);
      
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${fileName}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      resolve();
    };
    img.onerror = reject;
    img.src = base64Data;
  });
}
