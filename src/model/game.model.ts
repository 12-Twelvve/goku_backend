import mongoose, { Document } from "mongoose";

// Define the schema for the Gomoku game
export interface GameDocument extends Document {
  moves: [{ player: string; location: [number, number] }];
  board_size : number;
  winner: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
const gameSchema = new mongoose.Schema(
  {
    moves: [
      {
        player: String,
        location: [Number, Number],
      },
    ],
    board_size : {type:Number},
    winner: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model<GameDocument>("Game", gameSchema);