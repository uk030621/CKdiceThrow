"use client";

import { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement, // Add this
  PointElement, // Add this
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement, // Register here
  PointElement, // Register here
  Title,
  Tooltip,
  Legend
);

export default function DiceThrower() {
  const [diceRange, setDiceRange] = useState(6);
  const [dice, setDice] = useState([1, 1, 1]);
  const [results, setResults] = useState(Array(10).fill(0));
  const [throws, setThrows] = useState(0);
  const [calibrationMode, setCalibrationMode] = useState(false);
  const [calibrationThrows, setCalibrationThrows] = useState(0);
  const [isCalibrated, setIsCalibrated] = useState(false);

  const rollDice = () => {
    const newDice = Array.from(
      { length: 3 },
      () => Math.floor(Math.random() * diceRange) + 1
    );
    setDice(newDice);
    const newResults = [...results];
    newDice.forEach((value) => {
      newResults[value - 1] += 1;
    });
    setResults(newResults);
    if (!calibrationMode) {
      setThrows(throws + 1);
    }
  };

  const runCalibration = () => {
    setCalibrationMode(true);
    setCalibrationThrows(100);
    const simulatedResults = Array(10).fill(0);
    for (let i = 0; i < 100; i++) {
      const newDice = Array.from(
        { length: 3 },
        () => Math.floor(Math.random() * diceRange) + 1
      );
      newDice.forEach((value) => {
        simulatedResults[value - 1] += 1;
      });
    }
    setResults(simulatedResults);
    setIsCalibrated(true);
    setCalibrationMode(false);
  };

  const resetCalibration = () => {
    setResults(Array(10).fill(0));
    setCalibrationThrows(0);
    setIsCalibrated(false);
    setThrows(0);
  };

  // Calculating expected frequency and confidence intervals
  const expectedFrequency = (throws + calibrationThrows) * (3 / diceRange);
  const confidenceInterval =
    1.96 * Math.sqrt(expectedFrequency * (1 - 1 / diceRange));

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
      {
        label: "Expected",
        data: Array(diceRange).fill(expectedFrequency),
        type: "line",
        borderColor: "rgb(17, 17, 17)",
        borderWidth: 2,
        pointRadius: 0,
      },
      {
        label: "95% Low",
        data: Array(diceRange).fill(expectedFrequency - confidenceInterval),
        type: "line",
        borderColor: "rgb(236, 8, 8)",
        borderWidth: 1,
        pointRadius: 0,
        borderDash: [5, 5],
      },
      {
        label: "95% High",
        data: Array(diceRange).fill(expectedFrequency + confidenceInterval),
        type: "line",
        borderColor: "rgb(236, 8, 8)",
        borderWidth: 1,
        pointRadius: 0,
        borderDash: [5, 5],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "white",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "white",
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: "white",
        },
      },
    },
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
      <h1 className="text-4xl font-bold mb-5 mt-4">CK Dice Thrower</h1>

      <div className="flex flex-col items-center">
        <label htmlFor="dice-range" className="text-lg font-medium mb-2">
          Select Dice Range:
        </label>
        <select
          id="dice-range"
          value={diceRange}
          onChange={(e) => setDiceRange(parseInt(e.target.value))}
          className="mb-5 px-4 py-2 rounded text-black"
        >
          {[6, 7, 8, 9, 10].map((range) => (
            <option key={range} value={range}>
              1-{range}
            </option>
          ))}
        </select>

        <div className="flex gap-4 mb-5">
          {dice.map((value, index) => (
            <div
              key={index}
              className="flex items-center justify-center w-16 h-16 text-2xl font-bold bg-white text-black rounded shadow"
            >
              {value}
            </div>
          ))}
        </div>

        <p className="text-lg font-medium">
          Total: {dice.reduce((a, b) => a + b, 0)}
        </p>
        <p className="text-lg font-medium">Number of Throws: {throws}</p>
        {calibrationMode && (
          <p className="text-lg font-medium">Bias check in progress...</p>
        )}
        {!calibrationMode && isCalibrated && (
          <p className="text-lg font-medium">
            Check completed. Number of Throws: {calibrationThrows}
          </p>
        )}

        <button
          onClick={
            isCalibrated ? resetCalibration : calibrationMode ? null : rollDice
          }
          className="mt-5 px-6 py-2 bg-yellow-500 text-black font-bold rounded shadow hover:bg-yellow-600"
        >
          {isCalibrated ? "Reset Check" : "Throw Dice"}
        </button>

        {!calibrationMode && !isCalibrated && (
          <button
            onClick={runCalibration}
            className="mt-3 px-6 py-2 bg-green-500 text-black font-bold rounded shadow hover:bg-green-600"
          >
            Check For Bias
          </button>
        )}
      </div>

      <div className="mt-10 w-full max-w-3xl" style={{ height: "300px" }}>
        <Bar data={data} options={options} />
      </div>

      <footer className="mt-10 text-sm text-gray-200">
        © {new Date().getFullYear()} LWJ Dice App. All rights reserved.
      </footer>
    </main>
  );
}
