import { Document, model, Schema, Types } from "mongoose";

/**
 * Interface to model the Holding Schema for TypeScript.
 * @param userId:ObjectId
 * @param category:string
 * @param label:string
 * @param amount:number
 * @param lastUpdated:Date
 * @param created:Date
 * @param updated:Date
 */
export interface IHolding extends Document {
  userId: Types.ObjectId;
  category: string;
  label: string;
  amount: number;
  lastUpdated: Date;
  created: Date;
  updated: Date;
}

const holdingSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  label: {
    type: String
  },
  amount: {
    type: Number,
    required: true,
  },
  lastUpdated: {
    type: Date
  },
  created: {
    type: Date
  },
  updated: {
    type: Date
  },
});

const Holding = model<IHolding>("Holding", holdingSchema);

export default Holding;
