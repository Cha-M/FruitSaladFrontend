import React from "react";
import Blurb from "./blurb";
import FruitSalad from "./FruitSalad";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col font-mono items-center p-24 space-y-2">
      <div className="w-full max-w-5xl flex-col text-sm lg:flex space-y-2">
        <Blurb />
      </div>
      <FruitSalad />
    </main>
  );
}
