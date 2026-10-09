# Cookie Clicker Web Application

A simple, interactive web page featuring a centered cookie with a click counter, floating "+1" animations, and persistence using HTTP cookies.

## Structure

- `index.html`: Contains the layout, inline CSS styling, and centered cookie SVG graphic.
- `script.js`: Contains the JavaScript logic for tracking clicks, generating floating animations, and persisting the click count in a browser cookie (`document.cookie`).

## Features

- **Centered Cookie Graphic**: Beautiful inline SVG cookie styled with modern CSS gradients and glassmorphism design.
- **External Script**: Separate `script.js` handling all interactive logic.
- **Click Counter**: Increments every time you click on the cookie.
- **Interactive Animations**: Floating "+1" visual feedback on each click and press effect.
- **Browser Cookie Persistence**: Stores your click count in browser cookies (`document.cookie`) so your score persists across visits.
- **Reset Functionality**: Easy reset button to clear your score back to zero.

## How to Run

1. Serve the project using a simple local web server (required for cookie storage support):
   ```bash
   python3 -m http.server 8000
   ```
2. Open `http://localhost:8000` in your web browser.
