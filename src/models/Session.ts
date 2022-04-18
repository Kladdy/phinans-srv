import { Document, model, Schema, Types } from "mongoose";

/**
 * Interface to model the Session Schema for TypeScript.
 * @param sessionToken:string
 * @param userId:ObjectId
 * @param expires:Date
 */
export interface ISession extends Document {
  sessionToken: string;
  userId: Types.ObjectId;
  expires: Date;
}

const sessionSchema: Schema = new Schema({
  provider: {
    type: String
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  expires: {
    type: Date
  },
});

const Session = model<ISession>("Session", sessionSchema);

export default Session;
