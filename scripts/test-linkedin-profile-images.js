// Test LinkedIn profile image URL generation

const testLinkedInUrls = [
  "https://www.linkedin.com/in/georgia-hinks-7443b034a",
  "https://www.linkedin.com/in/james-demetrios-596096b0",
  "https://www.linkedin.com/in/ACwAAADWE7oB1FD64dzt9CaP8Mgmkzw2Yt1FjvQ",
  "https://www.linkedin.com/in/ACwAADBXEFUBIeEdfQjPkp1MWp2yCUJ7xf3j0zI",
  "https://www.linkedin.com/in/ACwAAAdebqMBamtw7bVKv4XhaFK1825UvkrcWg0"
];

const getLinkedInProfileImageUrl = (linkedinUrl, size = 'medium') => {
  if (!linkedinUrl) return null;

  try {
    // Validate LinkedIn URL format
    if (!linkedinUrl.includes('linkedin.com/in/')) {
      return null;
    }

    // Extract the base profile URL (remove any additional parameters)
    const baseUrl = linkedinUrl.split('?')[0];
    
    // Add /picture to the URL
    const profileImageUrl = `${baseUrl}/picture`;
    
    // Add size parameter if specified
    const sizeParams = {
      small: '?size=small',
      medium: '?size=medium', 
      large: '?size=large'
    };
    
    return `${profileImageUrl}${sizeParams[size]}`;
  } catch (error) {
    console.error('Error generating LinkedIn profile image URL:', error);
    return null;
  }
};

const testLinkedInProfileImageUrl = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log(`Content-Type: ${response.headers.get('content-type')}`);
    return response.ok;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    return false;
  }
};

const testLinkedInProfile = async (linkedinUrl, index) => {
  console.log(`\n📊 LinkedIn Profile ${index + 1}:`);
  console.log(`Original URL: ${linkedinUrl}`);
  
  const imageUrl = getLinkedInProfileImageUrl(linkedinUrl);
  console.log(`Generated Image URL: ${imageUrl}`);
  
  if (imageUrl) {
    const isValid = await testLinkedInProfileImageUrl(imageUrl);
    console.log(`Status: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
  } else {
    console.log(`Status: ❌ No URL generated`);
  }
};

const runTests = async () => {
  console.log('🧪 Testing LinkedIn Profile Image URL Generation...\n');
  
  for (let i = 0; i < testLinkedInUrls.length; i++) {
    await testLinkedInProfile(testLinkedInUrls[i], i);
  }
  
  console.log('\n🎯 Test complete!');
};

runTests();



