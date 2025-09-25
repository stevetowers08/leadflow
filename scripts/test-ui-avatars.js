// Test UI Avatars service

const testNames = [
  "Georgia Hinks",
  "James Demetrios", 
  "Blair Hasforth",
  "Sarah Jarman",
  "Pavel Kamychnikov",
  "Neill Wiffin",
  "Scott Smedley",
  "Pamela Ong",
  "Damon Etherington",
  "Paul Vella"
];

const getInitials = (name) => {
  if (!name) return '?';
  
  const words = name.trim().split(' ');
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  
  return words
    .slice(0, 2)
    .map(word => word.charAt(0).toUpperCase())
    .join('');
};

const getUIAvatarUrl = (name, size = 40, backgroundColor = '4f46e5', textColor = 'ffffff') => {
  const initials = getInitials(name);
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&size=${size}&background=${backgroundColor}&color=${textColor}&format=png`;
};

const testUIAvatar = async (name, index) => {
  console.log(`\n📊 Avatar ${index + 1}:`);
  console.log(`Name: ${name}`);
  
  const initials = getInitials(name);
  console.log(`Initials: ${initials}`);
  
  const avatarUrl = getUIAvatarUrl(name, 40);
  console.log(`Avatar URL: ${avatarUrl}`);
  
  try {
    const response = await fetch(avatarUrl, { method: 'HEAD' });
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log(`Content-Type: ${response.headers.get('content-type')}`);
    console.log(`Result: ${response.ok ? '✅ Valid' : '❌ Invalid'}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    console.log(`Result: ❌ Invalid`);
  }
};

const runTests = async () => {
  console.log('🧪 Testing UI Avatars Service...\n');
  
  for (let i = 0; i < testNames.length; i++) {
    await testUIAvatar(testNames[i], i);
  }
  
  console.log('\n🎯 Test complete!');
  console.log('\n💡 UI Avatars generates professional-looking avatar images from initials');
};

runTests();



