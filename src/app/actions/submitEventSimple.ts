"use server";

import { prisma } from "@/lib/prisma";

export async function submitEventSimple(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const description = formData.get("description") as string;
    const category = (formData.get("category") as string) || "Evergreen";
    const secretKey = formData.get("secretKey") as string;

    if (secretKey !== "BOSS2026") {
      return { success: false, message: "❌ Invalid Secret Key!" };
    }

    if (!name || !slug || !description) {
      return { success: false, message: "❌ Please fill in all required fields." };
    }

    const cleanText = description.replace(/<[^>]*>/g, '');
    const excerpt = cleanText.length > 160 ? cleanText.substring(0, 160) + "..." : cleanText;

    // All submissions go to the Post model only
    const post = await prisma.post.create({
      data: {
        title: name,
        slug: slug.toLowerCase().replace(/\s+/g, "-"),
        content: description,
        excerpt,
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1525625239513-39bc131f9979?w=1200",
        category: category === "News" ? "News" : "Evergreen",
        status: "PUBLISHED",
        isNewsjack: category === "News",
      },
    });

    return {
      success: true,
      message: "✅ Content published successfully!",
      slug: post.slug,
    };
  } catch (error: any) {
    console.error("Submit Error:", error);

    if (error.code === "P2002") {
      return { success: false, message: "❌ Slug already exists. Choose a unique URL." };
    }

    return { success: false, message: "❌ System error. Try again." };
  }
}