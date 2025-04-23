import { ProcessingOptions } from '../types/index';

export async function processImage(
  file: File, 
  options: ProcessingOptions,
): Promise<Blob | null> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Calculate dimensions
        let width = img.width;
        let height = img.height;
        let needsResize = false;
        
        // Check if resize is needed
        if (width > options.maxWidth || height > options.maxHeight) {
          needsResize = true;
          const ratio = Math.min(
            options.maxWidth / width,
            options.maxHeight / height
          );
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        }
        
        // Create canvas for processing
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        // Draw image on canvas
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Start with high quality
        let quality = options.quality || 0.9;
        let imageBlob: Blob;
        let dataURL: string;
        
        // First pass - resize if needed
        dataURL = canvas.toDataURL(options.format === 'jpeg' ? 'image/jpeg' : 'image/png', quality);
        
        // Check if we need to compress further
        // Convert dataURL to blob
        function dataURLToBlob(dataURL: string): Promise<Blob> {
          return new Promise((resolve) => {
            const byteString = atob(dataURL.split(',')[1]);
            const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            
            for (let i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i);
            }
            
            resolve(new Blob([ab], { type: mimeString }));
          });
        }
        
        // Iteratively compress until filesize is under maxFileSize
        const compressIteration = async (currentQuality: number): Promise<Blob> => {
          // Get dataURL with current quality
          const iterationDataURL = canvas.toDataURL(
            options.format === 'jpeg' ? 'image/jpeg' : 'image/png',
            currentQuality
          );
          
          // Convert to blob to check size
          const blob = await dataURLToBlob(iterationDataURL);
          
          // Check if size is under limit
          if (blob.size <= options.maxFileSize || currentQuality < 0.1) {
            console.log(`Final quality: ${currentQuality}, size: ${blob.size / 1000000}MB`);
            return blob;
          }
          
          // Reduce quality and try again
          const newQuality = Math.max(currentQuality - 0.1, 0.1);
          return compressIteration(newQuality);
        };
        
        // Start compression process
        compressIteration(quality)
          .then(finalBlob => {
            resolve(finalBlob);
          })
          .catch(err => {
            console.error("Error during image compression:", err);
            resolve(null);
          });
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.readAsDataURL(file);
  });
}