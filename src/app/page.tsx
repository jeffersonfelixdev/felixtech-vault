"use client";

import { WalletIcon } from "@/components/icons/WalletIcon";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const year = new Date().getFullYear();

  return (
    <div>
      <div className="p-4">
        <header className="flex justify-between">
          <h1 className="text-2xl text-zinc-300 font-semibold">
            Felixtech Vault
          </h1>
          <div className="flex gap-3">
            <button className="bg-slate-700 flex gap-2 p-2 w-40 justify-center items-center rounded-md hover:bg-slate-800 ">
              <WalletIcon size={24} />
              <span className="font-semibold">Vault</span>
            </button>
          </div>
        </header>
        <main className="flex flex-col gap-4 p-2 items-center">
          <div className="text-slate-300 text-2xl md:text-3xl lg:text-4xl mt-16 md:mt-24 lg:mt-32 mx-4">
            Store your secrets with{" "}
            <span className="font-semibold">security</span> and{" "}
            <span className="font-semibold">confidence</span>
          </div>
          <Image
            className="p-3"
            width={640}
            height={480}
            src="/vault.png"
            alt="vault"
          />
          <div>
            <p>Download App here:</p>
          </div>
        </main>
      </div>
      <footer className="p-8 block w-full bg-zinc-900 absolute bottom-0">
        <div>
          &copy; {year} Felixtech Soluções em Tecnologia Ltda. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
}
