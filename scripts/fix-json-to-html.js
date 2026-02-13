// scripts/fix-json-to-html.js
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function run() {
    const slug = "chinatown-little-india-kampong-glam-route-timing-tips";
    console.log(`🔍 Finding post with slug: ${slug}...`);

    const post = await prisma.post.findUnique({ where: { slug } });

    if (!post) {
        console.error("❌ Post not found!");
        return;
    }

    let data;
    try {
        data = JSON.parse(post.content);
        console.log("✅ Successfully parsed JSON from content field.");
    } catch (e) {
        console.error("❌ Content is not valid JSON or already transformed:", e.message);
        return;
    }

    let html = "";

    // 1. Introduction
    if (data.introduction) {
        html += `<h2>Introduction</h2>`;
        html += `<p>${data.introduction.overview || ""}</p>`;
        html += `<p><strong>Challenge:</strong> ${data.introduction.key_challenge || ""}</p>`;
    }

    // 2. Best Timing
    if (data.best_timing) {
        html += `<h2>Best Timing</h2>`;
        html += `<p>✦ <strong>Chinatown:</strong> ${data.best_timing.chinatown.optimal_hours} (${data.best_timing.chinatown.reason})</p>`;
        html += `<p>✦ <strong>Little India:</strong> ${data.best_timing.little_india.optimal_hours} (Caution: ${data.best_timing.little_india.caution})</p>`;
        html += `<p>✦ <strong>Kampong Glam:</strong> ${data.best_timing.kampong_glam.optimal_hours} (${data.best_timing.kampong_glam.reason})</p>`;
        html += `<p>✦ <strong>Best Days:</strong> ${data.best_timing.best_days}</p>`;
    }

    // 3. Quick Plan
    if (data.quick_plan_summary) {
        html += `<h2>Quick Plan Summary</h2>`;
        html += `<p>✦ <strong>Optimal Route:</strong> ${data.quick_plan_summary.best_timing}</p>`;
        html += `<p>✦ <strong>Budget:</strong> ${data.quick_plan_summary.budget_range}</p>`;
        html += `<p>✦ <strong>Dress Code:</strong> ${data.quick_plan_summary.dress_code}</p>`;
    }

    // 4. Route Options
    if (data.route_options && data.route_options.length > 0) {
        html += `<h2>Route Options</h2>`;
        data.route_options.forEach(route => {
            html += `<h3 style="color: #3b82f6; border-bottom: 1px solid rgba(59,130,246,0.2); padding-bottom: 0.5rem; margin-top: 2rem;">${route.name} (${route.duration})</h3>`;
            if (route.description) html += `<p><em>${route.description}</em></p>`;
            if (route.schedule) {
                if (Array.isArray(route.schedule)) {
                    route.schedule.forEach(s => {
                        html += `<p><strong>${s.time} - ${s.district}</strong></p><ul>`;
                        s.activities.forEach(a => html += `<li style="margin-bottom: 0.5rem;">✦ ${a}</li>`);
                        html += `</ul>`;
                    });
                } else if (typeof route.schedule === 'object') {
                    html += `<p>✦ <strong>Morning:</strong> ${route.schedule.morning || ""}</p>`;
                    html += `<p>✦ <strong>Midday Break:</strong> ${route.schedule.midday_break || ""}</p>`;
                    html += `<p>✦ <strong>Evening:</strong> ${route.schedule.evening || ""}</p>`;
                }
            }
        });
    }

    // 5. Budget Breakdown
    if (data.budget_breakdown) {
        html += `<h2>Budget Breakdown</h2>`;
        Object.keys(data.budget_breakdown).forEach(key => {
            const b = data.budget_breakdown[key];
            if (b && typeof b === 'object' && b.item && b.cost) {
                html += `<p>✦ <strong>${b.item}:</strong> ${b.cost}</p>`;
            }
        });
        if (data.budget_breakdown.total_estimate) {
            html += `<p><strong>Estimated Total:</strong> ${data.budget_breakdown.total_estimate.basic} (Basic) / ${data.budget_breakdown.total_estimate.with_extras} (With Extras)</p>`;
        }
    }

    // 6. Dress Code & Practical Tips
    if (data.dress_code || data.friction_points) {
        html += `<h2>Practical Intelligence</h2>`;
        if (data.dress_code) {
            html += `<h3>Dress Code</h3>`;
            html += `<p>${data.dress_code.fabric_advice || ""}</p>`;
        }
        if (data.friction_points) {
            html += `<h3>Friction Points & Solutions</h3>`;
            data.friction_points.forEach(point => {
                html += `<p>✦ <strong>${point.issue}:</strong> ${point.details} ${point.solution ? `(Solution: ${point.solution})` : ""}</p>`;
            });
        }
    }

    // 7. FAQ
    if (data.faq && data.faq.length > 0) {
        html += `<h2>Frequently Asked Questions</h2>`;
        data.faq.forEach(q => {
            html += `<p style="color: white; font-weight: 800; margin-top: 1.5rem;">Q: ${q.question}</p>`;
            html += `<p>A: ${q.answer}</p>`;
        });
    }

    console.log("✨ Generated HTML content.");

    await prisma.post.update({
        where: { id: post.id },
        data: { content: html }
    });

    console.log("🚀 Database updated successfully!");
    await prisma.$disconnect();
}

run().catch(e => {
    console.error("💥 Error:", e.message);
    prisma.$disconnect();
});
