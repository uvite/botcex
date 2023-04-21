const {url} = require('inspector')
const defaultTheme = require('tailwindcss/defaultTheme')
/** @type {import('tailwindcss').Config} */
module.exports = {}

module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx}',
        './src/components/**/*.{js,ts,jsx,tsx}',
        './src/app/**/*.{js,ts,jsx,tsx}',
    ],

    theme: {
        extend: {
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            fontFamily: {
                'sans': ['Gilroy-Regular', ...defaultTheme.fontFamily.sans],
                GilroyRegular: ['Gilroy-Regular'],
                GilroyMedium: ['Gilroy-Medium'],
                GilroyLight: ['Gilroy-Light'],
                GilroyHeavy: ['Gilroy-Heavy'],
                GilroyBold: ['Gilroy-Bold'],
            },
            animation: {
                wiggle: 'wiggle 1s ease-in-out infinite',
            },
            keyframes: {
                wiggle: {
                    '0%, 100%': {transform: 'rotate(-1deg)'},
                    '50%': {transform: 'rotate(1deg)'},
                }
            },
            colors: {
                transparent: "transparent",
                'black': '#1A1A1A',
                'white': '#FFFFFF',
                'primary': '#4285F4',
                'primary-dark': '#3164B5',
                'secondary': '#F59B5B',
                'secondary-dark': '#B57343'
            },
            fontSize: {
                '4b5': ['2.9rem', '1'],
                'xxl': ['9rem', '1'],
                'xxxl': ['16rem', '1.2'],
            },
            height: {
                '128': '32rem',
            }
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('tailwind-scrollbar-hide'),
        require("flowbite/plugin")
    ],
    corePlugins: {
        fontFamily: true,
    },
}
