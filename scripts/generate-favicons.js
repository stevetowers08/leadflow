const fs = require('fs');
const path = require('path');

// Simple favicon generation script
// This creates basic favicon files from our SVG design

const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="faviconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#8B5CF6" />
      <stop offset="50%" stopColor="#7C3AED" />
      <stop offset="100%" stopColor="#5B21B6" />
    </linearGradient>
  </defs>
  
  <!-- Simplified hexagonal shape -->
  <path
    d="M16 2L28 8L28 24L16 30L4 24L4 8L16 2Z"
    fill="url(#faviconGradient)"
  />
  
  <!-- Simplified rocket -->
  <path
    d="M16 6L20 10L20 18L22 20L20 22L20 26L16 28L12 26L12 22L10 20L12 18L12 10L16 6Z"
    fill="white"
  />
  
  <!-- Rocket center dot -->
  <circle cx="16" cy="20" r="1.5" fill="white" />
</svg>`;

// Write the SVG favicon
fs.writeFileSync(path.join(__dirname, '../public/favicon.svg'), svgContent);

// Create a simple HTML preview
const previewHtml = `<!DOCTYPE html>
<html>
<head>
  <title>Favicon Preview</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      padding: 20px; 
      background: #f5f5f5; 
    }
    .preview { 
      display: flex; 
      gap: 20px; 
      align-items: center; 
      margin: 20px 0; 
    }
    .favicon { 
      width: 32px; 
      height: 32px; 
    }
    .favicon-large { 
      width: 64px; 
      height: 64px; 
    }
  </style>
</head>
<body>
  <h1>Empowr CRM Favicon Preview</h1>
  <div class="preview">
    <div class="favicon">${svgContent}</div>
    <div class="favicon-large">${svgContent}</div>
    <div>
      <p><strong>32x32px</strong> - Browser tab size</p>
      <p><strong>64x64px</strong> - Bookmark size</p>
    </div>
  </div>
  
  <h2>Instructions for PNG/ICO Generation:</h2>
  <p>To generate PNG and ICO files from this SVG:</p>
  <ol>
    <li>Open the SVG in a graphics editor (Inkscape, GIMP, or online converter)</li>
    <li>Export as PNG at 32x32px for favicon-32x32.png</li>
    <li>Export as PNG at 16x16px for favicon-16x16.png</li>
    <li>Use an online ICO converter to create favicon.ico</li>
    <li>For Apple touch icon, export as PNG at 180x180px</li>
  </ol>
  
  <p><strong>Note:</strong> The SVG is already optimized for small sizes with simplified shapes and high contrast colors.</p>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, '../public/favicon-preview.html'), previewHtml);

console.log('✅ Generated favicon.svg');
console.log('✅ Created favicon-preview.html');
console.log('📝 Next steps:');
console.log('   1. Open public/favicon-preview.html in your browser');
console.log('   2. Use a graphics editor to export PNG/ICO versions');
console.log('   3. Replace the existing favicon files in public/');
