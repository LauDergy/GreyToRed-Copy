/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                carolina: '#7BAFD4', // Official UNC Blue
            }
        },
    },
    plugins: [],
}