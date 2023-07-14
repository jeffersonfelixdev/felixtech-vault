import { VaultItem } from "./VaultItem";
import { cipher, decipher } from "@/server/utils";
import { env } from "@/server/config/env";

export class Vault {
  public readonly id;

  private _data!: string;

  get data() {
    return this._data;
  }

  set data(data: string) {
    this._data = data;
  }

  public async getItems(password: string): Promise<VaultItem[]> {
    const data = await decipher(this._data, password, env.SALT);
    const values = JSON.parse(data);
    return values.map(
      ({
        id,
        name,
        type,
        username,
        password,
        site,
        host,
        port,
        database,
        privateKey,
        accountID,
        createdAt,
        updatedAt,
      }: any) => {
        const item = VaultItem.assign({
          id,
          name,
          type,
          username,
          password,
          site,
          host,
          port,
          database,
          privateKey,
          accountID,
          createdAt,
          updatedAt,
        });
        return item;
      }
    );
  }

  public async setItems(items: VaultItem[], password: string) {
    await decipher(this._data, password, env.SALT);
    this._data = await cipher(
      JSON.stringify(items.map((item) => item.toJSON())),
      password,
      env.SALT
    );
  }

  public async addItem(item: VaultItem, password: string) {
    const items = await this.getItems(password);
    items.push(item);
    await this.setItems(items, password);
  }

  public async removeItem(item: VaultItem, password: string) {
    const items = await this.getItems(password);
    const index = items.findIndex((i) => i.id === item.id);
    items.splice(index, 1);
    await this.setItems(items, password);
  }

  public async updateItem(item: VaultItem, password: string) {
    const items = await this.getItems(password);
    const index = items.findIndex((i) => i.id === item.id);
    item.touch();
    items[index] = item;
    await this.setItems(items, password);
  }

  public static async create(id: string, password: string) {
    const vault = new Vault(id);
    vault._data = await cipher(JSON.stringify([]), password, env.SALT);
    return vault;
  }

  constructor(id: string) {
    this.id = id;
  }
}
