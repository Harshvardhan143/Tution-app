import * as XLSX from 'xlsx';
import { BadRequestError } from './errors';

export interface ParsedSheetData {
  sheetName: string;
  data: Record<string, unknown>[];
}

/**
 * Parses a spreadsheet file buffer (Excel or CSV) into raw JSON data array.
 */
export function parseExcelOrCsv(fileBuffer: Buffer): ParsedSheetData[] {
  try {
    // Read the sheet buffer
    const workbook = XLSX.read(fileBuffer, {
      type: 'buffer',
      cellDates: true, // Parse dates automatically
      cellText: false,
    });

    const result: ParsedSheetData[] = [];

    // Parse each sheet in the workbook
    workbook.SheetNames.forEach((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      // Convert sheet to JSON rows (header mapping)
      const data = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
        defval: '', // Default empty cells to empty string
      });

      result.push({
        sheetName,
        data,
      });
    });

    if (result.length === 0 || (result.length === 1 && result[0].data.length === 0)) {
      throw new BadRequestError('The spreadsheet file appears to be empty.');
    }

    return result;
  } catch (error: unknown) {
    if (error instanceof BadRequestError) {
      throw error;
    }
    console.error('Spreadsheet parsing failed:', error);
    throw new BadRequestError(`Failed to parse spreadsheet file: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Validates the headers of a parsed sheet data against a list of required headers.
 */
export function validateSheetHeaders(
  data: Record<string, unknown>[],
  requiredHeaders: string[]
): void {
  if (data.length === 0) {
    throw new BadRequestError('Sheet contains no data rows.');
  }

  const rowHeaders = Object.keys(data[0]);
  const missingHeaders = requiredHeaders.filter(
    (header) => !rowHeaders.includes(header)
  );

  if (missingHeaders.length > 0) {
    throw new BadRequestError(
      `Missing required spreadsheet headers: ${missingHeaders.join(', ')}`
    );
  }
}
export default parseExcelOrCsv;
