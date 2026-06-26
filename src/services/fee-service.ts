import { Fee } from '@/models/Fee';
import { User } from '@/models/User';
import { AppError } from '@/lib/errors';
import { HTTP_STATUS } from '@/config/constants';
import PDFDocument from 'pdfkit';
import '@/models/User';

export async function getStudentFees(userId: string, academicYear?: string) {
  const query: Record<string, unknown> = { student: userId };
  if (academicYear) query.academicYear = academicYear;
  
  const fees = await Fee.find(query).lean();
  return fees;
}

export async function generateFeeReceiptPdf(receiptId: string, userId: string): Promise<Buffer> {
  const fee = await Fee.findOne({ student: userId, 'receipts._id': receiptId });
  if (!fee) {
    throw new AppError('Receipt not found', HTTP_STATUS.NOT_FOUND);
  }

  const receipt = fee.receipts.find((r: Record<string, unknown>) => r._id?.toString() === receiptId);
  if (!receipt) {
    throw new AppError('Receipt not found', HTTP_STATUS.NOT_FOUND);
  }

  const user = await User.findById(userId).lean();

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (err) => reject(err));

      // Build PDF
      doc.fontSize(24).text('EduSpark Academy', { align: 'center' });
      doc.moveDown();
      doc.fontSize(16).text('Fee Receipt', { align: 'center', underline: true });
      doc.moveDown(2);
      
      doc.fontSize(12).text(`Receipt No: ${receipt.receiptNo}`);
      doc.text(`Date: ${new Date(receipt.date).toLocaleDateString()}`);
      if (user) {
        doc.text(`Student Name: ${user.name}`);
      }
      doc.text(`Payment Mode: ${receipt.paymentMode}`);
      if (receipt.paymentRef) {
        doc.text(`Payment Ref: ${receipt.paymentRef}`);
      }
      doc.moveDown();

      doc.text('Fee Heads:', { underline: true });
      doc.moveDown(0.5);
      receipt.feeHeads.forEach((head: Record<string, unknown>) => {
        doc.text(`- ${head.name}: Rs. ${head.amount}`);
      });
      doc.moveDown();

      doc.fontSize(14).text(`Total Paid: Rs. ${receipt.amount}`);

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
