import { NextRequest, NextResponse } from "next/server";
import { Event } from "@prisma/client";
import prisma from "../../../../_lib/prisma";

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const id = params.id;
  if (!id) {
    return NextResponse.json("Please provide an id");
  }

  try {
    const event = await prisma.event.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        creator: {
          select: { name: true },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error fetching event: ", error);
    return NextResponse.json(
      {
        error: "Something went wrong while fetching the event",
      },
      {
        status: 500,
      }
    );
  }
};

type CreateEventReqBody = Omit<Event, "id">;

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const id = params.id;
  if (!id) {
    return NextResponse.json("Please provide an id");
  }

  const event = await prisma.event.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const body: CreateEventReqBody = await request.json();
  if (!body.title && !body.description && !body.location && !body.date) {
    return NextResponse.json(
      {
        error: "Please enter at least one field to update",
      },
      { status: 400 }
    );
  }

  try {
    const updatedEvent = await prisma.event.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title: body.title || event.title,
        description: body.description || event.description,
        location: body.location || event.location,
        date: body.date || event.date,
      },
    });
    return NextResponse.json({ updatedEvent });
  } catch (error) {
    console.error("Error updating event: ", error);
    return NextResponse.json(
      { error: "Something went wrong updating the event" },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const id = params.id;
  if (!id) {
    return NextResponse.json(
      { error: "Please provide an id" },
      { status: 400 }
    );
  }

  try {
    const existingEvent = await prisma.event.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!existingEvent) {
      return NextResponse.json("Event not found", { status: 404 });
    }

    const deletePost = await prisma.event.delete({
      where: {
        id: parseInt(id),
      },
    });
    return NextResponse.json({
      success: 1,
      message: "Delete success",
      deletedEvent: deletePost,
    });
  } catch (error) {
    console.error("Error deleting event: ", error);
    return NextResponse.json("Something went wrong deleting the event", {
      status: 500,
    });
  }
};
