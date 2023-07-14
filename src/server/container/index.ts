import { createContainer } from "iti";
import { S3VaultRepository } from "../providers/impl/S3VaultRepository";
import { CreateVaultUseCase } from "../useCases/createVaultUseCase";
import { ShowVaultUseCase } from "../useCases/showVaultUseCase";
import { EditVaultItemUseCase } from "../useCases/editVaultItemUseCase";
import { CreateVaultItemUseCase } from "../useCases/createVaultItemUseCase";

export const container = createContainer()
  .add({
    vaultRepository: () => new S3VaultRepository(),
  })
  .add((ctx) => ({
    createVaultUseCase: () => new CreateVaultUseCase(ctx.vaultRepository),
    showVaultUseCase: () => new ShowVaultUseCase(ctx.vaultRepository),
    editVaultItemUseCase: () => new EditVaultItemUseCase(ctx.vaultRepository),
    createVaultItemUseCase: () =>
      new CreateVaultItemUseCase(ctx.vaultRepository),
  }));
