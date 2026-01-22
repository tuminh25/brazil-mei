import { NextRequest, NextResponse } from 'next/server'

type RelatedEvent = {
  id: string
  name: string
  slug: string
  imageUrl: string | null
  startDate: string
  price: string | null
  isFree: boolean
  currency: string
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> } // ✅ Next 15 của bạn đang require Promise
) {
  try {
    const { slug } = await params

    const relatedEvents: RelatedEvent[] = [
      {
        id: '2',
        name: 'Doujin Market Mini 2025',
        slug: 'doujin-market-mini-2025',
        imageUrl: 'https://via.placeholder.com/300x200?text=Event+2',
        startDate: '2025-12-13T00:00:00Z',
        price: null,
        isFree: true,
        currency: 'SGD',
      },
      {
        id: '3',
        name: 'Singapore Card Show Dec 2025',
        slug: 'singapore-card-show-dec-2025',
        imageUrl: 'https://via.placeholder.com/300x200?text=Event+3',
        startDate: '2025-12-13T00:00:00Z',
        price: null,
        isFree: true,
        currency: 'SGD',
      },
      {
        id: '4',
        name: "B'way Rave 2025",
        slug: 'bway-rave-2025',
        imageUrl: 'https://via.placeholder.com/300x200?text=Event+4',
        startDate: '2025-12-14T00:00:00Z',
        price: null,
        isFree: true,
        currency: 'SGD',
      },
    ]

    // nếu chưa dùng slug thì tránh warning
    void slug

    return NextResponse.json(relatedEvents, { status: 200 })
  } catch (error) {
    console.error('Error fetching related events:', error)
    return NextResponse.json({ error: 'Failed to fetch related events' }, { status: 500 })
  }
}
