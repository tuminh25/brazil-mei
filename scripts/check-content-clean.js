const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const posts = await prisma.post.findMany({
    where: { slug: { in: [
      'hdb-resale-grants-2026-complete-guide',
      'cpf-changes-2026-singapore-residents-guide',
    ]}},
    select: { title: true, content: true }
  });
  
  for (const post of posts) {
    console.log('===', post.title, '===');
    console.log('Has Suggested Internal Links:', post.content.includes('Suggested Internal Links'));
    console.log('Has Recommended Schema:', post.content.includes('Recommended Schema'));
    console.log('Has Sources:', post.content.includes('Sources'));
    console.log('Ends with </ul>:', post.content.trim().endsWith('</ul>'));
    console.log('');
  }
  await prisma.$disconnect();
}
check();