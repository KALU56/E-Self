'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative bg-white overflow-hidden z-40 h-screen">
      <div className="max-w-7xl mx-auto h-full">
        <div
          className={`relative z-10 bg-white h-full flex flex-col lg:flex-row ${
            isSmallScreen ? 'justify-center items-center text-center' : ''
          }`}
        >
          {/* Text Section */}
          <div
            className={`flex flex-col ${
              isSmallScreen
                ? 'justify-center items-center px-6 py-12'
                : 'justify-center text-left lg:w-1/2 px-6 lg:px-12 py-12'
            }`}
          >
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl leading-tight">
              <span>Welcome to E-Self</span>
              <span className="block text-[#8E1616]"> – A Great Choice!</span>
            </h1>
            <p className="mt-4 text-base text-gray-600 sm:text-lg md:text-xl max-w-xl">
              We provide high-quality courses at the best prices. Want to become an instructor? It`&apos;`s easy and the perfect place to start!
            </p>

            <div className="mt-6 flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-4">
              <Button className="bg-[#8E1616] hover:bg-[#D84040] text-white px-8 py-4 text-lg">
                Get started
              </Button>
              <Button variant="outline" className="text-[#8E1616] border-[#8E1616] hover:bg-gray-100 px-8 py-4 text-lg">
                Live demo
              </Button>
            </div>
          </div>

          {/* Image Section - only shown on md and up */}
          {!isSmallScreen && (
            <div className="lg:w-1/2 w-full flex justify-center items-center">
              <Image
                src="/Adobe Express - file.png"
                alt="Hero Image"
                width={500}
                height={500}
                className="object-cover lg:object-top w-full h-auto"
                style={{ objectPosition: 'center' }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
