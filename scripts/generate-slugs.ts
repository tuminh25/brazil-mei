import prisma from "@/lib/prisma";

function makeSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 100)
}

async function generateSlugs() {
  try {
    const events = await prisma.event.findMany({
  where: {
    OR: [{ slug: '' }, { slug: ' ' }],
      },
    })

    console.log(`Found ${events.length} events without slug`)

    let updated = 0
    for (const event of events) {
      const slug = makeSlug(event.name)

      // Check if slug already exists
      const existing = await prisma.event.findFirst({
        where: { slug },
      })

      if (!existing) {
        await prisma.event.update({
          where: { id: event.id },
          data: { slug },
        })
        updated++
        console.log(`✓ ${event.name} → ${slug}`)
      } else {
        // Add timestamp to make unique
        const uniqueSlug = `${slug}-${Date.now()}`
        await prisma.event.update({
          where: { id: event.id },
          data: { slug: uniqueSlug },
        })
        console.log(`✓ ${event.name} → ${uniqueSlug} (collision fix)`)
        updated++
      }
    }

    console.log(`\n✅ Updated ${updated} events with slugs`)
    await prisma.$disconnect()
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

generateSlugs()
