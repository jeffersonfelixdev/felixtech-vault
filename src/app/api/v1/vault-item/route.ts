import { container } from "@/server/container";
import { getAuth } from "@/server/utils";
import { NextResponse } from "next/server";

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
    });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { status: "error", message: (err as Error).message },
      { status: 400 }
    );
  }
}
