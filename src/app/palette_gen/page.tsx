'use client';
import { useState, useEffect } from 'react';

// Function to generate a random hex color
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Function to generate a random gray color
const getRandomGray = () => {
  const value = Math.floor(Math.random() * 256); // Range from 0 to 255
  return `#${value.toString(16).padStart(2, '0')}${value.toString(16).padStart(2, '0')}${value.toString(16).padStart(2, '0')}`;
};

// Function to generate a lighter or darker shade of a color
const getLighterOrDarkerShade = (color: string) => {
  const [r, g, b] = hexToRGB(color);
  const factor = Math.random() < 0.5 ? 0.5 : 1.5; // Randomly decide to lighten or darken
  return rgbToHex(
    Math.min(Math.max(Math.floor(r * factor), 0), 255),
    Math.min(Math.max(Math.floor(g * factor), 0), 255),
    Math.min(Math.max(Math.floor(b * factor), 0), 255)
  );
};

// Function to generate a custom palette based on the requirements
const getCustomPalette = () => {
  const color1 = getRandomColor();
  const color2 = getRandomColor();
  const shade = getLighterOrDarkerShade(color1);
  const blackWhite1 = getRandomGray(); // Lighter gray
  const blackWhite2 = getLighterOrDarkerShade(blackWhite1); // Darker gray
  return [color1, color2, shade, blackWhite1, blackWhite2];
};

// Function to generate mainly random color palette
const getMainlyRandomPalette = (baseColor: string) => {
  const baseRGB = hexToRGB(baseColor);
  const [r, g, b] = baseRGB;
  const variance = 70; // Control the variance for R, G, B values
  const closeToWhite = getRandomGray(); // A random light shade

  const colors = new Set<string>(); // Use a Set to ensure unique colors
  while (colors.size < 4) { // Generate until we have 4 unique colors
    const newR = Math.min(Math.max(r + Math.floor(Math.random() * variance) - variance / 2, 0), 255);
    const newG = Math.min(Math.max(g + Math.floor(Math.random() * variance) - variance / 2, 0), 255);
    const newB = Math.min(Math.max(b + Math.floor(Math.random() * variance) - variance / 2, 0), 255);
    const newColor = rgbToHex(newR, newG, newB);
    colors.add(newColor);
  }

  const randomColor = getRandomColor(); // Additional random color
  colors.add(randomColor); // Add one random color

  // Ensure we only return 5 colors
  if (colors.size < 5) {
    colors.add(closeToWhite); // Add a random light shade
  }

  return Array.from(colors).slice(0, 5); // Return the first 5 unique colors
};

// Helper functions to convert colors
const hexToRGB = (hex: string) => {
  const bigint = parseInt(hex.slice(1), 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
};

const rgbToHex = (r: number, g: number, b: number) => {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
};

// Convert hex color to HSL
// const hexToHSL = (hex: string): [number, number, number] => {
//   const r: number = parseInt(hex.slice(1, 3), 16) / 255;
//   const g: number = parseInt(hex.slice(3, 5), 16) / 255;
//   const b: number = parseInt(hex.slice(5, 7), 16) / 255;

//   const max = Math.max(r, g, b);
//   const min = Math.min(r, g, b);
//   let h: number, s: number, l: number;

//   if (max === min) {
//     h = 0; // achromatic
//   } else if (max === r) {
//     h = (g - b) / (max - min) + (g < b ? 6 : 0);
//   } else if (max === g) {
//     h = (b - r) / (max - min) + 2;
//   } else {
//     h = (r - g) / (max - min) + 4;
//   }

//   h /= 6; // Normalize to [0, 1]
//   l = (max + min) / 2;
//   s = max === 0 || min === 1 ? 0 : (max - l) / Math.min(l, 1 - l);

//   return [h * 360, s * 100, l * 100]; // Return h, s, l
// };

// Convert HSL back to hex color
// const hslToHex = (h: number, s: number, l: number): string => {
//   s /= 100;
//   l /= 100;

//   const c = (1 - Math.abs(2 * l - 1)) * s;
//   const x = c * (1 - Math.abs((h / 60) % 2 - 1));
//   const m = l - c / 2;

//   let r: number, g: number, b: number;

//   if (h < 60) {
//     r = c; g = x; b = 0;
//   } else if (h < 120) {
//     r = x; g = c; b = 0;
//   } else if (h < 180) {
//     r = 0; g = c; b = x;
//   } else if (h < 240) {
//     r = 0; g = x; b = c;
//   } else if (h < 300) {
//     r = x; g = 0; b = c;
//   } else {
//     r = c; g = 0; b = x;
//   }

//   return `#${((1 << 24) + (Math.round((r + m) * 255) << 16) + (Math.round((g + m) * 255) << 8) + Math.round((b + m) * 255)).toString(16).slice(1).toUpperCase()}`;
// };

// Function to organize colors based on hue
// const organizeColors = (colors: string[]): string[] => {
//   const hslColors = colors.map(color => hexToHSL(color));
//   hslColors.sort((a, b) => a[0] - b[0]); // Sort by hue

//   // Convert back to hex
//   return hslColors.map(([h, s, l]) => hslToHex(h, s, l));
// };

export default function PaletteGenerator() {
  const [palette, setPalette] = useState<{ color: string; locked: boolean }[]>([]);
  const [generationCount, setGenerationCount] = useState(0);
  const [lockedColorsCount, setLockedColorsCount] = useState(0);

  // Retrieve the palette from localStorage when the component mounts
  useEffect(() => {
    const storedPalette = localStorage.getItem('colorPalette');
    if (storedPalette) {
      setPalette(JSON.parse(storedPalette));
      setLockedColorsCount(JSON.parse(storedPalette).filter((c: { locked: boolean }) => c.locked).length);
    } else {
      generatePalette(); // Generate a palette if none exists
    }
  }, []);

  const generatePalette = () => {
    const newPalette: { color: string; locked: boolean }[] = [];
    const unlockedColorsCount = palette.length - lockedColorsCount; // Count of unlocked colors

    // Generate new colors only for the unlocked colors
    for (let i = 0; i < unlockedColorsCount; i++) {
      if (generationCount % 3 === 0 && generationCount !== 0) {
        // Generate mainly random palette on every 3rd generation
        const baseColor = palette.find(c => !c.locked)?.color || getRandomColor(); // Ensure there is a base color
        newPalette.push({ color: getMainlyRandomPalette(baseColor)[i] || getRandomColor(), locked: false });
      } else {
        // Default custom palette
        newPalette.push({ color: getCustomPalette()[i] || getRandomColor(), locked: false });
      }
    }

    setPalette([...palette.filter(c => c.locked), ...newPalette]);
    setGenerationCount(prev => prev + 1);

    // Save to localStorage
    localStorage.setItem('colorPalette', JSON.stringify([...newPalette, ...palette.filter(c => c.locked)]));
  };

  const toggleLockColor = (index: number) => {
    setPalette(palette.map((c, i) => (i === index ? { ...c, locked: !c.locked } : c)));
    setLockedColorsCount(prev => prev + (palette[index].locked ? -1 : 1));
    localStorage.setItem('colorPalette', JSON.stringify(palette));
  };

  const addColor = () => {
    if (palette.length < 5){
    setPalette([...palette, { color: getRandomColor(), locked: false }]);
    localStorage.setItem('colorPalette', JSON.stringify([...palette, { color: getRandomColor(), locked: false }]));
    }
  };

  const removeColor = (index: number) => {
    // Check if the color is locked
    if (palette[index].locked) {
      console.log("This color is locked and cannot be removed."); // or handle this case as you prefer
      return; // Exit the function without making changes
    }
  
    // Create a new palette without the specified index
    const newPalette = palette.filter((_, i) => i !== index);
    
    // Update the state and local storage
    setPalette(newPalette);
    localStorage.setItem('colorPalette', JSON.stringify(newPalette));
  };
  

  return (
    <div className="p-8 rounded-lg ">
      <h2 className="text-2xl font-bold mb-6 text-center">Color Palette Generator</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {palette.map((colorObj, index) => (
          <div
            key={index}
            className={`relative flex items-center justify-center h-60 rounded-md transition-transform duration-300 transform hover:scale-105 cursor-pointer ${colorObj.locked ? 'border-2 border-red-500' : ''}`}
            style={{ backgroundColor: colorObj.color }}
          >
            <span className="text-white text-lg">{colorObj.color}</span>
            <button
              className="absolute top-2 right-2 bg-transparent text-white"
              onClick={(e) => { e.stopPropagation(); toggleLockColor(index); }}
            >
              {colorObj.locked ? '🔒' : '🔓'} {/* Lock/Unlock icon placeholder */}
            </button>
            <button 
              className="absolute bottom-2 right-2 bg-red-500 text-white rounded px-2" 
              onClick={(e) => { e.stopPropagation(); removeColor(index); }}>
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-between mb-4">
        <button 
          className="bg-blue-500 text-white py-2 px-4 rounded transition duration-200 hover:bg-blue-600"
          onClick={generatePalette}
        >
          Generate Palette
        </button>
        <button 
          className="bg-green-500 text-white py-2 px-4 rounded transition duration-200 hover:bg-green-600"
          onClick={addColor}
        >
          Add Color
        </button>
      </div>
    </div>
  );
}
