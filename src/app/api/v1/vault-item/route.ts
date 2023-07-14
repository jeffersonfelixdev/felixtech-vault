import { container } from "@/server/container";
import { getAuth } from "@/server/utils";
import { NextResponse } from "next/server";

export async function OPTIONS() {
  return new Response(undefined, { status: 204 });
}

export async function POST(request: Request) {
  try {
    const [vaultId, vaultPassword] = getAuth(request);
    const {
      type,
      name,
      username,
      password,
      site,
      host,
      port,
      database,
      privateKey,
      accountID,
    } = await request.json();
    const result = await container.items.createVaultItemUseCase.execute({
      vaultId,
      vaultPassword,
      type,
      name,
      username,
      password,
      site,
      host,
      port,
      database,
      privateKey,
      accountID,
    });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { status: "error", message: (err as Error).message },
      { status: 400 }
    );
  }
}
