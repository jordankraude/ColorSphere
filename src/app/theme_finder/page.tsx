'use client';
import { useEffect, useState } from 'react';
import ColorWheel from "../components/ColorWheel";
import { useRouter } from 'next/navigation';

const dullerColors = [
  "hsl(0, 0%, 0%)", // Black
  "hsl(0, 0%, 20%)", 
  "hsl(0, 0%, 40%)", 
  "hsl(0, 0%, 60%)", 
  "hsl(0, 0%, 80%)", 
  "hsl(0, 0%, 100%)" // White
];

export default function ThemeFinder() {
    
  const [selectedColor, setSelectedColor] = useState<string>('hsl(0, 100%, 50%)');
  const [colorScheme, setColorScheme] = useState<string>('monochromatic');
  const [colorCount, setColorCount] = useState<number>(3);
  const [generatedColors, setGeneratedColors] = useState<{ color: string; locked: boolean }[]>([]);

  const router = useRouter(); // Hook to navigate

  const handleColorChange = (color: string) => {
    localStorage.setItem('selectedColor', color); // Store in local storage
    setSelectedColor(color);
  };

  const handleSchemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newScheme = event.target.value;
    setColorScheme(newScheme);
    const maxColors = getMaxColors(newScheme);
    setColorCount(maxColors);
  };

  const handleCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setColorCount(Number(event.target.value));
  };

  const hslToHex = (h : number, s : number, l : number) => {
    s /= 100;
    l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;

    let r, g, b;
    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
    } else {
        r = c; g = 0; b = x;
    }

    const hex = (r + m) * 255 << 16 | (g + m) * 255 << 8 | (b + m) * 255;
    return `#${(0x1000000 + hex).toString(16).slice(1).toUpperCase()}`;
  };

  const getMaxColors = (scheme: string) => {
    switch (scheme) {
      case 'monochromatic':
        return 10;
      case 'analogous':
        return 5;
      case 'complementary':
        return 2;
      case 'split-complementary':
        return 3;
      case 'triadic':
        return 3;
      case 'square':
        return 4;
      case 'rectangle':
        return 4;
      default:
        return 3;
    }
  };

  const generateColorScheme = () => {
    const newPalette: { color: string; locked: boolean }[] = []; // Define the new palette array
    const baseHue = parseInt(selectedColor.slice(4, selectedColor.indexOf(','))); 
  
    switch (colorScheme) {
      case 'monochromatic':
        for (let i = 0; i < colorCount; i++) {
          const lightness = 50 + (i * 10); 
          newPalette.push({ color: hslToHex(baseHue, 100, lightness), locked: true }); // All colors locked
        }
        break;
      case 'analogous':
        for (let i = 0; i < colorCount; i++) {
          newPalette.push({ color: hslToHex((baseHue + i * 30) % 360, 100, 50), locked: true }); // All colors locked
        }
        break;
      case 'complementary':
        newPalette.push({ color: hslToHex(baseHue, 100, 50), locked: true }); // All colors locked
        newPalette.push({ color: hslToHex((baseHue + 180) % 360, 100, 50), locked: true }); // All colors locked
        break;
      case 'split-complementary':
        newPalette.push({ color: hslToHex(baseHue, 100, 50), locked: true }); // All colors locked
        newPalette.push({ color: hslToHex((baseHue + 150) % 360, 100, 50), locked: true }); // All colors locked
        newPalette.push({ color: hslToHex((baseHue + 210) % 360, 100, 50), locked: true }); // All colors locked
        break;
      case 'triadic':
        newPalette.push({ color: hslToHex(baseHue, 100, 50), locked: true }); // All colors locked
        newPalette.push({ color: hslToHex((baseHue + 120) % 360, 100, 50), locked: true }); // All colors locked
        newPalette.push({ color: hslToHex((baseHue + 240) % 360, 100, 50), locked: true }); // All colors locked
        break;
      case 'square':
        for (let i = 0; i < colorCount; i++) {
          newPalette.push({ color: hslToHex((baseHue + i * 90) % 360, 100, 50), locked: true }); // All colors locked
        }
        break;
      case 'rectangle':
        newPalette.push({ color: hslToHex(baseHue, 100, 50), locked: true }); // All colors locked
        newPalette.push({ color: hslToHex((baseHue + 180) % 360, 100, 50), locked: true }); // All colors locked
        newPalette.push({ color: hslToHex((baseHue + 90) % 360, 100, 50), locked: true }); // All colors locked
        newPalette.push({ color: hslToHex((baseHue + 270) % 360, 100, 50), locked: true }); // All colors locked
        break;
      default:
        newPalette.push({ color: hslToHex(baseHue, 100, 50), locked: true }); // All colors locked
    }
  
    // Clear the existing palette in local storage
    localStorage.removeItem('colorPalette');
  
    // Store the new palette in local storage
    localStorage.setItem('colorPalette', JSON.stringify(newPalette));
  
    setGeneratedColors(newPalette); // Store the generated colors
  };

  const handleDullerColorChange = (color: string) => {
    localStorage.setItem('selectedColor', color); // Store in local storage
    setSelectedColor(color);
  };

  const handleSpacebarPress = (event: KeyboardEvent) => {
    if (event.code === 'Space') {
      event.preventDefault(); // Prevent scrolling when pressing space
      generateColorScheme(); // Generate color scheme when spacebar is pressed
    }
  };

  const navigateToPaletteGen = () => {
    // Pass the generatedColors to the palette generator page
    router.push(`/palette_gen`);
  };
  
  useEffect(() => {
    // Add event listener for spacebar press
    window.addEventListener('keydown', handleSpacebarPress);
    return () => {
      // Cleanup event listener on component unmount
      window.removeEventListener('keydown', handleSpacebarPress);
    };
  }, []);

  return (
    <div className="h-auto my-20 flex flex-col items-center justify-center p-8rounded-lg shadow-lg w-3/4 mx-auto text-White">
      <h1 className="text-4xl font-bold mb-6 text-center">Theme Finder</h1>

      <div className="mb-10 w-full">
        <h2 className="text-2xl font-semibold mb-4">Select a Base Color</h2>
        <div className='flex justify-evenly w-full'>
          <ColorWheel onColorChange={handleColorChange} />
          <div
            className="mt-4 w-32 h-32 border border-gray-300 rounded"
            style={{ backgroundColor: selectedColor }}
          />
        </div>
      </div>

      {/* Duller Color Options */}
      <div className="mt-6 w-full mb-10">
        <h2 className="text-2xl font-semibold mb-4">Duller Color Options</h2>
        <div className="flex space-x-4 justify-evenly w-full">
          {dullerColors.map((color) => (
            <div
              key={color}
              className="w-8 h-8 cursor-pointer border border-black"
              style={{ backgroundColor: color }}
              onClick={() => handleDullerColorChange(color)}
            />
          ))}
        </div>
      </div>

      {/* Color Scheme Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Choose a Color Scheme</h2>
        <select
          value={colorScheme}
          onChange={handleSchemeChange}
          className="text-black px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="monochromatic">Monochromatic</option>
          <option value="analogous">Analogous</option>
          <option value="complementary">Complementary</option>
          <option value="split-complementary">Split-Complementary</option>
          <option value="triadic">Triadic</option>
          <option value="square">Square</option>
          <option value="rectangle">Rectangle</option>
        </select>
      </div>

      {/* Number of Colors Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Choose Number of Colors</h2>
        <input
          type="number"
          value={colorCount}
          onChange={handleCountChange}
          min={1}
          max={getMaxColors(colorScheme)}
          className="text-black px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={generateColorScheme}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Generate Color Scheme
      </button>

      {/* Navigation to Palette Generator */}
      <button
        onClick={navigateToPaletteGen}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Generate Palette
      </button>

      {/* Generated Colors */}
      <div className="mt-10 flex justify-evenly w-full">
        {generatedColors.map((colorObj, index) => (
          <div
            key={index}
            className="w-16 h-16 border border-gray-300"
            style={{ backgroundColor: colorObj.color }}
          />
        ))}
      </div>
    </div>
  );
}
