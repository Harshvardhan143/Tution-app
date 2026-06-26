import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-utils';
import { requireRole } from '@/lib/server/auth';
import { generateFeeReceiptPdf } from '@/services/fee-service';
import { ROLES } from '@/config/constants';

export const GET = withApiHandler(async (
  req: NextRequest,
  context
) => {
  const user = await requireRole(req, [ROLES.STUDENT]);
  const resolvedParams = await context.params;
  const id = resolvedParams.id as string;
  
  const pdfBuffer = await generateFeeReceiptPdf(id, user.userId);
  
  return new NextResponse(pdfBuffer as unknown as BodyInit, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="receipt_${id}.pdf"`,
    },
  });
});
