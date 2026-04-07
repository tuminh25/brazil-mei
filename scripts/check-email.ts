import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const oldEmailDomain = 'imperialpalacedeodorant.com'
  
  const authors = await prisma.author.findMany({
    where: {
      email: {
        contains: oldEmailDomain
      }
    }
  })
  
  console.log('Authors with old email domain:', JSON.stringify(authors, null, 2))

  const posts = await prisma.post.findMany({
    where: {
      content: {
        contains: oldEmailDomain
      }
    }
  })

  console.log('Posts with old email domain:', JSON.stringify(posts.map(p => ({ id: p.id, slug: p.slug })), null, 2))

  const events = await prisma.event.findMany({
    where: {
      OR: [
        { description: { contains: oldEmailDomain } },
        { enrichedContent: { path: [], equals: oldEmailDomain } } // This might not work as expected for Json, but let's see
      ]
    }
  })

  console.log('Events with old email domain:', JSON.stringify(events.map(e => ({ id: e.id, slug: e.slug })), null, 2))
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
