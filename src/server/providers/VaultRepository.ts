import { Vault } from "../entities/Vault";

export interface VaultRepository {
  save(vault: Vault): Promise<void>;
  findById(id: string): Promise<Vault | undefined>;
}
