import { ProcessingOptions } from '../types/index';

export const processImage = async (file: File, options: ProcessingOptions): Promise<File | null> => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.src = url;

    return new Promise((resolve) => {
        img.onload = async () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                resolve(null);
                return;
            }

            const { width, height } = img;
            let newWidth = width;
            let newHeight = height;

            if (file.size > options.maxFileSize || width > options.maxWidth || height > options.maxHeight) {
                const aspectRatio = width / height;

                if (file.size > options.maxFileSize) {
                    const scale = Math.sqrt(options.maxFileSize / file.size);
                    newWidth = Math.floor(width * scale);
                    newHeight = Math.floor(height * scale);
                }

                if (newWidth > options.maxWidth || newHeight > options.maxHeight) {
                    if (newWidth / options.maxWidth > newHeight / options.maxHeight) {
                        newHeight = Math.floor(newWidth / aspectRatio);
                        newWidth = options.maxWidth;
                    } else {
                        newWidth = Math.floor(newHeight * aspectRatio);
                        newHeight = options.maxHeight;
                    }
                }
            }

            canvas.width = newWidth;
            canvas.height = newHeight;
            ctx.drawImage(img, 0, 0, newWidth, newHeight);

            canvas.toBlob((blob) => {
                if (blob) {
                    const optimizedFile = new File([blob], file.name, { type: file.type });
                    resolve(optimizedFile);
                } else {
                    resolve(null);
                }
            }, file.type);
        };

        img.onerror = () => {
            resolve(null);
        };
    });
};