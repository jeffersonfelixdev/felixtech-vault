import { randomUUID } from "crypto";
import { format } from "date-fns";

type VaultItemProps = {
  type: "database" | "login" | "ssh" | "vault";
  name: string;
  username: string;
  password: string;
  site?: string;
  host?: string;
  port?: number;
  database?: string;
  privateKey?: string;
};

export class VaultItem {
  public readonly id: string;

  private _type!: "database" | "login" | "ssh" | "vault";

  private _name!: string;

  private _username!: string;

  private _password!: string;

  private _site?: string;

  private _host?: string;

  private _port?: number;

  private _database?: string;

  private _privateKey?: string;

  private _createdAt!: number;

  private _updatedAt?: number;

  get type() {
    return this._type;
  }

  get name() {
    return this._name;
  }

  set name(name: string) {
    this._name = name;
  }

  get username() {
    return this._username;
  }

  set username(username: string) {
    this._username = username;
  }

  get password() {
    return this._password;
  }

  set password(password: string) {
    this._password = password;
  }

  get site() {
    return this._site;
  }

  set site(site: string | undefined) {
    this._site = site;
  }

  get host() {
    return this._host;
  }

  set host(host: string | undefined) {
    this._host = host;
  }

  get port() {
    return this._port;
  }

  set port(port: number | undefined) {
    this._port = port;
  }

  get database() {
    return this._database;
  }

  set database(database: string | undefined) {
    this._database = database;
  }

  get privateKey() {
    return this._privateKey;
  }

  set privateKey(pk: string | undefined) {
    this._privateKey = pk;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  get formattedCreatedAt() {
    return format(this.createdAt, "dd/MM/yyyy HH:mm");
  }

  get formattedUpdatedAt() {
    return this._updatedAt
      ? format(this._updatedAt, "dd/MM/yyyy HH:mm")
      : undefined;
  }

  public touch() {
    this._updatedAt = Date.now();
  }

  constructor(id?: string) {
    this.id = id ?? randomUUID();
  }

  public static assign({
    id,
    type,
    name,
    username,
    password,
    site,
    host,
    port,
    database,
    privateKey,
    createdAt,
    updatedAt,
  }: VaultItemProps & { id: string; createdAt: number; updatedAt: number }) {
    const item = new VaultItem(id);
    Object.assign(item, {
      _type: type,
      _name: name,
      _username: username,
      _password: password,
      _site: site,
      _host: host,
      _port: port,
      _database: database,
      _privateKey: privateKey,
      _createdAt: createdAt,
      _updatedAt: updatedAt,
    });
    return item;
  }

  public static create({
    type,
    name,
    username,
    password,
    site,
    host,
    port,
    database,
    privateKey,
  }: VaultItemProps) {
    const item = new VaultItem();
    item._type = type;
    item._name = name;
    item._username = username;
    item._password = password;
    item._database = database;
    item._site = site;
    item._host = host;
    item._port = port;
    item._privateKey = privateKey;
    item._createdAt = Date.now();
    return item;
  }

  public toJSON() {
    return {
      id: this.id,
      type: this.type,
      name: this.name,
      username: this.username,
      password: this.password,
      site: this.site,
      host: this.host,
      port: this.port,
      database: this.database,
      privateKey: this.privateKey,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
