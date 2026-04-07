import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.post.findMany({
    where: {
      OR: [
        { title: { contains: 'Marina Bay Sands', mode: 'insensitive' } },
      ]
    },
    select: {
      id: true,
      title: true,
      slug: true,
      updatedAt: true,
      category: true,
      isNewsjack: true,
    },
    orderBy: { updatedAt: 'desc' }
  });

  let output = 'ID | Title | Slug | Updated | Category | isNewsjack\n';
  output += '---|-------|------|----------|----------|-----------\n';
  posts.forEach(p => {
    output += `${p.id} | ${p.title} | ${p.slug} | ${p.updatedAt.toISOString()} | ${p.category} | ${p.isNewsjack}\n`;
  });

  fs.writeFileSync('tmp/mbs_audit.md', output);
  console.log('Audit saved to tmp/mbs_audit.md');
}

main().finally(() => prisma.$disconnect());
