# Super Cool Noughts and Crosses 

Welcome to the Super Cool Noughts and Crosses repository!

You can view a live demo of the website [here](https://xavierprice.github.io/super-cool-noughts-and-crosses/).

Super Cool Noughts and Crosses is a classic game with a twist brought to life with HTML, CSS, and JavaScript. This project aims to provide a fun, interactive experience for players of all ages, while showcasing my skills as a front-end developer.

# How To Play
Players take turns placing their token (either 'X' or 'O') in a cell on a smaller 3x3 grid. The cell clicked determines where the next game will be played. If that game has a large token then the next player can choose any cell on the board. If a player gets 3 small tokens in a row on a small grid then they get a large token placed in that larger grid. If there is a draw in a small grid then that game resets/smaller tokens are removed. 
The objective is to be the first to form a horizontal, vertical, or diagonal line of three of your large tokens.

# Project Structure
generateHTML.js: Javascript file for generating boards and cells for the game.
index.html: Main file for the game/website.
script.js: Main javascript file for game/website including win/loss algorithms and game functions.

# Features
Interactive Gameplay: Enjoy a seamless, interactive gaming experience. Hover and click on the cell to place your token and see the game unfold dynamically.
Responsive Design: Whether you're playing on a desktop, tablet, or mobile device, the game adapts to various screen sizes ensuring an enjoyable experience across all platforms.
Win Detection: Algorithms to detect for wins, draws and losses.
View-turn-box: Displays current players turn.
Play Again and Undo Turn Option: Players have the option to restart the game as they please and to undo their turn when permitted.
