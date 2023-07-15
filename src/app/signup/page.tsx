"use client";

import { WalletIcon } from "@/components/icons/WalletIcon";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useState } from "react";

export default function Login() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      try {
        event.preventDefault();
        if (password !== repeatPassword)
          throw new Error("Senhas não coincidem");
        console.log(username, password);
        await axios.post("/api/v1/vault", {
          username,
          password,
        });
        const userCredentials = Buffer.from(`${username}:${password}`).toString(
          "base64"
        );
        localStorage.setItem("fv_uc", userCredentials);
        router.push("/dash");
      } catch (err) {
        setErrorMessage(
          (err as AxiosError<{ message: string }>).response?.data?.message ??
            (err as Error).message ??
            ""
        );
      }
    },
    [password, repeatPassword, router, username]
  );

  return (
    <div className="m-auto w-96 md:mt-8">
      <h1 className="flex gap-2 text-xl font-semibold text-center p-4 items-center justify-center">
        <WalletIcon size={32} /> <span>Sign Up</span>
      </h1>
      <p className="text-zinc-300 py-4">
        Create a vault in seconds, and store your secrets with security!
      </p>
      <form onSubmit={handleSubmit}>
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
          <input
            type="password"
            id="password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            placeholder="repeat passowrd"
            className="w-80 bg-zinc-800 rounded-md p-2"
          />
          <input
            type="submit"
            value="Register"
            className="bg-slate-700 p-2 w-80 rounded-md cursor-pointer hover:bg-slate-800 transition-all"
          />
          <div className="flex gap-4 items-center">
            <span>Already have an account?</span>
            <a
              href="/signin"
              className="p-3 bg-zinc-800 rounded-md hover:bg-zinc-700"
            >
              Sign In
            </a>
          </div>
          <p className="text-red-500">{errorMessage}</p>
        </div>
      </form>
    </div>
  );
}
