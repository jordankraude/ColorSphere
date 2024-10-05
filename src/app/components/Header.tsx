'use client';

import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header>
      <Image className="ml-10" src='/images/icon.png' alt='ColorSphere Icon' width={80} height={80}></Image>
      <nav
        className={`fixed top-4 right-4 bg-gradient-to-r from-green-400 to-blue-500 hover:bg-gradient-to-l shadow-lg rounded-lg transition-all duration-300 ease-in-out z-50 ${isOpen ? 'w-48' : 'w-16'}`}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="flex items-center justify-center h-full">
          {!isOpen && (<button className="text-white text-lg font-semibold">Menu</button>)}
        </div>
        {isOpen && (
          <ul className="flex flex-col space-y-2 p-2 relative">
            <li className="relative text-center group">
              <Link href="/" className="text-white relative z-10">
                Tutorial
              </Link>
              <span className="absolute left-0 right-0 bottom-0 h-1 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out origin-right" />
            </li>
            <li className="relative text-center group">
              <Link href="/palette_gen" className="text-white relative z-10">
                Palette Generator
              </Link>
              <span className="absolute left-0 right-0 bottom-0 h-1 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out origin-right" />
            </li>
            <li className="relative text-center group">
              <Link href="/theme_finder" className="text-white relative z-10">
                Theme Finder
              </Link>
              <span className="absolute left-0 right-0 bottom-0 h-1 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out origin-right" />
            </li>
            <li className="relative text-center group">
              <Link href="/contact" className="text-white relative z-10">
                Contact
              </Link>
              <span className="absolute left-0 right-0 bottom-0 h-1 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out origin-right" />
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
}

