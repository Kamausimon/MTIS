// tailwind.config.js
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      "./public/index.html"
    ],
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          primary: '#1a73e8',
          secondary: '#7c3aed'
        }
      }
    },
    plugins: [
      require('@tailwindcss/forms'),
      require('@tailwindcss/typography')
    ]
  }