import prisma from "@/lib/prisma";

async function main() {
  // tránh duplicate khi chạy seed nhiều lần
  await prisma.event.deleteMany()

  await prisma.event.createMany({
    data: [
      {
        name: 'Doujin Market Mini 2025',
        slug: 'doujin-market-mini-2025',
        description:
          'Singapore largest fan convention for anime, manga, and Japanese pop culture.',
        venue: 'Suntec Singapore Convention & Exhibition Centre',
        venueAddress: '1 Raffles Boulevard, Singapore',
        startDate: new Date('2025-12-13T00:00:00.000Z'),
        endDate: null,
        imageUrl: 'https://via.placeholder.com/1200x630?text=DoujinMarketMini2025',
        price: null,
        currency: 'SGD',
        isFree: true,
        category: 'General',
        tags: ['anime', 'manga', 'doujin'],
        sourceUrl: 'https://example.com/doujin-market-mini-2025',
        latitude: 1.2931,
        longitude: 103.8573,
        enrichedContent: {},
      },
      {
        name: 'Singapore Card Show Dec 2025',
        slug: 'singapore-card-show-dec-2025',
        description: 'A casual meetup for collectors and traders in Singapore.',
        venue: 'Marina Square',
        venueAddress: '6 Raffles Boulevard, Singapore',
        startDate: new Date('2025-12-13T00:00:00.000Z'),
        endDate: null,
        imageUrl: 'https://via.placeholder.com/1200x630?text=SingaporeCardShow',
        price: null,
        currency: 'SGD',
        isFree: true,
        category: 'General',
        tags: ['cards', 'collectibles'],
        sourceUrl: 'https://example.com/singapore-card-show-dec-2025',
        latitude: 1.2923,
        longitude: 103.8585,
        enrichedContent: {},
      },
      {
        name: 'Bway Rave 2025',
        slug: 'bway-rave-2025',
        description: 'A high-energy night with musical theatre hits and party vibes.',
        venue: 'Esplanade',
        venueAddress: '1 Esplanade Drive, Singapore',
        startDate: new Date('2025-12-14T00:00:00.000Z'),
        endDate: null,
        imageUrl: 'https://via.placeholder.com/1200x630?text=BwayRave2025',
        price: '35',
        currency: 'SGD',
        isFree: false,
        category: 'Music',
        tags: ['music', 'theatre', 'nightlife'],
        sourceUrl: 'https://example.com/bway-rave-2025',
        latitude: 1.2899,
        longitude: 103.8553,
        enrichedContent: {},
      },
    ],
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
