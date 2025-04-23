// This file contains the background script for the Chrome extension.
// It handles events such as image processing requests and communication 
// between the popup and background.

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "processImage") {
        // Handle image processing request
        const { imageData } = request;
        // Call the image processing function (to be implemented in utils/imageProcessor.ts)
        // Example: processImage(imageData).then(optimizedImage => sendResponse({ optimizedImage }));
        
        // Return true to indicate that the response will be sent asynchronously
        return true;
    }
});