import { VaultItem } from "../entities/VaultItem";
import { VaultRepository } from "../providers/VaultRepository";
import { VaultItemType } from "../types/VaultItemType";

interface CreateVaultItemInput {
  vaultId: string;
  vaultPassword: string;
  type: VaultItemType;
  name: string;
  username: string;
  password: string;
  site?: string;
  host?: string;
  port?: number;
  database?: string;
  privateKey?: string;
  accountID?: string;
}

interface CreateVaultItemOutput {
  item: VaultItem;
}

export class CreateVaultItemUseCase {
  constructor(private vaultRepository: VaultRepository) {}

  public async execute({
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
  }: CreateVaultItemInput): Promise<CreateVaultItemOutput> {
    const vault = await this.vaultRepository.findById(vaultId);
    if (!vault) throw new Error("vault not found");
    const items = await vault.getItems(vaultPassword);
    const item = VaultItem.create({
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
    items.push(item);
    await vault.setItems(items, vaultPassword);
    await this.vaultRepository.save(vault);
    return { item };
  }
}
