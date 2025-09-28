// Ultra-minimal React test - no dependencies, no imports
console.log('🚀 Ultra-minimal React test starting...');

// Create a simple div without React
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('❌ Root element not found');
  throw new Error('Root element not found');
}

// Test if we can create elements without React
const testDiv = document.createElement('div');
testDiv.innerHTML = `
  <div style="
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f0f2f5;
    font-family: Arial, sans-serif;
    color: #333;
    padding: 20px;
  ">
    <h1 style="color: #4CAF50; font-size: 2.5em; margin-bottom: 20px;">
      ✅ Ultra-Minimal Test (No React)
    </h1>
    <p style="font-size: 1.2em; margin-bottom: 10px;">
      This page loads without React at all!
    </p>
    <div style="
      background-color: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      text-align: left;
      max-width: 500px;
      width: 100%;
    ">
      <h2 style="font-size: 1.5em; margin-bottom: 10px; color: #555;">Test Results:</h2>
      <ul style="font-size: 1em; line-height: 1.6;">
        <li>✅ HTML rendering works</li>
        <li>✅ CSS styling works</li>
        <li>✅ JavaScript execution works</li>
        <li>✅ No React dependencies</li>
      </ul>
      <p style="margin-top: 15px; font-size: 0.9em; color: #777;">
        If you see this, the issue is specifically with React, not the build process.
      </p>
    </div>
  </div>
`;

rootElement.appendChild(testDiv);
console.log('✅ Ultra-minimal test rendered successfully without React!');
