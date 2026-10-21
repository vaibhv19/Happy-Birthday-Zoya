import React, { useMemo } from 'react';
import MediaWindowCluster from './MediaWindowCluster';
import { birthdayConfig } from '../birthday.config';

// Dynamically import optimized media assets using Vite's glob import
const portraitModules = import.meta.glob('../assets/portrait/*.webp', { eager: true });
const landscapeModules = import.meta.glob('../assets/landscape/*.webp', { eager: true });
const videoModules = import.meta.glob('../assets/vid/*.mp4', { eager: true });

const portraitPhotos = Object.values(portraitModules).map(mod => mod.default || mod);
const landscapePhotos = Object.values(landscapeModules).map(mod => mod.default || mod);
const videos = Object.values(videoModules).map(mod => mod.default || mod);

/**
 * Dynamically distribute media items across target windows based on relative weights.
 * Ensures zero empty windows if media collection count changes next year.
 */
function distributeItems(items, targetWeights) {
  if (!items || items.length === 0) return targetWeights.map(() => []);
  const totalWeight = targetWeights.reduce((a, b) => a + b, 0);
  let start = 0;
  return targetWeights.map((weight, i) => {
    if (i === targetWeights.length - 1) {
      return items.slice(start);
    }
    const count = Math.max(1, Math.round((weight / totalWeight) * items.length));
    const slice = items.slice(start, start + count);
    start += count;
    return slice;
  });
}

const LetterFlow = () => {
  const { paragraphs, header, tagline, sender } = birthdayConfig;

  // Stably configure Polaroid clusters based on available media
  const clusters = useMemo(() => {
    // 9 portrait windows distributed across the 4 narrative clusters
    const portraitSlices = distributeItems(portraitPhotos, [6, 6, 4, 4, 8, 8, 6, 6, 5]);
    
    // 2 video windows distributed across Cluster 2 and Cluster 4
    const videoSlices = distributeItems(videos, [3, 4]);

    return [
      // Cluster 1: After Paragraph 1
      [
        { mediaItems: portraitSlices[0], aspectRatio: "4:5" },
        { mediaItems: portraitSlices[1], aspectRatio: "4:5" }
      ],
      // Cluster 2: After Paragraph 2
      [
        { mediaItems: videoSlices[0], aspectRatio: "4:5" },
        { mediaItems: portraitSlices[2], aspectRatio: "4:5" },
        { mediaItems: portraitSlices[3], aspectRatio: "4:5" },
        { mediaItems: landscapePhotos, aspectRatio: "5:4" } // 5:4 aspect ratio polaroid
      ],
      // Cluster 3: After Paragraph 3
      [
        { mediaItems: portraitSlices[4], aspectRatio: "4:5" },
        { mediaItems: portraitSlices[5], aspectRatio: "4:5" }
      ],
      // Cluster 4: After Paragraph 4
      [
        { mediaItems: videoSlices[1], aspectRatio: "4:5" },
        { mediaItems: portraitSlices[6], aspectRatio: "4:5" },
        { mediaItems: portraitSlices[7], aspectRatio: "4:5" },
        { mediaItems: portraitSlices[8], aspectRatio: "4:5" }
      ]
    ];
  }, []);

  return (
    <main className="main-content">
      <div className="letter-wrapper">
        {/* Header Section */}
        <header className="birthday-header">
          <h1 className="header-h1">
            {header.greeting} <span className="header-name">{header.name}</span>
          </h1>
        </header>

        {/* Paragraph 1 */}
        <p className="letter-paragraph">{paragraphs[0]}</p>
        
        {/* Cluster 1 */}
        <MediaWindowCluster windows={clusters[0]} />

        {/* Paragraph 2 */}
        <p className="letter-paragraph">{paragraphs[1]}</p>

        {/* Cluster 2 */}
        <MediaWindowCluster windows={clusters[1]} />

        {/* Paragraph 3 */}
        <p className="letter-paragraph">{paragraphs[2]}</p>

        {/* Cluster 3 */}
        <MediaWindowCluster windows={clusters[2]} />

        {/* Paragraph 4 */}
        <p className="letter-paragraph">{paragraphs[3]}</p>

        {/* Cluster 4 */}
        <MediaWindowCluster windows={clusters[3]} />

        {/* Paragraph 5 */}
        <p className="letter-paragraph">{paragraphs[4]}</p>

        {/* Closing Tagline */}
        <div className="letter-tagline">
          {tagline}
        </div>

        {/* Signature Block */}
        <div className="letter-closing">
          <span className="closing-phrase">{sender.closingPhrase}</span>
          <span className="closing-signature">{sender.name}</span>
        </div>
      </div>
    </main>
  );
};

export default LetterFlow;
