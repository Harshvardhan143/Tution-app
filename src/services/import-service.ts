import * as xlsx from 'xlsx';
import { AppError } from '@/lib/errors';
import { HTTP_STATUS } from '@/config/constants';

export async function parseExcel<T>(fileBuffer: Buffer): Promise<T[]> {
  try {
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json<T>(sheet);
    return data;
  } catch (error) {
    throw new AppError('Failed to parse Excel file: ' + (error as Error).message, HTTP_STATUS.BAD_REQUEST);
  }
}
