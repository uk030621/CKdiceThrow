"use client";

import { useState } from "react";

export default function DiceThrower() {
  const [dice, setDice] = useState([1, 1, 1]);
  const [isShaking, setIsShaking] = useState([false, false, false]);
  const [total, setTotal] = useState(3);

  // Handle dice throw
  const throwDice = () => {
    const shakingState = [true, true, true];
    setIsShaking(shakingState);

    // Simulate rocking animation for 500ms
    setTimeout(() => {
      const newDice = [1, 2, 3].map(() => Math.floor(Math.random() * 6) + 1);
      setDice(newDice);
      setTotal(newDice.reduce((acc, value) => acc + value, 0));

      // Stop shaking after animation
      setIsShaking([false, false, false]);
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
      <h1 className="text-4xl font-bold mb-6 mt-6">CK Dice Thrower</h1>

      <div className="flex gap-4 mb-4">
        {dice.map((value, index) => (
          <div
            key={index}
            className={`w-20 h-20 bg-white rounded-lg flex items-center justify-center text-black text-3xl font-semibold shadow-lg transition-transform ${
              isShaking[index] ? `animate-rock-${index + 1}` : ""
            }`}
          >
            {value}
          </div>
        ))}
      </div>

      <p className="text-lg font-bold mb-8">Total: {total}</p>

      <button
        onClick={throwDice}
        className="px-6 py-3 bg-yellow-400 rounded-lg font-bold text-black hover:bg-yellow-300 transition-all duration-300 shadow-lg"
      >
        Throw Dice
      </button>

      <footer className="mt-10 text-sm text-gray-200">
        © {new Date().getFullYear()} LWJ Dice App. All rights reserved.
      </footer>
    </div>
  );
}
