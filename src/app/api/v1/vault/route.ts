import { container } from "@/server/container";
import { getAuth } from "@/server/utils";
import { NextResponse } from "next/server";

export async function OPTIONS() {
  return new Response(undefined, { status: 204 });
}

export async function GET(request: Request) {
  try {
    const [username, password] = getAuth(request);
    const result = await container.items.showVaultUseCase.execute({
      username,
      password,
    });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { status: "error", message: (err as Error).message },
      { status: 400 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const result = await container.items.createVaultUseCase.execute({
      username,
      password,
    });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { status: "error", message: (err as Error).message },
      { status: 400 }
    );
  }
}
