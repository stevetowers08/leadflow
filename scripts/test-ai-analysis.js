// Test script to analyze the 3 existing reply messages
const testMessages = [
  {
    id: "29176b80-9289-4d4d-adc3-192ac77b1de0",
    name: "Matthew Lowe",
    message: "Hi Daniel,\n\"Unfortunately\", the process is being handled by our internal recruitment team. Its always a challenge working this way, but I need to let them run the process first to see if they can find the needle in the haystack so to say. If not, I'll be pushing for external assistance.\n\nThanks, Matt"
  },
  {
    id: "ec5f6a9b-5fb3-4b5a-bc2f-1f17e242d683", 
    name: "Tercio Couceiro",
    message: "pls connect with - @Warren Zietsman"
  },
  {
    id: "93cf5c77-239a-413a-bfb3-777c061c3331",
    name: "Gregg McCallum", 
    message: "Hi Daniel, thanks for the reach out. I'm not the correct person inside Nearmap, as it turns out I've recently resigned and starting my next role in a few weeks. Happy to connect in any case."
  }
];

// Simulate AI analysis (since we don't have Google AI API key set up)
function analyzeMessage(message) {
  const lowerMessage = message.toLowerCase();
  
  // Simple rule-based analysis for testing
  if (lowerMessage.includes('not interested') || 
      lowerMessage.includes('unfortunately') || 
      lowerMessage.includes('not the correct person') ||
      lowerMessage.includes('resigned')) {
    return {
      replyType: 'not_interested',
      confidence: 0.85,
      reasoning: 'Message indicates lack of interest or unavailability'
    };
  }
  
  if (lowerMessage.includes('connect') || 
      lowerMessage.includes('happy to') ||
      lowerMessage.includes('assistance')) {
    return {
      replyType: 'interested', 
      confidence: 0.75,
      reasoning: 'Message shows willingness to connect or get help'
    };
  }
  
  return {
    replyType: 'maybe',
    confidence: 0.6,
    reasoning: 'Neutral response, unclear intent'
  };
}

console.log('🤖 Testing AI Analysis on 3 Reply Messages:\n');

testMessages.forEach((person, index) => {
  console.log(`${index + 1}. ${person.name}:`);
  console.log(`   Message: "${person.message.substring(0, 100)}..."`);
  
  const analysis = analyzeMessage(person.message);
  console.log(`   Analysis: ${analysis.replyType} (${(analysis.confidence * 100).toFixed(1)}% confidence)`);
  console.log(`   Reasoning: ${analysis.reasoning}`);
  console.log('');
});

console.log('✅ Test analysis complete!');
console.log('\n📊 Summary:');
const analyses = testMessages.map(p => analyzeMessage(p.message));
const interested = analyses.filter(a => a.replyType === 'interested').length;
const notInterested = analyses.filter(a => a.replyType === 'not_interested').length;
const maybe = analyses.filter(a => a.replyType === 'maybe').length;

console.log(`😊 Interested: ${interested}/3`);
console.log(`😞 Not Interested: ${notInterested}/3`); 
console.log(`😐 Maybe: ${maybe}/3`);
