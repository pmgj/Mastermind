# Mastermind
Implementation of the game in JavaScript and Java, using Ajax and REST. The objective of the game is to find out a secret code made of colors.

## Setup
The player can choose the number of colors to use, the number of allowed tries, and the code size.

## Rules
The player must click on the colors below the board and they will appear in the board, bottom to top. After that, he should click on the "Check" button, and a result will appear on the right size. The number in green indicates the number of colors that are in the correct position while the number in yellow indicates the number of colors that are in the secret code bu not in the correct position. The player can remove current colors by clicking in the "Backspace button".

## Game Over
If the code informed by the player is equal to the secret code (both order and color), he wins the game. If none of the codes informed by the player is equal to the secret code, he loses the game and the secret code is informed in the top of the board.
