const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();

prisma.event.update({
    where: { slug: 'seventeen-world-tour-new-singapore-2026-insider-guide' },
    data: { imageUrl: 'https://offloadmedia.feverup.com/secretsingapore.co/wp-content/uploads/2025/11/06190019/Seventeen-Singapore-concert-2026.jpg' }
}).then(e => {
    console.log('✅ Updated imageUrl for:', e.name);
}).catch(console.error).finally(() => prisma.$disconnect());
