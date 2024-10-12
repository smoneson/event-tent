import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function POST(request: Request) {
  const data = await request.json();
  const event = prisma.event.create({ data });
  return NextResponse.json(event);
}

export async function GET() {
  const events = await prisma.event.findMany();
  return NextResponse.json(events);
}
