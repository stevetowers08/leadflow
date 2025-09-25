// Using built-in fetch (Node.js 18+)

// Test companies from the database
const testCompanies = [
  { name: "aXcelerate", website: "http://www.axcelerate.com.au" },
  { name: "Objective Corporation", website: "https://www.objective.com.au" },
  { name: "Proofpoint", website: "https://www.proofpoint.com" },
  { name: "MediaForm", website: "https://www.mediaform.com.au" },
  { name: "Nightingale Software", website: "https://www.nightingalesoftware.com.au" },
  { name: "One Identity", website: "https://www.oneidentity.com/" },
  { name: "Sentrient", website: "https://www.sentrient.com.au/" },
  { name: "AvePoint", website: "https://www.avepoint.com" },
  { name: "Zenith Payments Pty Ltd", website: "http://www.zenithpayments.com.au" },
  { name: "Cvent", website: "https://bit.ly/3vyiQnI" }, // This is a redirect URL!
];

const getClearbitLogo = (companyName, website) => {
  try {
    // Try website domain first (most reliable)
    if (website) {
      const domain = website
        .replace(/^https?:\/\//, '') // Remove protocol
        .replace(/^www\./, '') // Remove www
        .split('/')[0] // Get domain only
        .split('?')[0]; // Remove query params
      
      return `https://logo.clearbit.com/${domain}`;
    }
    
    // Fallback: try common domain patterns
    const cleanName = companyName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '') // Remove special chars
      .replace(/\s+/g, ''); // Remove spaces
    
    return `https://logo.clearbit.com/${cleanName}.com`;
  } catch (error) {
    console.error('Error generating Clearbit logo URL:', error);
    return null;
  }
};

const testLogoUrl = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

const testCompany = async (company) => {
  console.log(`\n📊 ${company.name}:`);
  console.log(`   Website: ${company.website}`);
  
  const logoUrl = getClearbitLogo(company.name, company.website);
  console.log(`   Generated URL: ${logoUrl}`);
  
  if (logoUrl) {
    const isValid = await testLogoUrl(logoUrl);
    console.log(`   Status: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
  } else {
    console.log(`   Status: ❌ No URL generated`);
  }
};

const runTests = async () => {
  console.log('🧪 Testing Company Logo URL Generation...\n');
  
  for (const company of testCompanies) {
    await testCompany(company);
  }
  
  console.log('\n🎯 Test complete!');
};

runTests();
