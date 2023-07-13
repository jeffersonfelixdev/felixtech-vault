import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  AWS_REGION: z.enum([
    "us-east-1",
    "us-east-2",
    "us-west-1",
    "us-west-2",
    "sa-east-1",
  ]),
  ENCRYPTION_ALGORITHM: z.string(),
  S3_BUCKET: z.string(),
  SALT: z.string(),
  COGNITO_CLIENT_ID: z.string(),
  COGNITO_USER_POOL_ID: z.string(),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("⛔️ environment variable validation failed!");
  console.table(result.error.issues);
  process.exit(1);
}

export const env = result.data;
