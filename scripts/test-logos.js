/**
 * Test script for Clearbit Logo API
 * Run with: node scripts/test-logos.js
 */

const testCompanies = [
  { name: 'Google', website: 'https://google.com' },
  { name: 'Microsoft', website: 'https://microsoft.com' },
  { name: 'Apple', website: 'https://apple.com' },
  { name: 'Tesla', website: 'https://tesla.com' },
  { name: 'Netflix', website: 'https://netflix.com' },
  { name: 'Spotify', website: 'https://spotify.com' },
  { name: 'Airbnb', website: 'https://airbnb.com' },
  { name: 'Uber', website: 'https://uber.com' }
];

function getClearbitLogo(companyName, website) {
  try {
    if (website) {
      const domain = website
        .replace(/^https?:\/\//, '') // Remove protocol
        .replace(/^www\./, '') // Remove www
        .split('/')[0] // Get domain only
        .split('?')[0]; // Remove query params
      
      return `https://logo.clearbit.com/${domain}`;
    }
    
    const cleanName = companyName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '') // Remove special chars
      .replace(/\s+/g, ''); // Remove spaces
    
    return `https://logo.clearbit.com/${cleanName}.com`;
  } catch (error) {
    console.error('Error generating Clearbit logo URL:', error);
    return null;
  }
}

async function testLogoUrl(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

async function testAllLogos() {
  console.log('🧪 Testing Clearbit Logo API...\n');
  
  for (const company of testCompanies) {
    const logoUrl = getClearbitLogo(company.name, company.website);
    console.log(`📊 ${company.name}:`);
    console.log(`   Website: ${company.website}`);
    console.log(`   Logo URL: ${logoUrl}`);
    
    if (logoUrl) {
      const isValid = await testLogoUrl(logoUrl);
      console.log(`   Status: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
    } else {
      console.log(`   Status: ❌ No URL generated`);
    }
    console.log('');
  }
  
  console.log('🎯 Test complete! Copy any valid URLs to update your companies.');
}

// Run the test
testAllLogos().catch(console.error);



