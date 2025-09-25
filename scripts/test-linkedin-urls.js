// Test LinkedIn URLs for CORS issues

const testLinkedInUrls = [
  "https://media.licdn.com/dms/image/v2/D560BAQFkqTiqyX06eg/company-logo_200_200/company-logo_200_200/0/1736124770595/axcelerate_student_training_rto_management_systems_logo?e=2147483647&v=beta&t=IuRxKyaFZQ3RRokyxiGd7Ne9DpAbRMC-4utNhyuonZw",
  "https://media.licdn.com/dms/image/v2/C4D0BAQF7whw6w5LRHA/company-logo_200_200/company-logo_200_200/0/1631356460568?e=2147483647&v=beta&t=-TDvmKWx3HJ0ASETVXp7kQToUBcC2XQkRo4aRfY5Uhk",
  "https://media.licdn.com/dms/image/v2/D4E0BAQFEzwJn3C-nDQ/company-logo_200_200/company-logo_200_200/0/1726764831463/proofpoint_logo?e=2147483647&v=beta&t=aStCpDbDFQICbN9BUt0d1yiPC2JKrPbtDYfj8bIspj0"
];

const testLogoUrl = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log(`Content-Type: ${response.headers.get('content-type')}`);
    console.log(`CORS Headers: ${response.headers.get('access-control-allow-origin')}`);
    return response.ok;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    return false;
  }
};

const testLinkedInUrl = async (url, index) => {
  console.log(`\n📊 LinkedIn URL ${index + 1}:`);
  console.log(`URL: ${url.substring(0, 100)}...`);
  
  const isValid = await testLogoUrl(url);
  console.log(`Result: ${isValid ? '✅ Accessible' : '❌ Not accessible'}`);
};

const runTests = async () => {
  console.log('🧪 Testing LinkedIn URLs for CORS issues...\n');
  
  for (let i = 0; i < testLinkedInUrls.length; i++) {
    await testLinkedInUrl(testLinkedInUrls[i], i);
  }
  
  console.log('\n🎯 Test complete!');
};

runTests();



