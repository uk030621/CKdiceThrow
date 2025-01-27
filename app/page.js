"use client";

import { useState } from "react";
import clsx from "clsx"; // To handle conditional classes easily
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  LineController, // Import this
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  LineController, // Register this
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
  const [isShaking, setIsShaking] = useState([false, false, false]);
  const [total, setTotal] = useState(3);

  const throwDice = () => {
    // Set all dice to shaking state
    setIsShaking([true, true, true]);

    // Simulate shaking animation for 500ms
    setTimeout(() => {
      // Generate new dice values
      const newDice = Array.from(
        { length: 3 },
        () => Math.floor(Math.random() * diceRange) + 1
      );

      // Update the `results` array to reflect the frequency of the dice values rolled
      setResults((prevResults) => {
        const updatedResults = [...prevResults];
        newDice.forEach((value) => {
          updatedResults[value - 1] += 1; // Increment the frequency for the rolled value
        });
        return updatedResults;
      });

      // Update other state
      setDice(newDice);
      setTotal(newDice.reduce((acc, value) => acc + value, 0));
      setThrows((prevThrows) => prevThrows + 1);

      // Stop shaking animation
      setIsShaking([false, false, false]);
    }, 500);
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
    labels: Array.from({ length: diceRange }, (_, i) => `${i + 1}`),
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
        label: "95% Lo CI ",
        data: Array(diceRange).fill(expectedFrequency - confidenceInterval),
        type: "line",
        borderColor: "rgb(236, 8, 8)",
        borderWidth: 1,
        pointRadius: 0,
      },
      {
        label: "95% Hi CI",
        data: Array(diceRange).fill(expectedFrequency + confidenceInterval),
        type: "line",
        borderColor: "rgb(236, 8, 8)",
        borderWidth: 1,
        pointRadius: 0,
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
          font: {
            size: 14,
          },
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
      <h1 className="text-3xl font-bold mb-5 mt-1">CK Dice Thrower</h1>

      <div className="flex flex-col items-center">
        <label htmlFor="dice-range" className="text-lg font-medium mb-2">
          Select Dice Range:
        </label>
        <select
          id="dice-range"
          value={diceRange}
          onChange={(e) => {
            const newRange = parseInt(e.target.value);
            setDiceRange(newRange); // Update dice range
            setThrows(0); // Reset number of throws
            setResults(Array(10).fill(0)); // Reset results array
            setDice([1, 1, 1]); // Reset dice to initial values
            setTotal(3); // Reset total to the minimum sum
          }}
          className="mb-5 px-4 py-2 rounded text-black"
        >
          {[6, 7, 8, 9, 10].map((range) => (
            <option key={range} value={range}>
              1-{range}
            </option>
          ))}
        </select>

        <div className="flex gap-4 mb-4">
          {dice.map((value, index) => (
            <div
              key={index}
              className={clsx(
                "w-14 h-14 bg-slate-300 rounded-lg flex items-center justify-center text-black text-3xl font-semibold shadow-lg transition-transform",
                { [`animate-rock-${index + 1}`]: isShaking[index] }
              )}
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
            Check done. Number of Throws: {calibrationThrows}
          </p>
        )}
        <div className="flex gap-3">
          <button
            onClick={() => {
              if (isCalibrated) {
                resetCalibration();
              } else if (!calibrationMode) {
                throwDice(); // Call only `throwDice`
              }
            }}
            className="mt-3 px-6 py-2 bg-yellow-300 text-black  rounded shadow hover:bg-yellow-400 text-sm"
          >
            {isCalibrated ? "Reset Check" : "Throw Dice"}
          </button>

          {!calibrationMode && !isCalibrated && (
            <button
              onClick={runCalibration}
              className="mt-3 px-6 py-2 bg-slate-800 text-white  rounded shadow hover:bg-slate-900 text-sm"
            >
              Bias check
            </button>
          )}
        </div>
      </div>

      <div className="mt-10 w-full max-w-3xl" style={{ height: "250px" }}>
        <Bar data={data} options={options} />
      </div>

      <footer className="mt-10 text-sm text-gray-200">
        © {new Date().getFullYear()} LWJ Dice App. All rights reserved.
      </footer>
    </main>
  );
}
