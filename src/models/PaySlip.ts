import mongoose, { Document, Schema } from 'mongoose';

export interface ISalaryComponent {
  name: string;
  amount: number;
}

export interface IPaySlip extends Document {
  staff: mongoose.Types.ObjectId;
  month: number;
  year: number;
  basicSalary: number;
  allowances: ISalaryComponent[];
  deductions: ISalaryComponent[];
  netSalary: number;
  paidDate?: Date;
  paidBy?: mongoose.Types.ObjectId;
  isPaid: boolean;
}

const salaryComponentSchema = new Schema<ISalaryComponent>({
  name: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0 },
});

const paySlipSchema = new Schema<IPaySlip>(
  {
    staff: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true },
    basicSalary: { type: Number, required: true, min: 0 },
    allowances: [salaryComponentSchema],
    deductions: [salaryComponentSchema],
    netSalary: { type: Number, required: true, min: 0 },
    paidDate: { type: Date },
    paidBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isPaid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const PaySlip = mongoose.models.PaySlip || mongoose.model<IPaySlip>('PaySlip', paySlipSchema);
