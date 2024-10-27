import { NextRequest, NextResponse } from "next/server";
import { Event } from "@prisma/client";
import prisma from "@/app/_lib/prisma";

export const GET = async () => {
  try {
    const events = await prisma.event.findMany({
      include: {
        creator: {
          select: { name: true },
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events: ", error);
    return NextResponse.json(
      { error: "Something went wrong fetching events" },
      { status: 500 }
    );
  }
};

type CreateEventReqBody = Omit<Event, "id">;

export const POST = async (req: NextRequest) => {
  const body: CreateEventReqBody = await req.json();

  // Validate required fields
  if (!body.title || !body.location || !body.date || !body.creatorId) {
    return NextResponse.json(
      { error: "Please provide title, location, date, and creatorId" },
      { status: 400 }
    );
  }

  try {
    const creatorExists = await prisma.user.findUnique({
      where: { id: parseInt(body.creatorId.toString()) },
    });

    if (!creatorExists) {
      return NextResponse.json(
        { error: "Creator with the given ID does not exist" },
        { status: 400 }
      );
    }

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
    console.error("Error creating event: ", error);
    return NextResponse.json(
      { error: "Something went wrong creating the event" },
      { status: 500 }
    );
  }
};
