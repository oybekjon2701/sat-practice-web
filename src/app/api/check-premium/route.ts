import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ premium: false });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    await prisma.user.create({
      data: { id: userId, email: userId, plan: "free" },
    });
    return NextResponse.json({ premium: false });
  }

  let premium = user.plan === "premium";
  if (premium && user.premiumUntil && user.premiumUntil < new Date()) {
    premium = false;
  }

  return NextResponse.json({ premium });
}
