import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import OpenAI from "https://esm.sh/openai@4.28.0"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function generateImageWithRetry(openai: OpenAI, prompt: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await openai.images.generate({
        model: "dall-e-3",
        prompt: `Based on the hairstyle suggestion: ${prompt}, create a realistic and modern hairstyle image. The style should be trendy and suitable for a real person.`,
        n: 1,
        size: "1024x1024",
        quality: "standard",
      });
      return result;
    } catch (error) {
      if (error.status === 429 && i < retries - 1) {
        console.log(`Rate limit hit, waiting before retry ${i + 1}...`);
        await sleep(2000); // Wait 2 seconds before retrying
        continue;
      }
      throw error;
    }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting image generation process...')
    const { prompt, imageUrl } = await req.json()
    console.log('Received prompt:', prompt)
    console.log('Received image URL:', imageUrl)

    if (!imageUrl) {
      throw new Error('No image URL provided')
    }

    // Download the image with timeout
    console.log('Downloading image from URL:', imageUrl)
    const imageResponse = await fetch(imageUrl, {
      signal: AbortSignal.timeout(30000)
    }).catch(error => {
      console.error('Error downloading image:', error)
      throw new Error(`Failed to download image: ${error.message}`)
    })

    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.status} ${imageResponse.statusText}`)
    }

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
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional hairstylist assistant that helps suggest hairstyles based on images and descriptions."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Based on this image and description: ${prompt}, suggest 5 different modern and suitable hairstyles.`
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl
              }
            }
          ]
        }
      ],
      max_tokens: 1000
    })

    console.log('OpenAI response received:', response)

    // Generate 5 images based on the suggestions, with delay between requests
    const suggestions = response.choices[0].message.content.split('\n').filter(Boolean)
    const imageUrls = [];

    for (const suggestion of suggestions) {
      try {
        const result = await generateImageWithRetry(openai, suggestion);
        imageUrls.push(result.data[0].url);
        // Add a delay between requests to avoid rate limiting
        await sleep(1000);
      } catch (error) {
        console.error('Error generating image:', error);
        // Continue with other suggestions if one fails
        continue;
      }
    }

    console.log('Generated image URLs:', imageUrls)

    // Return whatever images we successfully generated
    return new Response(
      JSON.stringify({ 
        suggestions: imageUrls
      }),
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