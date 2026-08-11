import React, { useMemo } from 'react';
import MediaWindow from './MediaWindow';

const MediaWindowCluster = ({ windows = [] }) => {
  // Generate stable random rotations for each window to prevent changes on re-renders
  const rotations = useMemo(() => {
    return windows.map(() => {
      // Rotation between -5 and +5 degrees
      const angle = (Math.random() - 0.5) * 10;
      // Round to 1 decimal place
      return Math.round(angle * 10) / 10;
    });
  }, [windows.length]);

  // Check if any window is 5:4 (wide) to adjust styling
  const hasWide = windows.some(w => w.aspectRatio === "5:4");

  return (
    <div className={`media-cluster ${hasWide ? 'has-wide' : ''}`}>
      {windows.map((win, idx) => (
        <MediaWindow
          key={idx}
          mediaItems={win.mediaItems}
          aspectRatio={win.aspectRatio || "4:5"}
          rotation={rotations[idx]}
        />
      ))}
    </div>
  );
};

export default MediaWindowCluster;
