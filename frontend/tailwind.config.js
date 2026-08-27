/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Rebranded to match the GiftAimers logo: white/cream canvas,
        // deep plum-navy text, magenta-to-purple gradient accents.
        // Token names kept as-is so every component that already
        // references them (bg-ink, text-gold, etc.) just inherits the
        // new palette automatically.
        ink: "#FFFFFF", // page background
        surface: "#FDF5FA", // card background (soft pink tint)
        surface2: "#F6E7F1", // deeper card / hover background
        gold: "#D6217F", // primary accent - magenta (was gold)
        blush: "#6B2C91", // secondary accent - deep purple
        ivory: "#241539", // primary text - deep plum/navy
        muted: "#8A7A99", // muted secondary text
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #D6217F 0%, #8A2E8C 50%, #3D1E6B 100%)",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Manrope", "sans-serif"],
        mono: ["Space Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
