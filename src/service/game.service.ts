import Game, { GameDocument } from "../model/game.model";


// Retrieve a list of played games
export async function getGames(): Promise<GameDocument[]> {
  return Game.find().exec();
}
// Retrieve a single game by ID
export async function getGameById(gameId: string): Promise<GameDocument | null> {
  return Game.findById(gameId).exec();
}

// Create a new game
export async function createGame(gameData: {}): Promise<GameDocument> {
  const newGame = new Game(gameData);
  return newGame.save();
}

// Update the current moves and return the updated game
export async function updateGame(gameId: string, newMove: { player: string; location: number[] }): Promise<GameDocument | null> {
  const updatedGame = await Game.findByIdAndUpdate(
      gameId,
      { $push: { moves: newMove } },
      { new: true }
    );
    return updatedGame;
}

// Update the winner of a game
export async function updateGameWinner(gameId: string, winner: string): Promise<GameDocument | null> {
  const updatedGame = await Game.findByIdAndUpdate(
    gameId,
    { winner },
    { new: true }
  )
  return updatedGame;
}

interface Move {
  player: string;
  location: [number, number];
}

type Board = string[][];


const checkWin = (board: string[][], boardSize: number): boolean => {
  const n = boardSize;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (board[i][j] === "0") {
        // Skip empty cells
        continue;
      }
      // Check horizontal
      if (
        j + 4 < n &&
        board[i][j] === board[i][j + 1] &&
        board[i][j] === board[i][j + 2] &&
        board[i][j] === board[i][j + 3] &&
        board[i][j] === board[i][j + 4]
      ) {
        return true;
      }
      // Check vertical
      if (
        i + 4 < n &&
        board[i][j] === board[i + 1][j] &&
        board[i][j] === board[i + 2][j] &&
        board[i][j] === board[i + 3][j] &&
        board[i][j] === board[i + 4][j]
      ) {
        return true;
      }
      // Check diagonal \
      if (
        i + 4 < n &&
        j + 4 < n &&
        board[i][j] === board[i + 1][j + 1] &&
        board[i][j] === board[i + 2][j + 2] &&
        board[i][j] === board[i + 3][j + 3] &&
        board[i][j] === board[i + 4][j + 4]
      ) {
        return true;
      }
      // Check diagonal /
      if (
        i - 4 >= 0 &&
        j + 4 < n &&
        board[i][j] === board[i - 1][j + 1] &&
        board[i][j] === board[i - 2][j + 2] &&
        board[i][j] === board[i - 3][j + 3] &&
        board[i][j] === board[i - 4][j + 4]
      ) {
        return true;
      }
    }
  }
  return false;
};


export async function checkGomokuResult(moves: Move[], boardSize: number):Promise<string | null> {
  const board: Board = Array.from({ length: boardSize }, () =>
    Array(boardSize).fill('0')
  );
  for (const move of moves) {
    const [row, col] = move.location;
    board[row][col] = move.player;
    if (checkWin(board, boardSize)) {
      return move.player; // Player has won
    }
  }
  return null; // No winner yet
}
