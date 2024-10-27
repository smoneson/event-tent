import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../_lib/prisma";

export const GET = async (
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
    include: {
      creator: {
        select: { name: true },
      },
    },
  });

  return NextResponse.json(event);
};

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

  const { title, description } = await request.json();
  const updatedEvent = await prisma.event.update({
    where: {
      id: parseInt(id),
    },
    data: {
      title: title,
      description: description,
    },
  });

  return NextResponse.json({
    success: 1,
    post: updatedEvent,
    message: "Update success",
  });
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const id = params.id;
  if (!id) {
    return NextResponse.error();
  }

  const deletePost = await prisma.event.delete({
    where: {
      id: parseInt(id),
    },
  });

  return NextResponse.json({ success: 1, message: "Delete success" });
};
