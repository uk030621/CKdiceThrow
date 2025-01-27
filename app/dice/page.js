"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function DicePage() {
  const [roll, setRoll] = useState(null);
  const [limit, setLimit] = useState(10);
  const [history, setHistory] = useState([]);
  const [isShaking, setIsShaking] = useState(false);
  const [animation, setAnimation] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      const response = await fetch("/api/history");
      const data = await response.json();
      setHistory(data.rolls || []);
    };
    fetchHistory();
  }, []);

  const rollDice = async () => {
    const randomAnimation = `animate-rock-${Math.floor(Math.random() * 3) + 1}`;
    setAnimation(randomAnimation);
    setIsShaking(true);

    setTimeout(async () => {
      setIsShaking(false);

      const response = await fetch("/api/roll", {
        method: "POST",
        body: JSON.stringify({ limit }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setRoll(data.roll);

      setHistory([{ roll: data.roll, createdAt: new Date() }, ...history]);
    }, 500);
  };

  const clearHistory = async () => {
    const response = await fetch("/api/clear", { method: "DELETE" });
    if (response.ok) {
      setHistory([]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 px-4">
      <div className="bg-white mt-6 shadow-lg rounded-2xl p-6 w-full max-w-md sm:max-w-lg text-center">
        <Link
          className="flex text-sm text-white rounded-md items-start w-fit bg-slate-900 py-1 px-2 mb-3"
          href="/"
        >
          Back ⬅️
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-800">
          Fibonacci Dice
        </h1>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm sm:text-base">
            Fibonacci Limit:
          </label>
          <input
            type="number"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="border rounded-lg px-3 py-1 w-full mt-2"
          />
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={rollDice}
            className="bg-blue-500 text-white px-4 py-2 rounded-xl shadow-md hover:bg-blue-600 transition"
          >
            Roll Dice
          </button>
          <button
            onClick={clearHistory}
            className="bg-red-500 text-white px-4 py-2 rounded-xl shadow-md hover:bg-red-600 transition"
          >
            Clear History
          </button>
        </div>

        {/* Dice Animation */}
        {roll !== null && (
          <div className="flex justify-center items-center mt-4">
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 flex justify-center items-center border-2 border-gray-400 bg-white rounded-lg text-lg sm:text-xl font-bold text-blue-600 shadow-md ${
                isShaking ? animation : ""
              }`}
            >
              {roll}
            </div>
          </div>
        )}

        {/* Explanatory Dropdown */}
        <div className="mt-6">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="text-sm text-gray-600 hover:underline"
          >
            {isDropdownOpen ? "Hide Explanation" : "How does this work?"}
          </button>
          {isDropdownOpen && (
            <div className="mt-4 text-left text-sm bg-gray-50 border rounded-lg p-4">
              <p className="text-gray-800">
                This system generates random numbers from the Fibonacci sequence
                up to a specific limit. Here&apos;s how it works:
              </p>
              <ul className="list-disc list-inside text-gray-700 mt-2">
                <li>
                  <strong>Fibonacci Limit:</strong> Determines the highest
                  Fibonacci number that can be generated. For example, with a
                  limit of 10, the sequence includes 0, 1, 2, 3, 5, 8.
                </li>
                <li>
                  <strong>Roll:</strong> A random number from the sequence is
                  generated and displayed.
                </li>
                <li>
                  <strong>History:</strong> Keeps track of all previous rolls
                  for reference.
                </li>
              </ul>
              <p className="text-gray-800 mt-2">
                Use the <strong>Clear History</strong> button to reset the roll
                history.
              </p>
            </div>
          )}
        </div>

        {/* Roll History */}
        {history.length > 0 && (
          <div className="mt-6 text-left">
            <h3 className="font-bold text-gray-800 text-sm sm:text-base">
              Roll History:
            </h3>
            <ul className="text-gray-700 text-xs sm:text-sm">
              {history.map((r, index) => (
                <li key={index}>
                  Roll {history.length - index}: {r.roll} (at{" "}
                  {new Date(r.createdAt).toLocaleString()})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
