import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type EnrichmentResult = {
  aiSummary: string
  aiBestFor: string
  aiVibe: string
  aiDurationHint: string
  aiSmartTips: string[]
  aiFullExperience: string[]
  aiFaq: [string, string][]
  hotnessScore: number
  comparison?: {
    similarEvents?: string[]
    betterAlternatives?: string[]
    uniqueSellingPoints?: string[]
  }
}

function isNonEmptyObject(value: unknown): boolean {
  return (
    !!value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.keys(value as any).length > 0
  )
}

function isAlreadyEnriched(event: any): boolean {
  if (!event?.aiSummary) return false
  if (!isNonEmptyObject(event?.enrichedContent)) return false
  return true
}

async function callGroqForEventEnrichment(event: any): Promise<EnrichmentResult> {
  const LLM_BASE_URL = process.env.LLM_BASE_URL || 'https://api.groq.com/openai/v1'
  const LLM_API_KEY = process.env.LLM_API_KEY || process.env.GROQ_API_KEY
  const model = 'llama-3.3-70b-versatile'

  if (!LLM_API_KEY) {
    throw new Error('GROQ_API_KEY is not set in environment variables')
  }

  const prompt = `You are an event enrichment assistant for Singapore events. Analyze this event and provide structured enrichment data.

EVENT DETAILS:
- Name: ${event.name}
- Description: ${event.description || 'No description provided'}
- Category: ${event.category || 'General'}
- Venue: ${event.venue || 'Unknown'} at ${event.venueAddress || 'Unknown address'}
- Price: ${event.price || 'Not specified'}
- Start Date: ${event.startDate ? new Date(event.startDate).toLocaleDateString('en-SG') : 'TBA'}
- Source: ${event.sourceUrl || 'N/A'}

IMPORTANT: You are writing for a Singapore audience. Focus on:
1. Vibe and atmosphere (casual, upscale, family-friendly, hipster, etc.)
2. Type of crowd (tourists, locals, families, couples, professionals)
3. Budget considerations (value for money, premium pricing)
4. Food & Beverage options nearby
5. View or scenery (if applicable)
6. Instagram-worthy spots
7. Public transport access (MRT stations, bus routes)
8. Practical Singapore context (weather considerations, what to wear)

REQUIRED OUTPUT FORMAT (JSON only - you MUST return valid JSON with this exact structure):
{
  "aiSummary": "2-4 sentences. Friendly, engaging, Singapore-focused summary. Use 'you', 'your friends', 'date night', 'family outing' style.",
  "aiBestFor": "One sentence describing who this event is best for.",
  "aiVibe": "One sentence describing the mood/atmosphere.",
  "aiDurationHint": "One sentence estimating duration.",
  "aiSmartTips": ["Tip 1", "Tip 2", "Tip 3", "Tip 4"],
  "aiFullExperience": ["Step 1", "Step 2", "Step 3", "Step 4"],
  "aiFaq": [["Question 1", "Answer 1"], ["Question 2", "Answer 2"], ["Question 3", "Answer 3"]],
  "hotnessScore": 0,
  "comparison": {
    "similarEvents": ["Event 1", "Event 2"],
    "betterAlternatives": ["Alternative 1", "Alternative 2"],
    "uniqueSellingPoints": ["USP 1", "USP 2", "USP 3"]
  }
}

CRITICAL RULES:
1. You MUST respond strictly in English.
2. Use casual, friendly English (Singapore style)
3. Never mention "LLM", "AI", or "as an AI model"
4. Return ONLY the JSON object, no other text

Now, analyze the event and return ONLY the JSON object.`

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 30_000)

  try {
    const response = await fetch(`${LLM_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${LLM_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content:
              'You are a Singapore events editorial assistant. Output must be strictly in English only. Return valid JSON only (no markdown, no extra text).',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1500,
        response_format: { type: 'json_object' },
      }),
      signal: controller.signal,
    })

    if (response.status === 400) throw new Error('Bad request to LLM API - check prompt format')
    if (response.status === 401) throw new Error('Invalid API key for Groq')
    if (response.status === 429) throw new Error('Rate limit exceeded for Groq API')
    if (response.status === 402) throw new Error('Payment required - check Groq account')
    if (!response.ok) throw new Error(`LLM API error: ${response.status} ${response.statusText}`)

    const data = await response.json()
    let content = data.choices?.[0]?.message?.content

    if (!content) throw new Error('No content in LLM response')

    content = content.replace(/``````\s*/g, '').trim()
    const result = JSON.parse(content) as EnrichmentResult

    if (!result.aiSummary) throw new Error('Invalid LLM response - missing aiSummary')

    result.hotnessScore = Math.max(0, Math.min(100, result.hotnessScore || 50))
    result.aiSmartTips = result.aiSmartTips || []
    result.aiFullExperience = result.aiFullExperience || []
    result.aiFaq = result.aiFaq || []
    result.comparison = result.comparison || {}
    result.comparison.similarEvents = result.comparison.similarEvents || []
    result.comparison.betterAlternatives = result.comparison.betterAlternatives || []
    result.comparison.uniqueSellingPoints = result.comparison.uniqueSellingPoints || []

    return result
  } catch (error: any) {
    console.error('Groq API call failed:', error)

    const fallback: EnrichmentResult = {
      aiSummary: `Join this ${event.category || 'event'} at ${event.venue || 'a popular venue'} in Singapore. A great opportunity to experience local culture and meet new people.`,
      aiBestFor: 'Anyone looking for something fun to do in Singapore this weekend.',
      aiVibe: 'Casual and social - come as you are and enjoy the atmosphere.',
      aiDurationHint: 'Plan for 2-3 hours, or extend your visit with nearby attractions.',
      aiSmartTips: [
        'Check the weather forecast - Singapore can have sudden rain showers',
        'Arrive early to get good spots, especially for popular events',
        'Use public transport - most venues are near MRT stations',
        'Bring cash as some vendors may not accept cards',
      ],
      aiFullExperience: [
        'Start with exploring the surrounding area',
        'Arrive 30 minutes early to soak in the atmosphere',
        'Engage with the event activities fully',
        'Extend your evening at nearby cafes or bars',
      ],
      aiFaq: [
        ['Is this event suitable for children?', 'Check the event description for age restrictions, but most public events in Singapore are family-friendly.'],
        ['What should I wear?', "Smart casual is usually appropriate. Consider Singapore's humid weather."],
        ['How do I get there by MRT?', 'Check the venue address for nearest MRT station.'],
      ],
      hotnessScore: 50,
      comparison: {
        similarEvents: [],
        betterAlternatives: [],
        uniqueSellingPoints: ['Local experience', 'Cultural immersion', 'Community event'],
      },
    }

    const msg = (error?.message || '').toLowerCase()
    if (msg.includes('rate limit') || msg.includes('network') || msg.includes('aborted')) {
      console.log('Using fallback due to rate limit/network/timeout error')
      return fallback
    }

    throw error
  } finally {
    clearTimeout(timeoutId)
  }
}

export async function POST(request: NextRequest) {
  try {
    let body: any
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 })
    }

    const { eventId } = body
    if (eventId === undefined || eventId === null) {
      return NextResponse.json({ success: false, error: 'Missing eventId' }, { status: 400 })
    }

    const numericId = typeof eventId === 'string' ? parseInt(eventId, 10) : eventId
    if (isNaN(numericId) || !Number.isInteger(numericId)) {
      return NextResponse.json({ success: false, error: 'eventId must be a valid integer' }, { status: 400 })
    }

    console.log(`🤖 Starting AI augmentation for event ${numericId}`)

    const event = await prisma.event.findUnique({
      where: { id: numericId },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        category: true,
        venue: true,
        venueAddress: true,
        price: true,
        startDate: true,
        sourceUrl: true,
        aiSummary: true,
        hotnessScore: true,
        enrichedContent: true,
      },
    })

    if (!event) {
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 })
    }

    if (isAlreadyEnriched(event)) {
      console.log(`ℹ️ Event ${numericId} already has proper AI enrichment, skipping`)
      return NextResponse.json({ success: true, message: 'Event already enriched', eventId: numericId })
    }

    const enrichment = await callGroqForEventEnrichment(event)

    const enrichedContent = {
      ...enrichment,
      generatedAt: new Date().toISOString(),
      version: '2.0',
    }

    await prisma.event.update({
      where: { id: numericId },
      data: {
        aiSummary: enrichment.aiSummary,
        aiBestFor: enrichment.aiBestFor,
        aiVibe: enrichment.aiVibe,
        aiDurationHint: enrichment.aiDurationHint,
        aiSmartTips: enrichment.aiSmartTips,
        aiFullExperience: enrichment.aiFullExperience,
        aiFaq: enrichment.aiFaq,
        hotnessScore: enrichment.hotnessScore,
        enrichedContent,
        updatedAt: new Date(),
      },
    })

    console.log(`✅ AI enrichment completed for event ${numericId}, hotnessScore: ${enrichment.hotnessScore}`)

    return NextResponse.json({
      success: true,
      message: 'AI augmentation completed successfully',
      eventId: numericId,
      hotnessScore: enrichment.hotnessScore,
      hasEnrichedContent: true,
    })
  } catch (error: any) {
    console.error('❌ Error in AI augmentation route:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'AI augmentation failed',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'SG Events Hub - AI Augmentation API',
    status: 'operational',
    usage: 'POST /api/ai-augment-event with { "eventId": number }',
    environment: {
      hasGroqKey: !!process.env.GROQ_API_KEY,
      model: 'llama-3.3-70b-versatile',
    },
  })
}
