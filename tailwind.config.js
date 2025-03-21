
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        reddit: {
          orange: '#FF4500',
          red: '#F54404',
          blue: '#0079D3',
          lightGray: '#F8F9FA',
          mediumGray: '#DAE0E6',
          darkGray: '#1A1A1B',
          hover: '#FF5414',
        },
      },
    },
  },
  plugins: [],
}
