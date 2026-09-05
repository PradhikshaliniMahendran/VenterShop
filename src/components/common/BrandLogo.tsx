'use client';

import React from 'react';
import Link from 'next/link';

interface BrandLogoProps {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export default function BrandLogo({
  variant = 'dark',
  size = 'md',
  showSubtitle = true,
}: BrandLogoProps) {
  const isLight = variant === 'light';

  // Size configurations
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9 sm:w-10 sm:h-10',
    lg: 'w-12 h-12 sm:w-14 sm:h-14',
  };

  const titleSizes = {
    sm: 'text-base font-extrabold',
    md: 'text-xl sm:text-2xl font-black',
    lg: 'text-2xl sm:text-3xl font-black',
  };

  const subtitleSizes = {
    sm: 'text-[8px]',
    md: 'text-[9px] sm:text-[10px]',
    lg: 'text-[11px] sm:text-xs',
  };

  const primaryColor = isLight ? '#FFFFFF' : '#8B1D1D';
  const secondaryColor = isLight ? '#D4AF37' : '#C42B2B';
  const subtitleColor = isLight ? 'text-gray-200' : 'text-gray-600';

  return (
    <Link href="/" className="inline-flex items-center gap-2.5 sm:gap-3 group select-none">
      {/* 8-Petal Symmetric Flower / Mandala Vector Icon */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Central Core */}
          <circle cx="50" cy="50" r="10" fill={primaryColor} />
          <circle cx="50" cy="50" r="6" fill="#D4AF37" />

          {/* 8 Radial Petals */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <g key={i} transform={`rotate(${angle} 50 50)`}>
              {/* Outer main petal */}
              <path
                d="M50 14 C44 26 40 38 50 44 C60 38 56 26 50 14 Z"
                fill={primaryColor}
              />
              {/* Inner Petal highlight */}
              <path
                d="M50 20 C46 28 44 36 50 40 C56 36 54 28 50 20 Z"
                fill={secondaryColor}
                opacity="0.85"
              />
              {/* Gold tip accent dot */}
              <circle cx="50" cy="11" r="2.5" fill="#D4AF37" />
            </g>
          ))}

          {/* Inter-petal small decorative diamond nodes */}
          {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle, i) => (
            <g key={i} transform={`rotate(${angle} 50 50)`}>
              <path
                d="M50 28 L53 33 L50 38 L47 33 Z"
                fill={primaryColor}
                opacity="0.9"
              />
            </g>
          ))}
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col text-left justify-center">
        <span
          className={`font-serif tracking-tight leading-none ${titleSizes[size]}`}
          style={{ color: primaryColor }}
        >
          VENTERSHOP
        </span>
        {showSubtitle && (
          <span
            className={`font-medium tracking-tight mt-0.5 leading-tight ${subtitleSizes[size]} ${subtitleColor}`}
          >
            Your Trusted Online Store for Quality Products
          </span>
        )}
      </div>
    </Link>
  );
}
