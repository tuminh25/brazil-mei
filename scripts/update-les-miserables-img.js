const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();

const SLUG = 'les-miserables-singapore-2026-sands-theatre-tickets-seats';
const IMAGE_URL = 'https://res.klook.com/image/upload/c_crop,h_1200,w_1920,x_0,y_0,z_0.4/w_1265,h_791,c_fill,q_85/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/u0b798s8bcy3b01zzgbi.webp';

async function update() {
    try {
        const result = await prisma.event.update({
            where: { slug: SLUG },
            data: { imageUrl: IMAGE_URL }
        });
        console.log('✅ Updated imageUrl for:', result.name);
    } catch (error) {
        console.error('❌ Error updating event:', error);
    } finally {
        await prisma.$disconnect();
    }
}

update();
