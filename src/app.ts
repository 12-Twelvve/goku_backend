import { createServer } from 'http'
import express, { Express } from 'express'
import cors from 'cors'

import authHandler from './handler/auth.handler'

import {
  createGameHandler,
  getGamesHandler,
  getGameByIdHandler,
  updateGameHandler,
  updateGameWinnerHandler,
} from "./handler/game.handler";

const app: Express = express()

app.use(
  cors({
    origin: process.env.allowHost || true,
  })
)

app.use(express.json())


app.get('/', (req, res) => {
  res.send('Hello, Gomoku API!');
});

// user api
app.use('/api/auth', authHandler)
// game api
app.get("/api/games", getGamesHandler);
app.get("/api/game/:id", getGameByIdHandler);
app.post("/api/game/create", createGameHandler);
app.put("/api/game/:id", updateGameHandler);
app.put("/api/game/winner/:id", updateGameWinnerHandler);


export const server = createServer(app)

export default app
