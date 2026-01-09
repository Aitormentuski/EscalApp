export const compressImage = (file) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 1200; // Slightly increased from original
                const scaleSize = MAX_WIDTH / img.width;
                canvas.width = MAX_WIDTH;
                canvas.height = img.height * scaleSize;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                // Convert to blob for upload convenience if needed, but keeping dataURL for now as per original logic flow usually
                // modifying to return Blob might be better for fetch upload, but let's stick to base64 or blob.
                // The backend mostly expects a file upload via multer.
                // So we actually need to convert this canvas back to a File/Blob.

                canvas.toBlob((blob) => {
                    resolve(blob);
                }, 'image/jpeg', 0.8);
            }
        }
    })
};
