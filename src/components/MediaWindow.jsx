import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [outgoingIndex, setOutgoingIndex] = useState(null);
  const [inView, setInView] = useState(false);
  const containerRef = useRef(null);
  const videoRefs = useRef({});

  // Check prefers-reduced-motion
  const prefersReducedMotion = useRef(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // Setup Intersection Observer to start/stop animations and video playback
  useEffect(() => {
    const currentContainer = containerRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      {
        threshold: 0.15, // Trigger when 15% visible
      }
    );

    if (currentContainer) {
      observer.observe(currentContainer);
    }

    return () => {
      if (currentContainer) {
        observer.unobserve(currentContainer);
      }
    };
  }, []);

  // Staggered hold duration between 2000ms and 3000ms
  const holdDuration = useRef(2000 + Math.random() * 1000);
  
  // Helper to check if a media item is a video
  const isVideo = (url) => {
    if (typeof url !== 'string') return false;
    return url.toLowerCase().includes('.mp4') || url.toLowerCase().includes('/vid/');
  };

  const isVideoWindow = mediaItems.some(item => isVideo(item));

  // Advance to next item with an overlapping crossfade
  const advanceToNext = useCallback(() => {
    if (mediaItems.length <= 1) return;
    setOutgoingIndex(currentIndex);
    setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
  }, [mediaItems.length, currentIndex]);

  // Clean up outgoing item after the 0.7s fade-in transition completes (750ms)
  useEffect(() => {
    if (outgoingIndex === null) return;
    const timer = setTimeout(() => {
      setOutgoingIndex(null);
    }, 750);
    return () => clearTimeout(timer);
  }, [outgoingIndex]);

  // Photo-only cycling interval
  useEffect(() => {
    if (isVideoWindow) return;
    if (mediaItems.length <= 1 || !inView || prefersReducedMotion.current) return;

    const interval = setInterval(() => {
      advanceToNext();
    }, holdDuration.current);

    return () => clearInterval(interval);
  }, [mediaItems.length, inView, isVideoWindow, advanceToNext]);

  // Handle active video playback
  useEffect(() => {
    const activeItem = mediaItems[currentIndex];
    if (activeItem && isVideo(activeItem)) {
      const activeVideo = videoRefs.current[activeItem];
      if (activeVideo) {
        if (inView) {
          activeVideo.currentTime = 0;
          activeVideo.play().catch((err) => {
            console.debug("Video playback interrupted or blocked:", err);
          });
        } else {
          activeVideo.pause();
        }
      }
    }

    // Pause outgoing video if present
    if (outgoingIndex !== null) {
      const outgoingItem = mediaItems[outgoingIndex];
      if (outgoingItem && isVideo(outgoingItem)) {
        const outVideo = videoRefs.current[outgoingItem];
        if (outVideo) {
          outVideo.pause();
        }
      }
    }
  }, [currentIndex, outgoingIndex, inView, mediaItems]);

  // Handle video end event
  const handleVideoEnded = () => {
    if (prefersReducedMotion.current || mediaItems.length <= 1) {
      const activeItem = mediaItems[currentIndex];
      const video = videoRefs.current[activeItem];
      if (video) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }
      return;
    }

    advanceToNext();
  };

  // Build items to render with distinct roles: 'outgoing', 'active', or 'preload'
  const itemsToRender = useMemo(() => {
    if (!mediaItems || mediaItems.length === 0) return [];

    const list = [];
    const addedIndices = new Set();

    // 1. Outgoing item: sits underneath at z-index 1, holding opacity 1 during transition
    if (outgoingIndex !== null && outgoingIndex !== currentIndex && outgoingIndex < mediaItems.length) {
      list.push({
        item: mediaItems[outgoingIndex],
        index: outgoingIndex,
        role: 'outgoing'
      });
      addedIndices.add(outgoingIndex);
    }

    // 2. Active item: sits on top at z-index 2, fading in smoothly from 0 to 1
    if (currentIndex < mediaItems.length) {
      list.push({
        item: mediaItems[currentIndex],
        index: currentIndex,
        role: 'active'
      });
      addedIndices.add(currentIndex);
    }

    // 3. Preload next item: sits at bottom at z-index 0, opacity 0, preloading quietly
    if (inView && mediaItems.length > 1 && !prefersReducedMotion.current) {
      const nextIdx = (currentIndex + 1) % mediaItems.length;
      if (!addedIndices.has(nextIdx)) {
        list.push({
          item: mediaItems[nextIdx],
          index: nextIdx,
          role: 'preload'
        });
      }
    }

    return list;
  }, [mediaItems, currentIndex, outgoingIndex, inView]);

  // Rotational scatter style
  const polaroidStyle = {
    transform: prefersReducedMotion.current ? 'none' : `rotate(${rotation}deg)`,
  };

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
        {itemsToRender.map(({ item, role }) => {
          const isVid = isVideo(item);

          if (isVid) {
            return (
              <video
                key={item}
                ref={(el) => {
                  if (el) videoRefs.current[item] = el;
                  else delete videoRefs.current[item];
                }}
                src={item}
                className={`polaroid-media-item ${role}`}
                muted
                playsInline
                webkit-playsinline="true"
                preload={role === 'active' ? "auto" : "metadata"}
                onEnded={handleVideoEnded}
              />
            );
          }

          return (
            <img
              key={item}
              src={item}
              alt=""
              loading="eager"
              className={`polaroid-media-item ${role}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default MediaWindow;
