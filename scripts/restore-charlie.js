require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function restoreCharlie() {
    // Đọc nội dung bài từ new_events.txt
    const raw = fs.readFileSync('scripts/new_events.txt', 'utf8');

    // Convert plain text sang HTML đơn giản
    const lines = raw.split('\n').map(l => l.trim());
    let htmlBlocks = [];
    let currentList = [];
    let inTable = false;

    // Bỏ qua các dòng META header (đến dòng tiêu đề bài)
    let startIdx = 0;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('Charlie and the Chocolate Factory Singapore 2026 — Tickets')) {
            startIdx = i + 1; // bắt đầu từ dòng tiếp theo (paragraph đầu)
            break;
        }
    }

    const contentLines = lines.slice(startIdx);

    for (const line of contentLines) {
        if (!line) {
            if (currentList.length > 0) {
                htmlBlocks.push(`<ul>${currentList.join('')}</ul>`);
                currentList = [];
            }
            continue;
        }

        if (line.includes('\t')) {
            if (!inTable) {
                if (currentList.length > 0) {
                    htmlBlocks.push(`<ul>${currentList.join('')}</ul>`);
                    currentList = [];
                }
                inTable = true;
                const cells = line.split('\t').map(c => `<th style="padding:8px;border:1px solid #333;background:#1a1a1a;text-align:left;">${c.trim()}</th>`);
                htmlBlocks.push(`<table style="width:100%;border-collapse:collapse;margin-bottom:1.5rem;"><thead><tr>${cells.join('')}</tr></thead><tbody>`);
            } else {
                const cells = line.split('\t').map(c => `<td style="padding:8px;border:1px solid #333;">${c.trim()}</td>`);
                htmlBlocks.push(`<tr>${cells.join('')}</tr>`);
            }
            continue;
        } else if (inTable) {
            htmlBlocks.push('</tbody></table>');
            inTable = false;
        }

        if (line.startsWith('- ') || line.startsWith('* ')) {
            currentList.push(`<li>${line.replace(/^[-*]\s+/, '')}</li>`);
            continue;
        } else if (currentList.length > 0) {
            htmlBlocks.push(`<ul>${currentList.join('')}</ul>`);
            currentList = [];
        }

        // Headers
        const isHeader = !line.includes('.') && !line.includes('?') && line.length < 90 && line.length > 5
            && line === line.charAt(0).toUpperCase() + line.slice(1)
            && !line.startsWith('Tickets are live')
            && !line.startsWith('This ')
            && !line.startsWith('According ')
            && !line.startsWith('Here')
            && !line.startsWith('The ')
            && !line.startsWith('For ')
            && !line.startsWith('If ')
            && !line.startsWith('Prices ')
            && !line.startsWith('Both ')
            && !line.startsWith('Show ')
            && !line.startsWith('Standard ')
            && !line.startsWith('Parking ')
            && !line.startsWith('Do ')
            && !line.startsWith('A ')
            && !line.startsWith('Wheelchair ')
            && !line.startsWith('Doors ')
            && !line.startsWith('Latecomers ')
            && !line.startsWith('Food ')
            && !line.startsWith('Photography ')
            && !line.startsWith('Cloakroom ')
            && !line.startsWith('Booster ')
            && !line.startsWith('Pre-show ')
            && !line.startsWith('Grab ')
            && !line.startsWith('By ')
            && !line.startsWith('Drop')
            && !line.startsWith('Disabled')
            && !line.startsWith('Bayfront')
            && !line.startsWith('Station')
            && !line.startsWith('Category\t')
            && !line.includes('~$')
            && !line.startsWith('Practical')
            && !line.startsWith('Opening')
            && !line.startsWith('Closing')
            && !line.startsWith('Venue')
            && !line.startsWith('Address')
            && !line.startsWith('Seating')
            && !line.startsWith('Language')
            && !line.startsWith('Typical')
            && !line.startsWith('Ages ')
            && !line.startsWith('Teens:')
            && !line.startsWith('Under ')
            && !line.startsWith('Short ')
            && !line.startsWith('Recommended')
            && !line.startsWith('Merchandise')
            && !line.startsWith('Staying')
            && !line.startsWith('Tips:')
            && !line.startsWith('Note');

        // Known section headers
        const knownHeaders = [
            'What Makes This Production Worth It',
            'The Golden Surprise Seat Experience (Singapore-Exclusive)',
            'Dates, Venue & Schedule',
            'Ticket Prices & How to Get Discounts',
            'Discount Codes & Member Benefits (March 2026)',
            'Other deals:',
            'UOB Cardmember Perks — Two Separate Tiers',
            'Seat Map & Sightline Guide for Sands Theatre',
            'Venue Rules — Read Before You Go',
            'Getting There: Transport, MRT & Parking',
            'By MRT (recommended for most)',
            'By Grab / Taxi',
            'By Car — Parking Options',
            'Family Guide: Is This Show Right for Your Kids?',
            'Frequently Asked Questions',
            '3 Things to Remember Before You Book',
        ];

        const isKnownHeader = knownHeaders.some(h => line.includes(h) || line === h);
        const isFaqQuestion = line.endsWith('?') && line.length < 120;

        if (isKnownHeader) {
            htmlBlocks.push(`<h2>${line}</h2>`);
            continue;
        }

        if (isFaqQuestion) {
            htmlBlocks.push(`<h3>${line}</h3>`);
            continue;
        }

        // Emoji section markers become h2
        if (line.startsWith('🍫') || line.startsWith('🎟') || line.startsWith('🚇')) {
            htmlBlocks.push(`<h2>${line}</h2>`);
            continue;
        }

        htmlBlocks.push(`<p>${line}</p>`);
    }

    if (currentList.length > 0) htmlBlocks.push(`<ul>${currentList.join('')}</ul>`);
    if (inTable) htmlBlocks.push('</tbody></table>');

    let description = htmlBlocks.join('\n');

    // Inject affiliate CTA
    const affiliateCTA = `
<div style="background:linear-gradient(135deg,#7c3aed,#db2777);padding:20px;border-radius:12px;margin:24px 0;text-align:center;">
  <p style="color:#fff;font-weight:bold;font-size:1.1rem;margin-bottom:12px;">🎫 Book Your Charlie and the Chocolate Factory Tickets</p>
  <a href="https://www.klook.com/en-SG/search/result/?query=charlie+chocolate+factory+singapore&aid=105111&utm_medium=affiliate-alwayson&utm_source=non-network&utm_campaign=105111" target="_blank" rel="noopener noreferrer" style="background:#fff;color:#7c3aed;padding:10px 24px;border-radius:8px;font-weight:bold;text-decoration:none;margin:4px;display:inline-block;">Book on Klook</a>
  <a href="https://sg.trip.com/hotels/singapore-hotel-detail-6047677/marina-bay-sands/?allianceid=7367361&sid=278066643" target="_blank" rel="noopener noreferrer" style="background:rgba(255,255,255,0.2);color:#fff;padding:10px 24px;border-radius:8px;font-weight:bold;text-decoration:none;margin:4px;display:inline-block;">Hotels near MBS</a>
</div>`;

    description = affiliateCTA + description;

    // Đúng startDate và endDate theo bài viết: 19 May – 7 June 2026
    const startDate = new Date('2026-05-19T00:00:00+08:00');
    const endDate = new Date('2026-06-07T23:59:59+08:00');

    const slug = 'charlie-and-the-chocolate-factory-singapore-2026';
    const name = 'Charlie and the Chocolate Factory Singapore 2026 — Tickets, Seats, Secrets & Family Guide';
    const imageUrl = 'https://res.klook.com/image/upload/w_750,h_469,c_fill,q_85/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/iboxuufkn5pdnura8y24.jpg';

    await prisma.event.upsert({
        where: { slug },
        update: {
            name,
            description,
            imageUrl,
            venue: 'The Sands Theatre, Marina Bay Sands',
            venueAddress: '10 Bayfront Avenue, Singapore 018956',
            price: 'From $88',
            status: 'PUBLISHED',
            category: 'Event',
            startDate,
            endDate,
            updatedAt: new Date(),
            authorId: 'author_2', // Sarah (family content)
        },
        create: {
            slug,
            name,
            description,
            imageUrl,
            venue: 'The Sands Theatre, Marina Bay Sands',
            venueAddress: '10 Bayfront Avenue, Singapore 018956',
            price: 'From $88',
            status: 'PUBLISHED',
            category: 'Event',
            startDate,
            endDate,
            authorId: 'author_2',
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    });

    console.log('✅ Đã restore thành công bài Charlie và Chocolate Factory!');
    console.log(`   Slug: ${slug}`);
    console.log(`   StartDate: ${startDate.toISOString()}`);
    console.log(`   EndDate: ${endDate.toISOString()}`);
    console.log(`   Status: PUBLISHED`);

    await prisma.$disconnect();
}

restoreCharlie().catch(e => { console.error('❌ Lỗi:', e.message); process.exit(1); });
