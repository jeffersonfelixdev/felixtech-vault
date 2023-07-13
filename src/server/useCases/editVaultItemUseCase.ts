import { VaultRepository } from "../providers/VaultRepository";

interface EditVaultInput {
  vaultId: string;
  vaultItemId: string;
  vaultPassword: string;
  name: string;
  username: string;
  password: string;
  site?: string;
  host?: string;
  port?: number;
  database?: string;
  privateKey?: string;
}

export class EditVaultItemUseCase {
  constructor(private vaultRepository: VaultRepository) {}

  public async execute({
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
  }: EditVaultInput): Promise<void> {
    const vault = await this.vaultRepository.findById(vaultId);
    if (!vault) throw new Error("vault not found");
    const vaultItems = await vault.getItems(vaultPassword);
    const index = vaultItems.findIndex((item) => item.id === vaultItemId);
    if (index === -1) throw new Error("vault item not found");
    vaultItems[index].name = name;
    vaultItems[index].username = username;
    vaultItems[index].password = password;
    vaultItems[index].site = site;
    vaultItems[index].host = host;
    vaultItems[index].port = port;
    vaultItems[index].database = database;
    vaultItems[index].privateKey = privateKey;
    vaultItems[index].touch();
    await vault.setItems(vaultItems, vaultPassword);
    await this.vaultRepository.save(vault);
  }
}
