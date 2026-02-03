/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // Enable darker mode manually or system
    theme: {
        extend: {
            colors: {
                background: '#0a0a0a', // Dark background
                surface: '#121212', // Slightly lighter
                primary: '#6d28d9', // Deep purple
                secondary: '#db2777', // Pink/Magenta
                accent: '#22d3ee', // Cyan
                'surface-glass': 'rgba(18, 18, 18, 0.7)',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                'glitch': 'glitch 1s linear infinite',
            },
            keyframes: {
                glitch: {
                    '2%, 64%': { transform: 'translate(2px,0) skew(0deg)' },
                    '4%, 60%': { transform: 'translate(-2px,0) skew(0deg)' },
                    '62%': { transform: 'translate(0,0) skew(5deg)' },
                }
            }
        },
    },
    plugins: [],
}
