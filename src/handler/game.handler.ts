import { Request, Response } from 'express'
import {createGame, 
        getGameById, 
        getGames, 
        updateGame, 
        updateGameWinner,
        checkGomokuResult
       } from "../service/game.service";


// Retrieve a list of played games
export async function getGamesHandler(req: Request, res: Response) {
  try {
    const games = await getGames();
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Retrieve a single game by ID
export async function getGameByIdHandler(req: Request, res: Response) {
  const gameId = req.params.id;
  try {
    const game = await getGameById(gameId);
    if (!game) {
      res.status(404).json({ error: "Game not found" });
    } else {
      res.status(200).json(game);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Create a new game
export async function createGameHandler(req: Request, res: Response) {
  // try {
    const { moves, winner, board_size } = req.body;
    // console.log(req.body)
    if (!moves || !board_size) {
      return res.status(400).json({ error: "Title, description, and board_size are required" });
    }
    const newGame = await createGame({
      moves,
      board_size,
      winner,
    });

    res.status(201).json(newGame);
 
}

// Update the current moves and respond with the current game status
export async function updateGameHandler(req: Request, res: Response) {
  const gameId = req.params.id;
  const { move } = req.body;

  try {
    const updatedGame = await updateGame(gameId, move);
    if (!updatedGame) {
      res.status(404).json({ error: "Game not found" });
    } else {
      let moves = updatedGame.moves
      let boardSize = updatedGame.board_size
      let result = checkGomokuResult(moves, boardSize);
      result.then((result) => {
        res.status(200).json({"winner":result});
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Update the winner of a game handler
export async function updateGameWinnerHandler(req: Request, res: Response) {
  try {
    const  id  = req.params.id;
    const { winner } = req.body;
    const updatedGame = await updateGameWinner(id, winner);
    if (!updatedGame) {
      return res.status(404).json({ message: 'Gaaame not found' });
    }
    return res.status(200).json(updatedGame);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
