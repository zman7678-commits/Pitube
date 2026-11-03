import React from 'react';

interface PiCoinIconProps {
  className?: string;
  size?: number;
  animate?: boolean;
}

export const PiCoinIcon: React.FC<PiCoinIconProps> = ({ 
  className = "w-6 h-6", 
  size = 24,
  animate = false 
}) => {
  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 ${animate ? 'animate-bounce' : ''}`}
      style={{ width: size, height: size }}
    >
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <defs>
          <radialGradient id="piGoldGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="25%" stopColor="#FDE047" />
            <stop offset="60%" stopColor="#EAB308" />
            <stop offset="90%" stopColor="#CA8A04" />
            <stop offset="100%" stopColor="#854D0E" />
          </radialGradient>
          <linearGradient id="piInnerGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2e1065" />
            <stop offset="100%" stopColor="#140228" />
          </linearGradient>
          <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Coin Rim */}
        <circle cx="50" cy="50" r="48" fill="url(#piGoldGrad)" filter="url(#goldGlow)" />
        
        {/* Outer Dark Ring */}
        <circle cx="50" cy="50" r="42" fill="#0d041a" stroke="#FACC15" strokeWidth="2" strokeDasharray="3 3" />
        
        {/* Inner Purple Gradient Body */}
        <circle cx="50" cy="50" r="37" fill="url(#piInnerGrad)" stroke="#EAB308" strokeWidth="2.5" />
        
        {/* Greek Pi Symbol (π) in Bright Yellow / Gold */}
        {/* Horizontal top bar */}
        <path 
          d="M26 33 C26 31 28 30 31 30 L69 30 C72 30 74 31 74 33 C74 35 72 36 69 36 L31 36 C28 36 26 35 26 33 Z" 
          fill="#FDE047" 
        />
        {/* Left leg of Pi */}
        <path 
          d="M38 34 L38 65 C38 69 34 71 31 71 C29 71 28 70 28 68 C28 66 31 65 33 63 L33 34 Z" 
          fill="#FACC15" 
        />
        {/* Right leg of Pi with distinctive curve */}
        <path 
          d="M62 34 L62 62 C62 67 65 69 69 69 C72 69 73 68 73 66 C73 64 70 63 68 62 C67 61 67 59 67 56 L67 34 Z" 
          fill="#FACC15" 
        />
        
        {/* Sparkle Accent */}
        <circle cx="68" cy="28" r="2.5" fill="#FFFFFF" />
      </svg>
    </div>
  );
};
