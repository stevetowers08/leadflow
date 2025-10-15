import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function analyzeExistingReplies() {
  try {
    console.log('🔍 Finding people with replies that need AI analysis...');

    // Get all people with replies but no reply_type
    const { data: people, error } = await supabase
      .from('people')
      .select('id, name, email_reply')
      .not('email_reply', 'is', null)
      .is('reply_type', null)
      .limit(10); // Start with first 10 for testing

    if (error) throw error;

    console.log(
      `📊 Found ${people?.length || 0} people with replies to analyze`
    );

    if (!people || people.length === 0) {
      console.log('✅ No replies need analysis');
      return;
    }

    // Analyze each reply
    for (const person of people) {
      try {
        console.log(`🤖 Analyzing reply for ${person.name}...`);

        // Call the Edge Function
        const response = await fetch(
          `${supabaseUrl}/functions/v1/analyze-reply`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: person.email_reply,
              personId: person.id,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          console.log(
            `✅ ${person.name}: ${result.analysis.replyType} (${(result.analysis.confidence * 100).toFixed(1)}% confidence)`
          );
        } else {
          console.log(`❌ ${person.name}: ${result.error}`);
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`❌ Error analyzing ${person.name}:`, error);
      }
    }

    console.log('🎉 Analysis complete!');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the analysis
analyzeExistingReplies();
