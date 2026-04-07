import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      slug: true,
      title: true,
      category: true,
      isNewsjack: true,
      status: true,
    }
  });

  let output = 'ID | Title | Slug | Category | isNewsjack | Status\n';
  output += '---|-------|------|----------|------------|-------\n';
  posts.forEach(p => {
    output += `${p.id} | ${p.title} | ${p.slug} | ${p.category} | ${p.isNewsjack} | ${p.status}\n`;
  });

  fs.writeFileSync('tmp/posts_audit.md', output);
  console.log('Audit saved to tmp/posts_audit.md');
}

main().finally(() => prisma.$disconnect());
