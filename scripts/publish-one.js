// scripts/publish-one.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanAndPublish() {
  const now = new Date();
  console.log(`🤖 ROBOT ĐANG LÀM VIỆC LÚC: ${now.toLocaleString()}`);

  // 1. NHIỆM VỤ QUÉT RÁC: Tự động xóa bài cũ (Trừ Attraction)
  const deleted = await prisma.event.deleteMany({
    where: {
      category: { not: 'Attraction' },
      startDate: { lt: now } // Những bài có ngày nhỏ hơn hiện tại
    }
  });
  if (deleted.count > 0) console.log(`🧹 Đã dọn dẹp ${deleted.count} bài viết hết hạn.`);

  // 2. NHIỆM VỤ XUẤT KHO: Tìm bài DRAFT mới nhất để đăng
  const draft = await prisma.event.findFirst({
    where: { status: 'DRAFT' },
    orderBy: { createdAt: 'asc' }
  });

  if (!draft) {
    console.log('😴 Kho hết hàng. Robot đi ngủ đây!');
    return;
  }

  await prisma.event.update({
    where: { id: draft.id },
    data: { status: 'PUBLISHED', updatedAt: now }
  });

  console.log(`✅ ĐÃ ĐĂNG BÀI MỚI: ${draft.name}`);
}

cleanAndPublish()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());