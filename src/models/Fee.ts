import mongoose, { Document, Schema } from 'mongoose';

export interface IFeeHead {
  name: string;
  amount: number;
  dueDate?: Date;
  status: 'paid' | 'pending' | 'partial';
}

export interface IReceipt {
  receiptNo: string;
  date: Date;
  amount: number;
  paymentMode: 'cash' | 'upi' | 'bank_transfer' | 'cheque';
  paymentRef?: string;
  feeHeads: { name: string; amount: number }[];
}

export interface IFee extends Document {
  student: mongoose.Types.ObjectId;
  academicYear: string;
  feeHeads: IFeeHead[];
  totalDue: number;
  totalPaid: number;
  pendingAmount: number;
  receipts: IReceipt[];
}

const feeHeadSchema = new Schema<IFeeHead>({
  name: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0 },
  dueDate: { type: Date },
  status: { type: String, enum: ['paid', 'pending', 'partial'], default: 'pending' },
});

const receiptSchema = new Schema<IReceipt>({
  receiptNo: { type: String, required: true, trim: true },
  date: { type: Date, required: true, default: Date.now },
  amount: { type: Number, required: true, min: 0 },
  paymentMode: { type: String, enum: ['cash', 'upi', 'bank_transfer', 'cheque'], required: true },
  paymentRef: { type: String, trim: true },
  feeHeads: [{
    name: { type: String, required: true },
    amount: { type: Number, required: true }
  }],
});

const feeSchema = new Schema<IFee>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    academicYear: { type: String, required: true, trim: true },
    feeHeads: [feeHeadSchema],
    totalDue: { type: Number, default: 0, min: 0 },
    totalPaid: { type: Number, default: 0, min: 0 },
    pendingAmount: { type: Number, default: 0, min: 0 },
    receipts: [receiptSchema],
  },
  { timestamps: true }
);

export const Fee = mongoose.models.Fee || mongoose.model<IFee>('Fee', feeSchema);
