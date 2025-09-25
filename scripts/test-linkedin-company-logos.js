// Test LinkedIn company logo URLs from database

const testLinkedInUrls = [
  "https://media.licdn.com/dms/image/v2/D560BAQFkqTiqyX06eg/company-logo_200_200/company-logo_200_200/0/1736124770595/axcelerate_student_training_rto_management_systems_logo?e=2147483647&v=beta&t=IuRxKyaFZQ3RRokyxiGd7Ne9DpAbRMC-4utNhyuonZw",
  "https://media.licdn.com/dms/image/v2/C4D0BAQF7whw6w5LRHA/company-logo_200_200/company-logo_200_200/0/1631356460568?e=2147483647&v=beta&t=-TDvmKWx3HJ0ASETVXp7kQToUBcC2XQkRo4aRfY5Uhk",
  "https://media.licdn.com/dms/image/v2/D4E0BAQFEzwJn3C-nDQ/company-logo_200_200/company-logo_200_200/0/1726764831463/proofpoint_logo?e=2147483647&v=beta&t=aStCpDbDFQICbN9BUt0d1yiPC2JKrPbtDYfj8bIspj0"
];

const testLinkedInLogoUrl = async (url, index) => {
  console.log(`\n📊 LinkedIn Logo ${index + 1}:`);
  console.log(`URL: ${url.substring(0, 100)}...`);
  
  try {
    const response = await fetch(url, { method: 'HEAD' });
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log(`Content-Type: ${response.headers.get('content-type')}`);
    console.log(`CORS Headers: ${response.headers.get('access-control-allow-origin')}`);
    console.log(`Result: ${response.ok ? '✅ Valid' : '❌ Invalid'}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    console.log(`Result: ❌ Invalid`);
  }
};

const runTests = async () => {
  console.log('🧪 Testing LinkedIn Company Logo URLs from Database...\n');
  
  for (let i = 0; i < testLinkedInUrls.length; i++) {
    await testLinkedInLogoUrl(testLinkedInUrls[i], i);
  }
  
  console.log('\n🎯 Test complete!');
  console.log('\n💡 If these are failing, use LogoManager to replace with Clearbit URLs');
};

runTests();



