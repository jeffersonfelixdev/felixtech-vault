import { getAuth } from "@/server/utils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  return NextResponse.json({
    hello: "world",
  });
}
