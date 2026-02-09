import React from 'react';

interface LoadingDotsProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  dots?:number;
}

const DotsLoader: React.FC<LoadingDotsProps> = ({ size = 'md', color = '#ffffff', dots = 4 }) => {
  const sizeStyles = {
    sm: 'w-1.5 h-1.5',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const dotStyle = {
    backgroundColor: color,
    animation: 'pulse 1s ease-in-out infinite',
  };

  const baseDelays = [0, 0.4, 0.8, 0.9];

  return (
      <div className="flex gap-x-1">
      {Array.from({ length: dots }).map((_, index) => {
        // Calculate animation delay: use baseDelays for the first few,
        // then extend with a consistent increment for more dots.
        const animationDelay = (index < baseDelays.length
          ? baseDelays[index]
          : baseDelays[baseDelays.length - 1] + (index - baseDelays.length + 1) * 0.1 // Extend by 0.1s for subsequent dots
        ).toFixed(1) + 's'; // Ensure two decimal places and add 's' unit

        return (
          <div
            key={index} // Use index as key, safe for static lists
            className={`rounded-full ${sizeStyles[size]} flex-shrink-0`} // Added flex-shrink-0 for robustness
            style={{ ...dotStyle, animationDelay }}
          ></div>
        );
      })}
      {/* <div
        className={`rounded-full ${sizeStyles[size]}`}
        style={{ ...dotStyle, animationDelay: '0s' }}
      ></div>
      <div
        className={`rounded-full ${sizeStyles[size]}`}
        style={{ ...dotStyle, animationDelay: '0.4s' }}
      ></div>
      <div
        className={`rounded-full ${sizeStyles[size]}`}
        style={{ ...dotStyle, animationDelay: '0.8s' }}
      ></div>
      <div
        className={`rounded-full ${sizeStyles[size]}`}
        style={{ ...dotStyle, animationDelay: '0.9s' }}
      ></div> */}
    </div>
  );
};

export default DotsLoader;