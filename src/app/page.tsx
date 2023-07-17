"use client";

import { Button } from "@/components/Button";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { WalletIcon } from "@/components/icons/WalletIcon";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const year = new Date().getFullYear();

  const router = useRouter();

  return (
    <div>
      <div className="p-4">
        <header className="flex justify-between">
          <h1 className="text-2xl text-zinc-300 font-semibold">
            Felixtech Vault
          </h1>
          <div className="flex gap-3">
            <Button
              icon={<GitHubIcon size={24} />}
              value=""
              variant="outline"
              onClick={() =>
                (window.location.href =
                  "https://github.com/jsfelix/felixtech-vault")
              }
            ></Button>
            <Button
              icon={<WalletIcon size={24} />}
              value="Vault"
              onClick={() => router.push("/dash")}
            />
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
            <h1 className="my-4 md:px-6 lg:px-8 xl:px-16 font-mono text-xl font-semibold text-slate-400">
              Free for use
            </h1>
            <p className="md:px-6 lg:px-8 xl:px-16">
              Felixtech Vault is a free and open source Vault App that you can
              use to store your secrets. You may use in development or
              production.
            </p>
            <p className="md:px-6 lg:px-8 xl:px-16">
              Visit our repository{" "}
              <a
                className="text-blue-500 cursor-pointer hover:text-blue-600"
                href="https://github.com/jsfelix/felixtech-vault"
              >
                here
              </a>{" "}
              and contribute!
            </p>
            <h1 className="my-4 md:px-6 lg:px-8 xl:px-16 font-mono text-xl font-semibold text-slate-400">
              Security
            </h1>
            <p className="md:px-6 lg:px-8 xl:px-16">
              All secrets are stored encrypted with a secure algorithm. The
              architecture uses the zero knowledge principle, so only you can
              decrypt your vault using a password.
            </p>
          </div>
        </main>
      </div>
      <footer className="mt-8 p-8 block w-full bg-zinc-900">
        <div>
          &copy; {year} Felixtech Soluções em Tecnologia Ltda. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
}
