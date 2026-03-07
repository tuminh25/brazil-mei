const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();

// PAW Patrol Live! Singapore 2026 show dates: March 14-17, 2026 at Sands Theatre, MBS
// Set startDate to March 14 2026
prisma.event.update({
    where: { slug: 'paw-patrol-live-singapore-2026-guide' },
    data: {
        startDate: new Date('2026-03-14T10:00:00+08:00'),
        endDate: new Date('2026-03-17T20:00:00+08:00'),
        venue: 'Sands Theatre, Marina Bay Sands',
        venueAddress: '10 Bayfront Avenue, Singapore 018956',
    }
}).then(e => {
    console.log('✅ Updated PAW Patrol startDate to:', e.startDate?.toISOString());
}).catch(console.error).finally(() => prisma.$disconnect());
