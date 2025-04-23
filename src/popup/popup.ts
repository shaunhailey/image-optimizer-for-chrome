// This file contains the TypeScript code for the popup functionality of the Chrome extension.
// It handles image uploads, displays the uploaded image, processes the image to check its size and dimensions,
// and provides a download link for the optimized image.

import './popup.css';
import { processImage } from '../utils/imageProcessor';
import { ProcessingOptions } from '../types/index';
import { SettingsService } from '../utils/settingsService';
import { SettingsUI } from './settings';

const uploadButton = document.getElementById('uploadButton') as HTMLInputElement;
const imageView = document.getElementById('imageView') as HTMLImageElement;
const downloadButton = document.getElementById('downloadButton') as HTMLAnchorElement;
const imageInfo = document.getElementById('image-info') as HTMLDivElement;
const processingStatus = document.getElementById('processing-status') as HTMLDivElement;

// Initialize settings UI
const settingsUI = new SettingsUI('settings-container', (newOptions) => {
  // This callback is called whenever settings are changed
  console.log('Settings updated:', newOptions);
});

// Current settings
let currentSettings: ProcessingOptions;

// Initialize and load settings
async function initialize() {
  currentSettings = await SettingsService.getSettings();
  uploadButton.addEventListener('change', handleImageUpload);
}

function handleImageUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    const reader = new FileReader();
    
    // Store the original filename without extension
    const originalFilename = file.name.replace(/\.[^/.]+$/, "");

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

async function processAndOptimizeImage(file: File, originalFilename: string) {
  processingStatus.textContent = 'Optimizing image...';
  
  try {
    const optimizedImage = await processImage(file, currentSettings);
    
    if (optimizedImage) {
      const url = URL.createObjectURL(optimizedImage);
      
      // Set download filename using original name + "_optimized"
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

// Initialize the popup
initialize();

document.addEventListener('DOMContentLoaded', () => {
  const openTabButton = document.getElementById('openTabButton');
  if (openTabButton) {
    openTabButton.addEventListener('click', () => {
      chrome.tabs.create({ url: chrome.runtime.getURL('tab/tab.html') });
    });
  }
});