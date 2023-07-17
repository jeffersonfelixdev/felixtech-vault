"use client";
import { Modal } from "flowbite-react";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { itemIcons } from "./itemIcons";
import axios from "axios";
import { VaultItemType } from "@/server/types/VaultItemType";
import { VaultItem } from "@/server/entities/VaultItem";
import { Button } from "./Button";

interface ItemModalProps {
  openModal: string | undefined;
  setOpenModal: Dispatch<SetStateAction<string | undefined>>;
  type: VaultItemType;
  item?: VaultItem;
  editMode?: boolean;
  onSubmit: () => any;
  onClose?: () => any;
}

export const ItemModal = ({
  openModal,
  setOpenModal,
  type: newType,
  item,
  editMode = false,
  onSubmit,
  onClose,
}: ItemModalProps) => {
  const rootRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [site, setSite] = useState("");
  const [host, setHost] = useState("");
  const [port, setPort] = useState("");
  const [database, setDatabase] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [accountID, setAccountID] = useState("");
  const [iamUser, setIamUser] = useState(false);

  const [type, setType] = useState<VaultItemType>("vault");

  const clearForm = () => {
    setName("");
    setUsername("");
    setPassword("");
    setSite("");
    setHost("");
    setPort("");
    setDatabase("");
    setPrivateKey("");
    setAccountID("");
    setIamUser(false);
  };

  const handleSave = useCallback(async () => {
    const payload: {
      type: string;
      name: string;
      username: string;
      password: string;
      site?: string;
      host?: string;
      port?: number;
      database?: string;
      privateKey?: string;
      accountID?: string;
      awsRootAccount?: boolean;
    } = {
      type,
      name,
      username,
      password,
    };
    if (type === "login") payload.site = site;
    if (type === "database" || type === "ssh") {
      payload.host = host;
      payload.port = +port;
    }
    if (type === "database") payload.database = database;
    if (type === "ssh") payload.privateKey = privateKey;
    if (type === "aws") {
      payload.accountID = iamUser ? accountID : "";
      payload.site = iamUser
        ? `https://${accountID}.signin.aws.amazon.com/console`
        : "https://signin.aws.amazon.com/console";
    }
    const userCredentials = localStorage.getItem("fv_uc");
    if (editMode && item) {
      await axios.put(`/api/v1/vault-item/${item.id}`, payload, {
        headers: { Authorization: `Basic ${userCredentials}` },
      });
    } else {
      await axios.post("/api/v1/vault-item", payload, {
        headers: { Authorization: `Basic ${userCredentials}` },
      });
    }
    setOpenModal(undefined);
    clearForm();
    onSubmit();
    if (onClose) onClose();
  }, [
    type,
    name,
    username,
    password,
    site,
    database,
    privateKey,
    editMode,
    item,
    setOpenModal,
    onSubmit,
    onClose,
    host,
    port,
    iamUser,
    accountID,
  ]);

  useEffect(() => {
    setType(item && editMode ? item.type : newType);
    if (item && editMode) {
      setName(item.name);
      setUsername(item.username);
      setPassword(item.password);
      setSite(item.site ?? "");
      setHost(item.host ?? "");
      setPort(`${item.port}` ?? "");
      setDatabase(item.database ?? "");
      setPrivateKey(item.privateKey ?? "");
      setAccountID(item.accountID ?? "");
      setIamUser(!!item.accountID);
    }
  }, [item, editMode, newType]);

  return (
    <div ref={rootRef}>
      <Modal
        root={rootRef.current ?? undefined}
        size="2xl"
        show={openModal === "default"}
        onClose={() => {
          clearForm();
          setOpenModal(undefined);
          if (onClose) onClose();
        }}
      >
        <Modal.Header className="bg-slate-700 border-none">
          <span className="text-zinc-100">New Item</span>
        </Modal.Header>
        <Modal.Body className="bg-zinc-900 border-b-zinc-700">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-3">
              {itemIcons(40)[type]}
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Item Name"
                className="bg-zinc-800 p-3 text-xl rounded-md w-full border-2 border-zinc-800 focus:border-blue-500 outline-none"
              />
            </div>
            <div className="border border-zinc-700 space-y-4 p-4">
              <div className="flex flex-col p-2 bg-zinc-800 border-zinc-800 border-2 rounded-md focus-within:border-blue-500">
                <label htmlFor="username" className="text-slate-400 text-sm">
                  username
                </label>
                <input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="johndoe"
                  className="bg-zinc-800 placeholder-zinc-600 outline-none"
                />
              </div>
              <div className="flex flex-col p-2 bg-zinc-800 border-zinc-800 border-2 rounded-md focus-within:border-blue-500">
                <label htmlFor="password" className="text-slate-400 text-sm">
                  password
                </label>
                <input
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="MyPassword@123"
                  className="bg-zinc-800 placeholder-zinc-600 outline-none"
                />
              </div>
              {type === "login" && (
                <div className="flex flex-col p-2 bg-zinc-800 border-zinc-800 border-2 rounded-md focus-within:border-blue-500">
                  <label htmlFor="site" className="text-slate-400 text-sm">
                    site
                  </label>
                  <input
                    id="site"
                    value={site}
                    onChange={(e) => setSite(e.target.value)}
                    className="bg-zinc-800 placeholder-zinc-600 outline-none"
                    placeholder="https://felixtech.dev"
                  />
                </div>
              )}
              {type === "aws" && (
                <>
                  <div className="flex items-center gap-2 p-2 ">
                    <input
                      id="awsRootAccount"
                      checked={iamUser}
                      onChange={(e) => {
                        setIamUser(e.target.checked);
                      }}
                      type="checkbox"
                      className="rounded-md bg-zinc-300"
                    />
                    <label
                      htmlFor="accountID"
                      className="text-slate-400 text-sm"
                    >
                      IAM User
                    </label>
                  </div>
                  {iamUser && (
                    <div className="flex flex-col p-2 bg-zinc-800 border-zinc-800 border-2 rounded-md focus-within:border-blue-500">
                      <label
                        htmlFor="accountID"
                        className="text-slate-400 text-sm"
                      >
                        account ID
                      </label>
                      <input
                        id="accountID"
                        value={accountID}
                        onChange={(e) => setAccountID(e.target.value)}
                        placeholder="123456789012"
                        className="bg-zinc-800 placeholder-zinc-600 outline-none"
                      />
                    </div>
                  )}
                </>
              )}
              {(type === "database" || type === "ssh") && (
                <>
                  <div className="flex flex-col p-2 bg-zinc-800 border-zinc-800 border-2 rounded-md focus-within:border-blue-500">
                    <label htmlFor="host" className="text-slate-400 text-sm">
                      host
                    </label>
                    <input
                      id="host"
                      value={host}
                      onChange={(e) => setHost(e.target.value)}
                      placeholder="localhost"
                      className="bg-zinc-800 placeholder-zinc-600 outline-none"
                    />
                  </div>
                  <div className="flex flex-col p-2 bg-zinc-800 border-zinc-800 border-2 rounded-md focus-within:border-blue-500">
                    <label htmlFor="port" className="text-slate-400 text-sm">
                      port
                    </label>
                    <input
                      id="port"
                      type="number"
                      value={port}
                      maxLength={5}
                      onChange={(e) => setPort(e.target.value)}
                      placeholder="1234"
                      className="bg-zinc-800 placeholder-zinc-600 border-none outline-none focus:border-none focus:ring-0 appearance-none p-0"
                    />
                  </div>
                </>
              )}
              {type === "database" && (
                <div className="flex flex-col p-2 bg-zinc-800 border-zinc-800 border-2 rounded-md focus-within:border-blue-500">
                  <label htmlFor="database" className="text-slate-400 text-sm">
                    database
                  </label>
                  <input
                    id="database"
                    value={database}
                    onChange={(e) => setDatabase(e.target.value)}
                    placeholder="postgres"
                    className="bg-zinc-800 placeholder-zinc-600 outline-none"
                  />
                </div>
              )}
              {type === "ssh" && (
                <div className="flex flex-col p-2 bg-zinc-800 border-zinc-800 border-2 rounded-md focus-within:border-blue-500">
                  <label
                    htmlFor="privateKey"
                    className="text-slate-400 text-sm"
                  >
                    private key
                  </label>
                  <textarea
                    rows={10}
                    id="privateKey"
                    placeholder={`-----BEGIN RSA PRIVATE KEY-----\nPut your private key here\n-----END RSA PRIVATE KEY-----`}
                    value={privateKey}
                    onChange={(e) => setPrivateKey(e.target.value)}
                    className="bg-zinc-800 font-mono text-xs border-none focus:ring-0 m-0 p-0 py-1 resize-none"
                  />
                </div>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="bg-zinc-900 flex justify-end gap-3 border-t-zinc-700">
          <Button
            value="Cancel"
            variant="outline"
            onClick={() => {
              clearForm();
              setOpenModal(undefined);
              if (onClose) onClose();
            }}
          />
          <Button value="Save" onClick={handleSave} />
        </Modal.Footer>
      </Modal>
    </div>
  );
};
