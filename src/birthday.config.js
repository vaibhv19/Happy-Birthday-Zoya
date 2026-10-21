/**
 * Birthday Website Configuration for Zoya
 * 
 * To update this website next year:
 * 1. Modify the message paragraphs, tagline, or titles below.
 * 2. Add or replace media files in `src/assets/portrait` (4:5 photos),
 *    `src/assets/landscape` (5:4 photos), and `src/assets/vid` (videos).
 *    The layout engine will dynamically and evenly distribute them!
 */

export const birthdayConfig = {
  // Recipient Information
  recipient: {
    name: "Zoya",
    envelopeLabel: "To Zoya",
  },

  // Sender Information
  sender: {
    name: "Vaibhav",
    closingPhrase: "With love,",
  },

  // Page Header
  header: {
    greeting: "Happy Birthday",
    name: "Zoya",
  },

  // Document Title & Meta
  meta: {
    title: "Happy Birthday, Zoya",
    description: "A special birthday celebration for Zoya.",
  },

  // Narrative Letter Paragraphs
  paragraphs: [
    "This city would feel a lot emptier without you — you're the closest thing to home I've got here.",
    "You've listened to my nonsense more times than anyone should have to. You've quietly cleared more of my rough days than you probably even remember.",
    "Somehow, every conversation with you teaches me something.",
    "Thanks for putting up with me, for all the terrible junk food we've eaten together slowly ruining any chance I had at a six-pack, and for the borderline assault every time I opened my mouth.",
    "Happy birthday, dear. Glad you exist. Cheers to another year of me annoying you."
  ],

  // Closing Tagline & Quotes
  tagline: "kind in a way that doesn't ask for credit",

  // Audio Configuration
  audio: {
    ariaPlay: "Play Background Music",
    ariaMute: "Mute Background Music",
    titlePlay: "Play music",
    titleMute: "Mute music"
  }
};

export default birthdayConfig;
