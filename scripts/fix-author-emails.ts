// scripts/fix-author-emails.ts
// Script này được thiết kế để chạy bằng lệnh: npx tsx scripts/fix-author-emails.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Author Email Fix Script ---');

  // Lấy 3 Author có email trùng lặp (nếu có, giả định là 3 Author đầu tiên)
  const authorsToFix = await prisma.author.findMany({
    take: 3, 
    orderBy: { createdAt: 'asc' } // Lấy 3 Author cũ nhất
  });
  
  if (authorsToFix.length === 0) {
    console.log('✅ No authors found to fix. Assuming authors are fine or DB is empty.');
    return;
  }

  // Gán email duy nhất cho mỗi Author theo tên (hoặc theo thứ tự)
  const updates = authorsToFix.map((author, index) => {
    // Tạo email duy nhất dựa trên ID hoặc thứ tự
    const uniqueEmail = `fix-${author.id || index}@sgeventshub.com`; 
    
    // Nếu có trường 'name', ta có thể dùng name để tạo email trực quan hơn
    const emailFromName = `${author.name?.toLowerCase().replace(/\s/g, '.') || `author${index}`}.fixed@sgeventshub.com`;

    return prisma.author.update({
      where: { id: author.id },
      data: { 
        // Chọn cách đặt email bằng tên để dễ quản lý hơn, Sếp có thể thay đổi
        email: emailFromName, 
        // Đảm bảo không còn giá trị placeholder tạm thời
        role: author.role || 'Writer'
      }
    });
  });

  // Chạy tất cả các lệnh update
  await prisma.$transaction(updates);

  console.log(`✅ Successfully updated ${updates.length} Author emails to be unique.`);
  console.log('--- Email Fix Complete. Proceed to BƯỚC 2. ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });