// scripts/generate-woodlands-backup-plan-pdf.js
// Generates the Woodlands Exam Week Backup Plan 2026 PDF
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(process.cwd(), 'digital-products', 'woodlands-exam-week-backup-plan');
const outputPath = path.join(outputDir, 'Woodlands-Exam-Week-Backup-Plan-2026.pdf');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 60, bottom: 60, left: 60, right: 60 },
  info: {
    Title: 'Woodlands Exam Week Backup Plan 2026',
    Author: 'SGEventsHub',
    Subject: 'Practical contingency guide for Woodlands study spots',
    Keywords: 'study spots, Woodlands, Singapore, exam week, backup plan',
  },
});

const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

// Register fonts (using built-in fonts for simplicity)
doc.font('Helvetica');

function addCoverPage() {
  doc.fontSize(10).fillColor('#666666').text('SGEventsHub - Digital Product', { align: 'center' });
  doc.moveDown(2);
  
  doc.fontSize(36).fillColor('#111111').font('Helvetica-Bold').text('Woodlands Exam Week\nBackup Plan 2026', { align: 'center', lineGap: 8 });
  doc.moveDown(1.5);
  
  doc.fontSize(18).fillColor('#444444').font('Helvetica-Oblique').text('Your Plan B, C and D when your\nusual study spot is full.', { align: 'center', lineGap: 6 });
  doc.moveDown(2);
  
  doc.fontSize(12).fillColor('#666666').font('Helvetica').text(
    'A practical contingency guide for choosing what to do when your preferred study location is crowded, unavailable, unsuitable, or closing soon.',
    { align: 'center', width: 400 }
  );
  doc.moveDown(4);
  
  doc.fontSize(10).fillColor('#999999').text('Last verified: September 2026', { align: 'center' });
  doc.fontSize(10).fillColor('#999999').text('Version 1.0', { align: 'center' });
  
  doc.addPage();
}

function addHowToUsePage() {
  addPageHeader('HOW TO USE THIS GUIDE');
  
  doc.fontSize(13).fillColor('#333333').font('Helvetica').text(
    'This guide is designed for exam-week conditions when your first-choice study spot lets you down. Follow the sequence:',
    { width: 480 }
  );
  doc.moveDown(1.5);
  
  const steps = [
    'Choose your preferred study spot (Plan A).',
    'Check current opening hours and booking requirements before leaving home.',
    'If the venue is unsuitable or unavailable, move to Backup #1.',
    'If Backup #1 fails, move to Backup #2.',
    'Use the late-hour fallback only when appropriate and verified.',
  ];
  
  steps.forEach((step, i) => {
    doc.fontSize(13).fillColor('#111111').font('Helvetica-Bold').text(`${i + 1}.`, { continued: true });
    doc.font('Helvetica').text(` ${step}`, { width: 480 });
    doc.moveDown(0.8);
  });
  
  doc.moveDown(1);
  
  // Important disclaimer box
  doc.fillColor('#fef3c7').rect(60, doc.y, 480, 70).fill();
  doc.fillColor('#92400e').fontSize(11).font('Helvetica-Bold').text('IMPORTANT', 70, doc.y + 10, { width: 460 });
  doc.font('Helvetica').fontSize(11).text(
    'This guide does NOT guarantee live seat availability. SGEventsHub does not track real-time occupancy. Always verify current conditions before travelling.',
    70, doc.y + 30, { width: 460 }
  );
  doc.moveDown(5);
  
  doc.addPage();
}

function addDecisionMatrixPage() {
  addPageHeader('STUDY-SPOT DECISION MATRIX');
  
  doc.fontSize(11).fillColor('#666666').font('Helvetica').text(
    'Verified Woodlands/North-area options. All details from official sources (NLB, PA/OnePA, venue operators) unless noted.',
    { width: 480 }
  );
  doc.moveDown(1.5);
  
  const venues = [
    {
      name: 'Woodlands Regional Library',
      bestFor: 'Long daytime sessions, silent study, reliable Wi-Fi & power',
      cost: 'Free',
      hours: 'Mon-Sun: 10:00-21:00 (closed public holidays)',
      booking: 'No booking required for general areas',
      wifi: 'Yes (Wireless@SGx)',
      power: 'Yes (designated seats with sockets)',
      quiet: 'High (designated quiet zones)',
      mrt: 'Woodlands MRT (NSL/TEL) - 5 min walk via Woodlands Civic Centre',
      risk: 'Fills up by mid-morning during exam periods; no late-night access',
      role: 'Plan A - Primary daytime option',
    },
    {
      name: 'Woodlands Galaxy Community Club',
      bestFor: 'Afternoon/evening sessions, free CC study area',
      cost: 'Free',
      hours: 'Mon-Sun: 9:00-22:00 (subject to CC programming; check OnePA)',
      booking: 'Walk-in; some CCs require registration at counter',
      wifi: 'Yes (Wireless@SGx in common areas)',
      power: 'Limited (some tables near wall sockets)',
      quiet: 'Moderate (shared with other CC users)',
      mrt: 'Woodlands MRT - 8 min walk',
      risk: 'CC events may restrict access; hours change without notice',
      role: 'Backup #1 - Evening extension',
    },
    {
      name: 'Sembawang Public Library',
      bestFor: 'Quieter alternative, smaller crowds than Woodlands Regional',
      cost: 'Free',
      hours: 'Mon-Sun: 11:00-21:00 (closed public holidays)',
      booking: 'No booking required',
      wifi: 'Yes (Wireless@SGx)',
      power: 'Yes (limited sockets at window seats)',
      quiet: 'High (smaller branch, less foot traffic)',
      mrt: 'Sembawang MRT (NSL) - 3 min walk via Sun Plaza',
      risk: 'Earlier closing than Woodlands Regional; smaller seating capacity',
      role: 'Backup #2 - North fallback',
    },
    {
      name: 'Republic Polytechnic - The Lawn / Library@RP (Public Access)',
      bestFor: 'Late afternoon/early evening, campus environment',
      cost: 'Free (public areas only)',
      hours: 'Library: Mon-Fri 8:00-21:00, Sat 9:00-17:00 (closed Sun/PH); The Lawn: 24/7 outdoor',
      booking: 'Library: walk-in for public areas; The Lawn: open access',
      wifi: 'Library: Yes; The Lawn: Wireless@SGx nearby',
      power: 'Library: Yes; The Lawn: No',
      quiet: 'Library: High; The Lawn: Low (outdoor, weather-dependent)',
      mrt: 'Woodlands MRT - Bus 169/962 (10 min) or walk 25 min',
      risk: 'Library closes early on weekends; The Lawn has no power/AC',
      role: 'Backup #2 (Library) / Late-night fallback (The Lawn, conditions permitting)',
    },
    {
      name: 'Causeway Point / Woodlands North Plaza (Mall Seating)',
      bestFor: 'Late-night fallback when libraries/CCs close',
      cost: 'Free (seating areas); purchase expected at F&B outlets',
      hours: 'Mall: 10:00-22:00 (some 24-hr F&B outlets); 24-hr McDonald\'s at Woodlands North Plaza',
      booking: 'No',
      wifi: 'Mall Wi-Fi (limited); Wireless@SGx at some spots',
      power: 'Limited (some charging stations; 24-hr McDonald\'s has sockets)',
      quiet: 'Low (public mall ambient noise)',
      mrt: 'Woodlands MRT - direct link to Causeway Point; Woodlands North MRT (TEL) - Woodlands North Plaza',
      risk: 'Not a study venue; noise, lighting, and seating not guaranteed',
      role: 'Late-night fallback ONLY when all above are closed',
    },
  ];
  
  // Table header - adjusted column widths for better fit
  const colWidths = [100, 80, 35, 60, 45, 45, 40, 50, 65, 60];
  const headers = ['Venue', 'Best For', 'Cost', 'Hours', 'Booking', 'Wi-Fi', 'Power', 'Quiet', 'MRT/Walk', 'Role'];
  
  let y = doc.y;
  const headerHeight = 20;
  const minRowHeight = 85;
  
  function drawHeader(startY) {
    doc.fillColor('#1e3a8a').rect(60, startY, 480, headerHeight).fill();
    doc.fillColor('#ffffff').fontSize(7).font('Helvetica-Bold');
    let hx = 60;
    headers.forEach((h, i) => {
      doc.text(h, hx + 2, startY + 5, { width: colWidths[i] - 4, align: 'center' });
      hx += colWidths[i];
    });
    return startY + headerHeight;
  }
  
  y = drawHeader(y);
  
  // Draw data rows
  venues.forEach((venue, rowIdx) => {
    // Calculate required height for this row based on content
    doc.fontSize(7).font('Helvetica');
    let maxLines = 1;
    const rowData = [
      venue.name,
      venue.bestFor,
      venue.cost,
      venue.hours,
      venue.booking,
      venue.wifi,
      venue.power,
      venue.quiet,
      venue.mrt,
      venue.role,
    ];
    
    rowData.forEach((cell, i) => {
      const opts = { width: colWidths[i] - 4, align: i === 0 ? 'left' : 'center' };
      const lines = doc.heightOfString(cell, opts) / 8.4; // approximate line height for 7pt font
      maxLines = Math.max(maxLines, Math.ceil(lines));
    });
    
    const contentHeight = Math.max(maxLines * 9, 55);
    const rowH = Math.max(minRowHeight, contentHeight + 25); // +25 for risk note
    
    // Check if we need a new page (leave space for footer)
    if (y + rowH > 720) {
      doc.addPage();
      y = 60;
      y = drawHeader(y);
    }
    
    const fillColor = rowIdx % 2 === 0 ? '#f8fafc' : '#ffffff';
    doc.fillColor(fillColor).rect(60, y, 480, rowH).fill();
    doc.fillColor('#1e293b').fontSize(7).font('Helvetica');
    
    let x = 60;
    rowData.forEach((cell, i) => {
      doc.text(cell, x + 2, y + 4, { width: colWidths[i] - 4, align: i === 0 ? 'left' : 'center' });
      x += colWidths[i];
    });
    
    // Risk note below each row
    doc.fillColor('#64748b').fontSize(6.5).font('Helvetica-Oblique')
      .text(`Risk: ${venue.risk}`, 62, y + rowH - 20, { width: 476 });
    
    y += rowH;
  });
  
  doc.moveDown(1);
  doc.fontSize(8).fillColor('#94a3b8').font('Helvetica-Oblique').text(
    'Last verified: September 2026. Opening hours, access rules, booking requirements, facilities, and seat availability can change. Always check the venue\'s current information before travelling.',
    { width: 480 }
  );
  
  doc.addPage();
}

function addDecisionTreePage() {
  addPageHeader('PRIMARY -> BACKUP DECISION TREE');
  
  doc.fontSize(12).fillColor('#333333').font('Helvetica').text(
    'Follow this flow when your first choice does not work. Verify hours before each move.',
    { width: 480 }
  );
  doc.moveDown(1.5);
  
  const tree = [
    { level: 0, text: 'START: Where do you want to study?', bold: true },
    { level: 1, text: 'PRIMARY: Woodlands Regional Library (10:00-21:00)', bold: false },
    { level: 2, text: 'Is it suitable & available?', bold: true },
    { level: 3, text: 'YES -> Study there. Done.', bold: false },
    { level: 3, text: 'NO -> Go to BACKUP #1', bold: false },
    { level: 1, text: 'BACKUP #1: Woodlands Galaxy CC (9:00-22:00, check OnePA)', bold: false },
    { level: 2, text: 'Still unsuitable?', bold: true },
    { level: 3, text: 'YES -> Go to BACKUP #2', bold: false },
    { level: 3, text: 'NO -> Study there. Done.', bold: false },
    { level: 1, text: 'BACKUP #2: Sembawang Library (11:00-21:00) OR Republic Polytechnic Library (8:00-21:00 weekdays)', bold: false },
    { level: 2, text: 'Need later hours? (after 21:00)', bold: true },
    { level: 3, text: 'YES -> LATE-NIGHT FALLBACK', bold: false },
    { level: 3, text: 'NO -> Study at Backup #2. Done.', bold: false },
    { level: 1, text: 'LATE-NIGHT FALLBACK: 24-hr McDonald\'s (Woodlands North Plaza) or Causeway Point 24-hr F&B', bold: false },
    { level: 2, text: '!! Not a study venue. No guaranteed power, quiet, or AC. Use only if no alternative.', bold: true },
  ];
  
  tree.forEach(node => {
    const indent = node.level * 20;
    const bullet = node.level === 0 ? '>>' : node.level === 1 ? '--' : node.level === 2 ? '|  --' : '|  |  --';
    doc.fontSize(11).fillColor(node.bold ? '#111111' : '#333333')
      .font(node.bold ? 'Helvetica-Bold' : 'Helvetica')
      .text(`${bullet} ${node.text}`, 60 + indent, doc.y, { width: 480 - indent });
    doc.moveDown(0.5);
  });
  
  doc.moveDown(1);
  doc.addPage();
}

function addTimingStrategyPage() {
  addPageHeader('EXAM-WEEK TIMING STRATEGY');
  
  const tips = [
    { title: 'Morning advantage', body: 'Libraries open at 10:00-11:00. Arriving at opening time significantly increases seat availability. The first 2-3 hours after opening are typically the least crowded.' },
    { title: 'Afternoon crowding', body: 'Exam periods see peak occupancy from 13:00-18:00. If your session starts in this window, have Backup #1 confirmed before you leave home.' },
    { title: 'Evening transition', body: 'Woodlands Regional Library closes at 21:00. Woodlands Galaxy CC may stay open until 22:00 (verify on OnePA). Plan your move 30 minutes before closing.' },
    { title: 'Late-night reality', body: 'After 22:00, free air-conditioned options with power are extremely limited in Woodlands. The 24-hour McDonald\'s at Woodlands North Plaza has sockets but is not a study venue - noise, lighting, and seating are not controlled.' },
    { title: 'Weekend vs weekday', body: 'Sembawang Library and Republic Polytechnic Library have shorter weekend hours. Check before travelling. Republic Polytechnic Library is closed on Sundays and public holidays.' },
    { title: 'Booking requirements', body: 'None of the listed free venues require advance booking for general study areas. Some CCs ask for registration at the counter on first visit.' },
    { title: 'Transport buffer', body: 'Woodlands MRT to Republic Polytechnic: ~10 min by bus, 25 min walk. Woodlands to Sembawang: 1 MRT stop (~3 min). Factor in 15-20 min buffer for walking/waiting.' },
    { title: 'Power-critical sessions', body: 'If your device battery is low, prioritise Woodlands Regional Library (confirmed sockets at designated seats) or Republic Polytechnic Library. Galaxy CC and Sembawang Library have limited/uncertain power access.' },
    { title: 'Silence-critical sessions', body: 'Do not default to cafes or mall seating if silence is essential. Woodlands Regional Library and Sembawang Library have designated quiet zones. Galaxy CC is shared space - noise level varies.' },
  ];
  
  tips.forEach((tip, i) => {
    doc.fontSize(12).fillColor('#1e3a8a').font('Helvetica-Bold').text(`${i + 1}. ${tip.title}`, { width: 480 });
    doc.moveDown(0.3);
    doc.fontSize(11).fillColor('#333333').font('Helvetica').text(tip.body, { width: 480 });
    doc.moveDown(1);
  });
  
  doc.moveDown(0.5);
  doc.fontSize(9).fillColor('#94a3b8').font('Helvetica-Oblique').text(
    'Language used: "may", "typically", "based on published information" — not live data. Always verify.',
    { width: 480 }
  );
  
  doc.addPage();
}

function addChecklistPage() {
  addPageHeader('BACKUP CHECKLIST (BEFORE YOU LEAVE)');
  
  doc.fontSize(12).fillColor('#333333').font('Helvetica').text(
    'Complete this checklist before leaving for your study session. Save a screenshot or print this page.',
    { width: 480 }
  );
  doc.moveDown(1.5);
  
  const items = [
    'Check opening hours for Plan A venue (official website/OnePA/NLB)',
    'Check booking/registration requirement for Plan A',
    'Check current availability if venue provides it (e.g., NLB Crowd Levels)',
    'Save Backup #1 details (venue, hours, MRT directions)',
    'Save Backup #2 details (venue, hours, MRT directions)',
    'Charge laptop / phone to 80%+',
    'Bring charger(s)',
    'Bring power bank (critical for venues with limited sockets)',
    'Download important study materials for offline access',
    'Check transport (MRT/bus status, walking time)',
    'Pack water / snacks if appropriate (note: no eating in libraries)',
    'Leave enough travel time to arrive 10-15 min before you need to start',
  ];
  
  items.forEach((item, i) => {
    const y = doc.y;
    // Checkbox
    doc.lineWidth(0.5).strokeColor('#94a3b8').rect(60, y + 1, 10, 10).stroke();
    doc.fontSize(11).fillColor('#1e293b').font('Helvetica').text(item, 75, y, { width: 465 });
    doc.moveDown(0.9);
  });
  
  doc.moveDown(1);
  doc.addPage();
}

function addEmergencyRulesPage() {
  addPageHeader('EMERGENCY DECISION RULES');
  
  const rules = [
    {
      title: 'If your first choice is full',
      body: 'Do not spend 30 minutes searching randomly. -> Switch to Backup #1 immediately. The decision tree exists so you do not have to improvise under pressure.',
    },
    {
      title: 'If it is already late (after 20:00)',
      body: 'Remove venues that close too soon (Woodlands Regional Library closes 21:00, Sembawang 21:00). -> Choose a genuinely suitable later option (Galaxy CC until 22:00, or late-night fallback).',
    },
    {
      title: 'If silence is critical',
      body: 'Do not automatically use a cafe or mall seating. -> Prioritise the verified quietest suitable option (Woodlands Regional Library quiet zones, Sembawang Library).',
    },
    {
      title: 'If power is essential',
      body: 'Do not gamble on an unverified venue. -> Choose a venue with confirmed power availability (Woodlands Regional Library designated seats, Republic Polytechnic Library). Bring a power bank regardless.',
    },
    {
      title: 'If travelling far (e.g., from another town)',
      body: 'Check the destination before leaving. -> A "good" venue is not good if the trip is wasted. Use NLB Crowd Levels, OnePA, or call the venue.',
    },
    {
      title: 'If all free options are exhausted',
      body: 'Consider paid alternatives: Spatial (booths), Switch study booths, City on a Hill, or nearby coworking day passes. Typical student pricing: ~S$2-5/hour, S$5-10/day. This guide covers free options only.',
    },
  ];
  
  rules.forEach((rule, i) => {
    doc.fontSize(12).fillColor('#b91c1c').font('Helvetica-Bold').text(`- ${rule.title}`, { width: 480 });
    doc.moveDown(0.3);
    doc.fontSize(11).fillColor('#333333').font('Helvetica').text(rule.body, { width: 480 });
    doc.moveDown(1.2);
  });
  
  doc.moveDown(0.5);
  doc.addPage();
}

function addSourcesPage() {
  addPageHeader('SOURCES & LIMITATIONS');
  
  doc.fontSize(12).fillColor('#333333').font('Helvetica-Bold').text('Official Sources Consulted', { width: 480 });
  doc.moveDown(0.5);
  
  const sources = [
    'National Library Board (NLB) - Woodlands Regional Library & Sembawang Public Library pages: opening hours, facilities, Wireless@SGx, socket locations',
    'People\'s Association (PA) / OnePA - Woodlands Galaxy Community Club: study area access, operating hours, booking requirements',
    'Republic Polytechnic - Library@RP public access hours and facilities',
    'Wireless@SGx - Government Wi-Fi coverage at public venues',
    'Land Transport Authority / OneMap - MRT walking distances and bus routes',
    'Venue operator websites / Google Business listings - Mall hours, 24-hr F&B confirmation',
  ];
  
  sources.forEach((src, i) => {
    doc.fontSize(10).fillColor('#333333').font('Helvetica').text(`${i + 1}. ${src}`, { width: 480 });
    doc.moveDown(0.6);
  });
  
  doc.moveDown(1);
  doc.fontSize(12).fillColor('#333333').font('Helvetica-Bold').text('Verification Date', { width: 480 });
  doc.moveDown(0.5);
  doc.fontSize(11).fillColor('#333333').font('Helvetica').text('All venue facts above were last verified against official sources in September 2026.', { width: 480 });
  doc.moveDown(1.5);
  
  doc.fontSize(12).fillColor('#333333').font('Helvetica-Bold').text('Important Disclaimer', { width: 480 });
  doc.moveDown(0.5);
  
  doc.fillColor('#fef2f2').rect(60, doc.y, 480, 80).fill();
  doc.fillColor('#991b1b').fontSize(11).font('Helvetica').text(
    'Opening hours, access rules, booking requirements, facilities, and seat availability can change without notice. ' +
    'Always check the venue\'s current information before travelling. ' +
    'This guide is designed to reduce decision-making friction, not to guarantee a seat. ' +
    'SGEventsHub does not track live occupancy, crowd levels, or real-time availability. ' +
    'Paid study-space alternatives (e.g., Spatial, Switch, City on a Hill, coworking) are not covered in this guide.',
    70, doc.y + 10, { width: 460 }
  );
  
  doc.moveDown(6);
  doc.fontSize(9).fillColor('#94a3b8').font('Helvetica-Oblique').text(
    '© 2026 SGEventsHub. Personal planning tool. Not for resale or redistribution.',
    { align: 'center', width: 480 }
  );
}

function addPageHeader(title) {
  doc.fontSize(10).fillColor('#666666').font('Helvetica').text('SGEventsHub - Woodlands Exam Week Backup Plan 2026', { align: 'left' });
  doc.moveDown(0.3);
  doc.fontSize(20).fillColor('#111111').font('Helvetica-Bold').text(title, { align: 'left' });
  doc.moveDown(0.5);
  doc.lineWidth(1).strokeColor('#1e3a8a').moveTo(60, doc.y).lineTo(540, doc.y).stroke();
  doc.moveDown(1);
}

// Generate all pages
addCoverPage();
addHowToUsePage();
addDecisionMatrixPage();
addDecisionTreePage();
addTimingStrategyPage();
addChecklistPage();
addEmergencyRulesPage();
addSourcesPage();

doc.end();

stream.on('finish', () => {
  console.log(`PDF generated: ${outputPath}`);
  console.log(`File size: ${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB`);
});

stream.on('error', (err) => {
  console.error('PDF generation error:', err);
});