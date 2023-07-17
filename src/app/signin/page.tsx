"use client";

import { Button } from "@/components/Button";
import { WalletIcon } from "@/components/icons/WalletIcon";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export default function Login() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = useCallback(async () => {
    try {
      const userCredentials = Buffer.from(`${username}:${password}`).toString(
        "base64"
      );
      await axios.get("/api/v1/vault", {
        headers: {
          Authorization: `Basic ${userCredentials}`,
        },
      });
      localStorage.setItem("fv_uc", userCredentials);
      router.push("/dash");
    } catch (err) {
      setErrorMessage(
        (err as AxiosError<{ message: string }>).response?.data?.message ?? ""
      );
    }
  }, [password, router, username]);

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="m-auto w-96 md:mt-8">
        <h1 className="flex gap-2 text-xl font-semibold text-center p-4 items-center justify-center">
          <WalletIcon size={32} /> <span>Felixtech Vault Login</span>
        </h1>
        <div className="flex flex-col gap-6 items-center justify-center p-8 bg-zinc-900">
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
            className="w-80 bg-zinc-800 rounded-md p-2"
          />
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            className="w-80 bg-zinc-800 rounded-md p-2"
          />
          <Button submit value="Login" fullWidth onClick={handleSubmit} />
          <p className="text-red-500">{errorMessage}</p>
          <div className="flex gap-4 items-center">
            <span>New here?</span>
            <a
              href="/signup"
              className="p-3 bg-zinc-800 rounded-md hover:bg-zinc-700"
            >
              Create account
            </a>
          </div>
        </div>
      </div>
    </form>
  );
}
