import { useEffect, useState } from "react";

const colors = [
  { name: "bg-gray-700", hex: "#4a5568" },
  { name: "bg-red-700", hex: "#b91c1c" },
  { name: "bg-yellow-700", hex: "#b45309" },
  { name: "bg-green-700", hex: "#1f9d55" },
  { name: "bg-blue-700", hex: "#1c64f2" },
  { name: "bg-indigo-700", hex: "#4f46e5" },
  { name: "bg-purple-700", hex: "#8b5cf6" },
  { name: "bg-pink-700", hex: "#c026d3" },
];

export const useRandomColors = (numColors: number) => {
  const [randomColors, setRandomColors] = useState<typeof colors>([]);

  useEffect(() => {
    // Shuffle the colors array to get a random order
    const shuffledColors = colors.sort(() => 0.5 - Math.random());
    // Slice the first 'numColors' items from the shuffled array
    const selectedColors = shuffledColors.slice(0, numColors);
    // Update the state with the selected colors
    setRandomColors(selectedColors);
  }, [numColors]);

  return randomColors;
};
