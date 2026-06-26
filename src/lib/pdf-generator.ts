import PDFDocument from 'pdfkit';

export interface FeeReceiptPDFData {
  receiptNo: string;
  date: Date;
  studentName: string;
  rollNo: string;
  grade: string;
  batch: string;
  totalAmount: number;
  paymentMode: string;
  paymentRef?: string;
  feeHeads: { name: string; amount: number }[];
}

export interface PaySlipPDFData {
  employeeCode: string;
  staffName: string;
  month: string;
  year: number;
  basicSalary: number;
  allowances: { name: string; amount: number }[];
  deductions: { name: string; amount: number }[];
  netSalary: number;
  paidDate: Date;
}

/**
 * Helper to wrap PDFKit stream piping into a Promise returning a Buffer.
 */
function buildPdfBuffer(doc: typeof PDFDocument): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', (err) => reject(err));
    doc.end();
  });
}

/**
 * Generates a styled Fee Receipt PDF.
 */
export async function generateFeeReceiptPdf(data: FeeReceiptPDFData): Promise<Buffer> {
  const doc = new PDFDocument({ margin: 50, size: 'A5' }); // A5 is perfect for receipts

  // Colors
  const primaryColor = '#4F46E5'; // Indigo
  const textColor = '#1F2937';
  const mutedTextColor = '#4B5563';
  const lightBg = '#F3F4F6';

  // --- Header ---
  doc.fillColor(primaryColor).fontSize(18).font('Helvetica-Bold').text('EDUSPARK ACADEMY', { align: 'center' });
  doc.fillColor(textColor).fontSize(10).font('Helvetica').text('Tuition Center Fee Receipt', { align: 'center' });
  doc.moveDown(1.5);

  // Divider line
  doc.strokeColor(primaryColor).lineWidth(1.5).moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke();
  doc.moveDown();

  // Receipt details grid
  const initialY = doc.y;
  doc.fillColor(mutedTextColor).fontSize(9);
  
  // Left Column
  doc.text(`Receipt No: `, 50, initialY, { continued: true }).fillColor(textColor).text(data.receiptNo);
  doc.fillColor(mutedTextColor).text(`Date: `, 50, doc.y, { continued: true }).fillColor(textColor).text(new Date(data.date).toLocaleDateString());
  doc.fillColor(mutedTextColor).text(`Payment Mode: `, 50, doc.y, { continued: true }).fillColor(textColor).text(data.paymentMode.toUpperCase());

  // Right Column
  doc.fillColor(mutedTextColor).text(`Student Name: `, 250, initialY, { continued: true }).fillColor(textColor).text(data.studentName);
  doc.fillColor(mutedTextColor).text(`Roll No: `, 250, doc.y, { continued: true }).fillColor(textColor).text(data.rollNo);
  doc.fillColor(mutedTextColor).text(`Class / Batch: `, 250, doc.y, { continued: true }).fillColor(textColor).text(`${data.grade} / ${data.batch}`);

  doc.moveDown(2);
  
  // Table Headers
  const tableY = doc.y;
  doc.rect(50, tableY, doc.page.width - 100, 20).fill(lightBg);
  doc.fillColor(primaryColor).fontSize(9).text('Particulars / Fee Head', 60, tableY + 6);
  doc.text('Amount (INR)', doc.page.width - 130, tableY + 6, { align: 'right', width: 80 });
  
  doc.moveDown(1.2);

  // Table Body Rows
  doc.fillColor(textColor);
  data.feeHeads.forEach((head) => {
    const rowY = doc.y;
    doc.text(head.name, 60, rowY);
    doc.text(`₹${head.amount.toFixed(2)}`, doc.page.width - 130, rowY, { align: 'right', width: 80 });
    doc.moveDown(0.2);
    // Draw fine line between rows
    doc.strokeColor('#E5E7EB').lineWidth(0.5).moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke();
    doc.moveDown(0.5);
  });

  // Total Section
  doc.moveDown();
  const totalY = doc.y;
  doc.rect(50, totalY, doc.page.width - 100, 24).fill(lightBg);
  doc.fillColor(textColor).fontSize(10).font('Helvetica-Bold').text('Total Paid Amount', 60, totalY + 7);
  doc.fillColor(primaryColor).text(`₹${data.totalAmount.toFixed(2)}`, doc.page.width - 130, totalY + 7, { align: 'right', width: 80 });
  doc.font('Helvetica');
  
  doc.moveDown(2);

  // Footer / Terms
  doc.fillColor(mutedTextColor).fontSize(8).text('Thank you for your payment! This is a system-generated invoice.', { align: 'center' });

  return buildPdfBuffer(doc);
}

/**
 * Generates a styled Staff Pay Slip PDF.
 */
export async function generatePaySlipPdf(data: PaySlipPDFData): Promise<Buffer> {
  const doc = new PDFDocument({ margin: 50, size: 'A4' }); // A4 for professional pay slip

  const primaryColor = '#4F46E5';
  const textColor = '#1F2937';
  const mutedTextColor = '#4B5563';
  const borderCol = '#E5E7EB';

  // --- Header ---
  doc.fillColor(primaryColor).fontSize(22).font('Helvetica-Bold').text('EDUSPARK ACADEMY', { align: 'left' });
  doc.fillColor(mutedTextColor).fontSize(10).font('Helvetica').text('Academic Tuition & Management Center', { align: 'left' });
  
  doc.moveUp(1.5);
  doc.fillColor(textColor).fontSize(14).font('Helvetica-Bold').text('SALARY PAYSLIP', { align: 'right' });
  doc.font('Helvetica');
  doc.fontSize(10).text(`Statement Period: ${data.month} ${data.year}`, { align: 'right' });
  doc.moveDown(1.5);

  doc.strokeColor(primaryColor).lineWidth(2).moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke();
  doc.moveDown();

  // Employee details grid
  const gridY = doc.y;
  doc.fillColor(mutedTextColor).fontSize(10);
  
  // Column 1
  doc.text(`Employee Code: `, 50, gridY, { continued: true }).fillColor(textColor).text(data.employeeCode);
  doc.fillColor(mutedTextColor).text(`Staff Name: `, 50, doc.y, { continued: true }).fillColor(textColor).text(data.staffName);
  
  // Column 2
  doc.fillColor(mutedTextColor).text(`Paid Date: `, 300, gridY, { continued: true }).fillColor(textColor).text(new Date(data.paidDate).toLocaleDateString());
  doc.fillColor(mutedTextColor).text(`Status: `, 300, doc.y, { continued: true }).fillColor('green').text('PAID (Direct Deposit)');
  
  doc.moveDown(2);

  // Salary details table grid (Earnings vs Deductions)
  const tableY = doc.y;
  const colWidth = (doc.page.width - 100) / 2;

  // Header background
  doc.rect(50, tableY, colWidth, 20).fill('#EEF2F6');
  doc.rect(50 + colWidth, tableY, colWidth, 20).fill('#FDF2F2');
  
  doc.fillColor(textColor).fontSize(10).font('Helvetica-Bold').text('EARNINGS', 60, tableY + 5);
  doc.text('DEDUCTIONS', 60 + colWidth, tableY + 5);
  doc.font('Helvetica');

  doc.moveDown(1.5);
  doc.fillColor(textColor);

  // Table columns contents
  const earnY = doc.y;
  
  // Render Earnings (Left)
  let leftY = earnY;
  doc.text('Basic Salary', 60, leftY);
  doc.text(`₹${data.basicSalary.toFixed(2)}`, 60 + colWidth - 100, leftY, { align: 'right', width: 80 });
  leftY += 18;

  data.allowances.forEach((allow) => {
    doc.text(allow.name, 60, leftY);
    doc.text(`₹${allow.amount.toFixed(2)}`, 60 + colWidth - 100, leftY, { align: 'right', width: 80 });
    leftY += 18;
  });

  // Render Deductions (Right)
  let rightY = earnY;
  data.deductions.forEach((ded) => {
    doc.text(ded.name, 60 + colWidth, rightY);
    doc.text(`₹${ded.amount.toFixed(2)}`, 60 + colWidth * 2 - 100, rightY, { align: 'right', width: 80 });
    rightY += 18;
  });

  // Align positions to the largest column
  const endY = Math.max(leftY, rightY) + 20;

  // Draw outline borders
  doc.strokeColor(borderCol).lineWidth(1)
     .moveTo(50, tableY).lineTo(doc.page.width - 50, tableY) // top
     .lineTo(doc.page.width - 50, endY).lineTo(50, endY).lineTo(50, tableY) // outer box
     .stroke();
  
  // Draw middle divider
  doc.strokeColor(borderCol).moveTo(50 + colWidth, tableY).lineTo(50 + colWidth, endY).stroke();

  // Summary Totals
  doc.y = endY + 10;
  
  const totalEarnings = data.basicSalary + data.allowances.reduce((acc, curr) => acc + curr.amount, 0);
  const totalDeductions = data.deductions.reduce((acc, curr) => acc + curr.amount, 0);

  const summaryY = doc.y;
  doc.fillColor(mutedTextColor).fontSize(9);
  doc.text(`Total Earnings: ₹${totalEarnings.toFixed(2)}`, 60, summaryY);
  doc.text(`Total Deductions: ₹${totalDeductions.toFixed(2)}`, 60 + colWidth, summaryY);
  
  doc.moveDown(1.5);
  doc.strokeColor(primaryColor).lineWidth(1.5).moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke();
  
  doc.moveDown(1.5);
  // Net salary block
  const netY = doc.y;
  doc.rect(50, netY, doc.page.width - 100, 30).fill('#EEF2F6');
  doc.fillColor(textColor).fontSize(12).font('Helvetica-Bold').text('NET SALARY (Take Home)', 60, netY + 9);
  doc.fillColor(primaryColor).text(`₹${data.netSalary.toFixed(2)}`, doc.page.width - 150, netY + 9, { align: 'right', width: 100 });
  doc.font('Helvetica');

  doc.moveDown(4);

  // Signatures
  const sigY = doc.y;
  doc.strokeColor('#D1D5DB').lineWidth(1).moveTo(50, sigY).lineTo(150, sigY).stroke();
  doc.moveTo(doc.page.width - 150, sigY).lineTo(doc.page.width - 50, sigY).stroke();
  
  doc.fillColor(mutedTextColor).fontSize(9);
  doc.text('Employee Signature', 50, sigY + 5, { width: 100, align: 'center' });
  doc.text('Authorized Director', doc.page.width - 150, sigY + 5, { width: 100, align: 'center' });

  return buildPdfBuffer(doc);
}
