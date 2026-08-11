import React, { useState, useEffect, useRef } from 'react';

const BowAccent = ({ corner = 'top-left', isGold = false }) => {
  const primaryColor = isGold ? '#C5A059' : '#E8C5C8';
  const strokeColor = isGold ? '#8C6A2E' : '#C38B90';
  
  return (
    <div className={`polaroid-bow ${corner}`} aria-hidden="true">
      <svg viewBox="0 0 40 40" width="20" height="20">
        {/* Left Loop */}
        <path d="M20 20 C10 10, 5 15, 10 20 C15 25, 20 20, 20 20 Z" fill={primaryColor} stroke={strokeColor} strokeWidth="1.5" />
        {/* Right Loop */}
        <path d="M20 20 C30 10, 35 15, 30 20 C25 25, 20 20, 20 20 Z" fill={primaryColor} stroke={strokeColor} strokeWidth="1.5" />
        {/* Left Tail */}
        <path d="M20 20 Q12 30, 8 32 Q14 30, 20 20" fill={primaryColor} stroke={strokeColor} strokeWidth="1.5" />
        {/* Right Tail */}
        <path d="M20 20 Q28 30, 32 32 Q26 30, 20 20" fill={primaryColor} stroke={strokeColor} strokeWidth="1.5" />
        {/* Knot Center */}
        <circle cx="20" cy="20" r="3.5" fill={strokeColor} />
      </svg>
    </div>
  );
};

const MediaWindow = ({ mediaItems = [], aspectRatio = "4:5", rotation = 0 }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [inView, setInView] = useState(false);
  const containerRef = useRef(null);
  const videoRefs = useRef([]);

  // Check prefers-reduced-motion
  const prefersReducedMotion = useRef(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // Setup Intersection Observer to start/stop animations and video playback
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      {
        threshold: 0.15, // Trigger when 15% visible
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  // Generate a random hold duration between 2000ms and 3000ms on mount to stagger updates
  const holdDuration = useRef(2000 + Math.random() * 1000);
  
  // Helper to check if a media item is a video
  const isVideo = (url) => {
    if (typeof url !== 'string') return false;
    return url.toLowerCase().endsWith('.mp4') || url.toLowerCase().includes('/vid/');
  };

  const isVideoWindow = mediaItems.some(item => isVideo(item));

  // Handle looping logic for photo-only windows
  useEffect(() => {
    if (isVideoWindow) return;
    // If we only have 1 item, or if we are not in view, or if user prefers reduced motion, don't loop
    if (mediaItems.length <= 1 || !inView || prefersReducedMotion.current) return;

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % mediaItems.length);
    }, holdDuration.current);

    return () => clearInterval(interval);
  }, [mediaItems, inView, isVideoWindow]);

  // Handle video play/pause based on active status and viewport intersection
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;

      const isCurrentActive = index === activeIndex;
      if (isCurrentActive && inView) {
        // Play active video when in view
        video.play().catch((err) => {
          // Ignore autoplay block errors as videos are muted
          console.debug("Autoplay video failed or was interrupted:", err);
        });
      } else {
        // Pause videos that are not active or not in view
        video.pause();
      }
    });
  }, [activeIndex, inView]);

  // Handle transition when a video finishes playing naturally
  const handleVideoEnded = () => {
    if (prefersReducedMotion.current) {
      const video = videoRefs.current[activeIndex];
      if (video) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }
      return;
    }

    if (mediaItems.length === 1) {
      const video = videoRefs.current[0];
      if (video) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }
      return;
    }

    setActiveIndex((prevIndex) => (prevIndex + 1) % mediaItems.length);
  };

  // Generate unique rotation and offset style for polaroid scatter effect
  const polaroidStyle = {
    transform: prefersReducedMotion.current ? 'none' : `rotate(${rotation}deg)`,
  };

  // Statically determine bow position and color from rotation value
  const bowCorner = Math.abs(rotation) % 2 > 1 ? 'top-right' : 'top-left';
  const isGoldBow = Math.abs(rotation) % 1 > 0.5;

  const isWide = aspectRatio === "5:4";

  return (
    <div 
      ref={containerRef} 
      className={`polaroid-frame ${isWide ? 'wide' : ''}`}
      style={polaroidStyle}
    >
      <BowAccent corner={bowCorner} isGold={isGoldBow} />
      <div className={`polaroid-media-box ratio-${aspectRatio.replace(':', '-')}`}>
        {mediaItems.map((item, index) => {
          const isActive = index === activeIndex;
          const isVid = isVideo(item);

          if (isVid) {
            return (
              <video
                key={item}
                ref={(el) => (videoRefs.current[index] = el)}
                src={item}
                className={`polaroid-media-item ${isActive ? 'active' : ''}`}
                muted
                playsInline
                webkit-playsinline="true"
                onEnded={handleVideoEnded}
              />
            );
          }

          return (
            <img
              key={item}
              src={item}
              alt=""
              loading="lazy"
              className={`polaroid-media-item ${isActive ? 'active' : ''}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default MediaWindow;
