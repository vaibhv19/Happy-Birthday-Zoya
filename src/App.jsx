import React, { useState } from 'react';
import ParticleBackground from './components/ParticleBackground';
import AudioController from './components/AudioController';
import Landing from './components/Landing';
import LetterFlow from './components/LetterFlow';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [triggerPlay, setTriggerPlay] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [isLandingMounted, setIsLandingMounted] = useState(true);

  const handleOpenInitiated = () => {
    // Start audio
    setTriggerPlay(true);
    // Mount the letter so it is ready and rendering underneath the landing screen
    setShowLetter(true);
  };

  const handleOpenComplete = () => {
    // Unmount landing screen from DOM after fade-out transition completes
    setIsLandingMounted(false);
  };

  return (
    <div className="app-container">
      {/* Background canvas particles */}
      <ParticleBackground />

      {/* Background music controller */}
      <AudioController 
        isPlaying={isPlaying} 
        setIsPlaying={setIsPlaying} 
        triggerPlay={triggerPlay} 
      />

      {/* Main birthday letter content */}
      {showLetter && <LetterFlow />}

      {/* Sealed envelope landing page */}
      {isLandingMounted && (
        <Landing 
          onOpenInitiated={handleOpenInitiated}
          onOpenComplete={handleOpenComplete}
        />
      )}
    </div>
  );
}

export default App;
