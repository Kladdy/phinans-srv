import { Document, model, Schema } from "mongoose";

/**
 * Interface to model the User Schema for TypeScript.
 * @param email:string
 * @param password:string
 * @param image:string
 */
export interface IUser extends Document {
  email: string;
  password: string;
  image: string;
}

const userSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  image: {
    type: String
  }
});

const User = model<IUser>("User", userSchema);

export default User;
