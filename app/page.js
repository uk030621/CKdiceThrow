"use client";

import { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function DiceThrower() {
  // State variables
  const [dice, setDice] = useState([1, 1, 1]);
  const [isShaking, setIsShaking] = useState([false, false, false]);
  const [total, setTotal] = useState(3);
  const [diceRange, setDiceRange] = useState(6); // Default range is 1-6
  const [results, setResults] = useState(Array(10).fill(0)); // Tracks frequency of dice results
  const [throwCount, setThrowCount] = useState(0); // Tracks the number of throws

  // Chart data
  const data = {
    labels: Array.from({ length: diceRange }, (_, i) => `Value ${i + 1}`),
    datasets: [
      {
        label: "Frequency",
        data: results.slice(0, diceRange),
        backgroundColor: "rgba(255, 206, 86, 0.5)",
        borderColor: "rgba(255, 206, 86, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "white", // Legend label color
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          color: "white", // X-axis tick label color
        },
        title: {
          display: true,
          text: "Dice Values",
          color: "white",
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: "white", // Y-axis tick label color
        },
        title: {
          display: true,
          text: "Frequency",
          color: "white",
        },
      },
    },
  };

  // Function to handle dice throws
  const throwDice = () => {
    const shakingState = [true, true, true];
    setIsShaking(shakingState);

    setTimeout(() => {
      const newDice = [1, 2, 3].map(
        () => Math.floor(Math.random() * diceRange) + 1
      );
      setDice(newDice);
      setTotal(newDice.reduce((acc, value) => acc + value, 0));

      const newResults = [...results];
      newDice.forEach((value) => {
        newResults[value - 1] += 1;
      });
      setResults(newResults);

      setThrowCount(throwCount + 1);

      setIsShaking([false, false, false]);
    }, 500);
  };

  const resetData = (newRange) => {
    setDiceRange(newRange);
    setResults(Array(10).fill(0)); // Reset results
    setThrowCount(0); // Reset throw count
    setDice([1, 1, 1]); // Reset dice to initial state
    setTotal(3); // Reset total
  };

  // Render
  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
      <h1 className="text-4xl font-bold mb-6 mt-6">Dice Thrower</h1>

      {/* Chart Range Selector */}
      <div className="mb-4">
        <label htmlFor="diceRange" className="mr-2 text-lg font-medium">
          Select Dice Range:
        </label>
        <select
          id="diceRange"
          value={diceRange}
          onChange={(e) => resetData(parseInt(e.target.value, 10))}
          className="px-4 py-2 rounded-md bg-white text-black shadow-md"
        >
          {[6, 7, 8, 9, 10].map((range) => (
            <option key={range} value={range}>
              1-{range}
            </option>
          ))}
        </select>
      </div>

      {/* Dice and Throw Count */}
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

      <p className="text-lg font-bold mb-2">Total: {total}</p>
      <p className="text-lg font-bold mb-8">Number of Throws: {throwCount}</p>

      <button
        onClick={throwDice}
        className="px-6 py-3 bg-yellow-400 rounded-lg font-bold text-black hover:bg-yellow-300 transition-all duration-300 shadow-lg"
      >
        Throw Dice
      </button>

      {/* Responsive and Centered Histogram */}
      <div className="mt-10 flex justify-center w-full px-4">
        <div className="w-full max-w-4xl">
          <Bar data={data} options={options} />
        </div>
      </div>

      <footer className="mt-10 text-sm text-gray-200">
        © {new Date().getFullYear()} LWJ Media Library. All rights reserved.
      </footer>
    </div>
  );
}
