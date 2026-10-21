import React, { useState } from 'react';

const Landing = ({ onOpenComplete, onOpenInitiated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleEnvelopeClick = () => {
    if (isOpen) return;
    
    // Start music and mount the main letter immediately on click interaction
    if (onOpenInitiated) {
      onOpenInitiated();
    }

    setIsOpen(true);

    // After envelope opens, begin fading out the landing overlay
    setTimeout(() => {
      setIsFadingOut(true);
    }, 1800);

    // Completely unmount after fade-out transition completes
    setTimeout(() => {
      if (onOpenComplete) {
        onOpenComplete();
      }
    }, 2800);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleEnvelopeClick();
    }
  };

  return (
    <div className={landing-container }>
      <div 
        className={envelope-wrapper }
        onClick={handleEnvelopeClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={isOpen ? "Opening birthday envelope" : "Open birthday envelope"}
      >
        <div className="envelope">
          {/* Flap of the envelope */}
          <div className="envelope-flap"></div>
          
          {/* Pocket / front panels */}
          <div className="envelope-pocket"></div>

          {/* Golden Wax Seal */}
          <div className="envelope-seal">
            <span className="seal-emblem">Z</span>
          </div>

          {/* Letter card that slides out */}
          <div className="envelope-letter">
            <span className="envelope-letter-name">To Zoya</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;