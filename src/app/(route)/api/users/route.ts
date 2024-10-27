import { NextRequest, NextResponse } from "next/server";
import { User } from "@prisma/client";
import prisma from "@/app/_lib/prisma";

type CreateUserReqBody = Omit<User, "id">;

export const POST = async (req: NextRequest) => {
  const body: CreateUserReqBody = await req.json();

  if (!body.email || !body.password) {
    return NextResponse.json(
      { error: "Please provide email and password" },
      { status: 400 }
    );
  }

  try {
    // Check if a user with the provided email already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (existingUser) {
      return NextResponse.json("Email already in use", {
        status: 400,
      });
    }

    // Create the new user
    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
        password: body.password,
      },
    });
    return NextResponse.json({ user });
  } catch (error) {
    console.error(error);
    return NextResponse.json("Something went wrong creating the user", {
      status: 500,
    });
  }
};
