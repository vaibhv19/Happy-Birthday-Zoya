import React, { useMemo } from 'react';
import MediaWindowCluster from './MediaWindowCluster';

// Dynamically import all media assets using Vite's glob import
const photos45Modules = import.meta.glob('../assets/4;5/*.{png,jpg,jpeg,PNG,JPG,JPEG}', { eager: true });
const photos54Modules = import.meta.glob('../assets/5;4/*.{png,jpg,jpeg,PNG,JPG,JPEG}', { eager: true });
const videosModules = import.meta.glob('../assets/vid/*.{mp4,MP4}', { eager: true });

const photos45 = Object.values(photos45Modules).map(mod => mod.default || mod);
const photos54 = Object.values(photos54Modules).map(mod => mod.default || mod);
const videos = Object.values(videosModules).map(mod => mod.default || mod);

// Exact text from assets/text.txt
const paragraphs = [
  "This city would feel a lot emptier without you — you're the closest thing to home I've got here.",
  "You've listened to my nonsense more times than anyone should have to. You've quietly cleared more of my rough days than you probably even remember.",
  "Somehow, every conversation with you teaches me something.",
  "Thanks for putting up with me, for all the terrible junk food we've eaten together slowly ruining any chance I had at a six-pack, and for the borderline assault every time I opened my mouth.",
  "Happy birthday, dear. Glad you exist. Cheers to another year of me annoying you."
];

const LetterFlow = () => {
  // Define clusters configurations stably using useMemo
  const clusters = useMemo(() => {
    return [
      // Cluster 1: After Paragraph 1
      [
        { mediaItems: photos45.slice(0, 6), aspectRatio: "4:5" },
        { mediaItems: photos45.slice(6, 12), aspectRatio: "4:5" }
      ],
      // Cluster 2: After Paragraph 2
      [
        { mediaItems: videos.slice(0, 3), aspectRatio: "4:5" },
        { mediaItems: photos45.slice(12, 16), aspectRatio: "4:5" },
        { mediaItems: photos45.slice(16, 20), aspectRatio: "4:5" },
        { mediaItems: photos54, aspectRatio: "5:4" } // Exactly one 5:4 aspect ratio polaroid
      ],
      // Cluster 3: After Paragraph 3
      [
        { mediaItems: photos45.slice(20, 28), aspectRatio: "4:5" },
        { mediaItems: photos45.slice(28, 36), aspectRatio: "4:5" }
      ],
      // Cluster 4: After Paragraph 4
      [
        { mediaItems: videos.slice(3, 7), aspectRatio: "4:5" },
        { mediaItems: photos45.slice(36, 42), aspectRatio: "4:5" },
        { mediaItems: photos45.slice(42, 48), aspectRatio: "4:5" },
        { mediaItems: photos45.slice(48, 53), aspectRatio: "4:5" }
      ]
    ];
  }, []);

  return (
    <div className="main-content">
      <div className="letter-wrapper">
        {/* Header Section */}
        <header className="birthday-header">
          <h1 className="header-h1">
            Happy Birthday <span className="header-name">Zoya</span>
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
          "kind in a way that doesn't ask for credit"
        </div>

        {/* Signature Block */}
        <div className="letter-closing">
          <span className="closing-phrase">With love,</span>
          <span className="closing-signature">Vaibhav</span>
        </div>
      </div>
    </div>
  );
};

export default LetterFlow;
