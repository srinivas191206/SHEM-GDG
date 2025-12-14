import React from 'react';
import headerLogo from '../assets/header-logo.png';

interface ShemLogoProps {
  scrolled: boolean;
}

const ShemLogo: React.FC<ShemLogoProps> = ({ scrolled }) => {
  return (
    <div className="flex items-center">
      <img
        src={headerLogo}
        alt="SHEM Logo"
        className={`h-12 w-auto transition-all duration-300 rounded-xl`}
      />
    </div>
  );
};

export default ShemLogo;