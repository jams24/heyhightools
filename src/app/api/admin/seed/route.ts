import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST() {
  try {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await prisma.admin.upsert({
      where: { email: "admin@heyhightoolz.com" },
      update: { password: hashedPassword },
      create: { email: "admin@heyhightoolz.com", password: hashedPassword },
    });

    const categories = await Promise.all(
      ["AI Assistants", "Creative Tools", "Productivity", "Streaming"].map(
        (name) =>
          prisma.category.upsert({
            where: { name },
            update: {},
            create: { name },
          })
      )
    );

    const catMap: Record<string, string> = {};
    categories.forEach((c) => (catMap[c.name] = c.id));

    const products = [
      {
        name: "ChatGPT Plus",
        description: "Premium access to OpenAI's ChatGPT with GPT-4, faster responses, and priority access.",
        image: "https://cdn.worldvectorlogo.com/logos/chatgpt-6.svg",
        categoryId: catMap["AI Assistants"],
        inStock: true,
        featured: true,
        plans: [
          { label: "1 Month", price: 6.50, priceNgn: 10000 },
          { label: "6 Months", price: 35.00, priceNgn: 55000 },
          { label: "12 Months", price: 55.00, priceNgn: 85000 },
        ],
      },
      {
        name: "Gemini AI Pro",
        description: "Google's advanced AI assistant with multimodal capabilities and deep research.",
        image: "https://cdn.worldvectorlogo.com/logos/google-gemini-icon.svg",
        categoryId: catMap["AI Assistants"],
        inStock: true,
        featured: true,
        plans: [{ label: "18 Months", price: 13.00, priceNgn: 20000 }],
      },
      {
        name: "Claude Pro",
        description: "Anthropic's AI assistant with extended thinking, vision, and long context window.",
        image: "https://cdn.worldvectorlogo.com/logos/claude-ai-icon.svg",
        categoryId: catMap["AI Assistants"],
        inStock: false,
        featured: false,
        plans: [{ label: "1 Month", price: 10.50, priceNgn: 16000 }],
      },
      {
        name: "Grok",
        description: "xAI's conversational AI with real-time information and witty personality.",
        image: "https://cdn.worldvectorlogo.com/logos/x-2.svg",
        categoryId: catMap["AI Assistants"],
        inStock: true,
        featured: false,
        plans: [{ label: "2 Months", price: 13.00, priceNgn: 20000 }],
      },
      {
        name: "Perplexity Pro",
        description: "AI-powered search engine with cited sources and advanced research capabilities.",
        image: "https://cdn.worldvectorlogo.com/logos/perplexity-ai-icon.svg",
        categoryId: catMap["AI Assistants"],
        inStock: true,
        featured: true,
        plans: [
          { label: "1 Month", price: 6.50, priceNgn: 10000 },
          { label: "12 Months", price: 19.50, priceNgn: 30000 },
        ],
      },
      {
        name: "ElevenLabs Creator",
        description: "Professional AI voice generation and cloning platform for creators.",
        image: "https://cdn.worldvectorlogo.com/logos/elevenlabs-1.svg",
        categoryId: catMap["Creative Tools"],
        inStock: true,
        featured: true,
        plans: [{ label: "1 Month", price: 13.00, priceNgn: 20000 }],
      },
      {
        name: "CapCut Pro",
        description: "Professional video editing tool with AI-powered features and effects.",
        image: "https://cdn.worldvectorlogo.com/logos/capcut-logo.svg",
        categoryId: catMap["Creative Tools"],
        inStock: true,
        featured: false,
        plans: [
          { label: "1 Month", price: 5.20, priceNgn: 8000 },
          { label: "6 Months", price: 22.75, priceNgn: 35000 },
        ],
      },
      {
        name: "Adobe Creative Cloud",
        description: "Full Adobe suite including Photoshop, Illustrator, Premiere Pro, and more.",
        image: "https://cdn.worldvectorlogo.com/logos/adobe-creative-cloud-cc.svg",
        categoryId: catMap["Creative Tools"],
        inStock: true,
        featured: false,
        plans: [{ label: "4 Months", price: 16.25, priceNgn: 25000 }],
      },
      {
        name: "Lovable AI",
        description: "AI-powered web app builder with 200 credits/month. No credit card required.",
        image: "https://cdn.worldvectorlogo.com/logos/lovable-icon.svg",
        categoryId: catMap["Creative Tools"],
        inStock: true,
        featured: false,
        plans: [{ label: "3 Months", price: 22.75, priceNgn: 35000 }],
      },
      {
        name: "Grammarly Pro",
        description: "AI writing assistant with advanced grammar, tone, and style suggestions.",
        image: "https://cdn.worldvectorlogo.com/logos/grammarly-1.svg",
        categoryId: catMap["Productivity"],
        inStock: true,
        featured: true,
        plans: [
          { label: "1 Month", price: 6.50, priceNgn: 10000 },
          { label: "1 Year", price: 29.25, priceNgn: 45000 },
        ],
      },
      {
        name: "Netlify Pro",
        description: "Modern web hosting platform with CI/CD, serverless functions, and edge network.",
        image: "https://cdn.worldvectorlogo.com/logos/netlify.svg",
        categoryId: catMap["Productivity"],
        inStock: true,
        featured: false,
        plans: [{ label: "1 Month", price: 4.55, priceNgn: 7000 }],
      },
      {
        name: "Prime Video",
        description: "Amazon's streaming service with movies, TV shows, and exclusive originals.",
        image: "https://cdn.worldvectorlogo.com/logos/prime-video-1.svg",
        categoryId: catMap["Streaming"],
        inStock: true,
        featured: false,
        plans: [
          { label: "3 Months", price: 3.90, priceNgn: 6000 },
          { label: "6 Months", price: 7.80, priceNgn: 12000 },
          { label: "12 Months", price: 15.60, priceNgn: 24000 },
        ],
      },
    ];

    await prisma.plan.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();

    for (const p of products) {
      await prisma.product.create({
        data: {
          name: p.name,
          description: p.description,
          image: p.image,
          categoryId: p.categoryId,
          inStock: p.inStock,
          featured: p.featured,
          plans: { create: p.plans },
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully!",
      admin: { email: "admin@heyhightoolz.com", password: "admin123" },
      products: products.length,
      categories: categories.length,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Seed failed", details: String(error) }, { status: 500 });
  }
}
