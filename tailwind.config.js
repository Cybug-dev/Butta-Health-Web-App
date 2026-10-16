/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F4F7F6",
        paper2: "#FFFFFF",
        well: "#EEF4F2",
        ink: "#17211F",
        muted: "#61706C",
        faint: "#899590",
        line: "#E4ECE6",
        leaf: "#2D5B46",
        teal: "#2F7D69",
        tealDark: "#235F50",
        gold: "#E7B94B",
        emerald: "#2F7D69",
        amber: {
          DEFAULT: "#B97823",
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          600: "#D97706",
          700: "#B45309"
        },
        rust: "#B85C5C",
        field: "#F8FAF9",
        fieldLine: "#D6E3DB",
        tealSoft: "#83A792",
        mist: "#EAF2EC",
        glow: "#6EE7B7",
        track: "#E3EFE8",
        barIdle: "#D4E3DB"
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateX(-4px)" },
          to: { opacity: "1", transform: "none" }
        }
      },
      animation: {
        "ping-slow": "ping 2.2s cubic-bezier(0, 0, 0.2, 1) infinite",
        "fade-in": "fade-in 220ms ease-out 90ms both"
      },
      borderRadius: {
        md: "0.75rem",
        lg: "1rem"
      },
      fontFamily: {
        serif: ['"Nunito Sans"', "Inter", "system-ui", "sans-serif"],
        sans: ['"Nunito Sans"', "Inter", "system-ui", "sans-serif"],
        mono: ['"Nunito Sans"', "Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        paper: "0 4px 20px -2px rgba(15, 41, 32, .05), 0 1px 3px 0 rgba(15, 41, 32, .03)",
        card: "0 4px 20px -2px rgba(15, 41, 32, .05), 0 1px 3px 0 rgba(15, 41, 32, .03)",
        lift: "0 10px 24px -4px rgba(6, 78, 60, .09), 0 2px 6px -1px rgba(6, 78, 60, .04)",
        chip: "inset 0 1px 0 rgba(255, 255, 255, .8), 0 1px 2px rgba(15, 41, 32, .04)",
        chipHover: "inset 0 1px 0 rgba(255, 255, 255, .9), 0 4px 10px -2px rgba(6, 78, 60, .12)",
        nav: "0 -4px 24px 0 rgba(20, 34, 26, .04)",
        fab: "0 8px 20px -2px rgba(45, 91, 70, .35)",
        float: "0 18px 48px rgba(27, 52, 45, .12)"
      }
    },
  },
  plugins: [],
};
