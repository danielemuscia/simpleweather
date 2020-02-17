const Dotenv = require('dotenv-webpack');
const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/app.js',
    plugins: [
        new Dotenv()
    ],
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist")
    }
};