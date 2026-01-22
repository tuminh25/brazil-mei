import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    const event = await prisma.event.findUnique({
      where: { slug },
    })

    if (!event) {
      return NextResponse.json(
        {
          error: `Event with slug "${slug}" not found in database`,
          searchedFor: slug,
        },
        { status: 404 }
      )
    }

    return NextResponse.json(event, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching event:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch event from database',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
