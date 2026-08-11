import React, { useState } from 'react';

const Landing = ({ onOpenComplete, onOpenInitiated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleEnvelopeClick = () => {
    if (isOpen) return;

    setIsOpen(true);
    // Notify parent to start audio immediately (upon user gesture)
    if (onOpenInitiated) {
      onOpenInitiated();
    }

    // Wait for the opening animations (flap flip + letter slide-up) to finish
    setTimeout(() => {
      setIsFadingOut(true);
    }, 1800);

    // Wait for the fade-out transition of the landing screen to finish before unmounting
    setTimeout(() => {
      if (onOpenComplete) {
        onOpenComplete();
      }
    }, 2800);
  };

  return (
    <div className={`landing-container ${isFadingOut ? 'fade-out' : ''}`}>
      <div 
        className={`envelope-wrapper ${isOpen ? 'open' : ''}`}
        onClick={handleEnvelopeClick}
      >
        <div className="envelope">
          {/* Flap of the envelope */}
          <div className="envelope-flap"></div>
          
          {/* Left/Right fold visuals */}
          <div className="envelope-sides"></div>
          <div className="envelope-sides-right"></div>
          
          {/* Bottom pocket */}
          <div className="envelope-pocket"></div>
          
          {/* Golden Wax Seal */}
          <div className="wax-seal"></div>

          {/* Letter card that slides out */}
          <div className="envelope-letter">
            <span className="envelope-letter-name">To Zoya</span>
          </div>
        </div>
      </div>
      <div className="envelope-hint">
        {isOpen ? "Opening..." : "Tap to open"}
      </div>
    </div>
  );
};

export default Landing;
