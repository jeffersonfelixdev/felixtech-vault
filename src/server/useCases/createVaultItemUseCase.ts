import { VaultItem } from "../entities/VaultItem";
import { VaultRepository } from "../providers/VaultRepository";

interface CreateVaultItemInput {
  vaultId: string;
  vaultPassword: string;
  type: "login" | "database" | "ssh";
  name: string;
  username: string;
  password: string;
  site?: string;
  host?: string;
  port?: number;
  database?: string;
  privateKey?: string;
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
    });
    items.push(item);
    await vault.setItems(items, vaultPassword);
    await this.vaultRepository.save(vault);
    return { item };
  }
}
