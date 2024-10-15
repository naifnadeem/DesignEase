/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'hero-pattern': "url('src/assets/images/bgimg.jpg')",
        'sign-up': "url('src/assets/images/image1.jpg')",
        'login': "url('src/assets/images/image1.jpg')",
        'upload-component': "url('src/assets/images/20240821_194642.jpg')",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit',
            a: {
              color: 'inherit',
              textDecoration: 'none',
            },
            fontFamily: {
              'montserrat': ['Montserrat', 'sans-serif'],
            }
          },
        },
      },
    },
  },
  plugins: [
    // eslint-disable-next-line no-undef
    require('daisyui'),
    require('@tailwindcss/typography'),
  ],
  daisyui: {
    themes: ["light", "dark"], // Add more themes if needed
  },
}