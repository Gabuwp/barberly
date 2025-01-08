import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import OpenAI from "https://esm.sh/openai@4.28.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting image generation process...')
    const { prompt } = await req.json()
    console.log('Received prompt:', prompt)

    const apiKey = Deno.env.get('OPENAI_API_KEY')
    if (!apiKey) {
      console.error('OpenAI API key not found')
      throw new Error('OpenAI API key not configured')
    }

    console.log('Initializing OpenAI client...')
    const openai = new OpenAI({
      apiKey: apiKey
    })

    console.log('Making request to OpenAI...')
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Based on this description: ${prompt}, generate a realistic and modern hairstyle or beard style suggestion. The style should be trendy and suitable for a real person.`,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    })

    console.log('OpenAI response received:', response.data)

    if (!response.data || response.data.length === 0) {
      throw new Error('No images generated')
    }

    return new Response(
      JSON.stringify({ imageUrl: response.data[0].url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in generate-styles function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.response?.data || 'No additional details available'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})