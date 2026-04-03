import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, language = "en" } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt =
      language === "hi"
        ? `You are SmartHealth AI Doctor, a bilingual health advisor. Respond in Hindi (Devanagari script). 
For each symptom query, provide:
1. **संभावित कारण** (Possible causes)
2. **घरेलू उपचार** (Home remedies)
3. **आहार सुझाव** (Dietary tips)
4. **डॉक्टर से कब मिलें** (When to see a doctor)

Important: You are NOT a replacement for professional medical advice. Always recommend consulting a doctor for serious symptoms. Keep responses concise and practical.`
        : `You are SmartHealth AI Doctor, an AI-powered health advisor. 
For each symptom query, provide:
1. **Possible Causes** - List 2-3 likely conditions
2. **Home Remedies** - Safe, practical suggestions
3. **Dietary Tips** - Foods that may help
4. **When to See a Doctor** - Warning signs that need professional attention

Important: You are NOT a replacement for professional medical advice. Always recommend consulting a doctor for serious or persistent symptoms. Keep responses concise and practical. Use bullet points and clear formatting.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || "I could not process your request.";

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-doctor error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
