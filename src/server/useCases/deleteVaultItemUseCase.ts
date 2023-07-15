import { VaultRepository } from "../providers/VaultRepository";

interface DeleteVaultInput {
  vaultId: string;
  vaultPassword: string;
  vaultItemId: string;
}

export class DeleteVaultItemUseCase {
  constructor(private vaultRepository: VaultRepository) {}

  public async execute({
    vaultId,
    vaultPassword,
    vaultItemId,
  }: DeleteVaultInput): Promise<void> {
    const vault = await this.vaultRepository.findById(vaultId);
    if (!vault) throw new Error("vault not found");
    const items = await vault.getItems(vaultPassword);
    const index = items.findIndex((item) => item.id === vaultItemId);
    if (index === -1) throw new Error("vault item not found");
    items.splice(index, 1);
    await vault.setItems(items, vaultPassword);
    await this.vaultRepository.save(vault);
  }
}
