# 🪓 Hangman Game

A classic **Hangman game** built with **HTML, CSS, and ES5 JavaScript**.  
The player guesses letters using **on-screen controls** to reveal a hidden word before the hangman is fully drawn.

---

## 🚀 Features

- 🎯 Random word selection loaded from `db.json`
- 🔤 Letter guessing using **on-screen buttons** (no keyboard input)
- 🧠 Displays already guessed letters
- 💀 Hangman SVG updates progressively on wrong guesses
- 🏆 Win and lose detection
- 🔄 Restart game without reloading the page

---

## 📂 Project Structure

```plaintext
Hangman-game/
├── index.html        # Game layout and structure
├── styles.css        # Styling and layout
├── app.js            # Game logic and DOM manipulation
├── db.json           # Words database
├── hanging.svg       # Hangman drawing
├── README.md
└── assets/
