# Image Optimizer Chrome Extension

This project is a Chrome extension designed to optimize images by resizing and compressing them while maintaining their aspect ratio. The extension allows users to upload images, check their dimensions and file size, and download the optimized version if the original exceeds specified limits.

## Features

- Upload images directly from your device.
- Display the uploaded image in a user-friendly interface.
- Automatically process images that exceed 5MB or dimensions of 2000x2000 pixels.
- Maintain the original aspect ratio during resizing.
- Download the optimized image after processing.

## Project Structure

```
image-optimizer-extension
├── src
│   ├── popup
│   │   ├── popup.html       # HTML structure for the popup interface
│   │   ├── popup.css        # Styles for the popup interface
│   │   └── popup.ts         # TypeScript code for popup functionality
│   ├── background
│   │   └── background.ts     # Background script for handling events
│   ├── utils
│   │   └── imageProcessor.ts  # Functions for image processing
│   └── types
│       └── index.ts          # TypeScript interfaces and types
├── public
│   ├── manifest.json         # Manifest file for the Chrome extension
│   ├── icons
│   │   ├── icon16.svg        # 16x16 pixel icon
│   │   ├── icon48.svg        # 48x48 pixel icon
│   │   └── icon128.svg       # 128x128 pixel icon
│   └── assets                # Additional assets (images, fonts, etc.)
├── webpack.config.js         # Webpack configuration file
├── tsconfig.json             # TypeScript configuration file
├── package.json              # npm configuration file
└── README.md                 # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd image-optimizer-extension
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Build the project:
   ```
   npm run build
   ```

5. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`.
   - Enable "Developer mode".
   - Click "Load unpacked" and select the `public` directory.

## Usage

1. Click on the extension icon in the Chrome toolbar.
2. Use the upload button to select an image from your device.
3. The uploaded image will be displayed in the popup.
4. If the image exceeds the size or dimension limits, it will be processed automatically.
5. After processing, a download button will appear to save the optimized image.

## License

This project is licensed under the MIT License. See the LICENSE file for details.