import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, leadName, email, phone, leadSource, notes, lastActivity } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("AI service is not configured");
    }

    const isEmail = type === 'email';
    
    const systemPrompt = `You are a professional sales assistant for FlowPilot OS, a business management platform. Generate ${isEmail ? 'professional follow-up emails' : 'brief, friendly SMS messages'} for sales leads. 
    
Guidelines:
- Be professional but warm and personable
- Keep ${isEmail ? 'emails concise (3-4 paragraphs max)' : 'SMS messages under 160 characters'}
- Reference any known context about the lead
- Include a clear call-to-action
- ${isEmail ? 'Use a professional email format with greeting and sign-off' : 'Be conversational and direct'}
- Never use placeholder brackets like [Your Name] - use "the FlowPilot team" instead`;

    const userPrompt = `Generate a ${isEmail ? 'follow-up email' : 'follow-up SMS'} for this lead:
Name: ${leadName}
${email ? `Email: ${email}` : ''}
${phone ? `Phone: ${phone}` : ''}
${leadSource ? `Lead Source: ${leadSource}` : ''}
${notes ? `Notes: ${notes}` : ''}
${lastActivity ? `Last Activity: ${lastActivity}` : ''}

${isEmail ? 'Generate a complete email with subject line (prefix with "Subject: ") and body.' : 'Generate a brief SMS message.'}`;

    console.log(`Generating ${type} follow-up for lead: ${leadName}`);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI service error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    console.log(`Successfully generated ${type} for lead: ${leadName}`);

    return new Response(JSON.stringify({ content: generatedContent, type }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-follow-up function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
