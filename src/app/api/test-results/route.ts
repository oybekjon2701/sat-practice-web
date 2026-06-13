import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const result = await prisma.testResult.create({
      data: {
        userId,
        testId: body.testId,
        testName: body.testName,
        totalScore: body.totalScore,
        readingScore: body.readingScore,
        mathScore: body.mathScore,
        readingCorrect: body.readingCorrect,
        readingTotal: body.readingTotal,
        mathCorrect: body.mathCorrect,
        mathTotal: body.mathTotal,
        answers: body.answers || {},
      },
    });
    return NextResponse.json({ id: result.id });
  } catch (err) {
    console.error("Save result error:", err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = await prisma.testResult.findMany({
    where: { userId },
    orderBy: { completedAt: "desc" },
  });

  return NextResponse.json(results);
}
