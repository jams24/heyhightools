import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const products = await prisma.product.findMany({
    include: { category: true, plans: { orderBy: { price: "asc" } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, description, image, categoryId, inStock, featured, plans } = body;

  const product = await prisma.product.create({
    data: {
      name,
      description,
      image,
      categoryId,
      inStock: inStock ?? true,
      featured: featured ?? false,
      plans: {
        create: plans?.map((p: { label: string; price: number; priceNgn?: number }) => ({
          label: p.label,
          price: p.price,
          priceNgn: p.priceNgn ?? 0,
        })) ?? [],
      },
    },
    include: { category: true, plans: true },
  });

  return NextResponse.json(product, { status: 201 });
}
