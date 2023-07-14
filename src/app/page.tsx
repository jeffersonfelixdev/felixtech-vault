"use client";
import { CopyIcon } from "@/components/icons/CopyIcon";
import { DeleteIcon } from "@/components/icons/DeleteIcon";
import { EditIcon } from "@/components/icons/EditIcon";
import { PowerIcon } from "@/components/icons/PowerIcon";
import { ShareIcon } from "@/components/icons/ShareIcon";
import { WalletIcon } from "@/components/icons/WalletIcon";
import { VaultItem } from "@/server/entities/VaultItem";
import { Dropdown } from "flowbite-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { DownIcon } from "@/components/icons/DownIcon";
import { NewItemModal } from "@/components/NewItemModal";
import { itemIcons } from "@/components/itemIcons";

function sortItems(items: VaultItem[]): VaultItem[] {
  return items.sort((a, b) => {
    const weights = {
      vault: "1",
      login: "2",
      ssh: "3",
      database: "4",
    };
    return `${weights[a.type]}${a.name}` > `${weights[b.type]}${b.name}`
      ? 1
      : -1;
  });
}

export default function Home() {
  const router = useRouter();

  const [items, setItems] = useState<VaultItem[]>([]);
  const [openNewItemModal, setOpenNewItemModal] = useState<string | undefined>(
    ""
  );
  const [type, setType] = useState<"login" | "ssh" | "database">("login");

  const updateVault = useCallback(async () => {
    const userCredentials = localStorage.getItem("fv_uc");
    const { data } = await axios.get("/api/v1/vault", {
      headers: { Authorization: `Basic ${userCredentials}` },
    });
    const newItems: VaultItem[] = data.items.map((item: any) => {
      const vaultItem = VaultItem.assign(item);
      return vaultItem;
    });
    setItems(sortItems(newItems));
    setSelectedItem(newItems[0]);
  }, []);

  const [selectedItem, setSelectedItem] = useState<VaultItem | undefined>(
    undefined
  );

  useEffect(() => {
    const userCredentials = localStorage.getItem("fv_uc");
    axios
      .get<{ items: VaultItem[] }>("/api/v1/vault", {
        headers: {
          Authorization: `Basic ${userCredentials}`,
        },
      })
      .then(({ data }) => {
        const newItems = data.items.map((item: any) => {
          const vaultItem = VaultItem.assign(item);
          return vaultItem;
        });
        setItems(sortItems(newItems));
        setSelectedItem(newItems[0]);
      })
      .catch(() => {
        router.push("/signin");
      });
  }, [router]);

  const handleLogout = async () => {
    localStorage.removeItem("fv_uc");
    router.push("/signin");
  };

  return (
    <div className="flex">
      {!selectedItem ? (
        <>Carregando...</>
      ) : (
        <>
          <div className="flex-grow h-screen">
            <div className="flex justify-between p-3 border-b-zinc-800 border-b text-zinc-500">
              <header className="flex items-center gap-2">
                <WalletIcon size={32} />
                <div className="text-xl text-zinc-300">Felixtech Vault</div>
              </header>
              <div className="flex gap-2">
                <Dropdown
                  label="Novo item"
                  className="bg-zinc-900 border-none rounded-md w-40"
                  renderTrigger={() => (
                    <button className="flex justify-between items-center bg-green-700 text-white px-4 py-2 w-40 rounded-lg hover:bg-green-600">
                      <span>Adicionar Item</span>
                      <DownIcon />
                    </button>
                  )}
                >
                  <Dropdown.Item
                    className="text-zinc-300 hover:text-zinc-700"
                    onClick={() => {
                      setType("login");
                      setOpenNewItemModal("default");
                    }}
                  >
                    Login/Site
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="text-zinc-300 hover:text-zinc-700"
                    onClick={() => {
                      setType("database");
                      setOpenNewItemModal("default");
                    }}
                  >
                    Database
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="text-zinc-300 hover:text-zinc-700"
                    onClick={() => {
                      setType("ssh");
                      setOpenNewItemModal("default");
                    }}
                  >
                    Servidor SSH
                  </Dropdown.Item>
                </Dropdown>
                <button className="p-2" onClick={handleLogout}>
                  <PowerIcon />
                </button>
              </div>
            </div>
            <div className="flex">
              <div className="md:block hidden bg-zinc-950 h-[calc(100vh-67px)] border-r border-r-zinc-800 w-64 overflow-auto">
                <ul className="mt-2">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className={`mx-2 p-2 rounded-lg hover:bg-slate-900 cursor-pointer ${
                        selectedItem.id === item.id && `bg-slate-800`
                      }`}
                      onClick={() => {
                        setSelectedItem(item);
                      }}
                    >
                      <div className="flex gap-2">
                        <div className="w-10 items-center justify-center">
                          {itemIcons(40)[item.type]}
                        </div>
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <span className="text-sm text-zinc-400">
                            {item.username}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-zinc-950 h-[calc(100vh-67px)] flex-grow overflow-auto">
                <div className="md:hidden p-4">
                  <select
                    className="bg-zinc-900 p-2 w-full"
                    onChange={(e) => {
                      const newSelectedItem = items.find(
                        (item) => item.id === e.target.value
                      );
                      setSelectedItem(newSelectedItem);
                    }}
                  >
                    {items.map((item) => (
                      <option
                        key={item.id}
                        selected={item.id === selectedItem.id}
                        value={item.id}
                      >
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <ul className="flex justify-end p-4 gap-6">
                  <li className="flex">
                    <ShareIcon />
                    &nbsp;Compartilhar
                  </li>
                  <li className="flex">
                    <EditIcon />
                    &nbsp;Editar
                  </li>
                  <li className="flex">
                    <DeleteIcon />
                    &nbsp;Excluir
                  </li>
                </ul>
                <div className="p-4 flex flex-col gap-4">
                  <div className="flex items-center gap-4 ml-4 mb-4">
                    {itemIcons(48)[selectedItem.type]}
                    <p className="text-3xl">{selectedItem.name}</p>
                  </div>
                  <div>
                    <div className="text-zinc-700 font-semibold mb-4 font-mono text-right">
                      #{selectedItem.id}
                    </div>
                    <div className="border border-zinc-500 rounded-lg p-2">
                      <div className="text-zinc-500">username</div>
                      <div className="mb-4 flex gap-2 items-center">
                        <span className="font-mono">
                          {selectedItem.username}
                        </span>
                        <div
                          className="cursor-pointer"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              selectedItem.username
                            );
                          }}
                        >
                          <CopyIcon size={20} />
                        </div>
                      </div>
                      <div className="text-zinc-500">password</div>
                      <div className="font-mono mb-4 flex gap-2 items-center">
                        <span>{selectedItem.password}</span>
                        <div
                          className="cursor-pointer"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              selectedItem.password
                            );
                          }}
                        >
                          <CopyIcon size={20} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    {(selectedItem.type === "login" ||
                      selectedItem.type === "vault") && (
                      <>
                        <div className="text-zinc-500">site</div>
                        <div className="mb-4">
                          <a target="_blank" href={selectedItem.site}>
                            {selectedItem.site}
                          </a>
                        </div>
                      </>
                    )}

                    {(selectedItem.type === "database" ||
                      selectedItem.type === "ssh") && (
                      <>
                        <div className="text-zinc-500">host</div>
                        <div className="mb-4 flex gap-2 items-center">
                          <span className="font-mono">{selectedItem.host}</span>
                          <div
                            className="cursor-pointer"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                selectedItem.host ?? ""
                              );
                            }}
                          >
                            <CopyIcon size={20} />
                          </div>
                        </div>
                        <div className="text-zinc-500">porta</div>
                        <div className="mb-4 flex gap-2 items-center">
                          <span className="font-mono">{selectedItem.port}</span>
                          <div
                            className="cursor-pointer"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                String(selectedItem.port) ?? ""
                              );
                            }}
                          >
                            <CopyIcon size={20} />
                          </div>
                        </div>
                      </>
                    )}
                    {selectedItem.type === "database" && (
                      <>
                        <div className="text-zinc-500">database</div>
                        <div className="mb-4 flex gap-2 items-center">
                          <span className="font-mono">
                            {selectedItem.database}
                          </span>
                          <div
                            className="cursor-pointer"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                selectedItem.database ?? ""
                              );
                            }}
                          >
                            <CopyIcon size={20} />
                          </div>
                        </div>
                      </>
                    )}
                    {selectedItem.privateKey && (
                      <>
                        <div className="text-zinc-500 flex gap-2 items-center">
                          <span>private key</span>
                          <div
                            className="cursor-pointer"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                selectedItem.privateKey ?? ""
                              );
                            }}
                          >
                            <CopyIcon size={20} />
                          </div>
                        </div>
                        <div className="mb-4 flex gap-2">
                          <div className="whitespace-pre-line font-mono">
                            {selectedItem.privateKey}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="p-6 mb-2 flex flex-col gap-2 justify-center items-center text-sm text-zinc-600">
                  <p>
                    Criado em{" "}
                    <span className="font-semibold">
                      {selectedItem.formattedCreatedAt}
                    </span>
                  </p>
                  {selectedItem.updatedAt && (
                    <p>
                      Modificado em{" "}
                      <span className="font-semibold">
                        {selectedItem.formattedUpdatedAt}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <NewItemModal
        openModal={openNewItemModal}
        setOpenModal={setOpenNewItemModal}
        type={type}
        onSubmit={updateVault}
      />
    </div>
  );
}
