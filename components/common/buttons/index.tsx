import React, { useState } from 'react';
import Image from 'next/image';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  type?: 'info' | 'success' | 'warning' | 'danger' | 'neutral';
  iconSrc?: string;
  iconAlt?: string;
}

const Button = ({ onClick, children, type = 'info', iconSrc, iconAlt }: ButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true); // Start loading
    try {
      await onClick(); // Execute the onClick function passed as a prop
    } finally {
      setIsLoading(false); // Stop loading regardless of the result
    }
  };

  if (type === 'success') {
    return (
      <button
        onClick={handleClick}
        className="cursor-pointer flex flex-row justify-center items-center rounded-lg py-3 px-5 bg-gradient-to-r from-[#28A745] to-[#67D58F] hover:from-[#28A745] hover:to-[#4DA766] text-white text-xs sm:text-sm font-normal font-roboto"
      >
        {isLoading ? (
          <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <>
            {iconSrc && (
              <Image
                className="ml-1"
                width={15}
                height={15}
                src={iconSrc as string}
                alt={iconAlt || 'icon'}
              />
            )}
            {children}
          </>
        )}
      </button>
    );
  } else if (type === 'warning') {
    return (
      <button
        onClick={handleClick}
        className="cursor-pointer flex flex-row justify-center items-center rounded-lg py-3 px-5 bg-gradient-to-r from-[#FFC107] to-[#FFD444] hover:from-[#FFC107] hover:to-[#FFCA30] text-white text-xs sm:text-sm font-normal font-roboto"
      >
        {isLoading ? (
          <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <>
            {iconSrc && (
              <Image
                className="ml-1"
                width={15}
                height={15}
                src={iconSrc as string}
                alt={iconAlt || 'icon'}
              />
            )}
            {children}
          </>
        )}
      </button>
    );
  } else if (type === 'danger') {
    return (
      <button
        onClick={handleClick}
        className="cursor-pointer flex flex-row justify-center items-center rounded-lg py-3 px-5 bg-gradient-to-r from-[#DC3545] to-[#E76D72] hover:from-[#DC3545] hover:to-[#E04550] text-white text-xs sm:text-sm font-normal font-roboto"
      >
        {isLoading ? (
          <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <>
            {iconSrc && (
              <Image
                className="ml-1"
                width={15}
                height={15}
                src={iconSrc as string}
                alt={iconAlt || 'icon'}
              />
            )}
            {children}
          </>
        )}
      </button>
    );
  } else if (type === 'neutral') {
    return (
      <button
        onClick={handleClick}
        className="cursor-pointer flex flex-row justify-center items-center rounded-lg py-3 px-5 bg-gradient-to-r from-[#B0B0B0] to-[#D0D0D0] hover:from-[#A0A0A0] hover:to-[#C0C0C0] text-white text-xs sm:text-sm font-normal font-roboto"
      >
        {isLoading ? (
          <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <>
            {iconSrc && (
              <Image
                className="ml-1"
                width={15}
                height={15}
                src={iconSrc as string}
                alt={iconAlt || 'icon'}
              />
            )}
            {children}
          </>
        )}
      </button>
    );
  } else {
    // Default for 'info' and any other type
    return (
      <button
        onClick={handleClick}
        className="cursor-pointer flex flex-row justify-center items-center rounded-lg py-3 px-5 bg-gradient-to-r from-[#0F54EF] to-[#6B96E9] hover:from-[#0F54EF] hover:to-[#4479D1] text-white text-xs sm:text-sm font-normal font-roboto"
      >
        {isLoading ? (
          <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <>
            {iconSrc && (
              <Image
                className="ml-1"
                width={15}
                height={15}
                src={iconSrc as string}
                alt={iconAlt || 'icon'}
              />
            )}
            {children}
          </>
        )}
      </button>
    );
  }
};

export default Button;
