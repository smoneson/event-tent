import { NextRequest, NextResponse } from "next/server";
import { Event } from "@prisma/client";
import prisma from "@/app/_lib/prisma";

export async function GET() {
  const events = await prisma.event.findMany({
    include: {
      creator: {
        select: { name: true },
      },
    },
  });

  return NextResponse.json(events);
}

type CreateEventReqBody = Omit<Event, "id">;

export const POST = async (req: NextRequest) => {
  const body: CreateEventReqBody = await req.json();

  if (!body.title || !body.location || !body.date) {
    return NextResponse.json("Please provide title, location, and date", {
      status: 400,
    });
  }

  try {
    const newEvent = await prisma.event.create({
      data: {
        title: body.title,
        description: body.description,
        location: body.location,
        date: body.date,
        creator: { connect: { id: parseInt(body.creatorId.toString()) } },
      },
      include: {
        creator: true,
      },
    });
    return NextResponse.json({ newEvent });
  } catch (error) {
    console.error(error);
    return NextResponse.json("Something went wrong creating the event", {
      status: 500,
    });
  }
};
