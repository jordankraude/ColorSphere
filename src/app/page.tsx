'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    { title: 'Welcome', description: 'Welcome to the ColorSphere! Start exploring our features to create amazing color themes.' },
    { title: 'Random Palette Generator', description: 'Head to the palette generator page to create random color schemes.' },
    { title: 'Color Wheel', description: 'Use our color wheel to pick a base color for your design themes.' },
    { title: 'Theme Generation', description: 'Once you choose your base color, generate matching themes for your projects.' },
    { 
      title: 'Support', 
      description: (
        <>
          If you want to support this project and more to come, consider making a donation at our Patreon site{' '}
          <Link href="https://kachinga.vercel.app" target="_blank" className="text-blue-500 hover:underline">
            here!
          </Link>
        </>
      ),
    },
  ];
  
  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen px-4 py-8">
      <h1 className="text-5xl font-extrabold mb-8 text-gradient">Welcome to ColorSphere</h1>
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105">
        <h2 className="text-3xl font-semibold mb-4 text-gray-400">{tutorialSteps[currentStep].title}</h2>
        <p className="text-gray-700 mb-6">{tutorialSteps[currentStep].description}</p>
        <button 
          onClick={nextStep} 
          className="w-full py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold rounded-md shadow hover:bg-gradient-to-l transition-all">
          {currentStep < tutorialSteps.length - 1 ? 'Next' : 'Get Started'}
        </button>
      </div>
      {currentStep === tutorialSteps.length - 1 && (
        <div className="mt-8">
          <Link href="/palette_gen">
            <span className="text-blue-500 hover:underline">Go to Palette Generator</span>
          </Link>
        </div>
      )}
    </div>
  );
}
