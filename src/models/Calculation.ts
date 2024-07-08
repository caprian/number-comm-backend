import mongoose, { Schema, Document } from 'mongoose';

interface ICalculation extends Document {
  parent: mongoose.Types.ObjectId | null;
  left: number;
  operator: string;
  right: number;
  result: number;
  initialResult: number; // Add this field to store the initial result
  userId: mongoose.Types.ObjectId;
}

const CalculationSchema: Schema = new Schema({
  parent: { type: Schema.Types.ObjectId, ref: 'Calculation', default: null },
  left: { type: Number, required: true },
  operator: { type: String, required: true },
  right: { type: Number, required: true },
  result: { type: Number, required: true },
  initialResult: { type: Number, required: true }, // Add this field to the schema
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

const Calculation = mongoose.model<ICalculation>('Calculation', CalculationSchema);
export default Calculation;
