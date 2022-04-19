import { Document, model, Schema, Types } from "mongoose";

/**
 * Interface to model the WalletNiceHash Schema for TypeScript.
 * @param userId:ObjectId
 * @param organizationId:string
 * @param apiKey:string
 * @param apiSecret:string
 * @param created:Date
 * @param updated:Date
 */
export interface IWalletNiceHash extends Document {
  userId: Types.ObjectId;
  organizationId: string;
  apiKey: string;
  apiSecret: string;
  label: string;
  created: Date;
  updated: Date;
}

const walletNiceHashSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  organizationId: {
    type: String,
    required: true,
  },
  apiKey: {
    type: String,
    required: true,
  },
  apiSecret: {
    type: String,
    required: true,
  },
  label: {
    type: String
  },
  created: {
    type: Date
  },
  updated: {
    type: Date
  },
});

const WalletNiceHash = model<IWalletNiceHash>("WalletNiceHash", walletNiceHashSchema);

export default WalletNiceHash;
