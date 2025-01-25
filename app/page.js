"use client";

import { useState } from "react";

export default function DiceThrower() {
  const [dice, setDice] = useState([1, 1, 1]);

  // Generate random numbers for dice
  const throwDice = () => {
    const newDice = [1, 2, 3].map(() => Math.floor(Math.random() * 6) + 1);
    setDice(newDice);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
      <h1 className="text-4xl font-bold mb-6 mt-8">Dice Thrower</h1>

      <div className="flex gap-4 mb-8">
        {dice.map((value, index) => (
          <div
            key={index}
            className="w-20 h-20 bg-white rounded-lg flex items-center justify-center text-black text-3xl font-semibold shadow-lg"
          >
            {value}
          </div>
        ))}
      </div>

      <button
        onClick={throwDice}
        className="px-6 py-3 bg-yellow-400 rounded-lg font-bold text-black hover:bg-yellow-300 transition-all duration-300 shadow-lg"
      >
        Throw Dice
      </button>

      <footer className="mt-10 text-sm text-gray-200">
        © {new Date().getFullYear()} LWJ Media Library. All rights reserved.
      </footer>
    </div>
  );
}
