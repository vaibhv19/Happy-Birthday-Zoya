import React, { useState, useRef } from 'react';
import ParticleBackground from './components/ParticleBackground';
import AudioController from './components/AudioController';
import Landing from './components/Landing';
import LetterFlow from './components/LetterFlow';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [isLandingMounted, setIsLandingMounted] = useState(true);
  const audioRef = useRef(null);

  const handleOpenInitiated = () => {
    // Start audio playback directly in the synchronous click interaction stack
    if (audioRef.current && audioRef.current.paused) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.debug("Audio play failed or was blocked by policy:", err);
            setIsPlaying(false);
          });
      }
    }
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
        audioRef={audioRef}
        isPlaying={isPlaying} 
        setIsPlaying={setIsPlaying} 
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
