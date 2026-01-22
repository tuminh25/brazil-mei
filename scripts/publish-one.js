const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function publishNext() {
  console.log('🤖 ROBOT ĐANG TÌM BÀI TRONG KHO...');

  // 1. Lấy bài cũ nhất đang chờ (First In, First Out)
  const draft = await prisma.event.findFirst({
    where: { status: 'DRAFT' },
    orderBy: { createdAt: 'asc' } // Lấy bài nạp vào đầu tiên
  });

  if (!draft) {
    console.log('zzz Kho hết hàng! Sếp ơi nạp thêm bài đi.');
    return;
  }

  // 2. Kích hoạt bài viết
  await prisma.event.update({
    where: { id: draft.id },
    data: { 
      status: 'PUBLISHED',
      updatedAt: new Date() // Cập nhật giờ để nó nhảy lên đầu trang chủ
    }
  });

  console.log(`✅ ĐÃ ĐĂNG: ${draft.name}`);
}

publishNext()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());