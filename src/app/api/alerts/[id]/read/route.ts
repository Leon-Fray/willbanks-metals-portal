import { NextResponse } from "next/server";

export async function PATCH(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // In production: update alerts.read_at = NOW() where id = ? AND company_id = ?
  return NextResponse.json({
    data: { id, read_at: new Date().toISOString() },
    message: "Alert marked as read",
  });
}
