import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Vault } from "../../entities/Vault";
import { VaultRepository } from "../VaultRepository";
import { env } from "@/server/config/env";
import { Readable } from "stream";
import { streamToString } from "@/server/utils";

export class S3VaultRepository implements VaultRepository {
  private client: S3Client;

  constructor() {
    this.client = new S3Client({
      region: env.AWS_REGION,
    });
  }

  public async save(vault: Vault): Promise<void> {
    const body = Buffer.from(vault.data);
    const command = new PutObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: `${vault.id}.dat`,
      Body: body,
      ContentType: "text/plain",
    });
    await this.client.send(command);
  }

  public async findById(id: string): Promise<Vault | undefined> {
    try {
      const command = new GetObjectCommand({
        Bucket: env.S3_BUCKET,
        Key: `${id}.dat`,
      });
      const { Body } = await this.client.send(command);
      if (!Body) return undefined;
      const data = await streamToString(Body as Readable);
      const vault = new Vault(id);
      vault.data = data;
      return vault;
    } catch (err) {
      return undefined;
    }
  }
}
