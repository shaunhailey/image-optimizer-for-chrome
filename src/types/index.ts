export interface ImageData {
    file: File;
    width: number;
    height: number;
    size: number; // in bytes
}

export interface ProcessingOptions {
    maxFileSize: number;  // in bytes
    maxWidth: number;     // in pixels
    maxHeight: number;    // in pixels
    quality?: number;     // 0-1 for JPEG quality
    format?: string;      // output format (e.g., 'jpeg', 'png')
}

export interface Preset {
    name: string;
    description: string;
    options: ProcessingOptions;
}

// Default settings
export const DEFAULT_SETTINGS: ProcessingOptions = {
    maxFileSize: 5000000,  // 5MB
    maxWidth: 2000,
    maxHeight: 2000,
    quality: 0.9,
    format: 'png'
};

// Predefined presets for different use cases
export const DEFAULT_PRESETS: Preset[] = [
    {
        name: "Standard",
        description: "Balances quality and file size (5MB, 2000×2000px)",
        options: { ...DEFAULT_SETTINGS }
    },
    {
        name: "High Quality",
        description: "Preserves quality (8MB, 3000×3000px)",
        options: {
            maxFileSize: 8000000,  // 8MB
            maxWidth: 3000,
            maxHeight: 3000,
            quality: 0.95,
            format: 'png'
        }
    },
    {
        name: "Web Optimized",
        description: "Fast loading for web (2MB, 1200×1200px)",
        options: {
            maxFileSize: 2000000,  // 2MB
            maxWidth: 1200,
            maxHeight: 1200,
            quality: 0.85,
            format: 'jpeg'
        }
    },
    {
        name: "Social Media",
        description: "Ideal for social platforms (1MB, 1080×1080px)",
        options: {
            maxFileSize: 1000000,  // 1MB
            maxWidth: 1080,
            maxHeight: 1080,
            quality: 0.8,
            format: 'jpeg'
        }
    },
    {
        name: "Custom",
        description: "Your personalized settings",
        options: { ...DEFAULT_SETTINGS }
    }
];