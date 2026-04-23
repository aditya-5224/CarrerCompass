import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, name, image, uid } = await req.json();

    if (!email || !uid) {
      return NextResponse.json({ error: "Email and UID are required" }, { status: 400 });
    }

    // Upsert user (update if exists, create if not)
    const user = await User.findOneAndUpdate(
      { uid },
      { email, name, image, uid },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error("Error saving user:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
