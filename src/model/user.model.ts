import mongoose, { Document } from "mongoose";

export interface UserDocument extends Document {
  username: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new mongoose.Schema({
  username: { type: String, require: true, unique: true},
  password: { type: String, require: true},
},{ timestamps: true })

export default mongoose.model<UserDocument>('User', userSchema)
