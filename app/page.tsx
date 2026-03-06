"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    alert("Login clicked\nUsername: " + username);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">

      <div className="bg-teal-300 w-[900px] p-10 rounded-md text-center shadow-lg">

        {/* Title */}
        <h1 className="text-5xl font-extrabold mb-6">
          LYRA’S STORE
        </h1>

        {/* Store Image */}
        <div className="flex justify-center mb-6">
          <Image
            src="/store.jpg"
            alt="Store"
            width={250}
            height={150}
            className="rounded-lg border-4 border-blue-400"
          />
        </div>

        {/* Username */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Username:"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-96 p-3 rounded-lg bg-gray-200 outline-none"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <input
            type="password"
            placeholder="Password:"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-96 p-3 rounded-lg bg-gray-200 outline-none"
          />
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-3 rounded-lg"
        >
          LOGIN
        </button>

        {/* Create Account */}
        <p className="mt-4 text-blue-700 text-sm cursor-pointer hover:underline">
          CREATE AN ACCOUNT
        </p>

      </div>
    </div>
  );
}