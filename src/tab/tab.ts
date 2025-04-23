import { processImage } from '../utils/imageProcessor';
import { ProcessingOptions } from '../types/index';
import { SettingsService } from '../utils/settingsService';
import './tab.css';
// Re-use all the functionality from popup.ts
import '../popup/popup';

document.addEventListener('DOMContentLoaded', () => {
  // Get DOM elements
  const uploadButton = document.getElementById('uploadButton') as HTMLInputElement;
  const imageView = document.getElementById('imageView') as HTMLImageElement;
  const downloadButton = document.getElementById('downloadButton') as HTMLAnchorElement;
  const imageInfo = document.getElementById('image-info') as HTMLDivElement;
  const processingStatus = document.getElementById('processing-status') as HTMLDivElement;
  
  // Initial settings
  let currentSettings: ProcessingOptions;
  
  // Initialize
  async function initialize() {
    // Get settings from service
    currentSettings = await SettingsService.getSettings();
    uploadButton.addEventListener('change', handleImageUpload);
  }
  
  // Handle image upload
  function handleImageUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      // Extract original filename without extension
      const originalFilename = file.name.replace(/\.[^/.]+$/, "");
      
      const reader = new FileReader();
      
      processingStatus.textContent = 'Loading image...';
      
      reader.onload = (e) => {
        const imgSrc = e.target?.result as string;
        imageView.src = imgSrc;
        
        // Display original image info
        const img = new Image();
        img.onload = () => {
          const width = img.width;
          const height = img.height;
          const fileSizeMB = file.size / (1024 * 1024);
          
          imageInfo.innerHTML = `
            <p><strong>Original:</strong> ${width}×${height}px, ${fileSizeMB.toFixed(2)}MB</p>
          `;
          
          processAndOptimizeImage(file, originalFilename);
        };
        img.src = imgSrc;
      };
      
      reader.readAsDataURL(file);
    }
  }
  
  // Process and optimize image
  async function processAndOptimizeImage(file: File, originalFilename: string) {
    processingStatus.textContent = 'Optimizing image...';
    
    try {
      const optimizedImage = await processImage(file, currentSettings);
      
      if (optimizedImage) {
        const url = URL.createObjectURL(optimizedImage);
        
        // Use original filename + "_optimized" for the download
        const format = currentSettings.format || 'png';
        downloadButton.href = url;
        downloadButton.download = `${originalFilename}_optimized.${format}`;
        downloadButton.style.display = 'block';
        
        // Display optimized image info
        const img = new Image();
        img.onload = () => {
          const width = img.width;
          const height = img.height;
          const fileSizeMB = optimizedImage.size / (1024 * 1024);
          
          const existingInfo = imageInfo.innerHTML;
          imageInfo.innerHTML = `
            ${existingInfo}
            <p><strong>Optimized:</strong> ${width}×${height}px, ${fileSizeMB.toFixed(2)}MB</p>
          `;
          
          processingStatus.textContent = 'Image optimized successfully!';
        };
        img.src = url;
      }
    } catch (error) {
      console.error('Error optimizing image:', error);
      processingStatus.textContent = 'Error optimizing image. Please try again.';
    }
  }
  
  initialize();
});