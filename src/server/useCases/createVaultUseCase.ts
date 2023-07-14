import { Username } from "../entities/Username";
import { Vault } from "../entities/Vault";
import { VaultItem } from "../entities/VaultItem";
import { VaultRepository } from "../providers/VaultRepository";

interface CreateVaultInput {
  username: string;
  password: string;
}

export class CreateVaultUseCase {
  constructor(private vaultRepository: VaultRepository) {}

  public async execute({ username, password }: CreateVaultInput) {
    const { value: id } = Username.create(username);
    const userExists = await this.vaultRepository.findById(id);
    if (userExists) throw new Error("vault exists");
    const vault = await Vault.create(id, password);
    const item = VaultItem.create({
      type: "vault",
      name: "My Vault",
      username: id,
      password,
      site: "https://vault.felixtech.dev",
    });
    await vault.addItem(item, password);
    await this.vaultRepository.save(vault);
    const items = await vault.getItems(password);
    return { id, items };
  }
}
