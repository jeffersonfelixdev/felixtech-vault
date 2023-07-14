import { container } from "@/server/container";
import { getAuth } from "@/server/utils";
import { NextResponse } from "next/server";

export async function OPTIONS() {
  return new Response(undefined, { status: 204 });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const [vaultId, vaultPassword] = getAuth(request);
    const vaultItemId = params.id;
    const { name, username, password, site, host, port, database, privateKey } =
      await request.json();
    await container.items.editVaultItemUseCase.execute({
      vaultId,
      vaultItemId,
      vaultPassword,
      name,
      username,
      password,
      site,
      host,
      port,
      database,
      privateKey,
    });
    return NextResponse.json({ message: "OK" });
  } catch (err) {
    return NextResponse.json(
      { status: "error", message: (err as Error).message },
      { status: 400 }
    );
  }
}
