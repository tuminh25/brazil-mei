"use server";

import prisma from "@/lib/prisma";

export async function submitEventSimple(formData: FormData) {
  try {
    // Lấy dữ liệu từ form
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const secretKey = formData.get("secretKey") as string;

    // Kiểm tra Secret Key
    if (secretKey !== "BOSS2026") {
      return { success: false, message: "❌ Invalid Secret Key!" };
    }

    // Validate
    if (!name || !slug || !description) {
      return { success: false, message: "❌ Please fill required fields" };
    }

    // Tạo aiSummary từ description (lấy 150 ký tự đầu)
    const cleanText = description.replace(/<[^>]*>/g, '');
    const aiSummary = cleanText.length > 150 
      ? cleanText.substring(0, 150) + "..."
      : cleanText;

    // Tạo event
    const event = await prisma.event.create({
      data: {
        name,
        slug: slug.toLowerCase().replace(/\s+/g, "-"),
        description,
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1525625239513-39bc131f9979?w=1200",
        startDate: new Date(), // Today's date
        status: "PUBLISHED",
        category,
        aiSummary,
        marketingPitch: "Discover this amazing experience in Singapore",
        price: "Check website",
        venue: "Singapore",
        hotnessScore: Math.floor(Math.random() * 100),
        tags: [category]
      },
    });

    return {
      success: true,
      message: "✅ Event published successfully!",
      slug: event.slug
    };
  } catch (error: any) {
    console.error("Submit Error:", error);
    
    if (error.code === "P2002") {
      return { success: false, message: "❌ Slug already exists" };
    }
    
    return { success: false, message: "❌ System error. Try again." };
  }
}