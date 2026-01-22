// lib/ai-service.ts

import OpenAI from 'openai'

interface EventData {
  name: string
  description: string | null
  price: string | null
  isFree: boolean
  venue: string | null
  venueAddress: string | null
  tags: string[]
  startDate: Date | null
  endDate: Date | null
}

interface InsightsResponse {
  quickDecision: string[]
  targetAudience: string
  vibe: string
  energyLevel: string
  duration: string
  budgetTips: string[]
  localAreaPlan: string[]
  bestTime: string
  faq: Array<{ q: string; a: string }>
}

export class AIService {
  private openai: OpenAI

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: 'https://api.deepseek.com',
    })
  }

  async generateInsights(event: EventData): Promise<InsightsResponse> {
    const prompt = `
You are an event expert analyzing events in Singapore. Generate helpful insights for this event:

Event: ${event.name}
Description: ${event.description?.substring(0, 300) || 'N/A'}
Location: ${event.venue || 'TBA'}
Price: ${event.isFree ? 'FREE' : event.price ? `SGD $${event.price}` : 'TBA'}
Tags: ${event.tags.join(', ')}
Date: ${event.startDate?.toLocaleDateString() || 'TBA'}

Respond ONLY with valid JSON in this exact format:
{
  "quickDecision": ["point1", "point2", "point3", "point4"],
  "targetAudience": "who should attend",
  "vibe": "casual/formal/fun etc",
  "energyLevel": "high/moderate/low",
  "duration": "estimated time",
  "budgetTips": ["tip1", "tip2", "tip3"],
  "localAreaPlan": ["activity1", "activity2", "activity3"],
  "bestTime": "best time to attend",
  "faq": [
    {"q": "question1?", "a": "answer1"},
    {"q": "question2?", "a": "answer2"},
    {"q": "question3?", "a": "answer3"}
  ]
}
`

    try {
      const response = await this.openai.chat.completions.create({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: 'You are a helpful event analyzer. Respond only with valid JSON.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      })

      const content = response.choices[0]?.message?.content
      if (!content) throw new Error('No response from DeepSeek')

      return JSON.parse(content)
    } catch (error) {
      console.error('DeepSeek AI Service Error:', error)
      return this.getDummyInsights()
    }
  }

  private getDummyInsights(): InsightsResponse {
    return {
      quickDecision: [
        'Perfect for families and friends',
        'Indoor air-conditioned venue',
        'Easy MRT access',
        'Photo opportunities available',
      ],
      targetAudience: 'Everyone welcome',
      vibe: 'Fun & Relaxed',
      energyLevel: 'Moderate',
      duration: '2-3 hours recommended',
      budgetTips: [
        'Bring your own water bottle',
        'Use public transport to save on parking',
        'Check for early bird discounts',
      ],
      localAreaPlan: [
        'Have lunch at nearby food court',
        'Explore shopping areas around venue',
        'Take photos at scenic spots',
      ],
      bestTime: 'Weekday mornings for smaller crowds',
      faq: [
        { q: 'Is this event suitable for kids?', a: "Yes, it's family-friendly!" },
        { q: 'Do I need to book tickets in advance?', a: 'Recommended to avoid disappointment.' },
        { q: 'Is there parking available?', a: 'Yes, check venue website for rates.' },
      ],
    }
  }
}
