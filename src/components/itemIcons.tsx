import { DatabaseIcon } from "./icons/DatabaseIcon";
import { KeyIcon } from "./icons/KeyIcon";
import { ServerIcon } from "./icons/ServerIcon";
import { WalletIcon } from "./icons/WalletIcon";
import { AwsIcon } from "./icons/AwsIcon";

export const itemIcons = (size: number) => ({
  database: <DatabaseIcon size={size} />,
  login: <KeyIcon size={size} />,
  ssh: <ServerIcon size={size} />,
  vault: <WalletIcon size={size} />,
  aws: <AwsIcon size={size} />,
});
