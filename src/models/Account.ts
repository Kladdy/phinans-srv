import { Document, model, Schema, Types } from "mongoose";

/**
 * Interface to model the Account Schema for TypeScript.
 * @param provider:string
 * @param type:string
 * @param providerAccountId:string
 * @param access_token:string
 * @param token_type:string
 * @param scope:string
 * @param userId:ObjectId
 */
export interface IAccount extends Document {
  provider: string;
  type: string;
  providerAccountId: string;
  access_token: string;
  token_type: string;
  scope: string;
  userId: Types.ObjectId;
}

const accountSchema: Schema = new Schema({
  provider: {
    type: String
  },
  type: {
    type: String
  },
  providerAccountId: {
    type: String
  },
  access_token: {
    type: String,
    required: true,
  },
  token_type: {
    type: String
  },
  scope: {
    type: String
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true
  },
});

const Account = model<IAccount>("Account", accountSchema);

export default Account;
