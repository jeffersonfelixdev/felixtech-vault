import { env } from "@/server/config/env";
import { createCipheriv, createDecipheriv, createHash } from "node:crypto";
import { Readable } from "node:stream";

const algorithm = env.ENCRYPTION_ALGORITHM;

export const cipher = async (text: string, password: string, salt: string) => {
  const key = createHash("sha256").update(`${password}${salt}`).digest();
  const iv = Buffer.alloc(16, 0);
  const cipher = createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return Buffer.from(encrypted).toString("base64");
};

export const decipher = async (
  encrypted: string,
  password: string,
  salt: string
) => {
  try {
    const buffer = Buffer.from(encrypted, "base64");
    const key = createHash("sha256").update(`${password}${salt}`).digest();
    const iv = Buffer.alloc(16, 0);
    const decipher = createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(buffer.toString("utf-8"), "hex", "utf-8");
    decrypted += decipher.final("utf-8");
    return decrypted;
  } catch (err) {
    throw new Error("error on decrypt");
  }
};

export const streamToString = (stream: Readable) => {
  const chunks: Uint8Array[] = [];
  return new Promise<string>((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on("error", (err) => reject(err));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
};

export const getAuth = (request: Request) => {
  const auth = request.headers.get("Authorization");
  if (!auth) throw new Error("unauthorized");
  const [, token] = auth.split(" ");
  return Buffer.from(token, "base64").toString().split(":");
};
