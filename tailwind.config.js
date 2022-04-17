const colors = require('tailwindcss/colors')
module.exports = {
    mode:'jit',
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: colors.purple,
            }
        },

    },
    plugins: [],
}
