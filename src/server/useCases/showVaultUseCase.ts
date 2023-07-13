import { id } from "date-fns/locale";
import { Vault } from "../entities/Vault";
import { VaultRepository } from "../providers/VaultRepository";
import { VaultItem } from "../entities/VaultItem";

interface ShowVaultInput {
  username: string;
  password: string;
}

interface ShowVaultOutput {
  items: VaultItem[];
}

export class ShowVaultUseCase {
  constructor(private vaultRepository: VaultRepository) {}

  public async execute({
    username,
    password,
  }: ShowVaultInput): Promise<ShowVaultOutput> {
    const vault = await this.vaultRepository.findById(username);
    if (!vault) throw new Error("vault not found");
    const items = await vault.getItems(password);
    return { items };
  }
}
