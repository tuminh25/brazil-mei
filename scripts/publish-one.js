// scripts/publish-one.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanAndPublish() {
  const now = new Date();
  console.log(`🤖 ROBOT ĐANG LÀM VIỆC LÚC: ${now.toLocaleString()}`);

  // 1. NHIỆM VỤ QUÉT RÁC: Tự động xóa bài cũ (Trừ Attraction)
  // CHÚ Ý: Chỉ xóa event đã thực sự KẾT THÚC trong quá khứ.
  // - Nếu có endDate: chỉ xóa khi endDate đã QUA (event thực sự đã kết thúc)
  // - Nếu không có endDate: chỉ xóa khi CẢ HAI điều kiện đúng:
  //     (a) startDate đã qua (event đã bắt đầu rồi), VÀ
  //     (b) startDate đã qua hơn 7 ngày
  //   => Event tương lai (startDate trong tương lai) sẽ KHÔNG BAO GIỜ bị xóa dù import từ lâu.
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const deleted = await prisma.event.deleteMany({
    where: {
      category: { not: 'Attraction' },
      OR: [
        {
          // Nếu có endDate, chỉ xóa khi event ĐÃ KẾT THÚC (endDate đã qua)
          endDate: { not: null, lt: now }
        },
        {
          // Nếu không có endDate, chỉ xóa khi startDate đã QUA VÀ đã hơn 7 ngày
          // => Event tương lai (startDate > now) ĐƯỢC BẢO VỆ
          endDate: null,
          startDate: { lt: sevenDaysAgo, lte: now }  // phải < 7 ngày trước VÀ đã qua hiện tại
        }
      ]
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