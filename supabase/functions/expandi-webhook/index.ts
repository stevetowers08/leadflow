import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const webhookData = await req.json()
    
    console.log('Expandi webhook received:', webhookData)

    // Validate webhook data structure
    if (!webhookData.messageId || !webhookData.conversationId) {
      throw new Error('Missing required webhook fields: messageId, conversationId')
    }

    // Process the webhook data
    const result = await processExpandiWebhook(webhookData)
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Webhook processed successfully',
      data: result
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })

  } catch (error) {
    console.error('Expandi webhook error:', error)
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    })
  }
})

async function processExpandiWebhook(webhookData: any) {
  try {
    // Extract data from Expandi webhook
    const expandiData = {
      messageId: webhookData.messageId || webhookData.id,
      conversationId: webhookData.conversationId || webhookData.threadId,
      senderType: determineSenderType(webhookData),
      content: webhookData.content || webhookData.message || webhookData.text,
      timestamp: webhookData.timestamp || webhookData.createdAt || new Date().toISOString(),
      status: webhookData.status || 'delivered',
      personEmail: webhookData.personEmail || webhookData.email,
      personName: webhookData.personName || webhookData.name,
    }

    console.log('Processing Expandi data:', expandiData)

    // Find or create conversation
    let conversation = await findConversationByLinkedInId(expandiData.conversationId)
    
    if (!conversation) {
      // Try to find person by email or name
      const person = await findPersonByEmailOrName(
        expandiData.personEmail, 
        expandiData.personName
      )
      
      if (!person) {
        console.warn('Could not find person for webhook data:', expandiData)
        return { status: 'person_not_found', message: 'Person not found in CRM' }
      }

      // Create new conversation
      conversation = await createConversation({
        person_id: person.id,
        linkedin_message_id: expandiData.conversationId,
        participants: [expandiData.personEmail || expandiData.personName || 'Unknown'],
        conversation_type: 'linkedin',
      })
    }

    // Add message to conversation
    const message = await addMessage({
      conversation_id: conversation.id,
      person_id: conversation.person_id,
      linkedin_message_id: expandiData.messageId,
      sender_type: expandiData.senderType,
      sender_name: expandiData.personName,
      sender_email: expandiData.personEmail,
      content: expandiData.content,
      sent_at: expandiData.timestamp,
      expandi_status: expandiData.status,
      expandi_message_id: expandiData.messageId,
    })

    // Log successful webhook processing
    await logSyncOperation('webhook_received', 'success', 1)

    return {
      status: 'success',
      conversationId: conversation.id,
      messageId: message.id,
      message: 'Webhook processed successfully'
    }

  } catch (error) {
    console.error('Failed to process Expandi webhook:', error)
    await logSyncOperation('webhook_received', 'error', 0, error.message)
    throw error
  }
}

function determineSenderType(webhookData: any): 'us' | 'them' | 'system' {
  // Determine if message is from us or them based on webhook data
  if (webhookData.senderType) {
    return webhookData.senderType
  }
  
  if (webhookData.fromUs || webhookData.isOutbound) {
    return 'us'
  }
  
  if (webhookData.fromThem || webhookData.isInbound) {
    return 'them'
  }
  
  // Default to 'them' for incoming messages
  return 'them'
}

async function findConversationByLinkedInId(linkedinMessageId: string) {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('linkedin_message_id', linkedinMessageId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

async function findPersonByEmailOrName(email?: string, name?: string) {
  let query = supabase.from('people').select('*')

  if (email) {
    query = query.eq('email_address', email)
  } else if (name) {
    query = query.ilike('name', `%${name}%`)
  } else {
    return null
  }

  const { data, error } = await query.single()
  if (error && error.code !== 'PGRST116') throw error
  return data
}

async function createConversation(conversationData: any) {
  const { data, error } = await supabase
    .from('conversations')
    .insert(conversationData)
    .select()
    .single()

  if (error) throw error
  return data
}

async function addMessage(messageData: any) {
  const { data, error } = await supabase
    .from('conversation_messages')
    .insert(messageData)
    .select()
    .single()

  if (error) throw error

  // Update conversation's last_message_at
  await supabase
    .from('conversations')
    .update({ 
      last_message_at: messageData.sent_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', messageData.conversation_id)

  return data
}

async function logSyncOperation(
  operationType: string,
  status: 'success' | 'error' | 'partial',
  messageCount: number,
  errorMessage?: string
) {
  await supabase
    .from('conversation_sync_logs')
    .insert({
      operation_type: operationType,
      status,
      message_count: messageCount,
      error_message: errorMessage,
    })
}








