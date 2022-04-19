import { Document, model, Schema, Types } from "mongoose";

/**
 * Interface to model the WalletDataNiceHash Schema for TypeScript.
 * @param userId:ObjectId
 * @param organizationId:string
 * @param apiKey:string
 * @param apiSecret:string
 * @param created:Date
 * @param updated:Date
 */
export interface IWalletDataNiceHash extends Document {
  userId: Types.ObjectId;
  walletId: Types.ObjectId;
  currency: string;
  totalBalance: Number;
  available: Number;
  debt: Number;
  pending: Number;
  time: Date;
  created: Date;
  updated: Date;
}

const walletDataNiceHashSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  walletId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  totalBalance: {
    type: Number,
  },
  available: {
    type: Number,
  },
  debt: {
    type: Number
  },
  pending: {
    type: Number
  },
  time: {
    type: Date
  },
  created: {
    type: Date
  },
  updated: {
    type: Date
  },
});

const WalletDataNiceHash = model<IWalletDataNiceHash>("WalletDataNiceHash", walletDataNiceHashSchema);

export default WalletDataNiceHash;
