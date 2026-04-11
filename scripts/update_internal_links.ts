import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.post.findMany();
  let updatedCount = 0;

  for (const post of posts) {
    if (!post.content) continue;

    // We want to replace href="/events/..." and href="/attractions/..." with href="/guides/..."
    // as well as absolute URLs
    let newContent = post.content;
    
    // Regex for absolute and relative paths
    newContent = newContent.replace(/(href=["'])(?:https?:\/\/(?:www\.)?sgeventshub\.com)?\/(events|attractions)(\/[^"']*)?(["'])/gi, '$1/guides$3$4');

    if (newContent !== post.content) {
      await prisma.post.update({
        where: { id: post.id },
        data: { content: newContent }
      });
      updatedCount++;
      console.log(`Updated post: ${post.slug}`);
    }
  }

  console.log(`Total posts updated: ${updatedCount}`);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
